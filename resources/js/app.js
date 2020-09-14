/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');


//imported


import VueChatScroll from 'vue-chat-scroll';

Vue.use(VueChatScroll);

import Vue from 'vue'

import Toaster from 'v-toaster'

// optional set default imeout, the default is 10000 (10 seconds).
Vue.use(Toaster, {timeout: 5000})


/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/message.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i);
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default));

Vue.component('message', require('./components/message.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',

    data:{
        message:'',

        chat:{

            message:[],

            user:[],

            color:[],

            time:[]

        },

        typing:'',

        numberOfUsers:0
    },

    watch:{

        message(){

            Echo.private('chat')

                .whisper('typing', {

                    name: this.message

                });

        }
    },

    methods:{
        send() {
            if(this.message.length != 0) {

                //console.log(this.message.length);
                this.chat.message.push(this.message);
                this.chat.color.push('success');

                this.chat.user.push('you');

                this.chat.time.push(this.getTime());



                axios.post('/send', {

                    message : this.message
                })

                .then(response => {
                    console.log(response);

                this.message = ''
                })
                    .catch(error => {
                        console.log(error);
                    });

            }
        },

        getTime(){

            let time = new Date();

            return time.getHours()+':'+time.getMinutes()

        }

    },


    mounted(){

        Echo.private('chat')

            .listen('ChatEvent', (e) => {
                this.chat.message.push(e.message);

                this.chat.user.push(e.user);

                this.chat.color.push('warning');

                this.chat.time.push(this.getTime());
                //console.log(e);
            })

            .listenForWhisper('typing', (e) => {

                if(e.name !='') {

                    //console.log('typing');
                    this.typing = 'typing...'

                }else {

                    //console.log('');
                    this.typing = ''

                }

            });

        Echo.join('chat')

            .here((users) => {

                this.numberOfUsers = users.length;

                //console.log('users')

            })

        .joining((user) => {

            this.numberOfUsers += 1;

            //console.log(user.name);

        })

        .leaving((user) => {

            this.numberOfUsers -= 1;

            //console.log(user.name);

        });
    }
    
});
