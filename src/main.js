import "./style.css";
import "leaflet/dist/leaflet.css";

import * as BIIcons from "oh-vue-icons/icons/bi";

import { OhVueIcon, addIcons } from "oh-vue-icons";

import App from "./App.vue";
import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";

const Bi = Object.values({ ...BIIcons });

addIcons(...Bi);

const app = createApp(App);
const pinia = createPinia();
app.component("v-icon", OhVueIcon);
app.use(router);
app.use(pinia);
app.mount("#app");
