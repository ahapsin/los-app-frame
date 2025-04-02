<template>
  <HAppBar title="Survey">
    <template #suffix>
      <n-button circle secondary>
        <v-icon name="bi-plus-lg"/>
      </n-button>
    </template>
  </HAppBar>
  {{surveyStore.surveys}}
</template>
<script setup>
import HAppBar from '../../../../components/molecules/HAppBar.vue';
import {onMounted} from "vue";
import {useSurveyStore} from "../../../../stores/survey.js";

const surveyStore = useSurveyStore();

onMounted(() => surveyStore.fetchSurveys());

</script>