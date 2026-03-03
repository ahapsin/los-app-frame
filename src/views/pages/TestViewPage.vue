<template>
  <n-card>
    <n-input v-model:value="form.idtrx" />
    <n-input v-model:value="form.loan" />
    <n-input v-model:value="form.amount" />
    {{ form }}
    <n-button @click="handlePost">kirim</n-button>
  </n-card>
</template>
<script setup>
import { useApi } from '../../helpers/axios';
const form = ref({
  idtrx: null,
  amount: null,
  loan: null
});
const payload = {
  amount: 100000
};
const handlePost = async () => {

  const response = await useApi({
    method: "POST",
    data: form.value,
    api: 'pembayarans',
    token: localStorage.getItem('token'),
  });
  if (!response.ok) {
    console.log(response);
  } else {
    console.log(response);
  }
}
</script>