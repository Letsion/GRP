import { createApp } from 'vue/dist/vue.esm-bundler.js';
import Login from './vue/Login.vue';
import Character from './vue/Character.vue';
import Notify from './vue/Notify.vue';
import Settings from './vue/Settings/Settings.vue';

document.addEventListener('DOMContentLoaded', main);

function main(): void {
    createApp({
        components: { Login, Character, Notify, Settings },
        data() {
            return {};
        },
        computed: {},
    }).mount('#app');
}
