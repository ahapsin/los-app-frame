<template>
    <AddSurveyBase v-if="appmod === 'base'" />
    <AddSurveyModPage v-else />
</template>
<script setup>
import AddSurveyBase from './AddSurveyBase.vue';
import AddSurveyModPage from './AddSurveyModPage.vue';

const appmod = import.meta.env.VITE_APP_MOD;
</script>
