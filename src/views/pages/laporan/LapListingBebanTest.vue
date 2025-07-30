<template>
  <n-card title="Laporan Listing Beban" :segmented="true" size="small">
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
            <!-- <json-excel v-if="dataListBan.length > 0" :data="dataListBan"
              :name="`Listing_Beban_${selectedBranch?.nama ? selectedBranch.nama : me.me.cabang_nama}_${rangeDate}_${periodeTarikan} `" :stringifyLongNum="false"> -->
            <n-button type="primary" secondary @click="exportToExcel(dataListBan)"
              v-if="dataListBan.length != 0">Download</n-button>
            <!-- <n-button type="primary" secondary :disabled="ctrDownload">Download</n-button> -->
            <!-- </json-excel> -->
          </n-form-item>
        </n-space>
        <n-input type="text" placeholder="nyari apa ?" v-model:value="boxSearch" v-if="!ctrDownload"
          @blur="searchData" />
        <n-data-table ref="tableRef" :max-height="300" virtual-scroll size="small" virtual-scroll-x :scroll-x="10000"
          :min-row-height="48" virtual-scroll-header :columns="convertObjectToArray(dataListBan)" :data="dataListBan"
          :pagination="{ pageSize: 10 }" :loading="loadingData" />
      </n-space>
    </div>
  </n-card>
</template>
<script setup>
import moment from "moment";
import { useLoadingBar, useMessage } from "naive-ui";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import JsonExcel from "vue-json-excel3";
import { useApi } from "../../../helpers/axios.js";
import { useMeStore } from "../../../stores/me";
import { saveAs } from 'file-saver'
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


const dummyData = [{
    "KODE CABANG": "003-ANJ",
    "NAMA CABANG": "Anjatan",
    "NO KONTRAK": 11101190000187,
    "NAMA PELANGGAN": "DADI BIN SAYAM",
    "TGL BOOKING": "02/13/2019",
    "UB": "",
    "PLATFORM": "",
    "ALAMAT TAGIH": "BLOK BULU RT 01 RW 01 DS LIMPAS KEC PATROL RT/01 RW/01 KAB. INDRAMAYU JAWA BARAT",
    "KECAMATAN": "KEC. PATROL",
    "KELURAHAN": "LIMPAS",
    "NO TELP": "081220534179",
    "NO HP1": "",
    "NO HP2": "",
    "PEKERJAAN": "WIRASWASTA",
    "SUPPLIER": "",
    "SURVEYOR": "NURFAUZI",
    "CATT SURVEY": "PK ADALAH SEORANG TUKANG OJEK ISTRI PK IRT",
    "PKK HUTANG": 1500000,
    "JML ANGS": 12,
    "JRK ANGS": 1,
    "PERIOD": 12,
    "OUT PKK AWAL": 153821,
    "OUT BNG AWAL": 6179,
    "OVERDUE AWAL": 1966,
    "AMBC PKK AWAL": 153821,
    "AMBC BNG AWAL": 6179,
    "AMBC TOTAL AWAL": 160000,
    "CYCLE AWAL": "CX",
    "STS KONTRAK": "AC",
    "STS BEBAN": "AC",
    "POLA BYR AWAL": "",
    "OUTS PKK AKHIR": 153821,
    "OUTS BNG AKHIR": 6179,
    "OVERDUE AKHIR": 1997,
    "ANGSURAN": 160000,
    "ANGS KE": 12,
    "TIPE ANGSURAN": "bulanan",
    "JTH TEMPO AWAL": "12/2/2020",
    "JTH TEMPO AKHIR": "12/2/2020",
    "TGL BAYAR": "",
    "KOLEKTOR": "unknown",
    "CARA BYR": null,
    "AMBC PKK_AKHIR": 153821,
    "AMBC BNG_AKHIR": 6179,
    "AMBC TOTAL_AKHIR": 160000,
    "AC PKK": 0,
    "AC BNG MRG": 0,
    "AC TOTAL": 0,
    "CYCLE AKHIR": "CX",
    "POLA BYR AKHIR": "",
    "NAMA BRG": null,
    "TIPE BRG": "HONDA NF 100 L SUPRA FIT TROMOL",
    "NO POL": "E4319RH",
    "NO MESIN": "HB31E1107525",
    "NO RANGKA": "MH1HB31125KK109961",
    "TAHUN": "2005",
    "NILAI PINJAMAN": 1000000,
    "ADMIN": 500000,
    "CUST_ID": 1110119000553
},{
    "KODE CABANG": "003-ANJ",
    "NAMA CABANG": "Anjatan",
    "NO KONTRAK": 11101190000195,
    "NAMA PELANGGAN": "WAHYUDIN",
    "TGL BOOKING": "2/17/2019",
    "UB": "",
    "PLATFORM": "",
    "ALAMAT TAGIH": "DUSUN LUNGMALANG RT 12 RW 03 DS BUGIS KEC ANJATAN RT/12 RW/03 KAB. INDRAMAYU JAWA BARAT",
    "KECAMATAN": "KEC. ANJATAN",
    "KELURAHAN": "BUGIS",
    "NO TELP": "082316695353",
    "NO HP1": "",
    "NO HP2": "",
    "PEKERJAAN": "MENGURUS RUMAH TANGGA",
    "SUPPLIER": "",
    "SURVEYOR": "CASDIKIN",
    "CATT SURVEY": "PK ADALAH SEORANG PEDAGANG SAYUR KELILING ISTRI PK IRT",
    "PKK HUTANG": 4650000,
    "JML ANGS": 24,
    "JRK ANGS": 1,
    "PERIOD": 24,
    "OUT PKK AWAL": 4650000,
    "OUT BNG AWAL": 2310000,
    "OVERDUE AWAL": 2301,
    "AMBC PKK AWAL": 4650000,
    "AMBC BNG AWAL": 2310000,
    "AMBC TOTAL AWAL": 6960000,
    "CYCLE AWAL": "CX",
    "STS KONTRAK": "AC",
    "STS BEBAN": "AC",
    "POLA BYR AWAL": "",
    "OUTS PKK AKHIR": 4650000,
    "OUTS BNG AKHIR": 2310000,
    "OVERDUE AKHIR": 2332,
    "ANGSURAN": 290000,
    "ANGS KE": 1,
    "TIPE ANGSURAN": "bulanan",
    "JTH TEMPO AWAL": "14/3/2019",
    "JTH TEMPO AKHIR": "14/3/2019",
    "TGL BAYAR": "",
    "KOLEKTOR": "unknown",
    "CARA BYR": null,
    "AMBC PKK_AKHIR": 4650000,
    "AMBC BNG_AKHIR": 2310000,
    "AMBC TOTAL_AKHIR": 6960000,
    "AC PKK": 0,
    "AC BNG MRG": 0,
    "AC TOTAL": 0,
    "CYCLE AKHIR": "CX",
    "POLA BYR AKHIR": "",
    "NAMA BRG": null,
    "TIPE BRG": "SUZUKI CARRY CARRY",
    "NO POL": "D1012EG",
    "NO MESIN": "F10AA1D184275",
    "NO RANGKA": "SL410285379",
    "TAHUN": "1988",
    "NILAI PINJAMAN": 4000000,
    "ADMIN": 650000,
    "CUST_ID": 1110119000560
}]

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
    cabang_id: selectedBranch.value?.id ? selectedBranch.value.id : me.me.cabang_id,
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

// const exportToExcel = () => {
//   const headTable = [
//     { pos: selectedBranch.value?.nama ? selectedBranch.value.nama : me.me.cabang_nama, bulan: periodeTarikan.value },
//   ];
//   const bodyTable = dataListBan.value;
//   const ws = XLSX.utils.json_to_sheet(headTable);
//   const startRow = headTable.length + 4;
//   XLSX.utils.sheet_add_json(ws, bodyTable, { origin: `A${startRow}` });
//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, "listing beban");
//   // Write the workbook to an Excel file
//   XLSX.writeFile(wb, `listing_beban_${selectedBranch.value?.nama ? selectedBranch.value.nama : me.me.cabang_nama}_${rangeDate.value}_${periodeTarikan.value}.xlsx`);
// }

const exportToExcel = (data) => {
  // Deteksi kolom yang isinya konsisten berupa tanggal
  const potentialDateColumns = new Set();

  data.forEach(row => {
    Object.entries(row).forEach(([key, value]) => {
      if (
        value &&
        typeof value === 'string' &&
        !isNaN(Date.parse(value))
      ) {
        potentialDateColumns.add(key);
      }
    });
  });

  // Konversi ke Date object untuk kolom tanggal
  const formattedData = data.map(row => {
    const newRow = { ...row };
    potentialDateColumns.forEach(col => {
      const val = newRow[col];
      if (
        val &&
        typeof val === 'string' &&
        !isNaN(Date.parse(val))
      ) {
        newRow[col] = new Date(val);
      }
    });
    return newRow;
  });

  const ws = XLSX.utils.json_to_sheet(formattedData);

  // Format cell sebagai tanggal jika isi adalah Date
  Object.keys(ws).forEach(cell => {
    const col = cell.replace(/[0-9]/g, '');
    const rowNum = parseInt(cell.replace(/[A-Z]/g, ''));
    if (rowNum !== 1 && potentialDateColumns.has(col)) {
      const cellVal = ws[cell].v;
      if (cellVal instanceof Date && !isNaN(cellVal.getTime())) {
        ws[cell].t = 'd';
        ws[cell].z = 'dd/mm/yyyy';
      }
    }
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

  saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `listing_beban_${selectedBranch.value?.nama ? selectedBranch.value.nama : me.me.cabang_nama}_${rangeDate.value}_${periodeTarikan.value}.xlsx`);
};
const boxSearch = ref();
const stack = ref()
const showData = computed(() => {
  return useSearch(dataListBan.value, stack.value);
});
const searchData = () => {
  stack.value = boxSearch.value;
}

onMounted(() => {
  loadingBar.finish();
  getBranch();
}
)
  ;

</script>
