<template>
  <n-layout class="h-screen">
    <n-layout-header>
      <n-page-header class="sticky outline outline-1 outline-slate-300 top-0 z-50 backdrop-blur p-2">
        <template #title>
          <n-space align="center">
            <n-button circle quaternary @click="router.back()"
              v-if="route.name !== 'landing' && route.name !== 'dashboard'" class="flex md:hidden">
              <template #icon>
                <n-icon>
                  <back-icon />
                </n-icon>
              </template>
            </n-button>
            <n-button circle quaternary @click="sideMenu.sideEffect = !sideMenu.sideEffect" color="#424242"
              v-if="width > 450">
              <template #icon>
                <v-icon name="bi-grid" v-if="sideMenu.sideEffect" />
                <v-icon name="bi-grid-fill" v-else />
              </template>
            </n-button>
            <img class="h-10 md:h-10" :src="applogo" alt="logo_company" />
            <div class="flex flex-col items-left justify-center">
              <n-ellipsis style="max-width: 150px">{{ apptitle }}</n-ellipsis>
              <span class="text-[10px]">v. {{ appVersion }}</span>
            </div>
          </n-space>
          <span class="hidden md:flex capitalize"></span>
        </template>
        <template #extra>
          <div class="flex items-center">
            <account-avatar />
          </div>
        </template>
      </n-page-header>
    </n-layout-header>
    <n-layout position="absolute" style="top: 60px" has-sider>
      <n-layout-sider :width='200' :collapsed-width="0" :show-collapsed-content="false"
        :collapsed="sideMenu.sideEffect ? true : false" content-style="padding: 10px;"
        class="absolute md:relative h-full z-20 shadow-xl md:shadow-none" bordered>
        <n-scrollbar>
          <SideMenu />
        </n-scrollbar>
      </n-layout-sider>
      <n-layout :class="`bg-slate-100`">
        <div class="p-0 md:p-4">
          <n-page-header @back="handleBack">
            <template #header>
              <n-breadcrumb v-if="width > 480">
                <n-breadcrumb-item @click="router.push('/')">DASHBOARD</n-breadcrumb-item>
                <n-breadcrumb-item v-if="$route.name != 'landing'">{{ $route.name?.toUpperCase() }}</n-breadcrumb-item>
              </n-breadcrumb>
            </template>
          </n-page-header>
          <RouterView />
          <slot />
        </div>

      </n-layout>
    </n-layout>
  </n-layout>
  <n-drawer v-model:show="active" placement="left">
    <n-drawer-content>
      <logo-header />
      <side-menu />
    </n-drawer-content>
  </n-drawer>
</template>
<script setup>
import {
  ChevronLeft as BackIcon
} from "@vicons/tabler";
import { useWindowSize } from "@vueuse/core";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import pjson from '../../../package.json';
import router from "../../router";
import { useSidebar } from "../../stores/sidebar";

const route = useRoute();
const applogo = import.meta.env.VITE_APP_LOGO;
const appbase = import.meta.env.VITE_APP_BASE_COLOR;
const appbackdrop = import.meta.env.VITE_APP_BACKDROP;
const appVersion = pjson.version;
const { width } = useWindowSize();

const sideMenu = useSidebar();
const active = ref(false);
const apptitle = import.meta.env.VITE_APP_TITLE;
const collapse = ref(false);
const ukuran = ref(0);
const widthScreen = () => {
  ukuran.value = width.value;
  if (ukuran.value < 620) {
    sideMenu.sideEffect = true;
    collapse.value = true;
  } else {
    sideMenu.sideEffect = false;
    collapse.value = false;
  }
};
onMounted(() => widthScreen());
</script>

<style scoped>
.sidebar {
  @apply p-2 bg-white md:flex flex-col justify-between border-r hidden;
}
</style>
