<template>
    <div class="settings" v-if="open">
        <div class="nav">
            <div class="header">Einstellungen</div>
            <div class="options">
                <button :class="'option ' + (active == index ? 'active' : '')" v-for="(option, index) in options" :key="index" @click="active = index">
                    {{ option.title }}
                </button>
            </div>
        </div>
        <div class="current">
            <component :is="options[active].component" :keySets="keySets" :accountData="accountData" :open="open" />
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import KEYS from '../Settings/SettingsKeys.vue';
import ACCOUNT from '../Settings/SettingsAccount.vue';

export default defineComponent({
    components: { ACCOUNT, KEYS },
    data() {
        return {
            open: false,
            active: 0,
            options: [
                { title: 'Account', component: 'ACCOUNT' },
                { title: 'Tastenbelegung', component: 'KEYS' },
            ],
            accountData: null,
            keySets: [
                {
                    name: 'Layout 1',
                    default: true,
                    keys: {
                        adminKey: [222, 'Ä', 'Adminpanel'],
                        funkKey: [18, 'Alt', 'Funken 1'],
                        funkSecondKey: [190, '.', 'Funken 2'],
                        voiceRangeKey: [89, 'Y', 'Sprachreichweite'],
                        megaphoneKey: [188, ',', 'Megafon'],
                        engineKey: [77, 'M', 'Motor an-/ausschalten'],
                        lockKey: [76, 'L', 'Fahrzeug auf-/absperren'],
                        inventoryKey: [73, 'I', 'Inventar'],
                        multiMenuKey: [88, 'X', 'Radialmenü'],
                        beltKey: [75, 'K', 'Gurt an-/ablegen'],
                        interactionKey: [69, 'E', 'Interagieren'],
                    },
                },
                {
                    name: 'Layout 2',
                    default: true,
                    keys: {
                        adminKey: [222, 'Ä', 'Adminpanel'],
                        funkKey: [18, 'Alt', 'Funken 1'],
                        funkSecondKey: [190, '.', 'Funken 2'],
                        voiceRangeKey: [89, 'Y', 'Sprachreichweite'],
                        megaphoneKey: [188, ',', 'Megafon'],
                        engineKey: [77, 'M', 'Motor an-/ausschalten'],
                        lockKey: [76, 'L', 'Fahrzeug auf-/absperren'],
                        inventoryKey: [73, 'I', 'Inventar'],
                        multiMenuKey: [88, 'X', 'Radialmenü'],
                        beltKey: [75, 'K', 'Gurt an-/ablegen'],
                        interactionKey: [69, 'E', 'Interagieren'],
                    },
                },
                {
                    name: 'Layout 3',
                    default: true,
                    keys: {
                        adminKey: [222, 'Ä', 'Adminpanel'],
                        funkKey: [18, 'Alt', 'Funken 1'],
                        funkSecondKey: [190, '.', 'Funken 2'],
                        voiceRangeKey: [89, 'Y', 'Sprachreichweite'],
                        megaphoneKey: [188, ',', 'Megafon'],
                        engineKey: [77, 'M', 'Motor an-/ausschalten'],
                        lockKey: [76, 'L', 'Fahrzeug auf-/absperren'],
                        inventoryKey: [73, 'I', 'Inventar'],
                        multiMenuKey: [88, 'X', 'Radialmenü'],
                        beltKey: [75, 'K', 'Gurt an-/ablegen'],
                        interactionKey: [69, 'E', 'Interagieren'],
                    },
                },
            ],
        };
    },
    watch: {
        keySets: {
            handler: function (newKeySets) {
                console.log('keySets changed');

                if ('alt' in window) {
                    // send new sets to server
                    // newKeySets
                }
            },
            deep: true,
        },
    },
    methods: {},
    mounted() {
        if ('alt' in window) {
            alt.on('settings:toggle', (boolean) => {
                if (this.open === boolean) return;
                this.open = !this.open;
            });
        }
    },
});
</script>
