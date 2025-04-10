<template>
  <n-card :segmented="{
        content: true,
        footer: 'soft'
    }" :title="`Form ${props.type} jaminan`" id="drawer-target" class="overflow-hidden">
    <n-form ref="formRef" :model="dynamicForm" :rules="rules" :label-placement="width <= 920 ? 'top' : 'left'"
            require-mark-placement="right-hanging" :size="size" label-width="auto">

      <n-space vertical :size="12" class="mb-4">
        <!--        <n-input clearable placeholder="cari disini.." v-model:value="searchBox"/>-->
        <JaminanTable :type="props.type === 'pengiriman' ? 'ondemand' : 'onGoing'" @check="handleCheck"/>
        <!--        <n-data-table striped size="small" :row-key="(row) => row" :columns="columns"-->
        <!--                      :data="showData"-->
        <!--                      :max-height="300" :on-update:checked-row-keys="handleChecked" :pagination="{pageSize:10}"/>-->
      </n-space>
      <n-space>
        <n-form-item label="Tujuan" path="tujuan" v-if="props.type === 'pengiriman'">
          <n-select filterable placeholder="Pilih Cabang" :options="branchData.listExclude"
                    v-model:value="dynamicForm.tujuan" value-field="id" label-field="nama"/>
        </n-form-item>
        <n-form-item label="Kurir" path="kurir" v-if="props.type === 'pengiriman'">
          <n-input filterable placeholder="Kurir" v-model:value="dynamicForm.kurir"/>
        </n-form-item>
      </n-space>
      <n-form-item label="Catatan" path="catatan">
        <n-input type="textarea" v-model:value="dynamicForm.catatan"/>
      </n-form-item>
    </n-form>
    <template #action>
      <n-space>
        <n-button :loading="loading" type="primary" @click="handleSave" v-if="props.type === 'pengiriman'">
          <span v-if="!param">Simpan Pengiriman</span>
        </n-button>
        <n-button :loading="loading" type="primary" @click="handleSavePerminataan" v-else>
          <span v-if="!param">Simpan Permintaan</span>
        </n-button>
        <n-button type="error" @click="handleCancel">
          Batal
        </n-button>
        <!-- <n-button type="info" @click="handlePrint" v-show="printAfter">
    Cetak
</n-button> -->
      </n-space>
    </template>
  </n-card>
  <n-drawer v-model:show="modalTrx" :height="400" placement="bottom" to="#drawer-target">
    <n-drawer-content title="Detail Jaminan">
      <n-table :bordered="false" :single-line="false" size="small">
        <thead>
        <tr>
          <th>Nama Debitur</th>
          <th>No Kontrak</th>
          <th>No BPKB</th>
          <th>Lokasi</th>
          <th>Status</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>{{ bodyModalTrx.debitur }}</td>
          <td>{{ bodyModalTrx.no_kontrak }}</td>
          <td>{{ bodyModalTrx.BPKB_NUMBER }}</td>
          <td>{{ bodyModalTrx.lokasi }}</td>
          <td>{{ bodyModalTrx.STATUS }}</td>
        </tr>
        </tbody>
      </n-table>
      <n-table :bordered="false" :single-line="false" size="small">
        <tbody>
        <tr>
          <th>BPKB Atas Nama</th>
          <td>{{ bodyModalTrx.ON_BEHALF }}</td>
        </tr>
        <tr>
          <th>Merk/Tipe/Tahun</th>
          <td>{{ bodyModalTrx.BRAND }} / {{ bodyModalTrx.TYPE }} / {{ bodyModalTrx.PRODUCTION_YEAR }}</td>
        </tr>
        <tr>
          <th>Warna/No Polisi</th>
          <td>{{ bodyModalTrx.COLOR }} /{{ bodyModalTrx.POLICE_NUMBER }}</td>
        </tr>
        <tr>
          <th>No Rangka/No Mesin</th>
          <td>{{ bodyModalTrx.CHASIS_NUMBER }}/ {{ bodyModalTrx.ENGINE_NUMBER }}</td>
        </tr>
        <tr>
          <th>No Faktur</th>
          <td>{{ bodyModalTrx.INVOICE_NUMBER }}</td>
        </tr>
        </tbody>
      </n-table>
    </n-drawer-content>
  </n-drawer>
</template>
<script setup>
import {NButton, useMessage} from 'naive-ui';
import _ from "lodash";
import {ref, reactive, h, computed} from 'vue';
import {
  ListAltRound as ListIcon,
} from "@vicons/material";
import {useApi} from "../../../helpers/axios";
import {useSearch} from "../../../helpers/searchObject";
import {useWindowSize} from '@vueuse/core';

const {width} = useWindowSize();
import router from '../../../router';
import {useRoute} from 'vue-router';

import {useCollateralStore} from "../../../stores/collateral.js";
import {useBranchStore} from "../../../stores/branch.js";
import JaminanTable from "./JaminanTable.vue";

const emit = defineEmits();
const props = defineProps({
  type: String,
});

const branchData = useBranchStore();


const dynamicForm = ref({
  jaminan: null,
  bpkb: null,
  tujuan: null,
  catatan: null,
  type: props.type == "pengiriman" ? "send" : 'request'
});
const handleCheck = (e) => {
  dynamicForm.value.bpkb = e;
}
const loading = ref(false);


const message = useMessage();

const baseRoute = useRoute();

const param = baseRoute.params.iduser;
const userToken = localStorage.getItem("token");
const handleCancel = () => {
  emit('batal', true);
};


const rules = {
  tujuan: {
    trigger: "blur",
    required: true,
    message: 'Tujuan harus dipilih salah satu'
  },
  kurir: {
    trigger: "blur",
    required: true,
    message: 'Kurir harus diisi yaa'
  }, catatan: {
    trigger: "blur",
    required: true,
    message: 'Catatan harus diisi'
  },
}

const columns = [
  {
    type: "selection",
    disabled(row) {
      return (
          row.STATUS === "SENDING"
      );
    },
  },

  {
    title: "No Kontrak",
    key: "no_kontrak",
    sorter: "default",
    // render(row) {
    //     return h("div", row.no_polisi);
    // }
  },
  {
    title: "Nama Debitur",
    key: "debitur",
    sorter: "default",
  },
  {
    title: "No BPKB",
    key: "BPKB_NUMBER",
    sorter: "default",
  },
  {
    title: "Posisi Berkas",
    key: "posisi_berkas",
    sorter: "default",
  },
  {
    title: "Status",
    key: "STATUS",
    sorter: "default",
  },
  {
    width: 100,
    align: "right",
    key: "action",
    render(row) {
      return h(
          NButton,
          {
            size: "small",
            secondary: true,
            round: true,
            onClick: () => {
              detailTrx(row);
            },
          },
          {
            default: () => "detail",
          }
      );
    },
  },
]

const collData = useCollateralStore();
const searchBox = ref();
const modalTrx = ref(false);
const bodyModalTrx = ref();
const detailTrx = (e) => {
  bodyModalTrx.value = e;
  modalTrx.value = true;
}
const formRef = ref(null)
const handleSave = async () => {
  console.log(dynamicForm);
  await formRef.value?.validate((errors) => {
    if (errors) {
      message.error("periksa kembali isian anda");
    } else {
      prosesSave();
    }
  });
  printAfter.value = true;

}
const prosesSave = async () => {
  const response = await useApi({
    method: 'POST',
    api: 'jaminan_transaction',
    data: dynamicForm.value,
    token: userToken
  });

  if (!response.ok) {
    message.error("data gagal disimpan");
    loading.value = false;
  } else {
    router.push({name: 'jaminan'})
    message.success("data berhasil disimpan");
    emit('simpan', false);
    loading.value = false;
  }
}
const handleSavePerminataan = async () => {
  printAfter.value = true;
  const bodyData = {
    collateral_id: dynamicForm.value.bpkb,
    catatan: dynamicForm.value.catatan,
  }
  const response = await useApi({
    method: 'POST',
    api: 'jaminan_transaction_permintaan',
    data: bodyData,
    token: userToken
  });

  if (!response.ok) {
    message.error("data gagal disimpan");
    loading.value = false;
  } else {
    router.push({name: 'jaminan'})
    message.success("data berhasil disimpan");
    emit('simpan', false);
    loading.value = false;
  }
}
const getBranchData = async () => {
  const response = await useApi({
    method: 'GET',
    api: 'cabang',
    token: userToken
  });

  if (!response.ok) {
    console.log(response);
  } else {
    branchData.storeBranch(response.data.response);
  }
}

onMounted(() => getBranchData())
const showData = computed(() => {
  let data = _.filter(props.type == 'pengiriman' ? collData.onDemand : collData.onGoing, {});
  return useSearch(data, searchBox.value);
});

const printAfter = ref(false);


</script>
