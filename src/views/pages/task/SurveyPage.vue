<template>
  <component :is="width < 450 ? MSurvey:MdSurvey"/>
</template>
<script setup>
import {useWindowSize} from "@vueuse/core";
import {defineAsyncComponent} from "vue";
const {width} = useWindowSize();
const MSurvey = defineAsyncComponent(() => import("../task/survey/MSurveyPage.vue"));
const MdSurvey = defineAsyncComponent(() => import("../task/survey/MdSurveyPage.vue"));
</script>