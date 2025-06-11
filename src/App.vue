<template>
  <div id="app">
    <!--    <LoadingScreen class="absolute" :isLoading="isLoading"/>-->
    <!--    <main v-if="!isLoading">-->
    <n-config-provider :theme-overrides="themeOverrides">
      <n-message-provider>
        <n-dialog-provider>
          <n-loading-bar-provider>
            <div
              class="py-2 bg-gradient-to-r from-slate-400 to-slate-950 text-white text-center shadow-xl bottom-0 text-bold"
              v-if="appMode === 'debug'">DEVELOPER MODE</div>
            <RouterView />
          </n-loading-bar-provider>
        </n-dialog-provider>
      </n-message-provider>
    </n-config-provider>
    <!--    </main>-->
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
const appcolor = import.meta.env.VITE_APP_BASE_COLOR;
const appInfoColor = import.meta.env.VITE_APP_INFO_COLOR;
const appAccentColor = import.meta.env.VITE_APP_ACCENT_COLOR;
const appMode = import.meta.env.VITE_APP_MODE;
const themeOverrides = {
  common: {
    primaryColor: appcolor,
    primaryColorHover: appAccentColor,
    borderRadius: "10px",
    textColorBase: appcolor,
    infoColor: appInfoColor,
    infoColorHover: appInfoColor,
    infoColorPressed: appInfoColor,
  },
  Button: {
    primaryColor: appcolor,
  }
}
const isLoading = ref(true);
onMounted(() => {
  setTimeout(() => isLoading.value = false, 1000);
});
</script>
