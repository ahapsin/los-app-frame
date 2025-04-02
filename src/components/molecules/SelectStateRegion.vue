<template>
  <div class="flex md:flex-row flex-col w-full  gap-2">
    <n-form-item class="w-full" label="Provinsi" path="provinsi">
      <n-select v-model:value="props.provinsi" :options="col_provinsi" filterable label-field="text"
                placeholder="Pilih Provinsi" value-field="id" @blur="provUpdate"
                @update:value="provinsiChanged"/>
    </n-form-item>
    <n-form-item class="w-full" label="Kota" path="kota">
      <n-select v-model:value="props.kota" :options="col_kota" filterable label-field="text"
                placeholder="Pilih Kab/Kota" value-field="id" @blur="kotaUpdate" @update:value="kotaChanged"/>
    </n-form-item>
    <n-form-item class="w-full" label="Kecamatan" path="kecamatan">
      <n-select v-model:value="props.kecamatan" :options="col_kec" filterable label-field="text"
                placeholder="Pilih Kecamatan" value-field="id" @blur="kecUpdate" @update:value="kecChanged"/>
    </n-form-item>
    <n-form-item v-if="col_desa.length <= 0 " class="w-full" label="Desa" path="desa">
      <n-input v-model:value="props.desa" placeholder="Kelurahan / Desa" @update:value="desaPostUp"/>
    </n-form-item>
    <n-form-item v-else class="w-full" label="Desa" path="desa">
      <n-select v-model:value="props.desa" :options="col_desa" filterable label-field="text" placeholder="Pilih Desa"
                tag
                value-field="id" @click="desaUpdate" @update:value="desaChanged"/>
    </n-form-item>
    <n-form-item v-if="col_kodepos.length <= 0" class="w-full" label="Kode Pos" path="kode_pos">
      <n-input v-model:value="props.kodepos" maxlength="5" placeholder="Kode Pos" @update:value="kodePostUp"/>
    </n-form-item>
    <n-form-item v-else class="w-full" label="Kode Pos" path="kode_pos">
      <n-select v-model:value="props.kodepos" :options="col_kodepos" filterable label-field="text"
                placeholder="Pilih Kodepos"
                tag value-field="id" @update:value="kodeposChanged"/>
    </n-form-item>
  </div>

</template>

<script setup>
import axios from "axios";
import {reactive, ref} from "vue";
import {useOpenAPIget} from "../../helpers/axios";
import _ from "lodash";

const sel_provinsi = ref('pilih');
const sel_kota = ref('pilih');
const sel_kec = ref('pilih');
const sel_desa = ref('pilih');
const col_provinsi = ref();
const col_kota = ref();
const col_kec = ref();
const col_desa = ref([]);
const kodepostText = ref();
const col_kodepos = ref([]);

const emit = defineEmits(['update:provinsi', 'update:kota', 'update:kecamatan', 'update:desa', 'update:kodepos']);
const props = defineProps({
  label: {
    type: [String, Boolean],
    default: false,
  },
  error: {
    type: [String, Boolean],
    default: false,
  },
  active: {
    type: Boolean,
  },
  options: {
    type: Object,
  },
  provinsi: {
    type: String,
  },
  kota: {
    type: String,
  },
  kecamatan: {
    type: String,
  },
  desa: {
    type: String,
  },
  kodepos: {
    type: String,
  },
  loop: {
    type: [Number, Boolean]
  }
});
const dataAlamat = reactive({
  provinsi: props.kota,
});
const provinsiChanged = async (value, option) => {
  try {
    let getKota = await axios.get(`https://alamat.thecloudalert.com/api/kabkota/get/?d_provinsi_id=${value}`);
    col_kota.value = getKota.data.result;
    emit('update:provinsi', option.text);
  } catch (error) {
    console.log(error);
  }
};
const provUpdate = () => {
  emit('update:kota', "");
  emit('update:kecamatan', "");
  emit('update:desa', "");
  emit('update:kodepos', "");
}
const kotaChanged = async (value, option) => {

  sel_kota.value = value;
  try {
    let getKec = await axios.get(`https://alamat.thecloudalert.com/api/kecamatan/get/?d_kabkota_id=${value}`);
    col_kec.value = getKec.data.result;
    emit('update:kota', option.text);
  } catch (error) {
    console.log(error);
  }
};
const kecChanged = async (value, option) => {
  sel_kec.value = value;
  try {
    let getKec = await axios.get(`https://alamat.thecloudalert.com/api/kelurahan/get/?d_kecamatan_id=${value}`);
    col_desa.value = getKec.data.result;
    emit('update:kecamatan', option.text);
  } catch (error) {
    console.log(error);
  }
};

const kodeposChanged = (value, option) => {
  // console.log(option.name);
  emit('update:kodepos', option.text);
};
const kodePostUp = (option) => {
  emit('update:kodepos', option);
}

const desaPostUp = (option) => {
  emit('update:desa', option);
}

const kotaUpdate = () => {
  emit('update:kecamatan', "");
  emit('update:desa', "");
  emit('update:kodepos', "");
  const find = _.find(col_provinsi.value, (o) => o.text.toLowerCase() === props.provinsi.toLowerCase())
  provinsiChanged(find.id);
}
const kotPlace = ref();
const kecPlace = ref();
const kecUpdate = async () => {
  emit('update:desa', "");
  emit('update:kodepos', "");
  const findKota = _.find(col_provinsi.value, (o) => o.text.toLowerCase() === props.provinsi.toLowerCase());
  kotPlace.value = findKota.id;
  await provinsiChanged(findKota.id);
  const findKec = _.find(col_kota.value, (o) => o.text.toLowerCase() === props.kota.toLowerCase());
  kecPlace.value = findKec.id;
  await kotaChanged(findKec.id);
}

const desaUpdate = async () => {
  emit('update:kodepos', "");
  const findKota = _.find(col_provinsi.value, (o) => o.text.toLowerCase() === props.provinsi.toLowerCase());
  kotPlace.value = findKota.id;
  await provinsiChanged(findKota.id);
  const findKec = _.find(col_kota.value, (o) => o.text.toLowerCase() === props.kota.toLowerCase());
  kecPlace.value = findKec.id;
  await kotaChanged(findKec.id);
  const findDesa = _.find(col_kec.value, (o) => o.text.toLowerCase() === props.kecamatan.toLowerCase());
  await kecChanged(findDesa.id);
}
const desaChanged = async (value, option) => {
  sel_desa.value = value;
  try {
    let getKodepos = await axios.get(`https://alamat.thecloudalert.com/api/kodepos/get/?d_kabkota_id=${sel_kota.value ? sel_kota.value : kotPlace.value}&d_kecamatan_id=${sel_kec.value ? sel_kec.value : kecPlace.value}`);
    col_kodepos.value = getKodepos.data.result;
    emit('update:desa', option.text);
  } catch (error) {
    console.log(error);
  }

};

useOpenAPIget("https://alamat.thecloudalert.com/api/provinsi/get/").then(([res]) => {
  col_provinsi.value = res.result
});

</script>
