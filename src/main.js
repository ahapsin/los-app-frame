import "./style.css";

import App from "./App.vue";
import { OhVueIcon } from "oh-vue-icons";
import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPersistedstate from 'pinia-plugin-persistedstate'
import router from "./router";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPersistedstate);
app.component("v-icon", OhVueIcon);
app.use(router);
app.use(pinia);

app.mount("#app");
