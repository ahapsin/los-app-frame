<template>
  <div class="flex flex-col gap-1">
    <div v-for="menu in props.menus" :key="menu.menuid">
      <router-link to="/" v-if="menu.menuitem.labelmenu === 'home'">
        <div class="flex gap-2  rounded-xl p-2 w-full hover:bg-pr-500 hover:text-white'"
          :class="$route.name === 'landing' ? 'bg-pr text-white font-bold' : 'bg-white'">
          <v-icon name="bi-grid" />
          DASHBOARD
        </div>
      </router-link>
      <div v-else>
        <small class="text-pr">{{ menu.menuitem.labelmenu.toUpperCase() }}</small>
      </div>
      <div v-for="submenu in [...menu.menuitem.submenu].sort((a, b) => a.sublabel.localeCompare(b.sublabel))" class="py-1" :key="submenu">
        <router-link :to="`${menu.menuitem.routename}${submenu.subroute}`" v-slot="{ isActive }" @click="handleStart">
          <div class="flex gap-2  rounded-xl p-2 w-full" @click="
            width < 620
              ? (sideMenu.sideEffect = !sideMenu.sideEffect)
              : handleStart
            " :class="isActive ? 'bg-pr text-white font-semibold' : 'hover:bg-pr-500 hover:text-white'">
            <v-icon :name="submenu.leading[0]" />
            {{ submenu.sublabel?.toUpperCase() }}
          </div>
        </router-link>
      </div>
      <!-- <Disclosure v-slot="{ open }" as="div">
        <DisclosureButton
            v-if="menu.menuitem.submenu.length == 0"
            class="rounded-xl w-full flex"
        >
          <router-link :to="menu.menuitem.routename" class="flex w-full">
            <MenuAt>
              <template #leading>
                <v-icon
                    :name="
                    open
                      ? menu.menuitem.leading[1]
                        ? menu.menuitem.leading[1]
                        : menu.menuitem.leading[0]
                      : menu.menuitem.leading[0]
                  "
                    scale="2"
                    class="p-2"
                />
              </template>
<template #label>
                {{ typeMenus ? menu.menuitem.labelmenu.toUpperCase() : "" }}
              </template>
<template #action v-if="!menu.menuitem.action">
                <div class="w-fit min-w-6">
                  <BadgeAt :val="menu.menuitem.action" variant="danger">
                  </BadgeAt>
                </div>
              </template>
</MenuAt>
</router-link>
</DisclosureButton>
<div v-else :class="open && ' flex flex-col w-full rounded-xl'">
  <DisclosureButton class="rounded-xl w-full flex">
    <MenuAt>
      <template #leading>
                <v-icon
                    :name="
                    open
                      ? menu.menuitem.leading[1]
                        ? menu.menuitem.leading[1]
                        : menu.menuitem.leading[0]
                      : menu.menuitem.leading[0]
                  "
                    scale="2"
                    class="p-2"
                />
              </template>
      <template #label>
                {{ typeMenus ? menu.menuitem.labelmenu.toUpperCase() : "" }}
              </template>
      <template #action v-if="!menu.menuitem.action">
                <v-icon
                    :name="
                    open ? 'ri-arrow-drop-up-line' : 'ri-arrow-drop-down-line'
                  "
                    scale="2"
                    class="p-2"
                />
              </template>
    </MenuAt>
  </DisclosureButton>
  <DisclosurePanel class="relative" v-if="menu.menuitem.submenu.length > 0">
    <div :class="
                !typeMenus &&
                'bg-primary/10 backdrop-blur-sm absolute left-12 -top-10 p-2 z-50 shadow-md rounded-md'
              ">
      <ul class="list-none2 flex flex-col gap-1">
        <li v-for="sub in menu.menuitem.submenu" :key="sub.subid"
          class="text-sm ps-4 pe-4 dark:text-pr-400 rounded-md cursor-pointer">
          <RouterLink @click="handleStart" :to="menu.menuitem.routename + '' + sub.subroute" v-slot="{ isActive }">
            <div @click="
                        width < 620
                          ? (sideMenu.sideEffect = !sideMenu.sideEffect)
                          : handleStart
                      "
              class="transition ease-in-out flex items-center text-nowrap w-full rounded-lg   dark:hover:bg-sf-drk-200"
              :style="
                        isActive &&
                        `background-color:${appAccentColor}; color:#fff`
                      ">
              <div v-if="sub.leading[1]">
                <v-icon :name="!isActive ? sub.leading[0] : sub.leading[1]" scale="1.8" class="p-2" />
              </div>
              <div v-else>
                <v-icon name="ri-apps-2-line" scale="1.8" class="p-2" />
              </div>
              {{
              sub.sublabel.charAt(0).toUpperCase() +
              sub.sublabel.slice(1)
              }}
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </DisclosurePanel>
</div>
</Disclosure> -->
    </div>
  </div>
</template>

<script setup>
import { useWindowSize } from "@vueuse/core";
import { useLoadingBar } from "naive-ui";
import { ref } from "vue";
import { useSidebar } from "../../stores/sidebar";
const appAccentColor = import.meta.env.VITE_APP_ACCENT_COLOR;
const { width } = useWindowSize();
const sideMenu = useSidebar();

const loadingBar = useLoadingBar();
const disabledRef = ref(true);
const handleStart = () => {
  loadingBar.start();
  disabledRef.value = false;
};
const props = defineProps({
  menus: {
    type: Object,
  },
  typeMenus: {
    type: Boolean,
    default: true,
  },
});
</script>