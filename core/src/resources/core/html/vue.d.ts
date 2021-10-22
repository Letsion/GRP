declare module 'vue/dist/vue.esm-bundler.js' {
    import { createApp, defineComponent } from 'vue';
    export { createApp, defineComponent };
}

declare module '*.vue' {
    import { defineComponent } from 'vue';
    const component: ReturnType<typeof defineComponent>;
    export default component;
}
