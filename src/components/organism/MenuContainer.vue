<template>
  <n-card>
    <div v-if="menu.loading">
      <div class="flex flex-col gap-2">
        <n-skeleton height="10px" width="100px" round/>
        <n-space>
          <n-skeleton height="60px" width="60px" class="rounded-xl"/>
          <n-skeleton height="60px" width="60px" class="rounded-xl"/>
        </n-space>
      </div>
      <div class="flex flex-col gap-2 mt-2">
        <n-skeleton height="10px" width="100px" round/>
        <n-space>
          <n-skeleton height="60px" width="60px" class="rounded-xl"/>
          <n-skeleton height="60px" width="60px" class="rounded-xl"/>
          <n-skeleton height="60px" width="60px" class="rounded-xl"/>
        </n-space>
      </div>
    </div>
    <div class="grid grid-cols gap-4" v-else>
      <div v-for="colMenu in _.filter(menu.list, (o) => o.menuitem.labelmenu != 'home')" :key="colMenu.id">
        <div class="font-bold text-lg">{{ colMenu.menuitem.labelmenu }}</div>
        <div class="grid grid-cols-4 md:grid-cols-10 gap-2">
          <div class="flex flex-col" v-for="colSubMenu in colMenu.menuitem.submenu" :key="colSubMenu.id">
            <router-link :to="`${colMenu.menuitem.routename}${colSubMenu.subroute}`">
              <div
                  class="flex flex-col hover:bg-sfc cursor-pointer rounded-xl w-16 md:w-20 h-16 md:h-20 justify-center items-center ">
                <div class="w-10 h-10 flex items-center justify-center">
                  <v-icon :name="colSubMenu.leading[0] ? colSubMenu.leading[0] : 'ri-apps-2-line'"/>
                </div>
                <n-ellipsis class="px-2 rounded-full bg-sfc">{{ colSubMenu.sublabel }}</n-ellipsis>
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
import {useMenuStore} from "../../stores/menu.js";

const menu = useMenuStore();
onMounted(() => menu.fetchData());
</script>
