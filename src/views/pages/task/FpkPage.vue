<template>
  <component :is="width < 450 ? MSurvey:MdSurvey"/>
</template>
<script setup>
import {useWindowSize} from "@vueuse/core";
import {defineAsyncComponent} from "vue";
const {width} = useWindowSize();
const MSurvey = defineAsyncComponent(() => import("../task/order/MOrderPage.vue"));
const MdSurvey = defineAsyncComponent(() => import("../task/order/MdOrderPage.vue"));
</script>