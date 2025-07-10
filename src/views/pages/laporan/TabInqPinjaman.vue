<template>
  <div>
    <n-space vertical>
      <n-space>
        <n-form-item label="Nomor Kontrak">
          <n-input placeholder="Nomor Kontrak" v-model:value="searchBox" clearable />
        </n-form-item>
        <n-form-item label="Nama Debitur">
          <n-input placeholder="Nama Debitur" v-model:value="namaDebitur" clearable />
        </n-form-item>
        <n-form-item label="No Polisi">
          <n-input placeholder="No Polisi" v-model:value="nomorPolisi" clearable />
        </n-form-item>
        <n-form-item>
          <n-button type="primary" @click="handleCari">Cari</n-button>
        </n-form-item>
      </n-space>
      <n-data-table ref="tableRef" :header-height="48" :columns="columns" :data="props.data" :loading="loading"
        v-show="props.available" :pagination="{ pageSize: 10 }" />
    </n-space>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  loading: Boolean,
  columns: Array,
  available: {
    type: Boolean,
    default: false,
  },
  data: Object
})
const tableRef = ref();
const searchBox = ref();
const namaDebitur = ref();
const nomorPolisi = ref();
const emit = defineEmits('cari');
const handleCari = () => {
  emit('cari', {
    no_kontrak: searchBox.value,
    nama: namaDebitur.value,
    no_polisi:nomorPolisi.value,
  });
}

</script>
