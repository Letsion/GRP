<template>
    <div v-if="open">
        <div class="character">
            <div class="characterBox">
                <div v-if="character">
                    <h3 class="characterTitle">Charakter Auswahl</h3>
                    <div class="dropdown">
                        <button class="dropbtn">{{ name }}</button>
                        <div class="dropdown-content">
                            <div v-for="(i, v) in characters" :key="v">
                                <a @click="switchCharacter(v)">{{ i.firstname }} {{ i.lastname }}</a>
                            </div>
                        </div>
                    </div>
                    <button class="xyz-in primary" v-if="characters.length !== 0" @click="setCharacter()">
                        Einreisen
                    </button>
                    <button class="xyz-in primary" v-if="characterCreate" @click="createCharacter">
                        Charakter erstellen
                    </button>
                </div>
                <div v-if="!character">
                    <h3 class="characterTitle">Charakter Erstellung</h3>
                    <input class="xyz-in" type="text" placeholder="Vorname" v-model="firstname" />
                    <input class="xyz-in" type="text" placeholder="Nachname" v-model="lastname" />
                    <input class="xyz-in" type="date" placeholder="Geburtstag" v-model="birth" />
                    <div style="display: flex">
                        <input type="radio" id="boy" name="sex" @click="this.sex = 'Männlich'" /><label
                            class="sexTitle"
                            for="boy"
                            >Männlich</label
                        >
                        <input type="radio" id="girl" name="sex" @click="this.sex = 'Weiblich'" /><label
                            class="sexTitle"
                            for="girl"
                            >Weiblich</label
                        >
                    </div>
                    <button class="xyz-in primary" @click="addCharacter">Charakter erstellen</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    data() {
        return {
            character: true,
            characterIndex: 0,
            open: false,
            characters: null,
            name: '',
            characterCreate: false,
            firstname: '',
            lastname: '',
            birth: '',
            sex: 'Männlich',
        };
    },
    methods: {
        switchCharacter(v) {
            this.characterIndex = v;
            this.name = `${this.characters[v].firstname} ${this.characters[v].lastname}`;
            if ('alt' in window) alt.emit('character:switch', v);
        },
        setCharacter() {
            this.open = false;
            if ('alt' in window) alt.emit('character:set', this.characterIndex);
        },
        createCharacter() {
            this.character = false;
        },
        addCharacter() {
            this.open = false;
            if ('alt' in window) alt.emit('character:create', this.firstname, this.lastname, this.birth, this.sex);
        },
    },
    mounted() {
        if ('alt' in window) {
            alt.on('character:load', (characters, characterCreate) => {
                this.open = true;
                this.characters = characters;
                this.characterCreate = characterCreate;
                this.name = `${characters[0].firstname} ${characters[0].lastname}`;
            });
        }
    },
});
</script>
