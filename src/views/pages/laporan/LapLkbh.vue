<template>
  <n-card :class="`shadow-lg`" title="Laporan Keuangan Berbasis Harian (LKBH)" :segmented="{
    content: true,
    footer: 'soft',
  }" size="small" class="shadow-lg">
    <div>
      <n-space vertical :size="12" class="pt-4">
        <n-space>
          <n-date-picker v-model:formatted-value="rangeDate" :default-calendar-start-time="Date.now()" clearable
            start-placeholder="dari" type="daterange" end-placeholder="sampai" format="yyyy-MM-dd" />
          <n-select v-show="me.me.cabang_nama == 'Head Office'" :loading="loadingBranch" @click="getBranch" filterable
            placeholder="Pilih Cabang" label-field="nama" value-field="id" :default-value="defBranch"
            :options="dataBranch" v-model:value="selectBranch" />
          <n-button @click="handleSubmit" type="primary">
            Cari
          </n-button>
          <json-excel :data="dataArusKas.datas" :name="`LAP_LKBH`">
            <n-button type="primary" secondary>Download</n-button>
          </json-excel>

        </n-space>
        <div class=" border p-4 border-black" v-if="tarik">
          <div class="flex items-center gap-2 justify-between">
            <div class="flex gap-2 items-center py-4">
              <img class="h-10 md:h-10" :src="applogo" alt="logo_company" />
              <div class="flex flex-col">
                <n-text class="text-xl font-bold">{{ apptitle }}</n-text>
                <n-text class="text-md font-bold">POS : {{ me.me.cabang_nama }}</n-text>
              </div>
            </div>
            <div class="text-md font-bold justify-center pt-4 flex flex-col text-right">
              <n-text>LAPORAN KEUANGAN BERBASI HARIAN (LKBH)</n-text>
              <n-text class="text-sm">tanggal : {{ formatDate(dataArusKas.dari) }}-{{ formatDate(dataArusKas.sampai)
              }}</n-text>

            </div>
          </div>
          <table class="w-full font-mono text-xs" cellspacing="10">
            <thead>
              <tr class="border-b border-t border-black border-dashed">
                <th align="left" class="px-2" v-for="header in dataArusKas.HeaderTable">{{ header }}</th>
              </tr>
            </thead>
            <tbody v-for="body in dataArusKas.Result" :key="body.title">
              <tr>
                <th colspan="9">
                  <n-divider title-placement="left">
                    {{ body.title }}
                  </n-divider>
                </th>
              </tr>
              <tr v-for="cashin in body.data" :key="cashin.id">
                <td v-for="td in cashin">{{ td }}</td>
              </tr>
              <tr class="border-b border-black">
                <th :colspan="body.colspan-1" align="left" class="pt-4">JUMLAH</th>
                <th align="left" class="pt-2">{{ body.jumlah }}</th>
              </tr>
            </tbody>

          </table>
        </div>

      </n-space>
    </div>
  </n-card :class="`shadow-lg`">
</template>

<script setup>
import _ from "lodash";
import {
  useLoadingBar,
  useMessage
} from "naive-ui";
import { ref } from "vue";
import JsonExcel from "vue-json-excel3";
import { useApi } from "../../../helpers/axios.js";
import { useMeStore } from "../../../stores/me.js";


const apptitle = import.meta.env.VITE_APP_TITLE;
const applogo = import.meta.env.VITE_APP_LOGO;
const me = useMeStore();
const dataArusKas = ref([]);
const loadingBar = useLoadingBar();
const tarik = ref(false);
const message = useMessage();
const loadData = ref(false);

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-11, so we add 1
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

const cashOut = ref([]);
const cashIn = ref([]);
const pelunasan = ref([]);
const cashInTrf = ref([]);
const getArusKas = async (e) => {
  message.loading('memuat data LKBH');
  loadData.value = true;
  tarik.value = false;
  let userToken = localStorage.getItem("token");
  const response = await useApi({
    method: "POST",
    api: "LkbhReport",
    data: e,
    token: userToken,
  });
  if (!response.ok) {
    console.log(reponse.error);
  } else {
    loadData.value = false;
    dataArusKas.value = response.data;
    tarik.value = true;
    cashOut.value = _.filter(response.data.datas, { 'type': "CASH_OUT" });
    pelunasan.value = _.filter(response.data.datas, { 'type': "PELUNASAN" });
    cashIn.value = _.filter(response.data.datas, { 'type': "CASH_IN", "metode_pembayaran": "cash" });
    cashInTrf.value = _.filter(response.data.datas, { "type": "CASH_IN", "metode_pembayaran": "transfer" });
  }
}

function sumRupiahStrings(arr) {
  // fungsi konversi string ke number
  const toNumber = (str) => {
    if (!str) return 0;
    return parseFloat(
      str.replace(/\./g, "").replace(",", ".")
    );
  };

  // jumlahkan semua
  const total = arr.reduce((acc, val) => acc + toNumber(val), 0);

  // balikin ke format Indonesia
  return total.toLocaleString("id-ID", { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
}

const rangeDate = ref();
const dataBranch = ref([]);
const selectBranch = ref();
const defBranch = ref();
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
    me.me.cabang_nama != "Head Office" ? selectBranch.value = me.me.cabang_id : selectBranch.value = "SEMUA CABANG";
    dataBranch.value = response.data.response;
    dataBranch.value.unshift({
      id: "SEMUA CABANG",
      nama: "SEMUA CABANG"
    });
  }
}
onMounted(() => {
  loadingBar.finish();
  getBranch();
});
const jumlahKan = (e) => {
  const toNumber = (val) => {
    if (!val) return 0;
    if (typeof val === "number") return val;
    return parseFloat(val.replace(/\./g, "").replace(",", "."));
  };

  return e.reduce((sum, item) => sum + toNumber(item.amount), 0);
};
const handleSubmit = async () => {
  let a = {
    dari: rangeDate.value[0],
    sampai: rangeDate.value[1],
    cabang_id: selectBranch.value ? selectBranch.value : null
  }
  console.log(a)
  await getArusKas(a);
}

</script>
