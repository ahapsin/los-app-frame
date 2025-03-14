<template>
    <div class="p-8 h-screen flex items-center justify-center" :style="`background-color: ${appAccentColor}`">
        <n-card class="md:w-fit">
            <div class=" w-fit items-center">
                <div class="flex w-full items-center justify-around px-10">
                    <img :src="applogo" class="w-[100px] h-[100px]" />
                    <div class="w-fit">
                        <n-icon size="34px" class="animate-pulse" color="#ff0000">
                            <off-icon />
                        </n-icon>
                    </div>
                    <img :src="app503" class="w-[100px]" />
                </div>
                <div class="flex flex-col gap-2 px-10 pt-10 items-center">
                    <span class="text-2xl font-bold">Service tidak tersedia</span>
                    <span class="text-sm">Sistem sedang dalam perbaikan</span>
                    <n-button type="info" @click="handleBack">Kembali</n-button>
                </div>
            </div>
        </n-card>
    </div>
</template>

<script setup>
import { LinkOffFilled as OffIcon } from "@vicons/material";
import router from "../../router";
const applogo = import.meta.env.VITE_APP_LOGO;
const appAccentColor = import.meta.env.VITE_APP_ACCENT_COLOR;
const app503 = import.meta.env.VITE_APP_NOSERVICE;
const handleBack = () => {
    router.push('/');
}
</script>
