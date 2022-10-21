declare module 'dui-vue' {
    import Vue from 'vue'
    export class DuiComponent extends Vue {
        static install(vue: typeof Vue): void;
      }
}