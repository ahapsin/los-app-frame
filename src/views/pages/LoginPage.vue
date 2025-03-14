<template>
  <SingleSideBar v-if="logged">
    <Dashboard/>
  </SingleSideBar>
  <div v-else
       :style="`background-color: ${appAccentColor}`"
       :class="`h-screen flex items-center  justify-center max-h-screen  md:p-20`"
  >
    <div
        class="flex w-full h-full md:w-3/4 md:h-full bg-white md:rounded-lg overflow-clip"
    >
      <div class="items-center flex w-full md:w-1/2 p-8 md:p-10 h-full">
        <LoginForm/>
      </div>
      <div class="hidden md:flex w-1/2">
        <QuoteSection/>
      </div>
    </div>
  </div>
</template>
<script setup>
import {ref, onMounted} from 'vue';
import Dashboard from './DashboardPage.vue';

const appAccentColor = import.meta.env.VITE_APP_ACCENT_COLOR;
const logged = ref(false);

onMounted(() => {
  appAccentColor;
  if (localStorage.getItem("token")) {
    logged.value = true;
  }
})

</script>
