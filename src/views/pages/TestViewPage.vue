<template>
  <div :style="`background-color:${appAccentColor} ;`" class="h-screen">
    <div class="flex">
      <div class="w-1/5 p-4 overflow-auto h-screen">
        <SideMenu/>
      </div>
      <div class="bg-white w-full h-screen rounded-s-2xl overflow-auto">
        <div class=" sticky sticky-top top-0 p-4">header</div>
        <FormProsepek/>
      </div>
    </div>
  </div>
</template>
<script setup>
import FormProsepek from '../prospek/FormProsepek.vue';
const appAccentColor = import.meta.env.VITE_APP_ACCENT_COLOR;
</script>
