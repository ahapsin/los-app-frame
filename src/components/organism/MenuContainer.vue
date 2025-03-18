<template>
    <n-card>
        <div class="grid grid-cols gap-4">
            <div v-for="colMenu in _.filter(menu.list, (o) => o.menuitem.labelmenu != 'home')" :key="colMenu.id">
                <div class="text-gray-400">{{ colMenu.menuitem.labelmenu }}</div>
                <div class="grid grid-cols-4 md:grid-cols-10 gap-2">
                    <div class="flex flex-col" v-for="colSubMenu in colMenu.menuitem.submenu" :key="colSubMenu.id">
                        <router-link :to="`${colMenu.menuitem.routename}${colSubMenu.subroute}`">
                            <div
                                class="flex flex-col hover:bg-sfc cursor-pointer rounded-xl w-16 md:w-20 h-16 md:h-20 justify-center items-center ">
                                <div class="w-10 h-10 flex items-center justify-center">
                                    <v-icon :name="colSubMenu.leading[0] ? colSubMenu.leading[0] : 'ri-apps-2-line'" />
                                </div>
                                <n-ellipsis>{{ colSubMenu.sublabel }}</n-ellipsis>
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </n-card>
</template>
<script setup>
import _ from "lodash";
import { useMenuStore } from "../../stores/menu.js";
const menu = useMenuStore();
onMounted(() => menu.fetchData());
</script>
