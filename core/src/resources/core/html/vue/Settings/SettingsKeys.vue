<template>
    <div class="keysComponent" @keyup="keyPressed">
        <div class="keySets">
            <button :class="'keySet ' + (active == index ? 'active' : '')" v-for="(keySet, index) in keySets" :key="index" @click="active = index">
                <span class="material-icons checked" v-if="activeSet == index"> check_circle </span>
                {{ keySet.name }}
            </button>
            <div class="seperator"></div>
            <button class="keySet activate" :disabled="activeSet == active" @click="activateSet()">Aktivieren</button>
        </div>
        <div class="keysWrapper">
            <div class="keys" v-for="(key, name) in keySets[active].keys" :key="name">
                <p class="name">{{ key[2] }}</p>
                <button :class="'key ' + (currentChange == name ? 'change' : '')" @click="currentChange = name">
                    <div :class="currentChange == name ? 'blink' : ''">{{ key[1].toUpperCase() }}</div>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        keySets: {
            type: Object,
        },
        open: {
            type: Boolean,
        },
    },
    data() {
        return {
            activeSet: 0,
            active: 0,
            currentChange: null,
            blacklistedKeys: [
                'Space',
                'Enter',
                'Backspace',
                'NumLock',
                'ContextMenu',
                'ControlLeft',
                'ControlRight',
                'MetaLeft',
                'AltRight',
                'PrintScreen',
                'ScrollLock',
                'Pause',
            ],
            translatedKey: {
                Backquote: '^',
                Minus: 'ß',
                Equal: '´',
                NumpadDecimal: 'Numpad ,',
                Numpad0: 'Numpad 0',
                Numpad1: 'Numpad 1',
                Numpad2: 'Numpad 2',
                Numpad3: 'Numpad 3',
                Numpad4: 'Numpad 4',
                Numpad5: 'Numpad 5',
                Numpad6: 'Numpad 6',
                Numpad7: 'Numpad 7',
                Numpad8: 'Numpad 8',
                Numpad9: 'Numpad 9',
            },
        };
    },
    watch: {
        active: function (val, oldVal) {
            this.currentChange = null;
        },
    },
    methods: {
        activateSet(setId) {
            this.activeSet = this.active;

            if ('alt' in window) {
                // send activate to server
            }
        },
        keyPressed(e) {
            if (!this.open) return;
            if (!this.currentChange) return;

            e.preventDefault();

            // cancel on escape or pressed key is old key
            if (e.key == 'Escape' || this.keySets[this.active].keys[this.currentChange][0] == e.keyCode) {
                this.currentChange = null;
                return;
            }

            // check if key is allowed
            if (this.blacklistedKeys.includes(e.code)) return;

            // check if key is already in use
            for (const [key, value] of Object.entries(this.keySets[this.active].keys)) {
                if (value[0] == e.keyCode) {
                    console.log('already in use');
                    return;
                }
            }

            // set new key
            this.keySets[this.active].keys[this.currentChange][0] = e.keyCode;
            this.keySets[this.active].keys[this.currentChange][1] = e.code in this.translatedKey ? this.translatedKey[e.code] : e.key.toUpperCase();
            this.currentChange = null;
        },
    },
    mounted() {
        console.log('mounted SettingsKey');

        if ('alt' in window) {
            // get keySettings from Server
        }
    },
});
</script>
