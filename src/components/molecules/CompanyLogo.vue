<template>
    <div class="flex items-center justify-center gap-2 p-2" v-bind="$attrs">
        <img :src="appLogo" class="w-8" />
        <n-text class="text-[16px] font-bold">{{ appTitle }}</n-text>
    </div>
</template>
<script setup>
const appLogo = import.meta.env.VITE_APP_LOGO;
const appTitle = import.meta.env.VITE_APP_TITLE;
</script>