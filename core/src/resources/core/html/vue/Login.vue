<template>
    <div v-if="open">
        <div class="login" v-if="login">
            <div>
                <h3>Willkommen bei Golden Roleplay</h3>
                <h4>Aktuelle Informationen</h4>
                <p>Der Server befindet sich derzeit in der Entwicklung.</p>
                <img src="img/logo.png"  alt=""/>
            </div>
            <div xyz="small fade stagger">
                <h3 class="xyz-in">Login</h3>
                <input class="xyz-in" type="text" placeholder="Benutzername" v-model="username" />
                <input class="xyz-in" type="password" placeholder="Passwort" v-model="password" v-on:keyup.enter="loginHandler" />
                <button class="xyz-in primary" v-on:click="loginHandler">
                    <span class="material-icons-round">login</span>
                    Anmelden
                </button>
            </div>
        </div>
        <div class="login" v-if="register">
            <div>
                <h3>Willkommen bei Golden Roleplay</h3>
                <h4>Aktuelle Informationen</h4>
                <p>Der Server befindet sich derzeit in der Entwicklung.</p>
                <img src="img/logo.png"  alt=""/>
            </div>
            <div xyz="small fade stagger">
                <h3 class="xyz-in">Register</h3>
                <input class="xyz-in" type="text" placeholder="Support Nummer" v-model="supportNumber" />
                <input class="xyz-in" type="password" placeholder="Neues Passwort" v-model="passwordOne" />
                <input class="xyz-in" type="password" placeholder="Passwort wiederholen" v-model="passwordTwo" v-on:keyup.enter="registerHandler" />
                <button class="xyz-in primary" v-on:click="registerHandler">
                    <span class="material-icons-round">login</span>
                    Registrieren
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    data() {
        return {
            open: true,
            login: true,
            register: false,
            username: '',
            password: '',

            supportNumber: '',
            passwordOne: '',
            passwordTwo: '',
        };
    },
    methods: {
        loginHandler() {
            if ('alt' in window) alt.emit('player:login', this.username, this.password);
        },
        registerHandler() {
          if (this.passwordOne === this.passwordTwo) if ('alt' in window) alt.emit('player:register', this.supportNumber, this.passwordOne);
        }
    },
    mounted() {
        if ('alt' in window) {
            alt.on('player:close', () => {
                this.open = false;
            });

            alt.on('player:register', () => {
                this.login = false;
                this.register = true;
            });
        }
    },
});
</script>