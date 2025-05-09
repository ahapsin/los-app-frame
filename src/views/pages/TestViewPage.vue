<template>
  <n-date-picker v-model:value="timestamp" type="date" />
  {{ timestamp }}

  {{ tanggal_skg }}
  {{ moment().add(10, 'days').format('DD') }}
</template>


<script setup>
import { ref } from 'vue';
import moment from 'moment';
const timestamp = ref();
const format_date = () => {
  let dayCurrent = moment().add(10, 'days').format('DD');
  if (dayCurrent >= 26 && dayCurrent <= 31) {
    return "tambah";
  }
  else {
    return "aslinya"
  }
}
const tanggal_skg = moment().format('DD');
const tanggal_over = () => {
  return moment().format('DD');
}
</script>