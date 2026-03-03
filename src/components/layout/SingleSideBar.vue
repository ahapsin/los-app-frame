<template>
  <n-layout class="h-screen">
    <n-layout position="absolute" has-sider>
      <n-layout-sider :width='200' :collapsed-width="0" :show-collapsed-content="false" v-if="width > 676"
        :collapsed="sideMenu.sideEffect ? true : false"
        class="absolute md:relative  z-20 shadow-xl md:shadow-none border-r max-h-full">
        <n-scrollbar>
          <div class="relative px-2 z-10">
            <div class="sticky sticky-top top-0 mb-2 p-2 bg-white">
              <n-space class="bg-white">
                <img class="h-6 md:h-6" :src="applogo" alt="logo_company" />
                <div class="flex flex-col items-left justify-center">
                  <n-ellipsis style="max-width: 150px">{{ apptitle }}</n-ellipsis>
                  <span class="text-[10px]">v. {{ appVersion }}</span>
                </div>
              </n-space>
            </div>
            <SideMenu />
          </div>
        </n-scrollbar>
      </n-layout-sider>
      <n-layout :class="`bg-gray-100`">
        <n-scrollbar>
          <div class="relative">
            <div
              class="sticky sticky-top top-0 mb-2 w-full flex justify-between z-40 px-4 py-2 bg-gray-100 items-center">
              <div class="flex gap-2 items-center">
                <n-button circle quaternary size="small" @click="handleSideMenu">
                  <template #icon>
                    <v-icon name="bi-layout-sidebar" v-if="sideMenu.sideEffect"></v-icon>
                    <v-icon name="bi-layout-sidebar-reverse" v-else></v-icon>
                  </template>
                </n-button>
                <span class="text-xl font-semibold capitalize text-black" v-if="width > 676">{{ $route.name }}</span>
              </div>
              <account-avatar />
            </div>
            <div class="px-4 pb-4">
              <RouterView />
              <slot />
            </div>
          </div>
        </n-scrollbar>
      </n-layout>
    </n-layout>
  </n-layout>
  <n-drawer v-model:show="sideMenu.sideEffect" placement="left" v-if="width < 676">
    <n-drawer-content body-style="padding:0">
      <n-scrollbar>
        <div class="relative px-2 z-10">
          <div class="sticky sticky-top top-0 mb-2 p-2 bg-white">
            <n-space class="bg-white">
              <img class="h-6 md:h-6" :src="applogo" alt="logo_company" />
              <div class="flex flex-col items-left justify-center">
                <span class="font-semibold">{{ apptitle }}</span>
                <span class="text-[10px]">v. {{ appVersion }}</span>
              </div>

            </n-space>
          </div>
          <!-- <div>
              <n-select  filterable placeholder="Please select a song"
                :options="options" />
            </div> -->

          <SideMenu @route-changed="active = false" />
        </div>
      </n-scrollbar>
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

const handleSideMenu = () => {
  sideMenu.sideEffect = !sideMenu.sideEffect;
}
onMounted(() => widthScreen());
</script>

<style scoped>
.sidebar {
  @apply p-2 bg-white md:flex flex-col justify-between border-r hidden;
}
</style>
