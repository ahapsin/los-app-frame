<template>
  <div :style="`background-color:${appAccentColor} ;`" class="h-screen">
    <div class="flex">

      <n-scrollbar class="h-screen w-52">
        <CompanyLogo class="sticky sticky-top top-0 bg-pr-100" />
        <SideMenu />
        <ClientLogo class="sticky sticky-bottom bottom-0 p-2" />
      </n-scrollbar>

      <div class="bg-white w-full h-screen rounded-s-2xl overflow-auto">
        <div class="sticky sticky-top top-0 p-4">
          <div class="flex justify-between items-center">
            <div class="font-bold">ROUTER NAME</div>
            <account-avatar />
          </div>
        </div>
        <!-- <FormProsepek /> -->
        <slot />
      </div>
    </div>
  </div>
</template>
<script setup>
import useRoute from "../../router/index.js"
const route = useRoute;
import FormProsepek from '../prospek/FormProsepek.vue';
const appAccentColor = import.meta.env.VITE_APP_ACCENT_COLOR;
</script>
