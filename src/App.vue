<template>
  <div id="app">
    <!--    <LoadingScreen class="absolute" :isLoading="isLoading"/>-->
    <!--    <main v-if="!isLoading">-->
    <n-config-provider :theme-overrides="themeOverrides">
      <n-message-provider>
        <n-dialog-provider>
        
            <RouterView />
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
const themeOverrides = {
  common: {
    primaryColor: appcolor,
    primaryColorHover: appAccentColor,
    primaryColorPressed: appcolor,
    borderRadius: "20px",
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
