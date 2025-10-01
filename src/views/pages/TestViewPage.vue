<template>
    <json-excel :data="a" :stringifyLongNum="true">
        <n-button type="primary" secondary>Download</n-button>
    </json-excel>
    <div class="text-[82px]">{{ lang }}</div>
</template>
<script setup>
import JsonExcel from "vue-json-excel3";
const lang = navigator.language;
const a = [{'a':1234567898.6}];
</script>