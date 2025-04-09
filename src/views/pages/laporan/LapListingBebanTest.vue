<template>
  <n-card title="Laporan Listing Beban TEST(mode)" :segmented="true" size="small">
    <div>
      <n-space vertical :size="12" class="pt-4">
        <n-space>
          <n-form-item label="TANGGAL AKHIR">
            <n-date-picker v-model:formatted-value="rangeDate" format="MMyyyy" type="month" clearable />
          </n-form-item>
          <n-form-item label="POS" v-if="me.me.cabang_nama === 'Head Office'">
            <n-select :loading="loadingBranch" filterable placeholder="Pilih POS" label-field="nama" value-field="id"
              :default-value="defBranch" :options="dataBranch" @update:value="handleUpdateBranch" />
          </n-form-item>
          <n-form-item>
            <n-button @click="handleSubmit" type="primary" :disabled="disbaledButton">
              Cari
            </n-button>
          </n-form-item>
          <n-form-item>
            <!-- <json-excel v-if="dataListBan.length > 0" :data="dataListBan" -->
            <!-- :name="`Listing_Beban_${selectBranch}_${rangeDate}_${periodeTarikan} `" :stringifyLongNum="false"> -->
            <n-button type="primary" secondary @click="exportToExcel" :disabled="ctrDownload">Download</n-button>
            <!-- </json-excel> -->
          </n-form-item>
        </n-space>
        <n-input type="text" placeholder="nyari apa ?" v-model:value="boxSearch"
          v-if="!ctrDownload" @blur="searchData"/>
        <n-data-table ref="tableRef" :max-height="300" virtual-scroll size="small" virtual-scroll-x :scroll-x="10000"
          :min-row-height="48" virtual-scroll-header :columns="convertObjectToArray(dataListBan)" :data="showData"
          :pagination="{ pageSize: 10 }" :loading="loadingData" />
      </n-space>
    </div>
  </n-card>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import moment from "moment";
import { useLoadingBar, useMessage } from "naive-ui";
import { useMeStore } from "../../../stores/me";
import { useApi } from "../../../helpers/axios.js";

import * as XLSX from "xlsx";
import { useSearch } from "../../../helpers/searchObject";

const tableRef = ref();
const me = useMeStore();
const message = useMessage();
const dataBranch = ref([]);
const selectBranch = ref();

const selectedBranch = ref();
const handleUpdateBranch = (value, option) => {
  selectedBranch.value = option;
}


const periodeTarikan = computed(() => {
  const range = moment(rangeDate.value, 'MMYYYY').format('YYYYMM');
  const rangeMonth = moment(rangeDate.value, 'MMYYYY').format('MM');
  const current = moment().format('MM');
  if (rangeMonth === current) {
    return moment().format('DD-MM-YYYY');
  } else {
    return moment(range).endOf('month').format('DD-MM-YYYY')
  }
}
);
const userToken = localStorage.getItem("token");
const loadingBranch = ref(false);
const getBranch = async () => {
  loadingBranch.value = true;
  const response = await useApi({
    method: "GET",
    api: "cabang",
    token: userToken,
  });
  if (!response.ok) {
    message.error("ERROR API");
  } else {
    loadingBranch.value = false;

    if (me.me?.cabang_nama != "Head Office") {
      selectBranch.value = me.me.cabang_id;
    } else {
      selectBranch.value = "SEMUA CABANG";
      dataBranch.value = response.data.response;
      dataBranch.value.unshift({
        id: "",
        nama: "SEMUA CABANG"
      });
    }
  }
}
const rangeDate = ref();
let messageReactive = null;
const loadingBar = useLoadingBar();
const handleSubmit = () => {
  let a = {
    dari: rangeDate.value,
    cabang_id: selectedBranch.value.id
  }
  messageReactive = message.loading('memuat data listing beban', { duration: 0 });
  grabListBan(a);
}
const dataListBan = ref([]);
const loadingData = ref(false);
const timer = ref(60);
const disbaledButton = ref(false);
const ctrDownload = ref(true);
const grabListBan = async (e) => {

  loadingData.value = true;
  let userToken = localStorage.getItem("token");
  const response = await useApi({
    method: "POST",
    api: "listBanTest",
    data: e,
    token: userToken,
  });
  if (!response.ok) {
    messageReactive.destroy();
    disbaledButton.value = true;
    var interval;
    interval = setInterval(() => {
      if (timer.value > 0) {
        timer.value--
      } else {
        clearInterval(interval);
        timer.value = 60;
        handleSubmit();
      }
    }, 1000);
    messageReactive = message.loading(() => (`data listban sedang sibuk mencoba ulang dalam ${timer.value} s`), { duration: 60000 });
  } else {
    messageReactive.destroy();
    messageReactive = null;
    disbaledButton.value = false;
    dataListBan.value = response.data;
    loadingData.value = false;
    ctrDownload.value = false;
  }

}
const convertObjectToArray = (obj) => {
  if (!Array.isArray(obj) || obj.length === 0) {
    return [];
  }
  const keys = Object.keys(obj[0]);
  return keys.map(key => ({ title: key, key: key }));
}

const exportToExcel = () => {
  const headTable = [
    { pos: selectedBranch.value.nama, bulan: periodeTarikan.value },
  ];
  const bodyTable = dataListBan.value;
  const ws = XLSX.utils.json_to_sheet(headTable);
  const startRow = headTable.length + 4;
  XLSX.utils.sheet_add_json(ws, bodyTable, { origin: `A${startRow}` });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "listing beban");
  // Write the workbook to an Excel file
  XLSX.writeFile(wb, `listing_beban_${selectedBranch.value.nama}_${rangeDate.value}_${periodeTarikan.value}.xlsx`);
}
const boxSearch = ref();
const stack = ref()
const showData = computed(() => {
  return useSearch(dataListBan.value, stack.value);
});
const searchData = ()=>{
  stack.value = boxSearch.value;
}

onMounted(() => {
  loadingBar.finish();
  getBranch();
}
)
  ;

</script>
