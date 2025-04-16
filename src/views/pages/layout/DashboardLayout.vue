<template>
  <div :style="`background-color:${appAccentColor} ;`" class="h-screen !bg-pr-100">
    <div class="flex">

      <n-scrollbar class="h-screen w-52" v-if="width > 390">
        <CompanyLogo class="sticky sticky-top top-0 bg-pr-100" />
        <SideMenu />
        <ClientLogo class="sticky sticky-bottom bottom-0 p-2" />
      </n-scrollbar>

      <div class="bg-white w-full h-screen rounded-0 md:rounded-s-2xl overflow-auto">
        <div class="sticky sticky-top top-0 z-50 bg-white" v-if="width > 390">
          <div class="flex justify-between items-center p-2">
            <div class="text-base font-bold px-4 uppercase">{{ $route.name }}</div>
            <account-avatar />
          </div>
        </div>
        <!-- <FormProsepek /> -->
        <RouterView />
        <slot />
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import { useWindowSize } from "@vueuse/core";
import router from "../../../router";

const { width } = useWindowSize();
const appAccentColor = import.meta.env.VITE_APP_ACCENT_COLOR;

onMounted(() => {
  if (!localStorage.getItem("token")) {
    router.push("/");

  }
});
</script>
