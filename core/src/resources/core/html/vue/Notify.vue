<template>
    <div class="notification-group" xyz="fade right-75% stagger-2">
        <div v-for="notification in notifications.values()" :key="notification.id" :class="'notification ' + notification.mode">
            <component :is="notification.type" :notify="notification" />
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';

const SIMPLE = {
    template: `
        <div class="simple" :style="'border-right: 5px solid ' + notify.color + ';'">
            <p class="msg" v-html="notify.msg" />
        </div>
    `,

    props: {
        notify: {
            type: Object,
        },
    },
};

const EXTENDED = {
    template: `
      <div class="extended">
      <h3 v-if="notify.title" class="header" :style="notify.color ? 'background-color: ' + notify.color : ''" v-html="notify.title" />
      <p class="msg" v-html="notify.msg" />
      <div v-if="notify.time > 0" class="timer"
           :style="'animation-duration: ' + notify.time + 'ms; background-color: ' + (notify.mode === 'xyz-out' ? 'transparent' : notify.color)"></div>
      </div>
    `,

    props: {
        notify: {
            type: Object,
        },
    },
};

const ICON = {
    template: `
        <div class="icon" style="display: flex; justify-content: flex-start; align-items: center">
            <span class="img material-icons-round" :style="'color: ' + notify.color">{{ notify.icon }}</span>
            <p class="msg" v-html="notify.msg" />
        </div>
    `,

    props: {
        notify: {
            type: Object,
        },
    },
};

export default defineComponent({
    components: { SIMPLE, EXTENDED, ICON },
    data() {
        return {
            notifications: new Map(),
            /*
                {
                    id: Auto Int,
                    type: 'extended' || 'simple',
                    title: String,
                    msg: String (html),
                    color: HEX,
                    time: Int (in ms),
                    group: String,
                    icon: material-icons name
                },
            */
        };
    },
    methods: {
        // Generate an unique ID
        generateId() {
            let id = Math.floor(Math.random() * 10000) + 1;

            while (this.notifications.has(id)) {
                id = Math.floor(Math.random() * 10000) + 1;
            }

            return id;
        },

        // Add new Notification to Notification Group
        addNotification(notification) {
            if (!notification.msg) return;

            if (notification.type) {
                let componentExists = notification.type.toUpperCase() in this.$options.components;
                if (!componentExists) return;
            }

            const notify = {
                id: this.generateId(),
                title: notification.title || undefined,
                msg: notification.msg,
                type: notification.type ? notification.type.toUpperCase() : 'SIMPLE',
                color: notification.color || '#feed00',
                icon: notification.icon || undefined,
                time: notification.time || 5000,
                group: notification.group || undefined,
                mode: 'xyz-in',
            };

            this.notifications.set(notify.id, { ...notify });
            if (notify.time > 0) setTimeout(() => this.destroyNotification(notify.id), notify.time);
        },

        // Destroy Notification after time
        destroyNotification(id) {
            if (!this.notifications.has(id)) return;

            let notify = this.notifications.get(id);

            notify.mode = 'xyz-out';
            this.notifications.set(id, notify);
            setTimeout(() => this.notifications.delete(id), 750);
        },

        // Destroy all Notifications with specific group
        destroyNotificationGroup(group) {
            this.notifications.forEach((value, key) => {
                if (value.group == group) {
                    value.mode = 'xyz-out';
                    setTimeout(() => this.notifications.delete(key), 750);
                }
            });
        },

        // Clear all Notifications
        clearNotifications() {
            this.notifications.forEach((value, key) => {
                this.destroyNotification(key);
            });
        },
    },
    mounted() {
        if ('alt' in window) {
            alt.on('notification', (notification) => this.addNotification(notification));
            alt.on('notification:destroy:group', (group) => this.destroyNotificationGroup(group));
            alt.on('notification:destroy:all', () => this.clearNotifications());
        }
    },
});
</script>
