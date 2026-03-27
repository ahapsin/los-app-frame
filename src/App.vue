<template>
    <div id="app">
        <!--    <LoadingScreen class="absolute" :isLoading="isLoading"/>-->
        <!--    <main v-if="!isLoading">-->
        <n-config-provider :theme-overrides="themeOverrides">
            <n-message-provider>
                <n-dialog-provider>
                    <n-loading-bar-provider>
                        <div class="py-2 fixed z-50 pe-20 ps-4 font-bold text-center bottom-0  bg-gradient-to-r from-gray-500 to-white/0"
                            v-if="appMode === 'debug'">
                            <div class="flex text-white">
                                <v-icon name="bi-record-fill" class="text-red-500 animate-pulse"></v-icon>
                                DEVELOPER MODE
                            </div>
                        </div>
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
        borderRadius: "16px",
        textColorBase: appcolor,
        infoColor: appInfoColor,
        infoColorHover: appInfoColor,
        infoColorPressed: appInfoColor,
    },
    Button: {
        primaryColor: appcolor,
    },
    Card: {
        color: '#ffffff'
    }
}
const isLoading = ref(true);
onMounted(() => {
    setTimeout(() => isLoading.value = false, 1000);
});
</script>
<style lang="css">
.n-card {
    border: 1px solid #ddd !important;
    box-shadow: 0 0px 0px rgba(0, 0, 0, 0.04);
}

.n-data-table.n-data-table--bordered .n-data-table-wrapper {
    border: 1px solid #ddd !important;
}
</style>
