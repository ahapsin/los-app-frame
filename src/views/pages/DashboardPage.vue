<template>
    <n-card>
        Hi,<b>{{ me.me.nama }} 👋</b>
    </n-card>
  <MenuContainer class="mt-2" v-if="width <= 390"/>
<n-scrollbar x-scrollable class="h-fit ">
    <div class="grid grid-flow-col md:grid-cols-3 gap-2 mt-2">
        <OrderBoard v-if="findAccessMenu('Order')" class="w-screen md:w-full shadow"/>
        <PaymentBoard v-if="findAccessMenu('Pembayaran')" class="w-screen md:w-full shadow"/>
        <JaminanBoard v-if="findAccessMenu('jaminan')" class="w-screen md:w-full shadow"/>
    </div>
</n-scrollbar>
</template>
<script setup>
import {defineAsyncComponent} from 'vue'
import _ from "lodash";
import MenuContainer from "./../../components/organism/MenuContainer.vue";
import {useMeStore} from "../../stores/me.js";
import { useWindowSize } from '@vueuse/core';

const me = useMeStore();
const {width} = useWindowSize();


const findAccessMenu = (e) => {
  return _.includes(me.me.accessMenu, e);
}

const OrderBoard = defineAsyncComponent(() => import("./board/OrderBoard.vue"));
// const SurveyBoard = defineAsyncComponent(() => import("./board/SurveyBoard.vue"));
const PaymentBoard = defineAsyncComponent(() => import("./board/PaymentBoard.vue"));
const JaminanBoard = defineAsyncComponent(() => import("./board/JaminanBoard.vue"));


</script>
