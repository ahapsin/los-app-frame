import "./style.css";
import * as HIIcons from "oh-vue-icons/icons/hi";
import * as RIcons from "oh-vue-icons/icons/ri";

import 'leaflet/dist/leaflet.css';

import { OhVueIcon, addIcons } from "oh-vue-icons";

import App from "./App.vue";
import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";

const Ri = Object.values({ ...RIcons });
const Hi = Object.values({ ...HIIcons });

addIcons(...Hi, ...Ri);

const app = createApp(App);
const pinia = createPinia();
app.component("v-icon", OhVueIcon);
app.use(router);
app.use(pinia);

app.mount("#app");
