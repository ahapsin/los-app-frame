<template>
  <n-layout class="h-screen">

    <n-layout-header>
      <n-page-header
          class="sticky bg-scf border-b top-0 z-50 backdrop-blur p-2"
      >
        <template #title>
          <n-space align="center">
            <n-button
                circle
                quaternary
                @click="router.back()"
                v-if="route.name !== 'landing' && route.name !== 'dashboard'"
            >
              <template #icon>
                <n-icon>
                  <back-icon/>
                </n-icon>
              </template>
            </n-button>
            <n-button
                circle
                quaternary
                @click="sideMenu.sideEffect = !sideMenu.sideEffect"
                color="#424242"
                v-if="width > 450"
            >
              <template #icon>
                <n-icon v-if="sideMenu.sideEffect">
                  <burger-icon/>
                </n-icon>
                <n-icon v-else>
                  <close-icon/>
                </n-icon>
              </template>
            </n-button>
            <img
                class="h-10 md:h-10"
                :src="applogo"
                alt="logo_company"
            />
            <div class="flex flex-col items-left justify-center">
              <n-ellipsis style="max-width: 150px">{{ apptitle }}</n-ellipsis>
              <span class="text-[10px]">v. {{ appVersion }}</span>
            </div>
          </n-space>
          <span class="hidden md:flex capitalize"></span>
        </template>
        <template #extra>
          <div class="flex items-center">
            <account-avatar/>
          </div>
        </template>
      </n-page-header>
    </n-layout-header>
    <n-layout position="absolute" style="top: 60px" has-sider>
      <n-layout-sider
          :width="180"
          :collapsed-width="0"
          :show-collapsed-content="false"
          :collapsed="sideMenu.sideEffect ? true : false"
          content-style="padding: 10px;"
          class="bg-white/80 backdrop-blur absolute md:relative h-full z-20"
          bordered
      >
        <SideMenu/>
      </n-layout-sider>
      <n-layout :class="`md:p-4 bg-slate-100`">
        <RouterView/>
        <slot/>
      </n-layout>
    </n-layout>
  </n-layout>
  <n-drawer v-model:show="active" placement="left">
    <n-drawer-content>
      <logo-header/>
      <side-menu/>
    </n-drawer-content>
  </n-drawer>
</template>
<script setup>
import {ref, onMounted} from "vue";
import {
  ChevronLeft as BackIcon,
  LayoutSidebarLeftCollapse as CloseIcon,
  LayoutSidebarRightCollapse as BurgerIcon,
} from "@vicons/tabler";
import {useSidebar} from "../../stores/sidebar";
import {useWindowSize} from "@vueuse/core";
import pjson from '../../../package.json';
import router from "../../router";
import {useRoute} from "vue-router";

const route = useRoute();
const applogo = import.meta.env.VITE_APP_LOGO;
const appbase = import.meta.env.VITE_APP_BASE_COLOR;
const appbackdrop = import.meta.env.VITE_APP_BACKDROP;
const appVersion = pjson.version;
const {width} = useWindowSize();

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
