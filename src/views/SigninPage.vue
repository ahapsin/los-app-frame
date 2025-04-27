<template>
  <div
       :style="`background-color: ${appAccentColor}`"
       :class="`h-screen flex items-center  justify-center max-h-screen  md:p-20`"
  >
    <div
        class="flex w-full h-full md:w-3/4 md:h-full  md:rounded-lg gap-20"
    >

      <div class="hidden lg:flex w-1/2">
        <QuoteSection/>
      </div>
      <div class="items-center flex w-full lg:w-1/2 md:p-10 h-full">
        <LoginForm/>
      </div>
    </div>
  </div>
</template>
<script setup>
const appAccentColor = import.meta.env.VITE_APP_ACCENT_COLOR;
</script>