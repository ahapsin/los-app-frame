<template>
    <div class="p-2" v-bind="$attrs">
        <div class="flex items-center gap-2 border p-2 border-pr-400 rounded-lg bg-pr-200">
            <img :src="appLogoClient" class="w-4"/>
            <n-text class="text-[12px] font-bold text-pr">
                {{ appTitleClient }}
            </n-text>
        </div>
    </div>
</template>
<script setup>
const appLogoClient = import.meta.env.VITE_APP_LOGO_CLIENT;
const appTitleClient = import.meta.env.VITE_APP_TITLE_CLIENT;
</script>