<template>
  <div id="app">
    <n-card title="Update taksasi">
      <template #header-extra>
        <n-space>
          <input id="files" type="file" @change="handleFileUpload" class="hidden" accept=".csv" />
          <label for="files"
            class="border-2 bg-pr  text-white flex p-2  hover:shadow justify-center rounded-xl cursor-pointer">Import</label>
          <div class="border-2 border-pr  text-pr flex p-2  hover:shadow justify-center rounded-xl cursor-pointer"
            @click="downloadCsv" v-if="dataTakasasi.length > 0">Download Taksasi</div>
        </n-space>
      </template>
      <n-card v-if="importChange">
        <n-alert type="warning" :show-icon="false">
          <div class="flex justify-between items-center">
            <div class="text-xl">{{ csvData.length }} baris data</div>
            <n-button type="primary" @click="importData">update data</n-button>
          </div>
        </n-alert>
        <table class="table table-striped">
          <thead class="sticky top-0">

            <th v-for="head in csvHeaders" :key="head">{{ head }}</th>
          </thead>
          <tbody class="h-96 overflow-y-auto">
            <tr v-for="body in csvData" :key="body">
              <td v-for="item in body" :key="item">{{ item }}</td>
            </tr>
          </tbody>
        </table>

      </n-card>
      {{ dataTaksasi }}
      <n-data-table :columns="columns" :data="dataTakasasi" :pagination="{ pageSize: 10 }" ref="tableRef"></n-data-table>
    </n-card>

  </div>
</template>

<script setup>
import Papa from 'papaparse'; // Import PapaParse
import { h, onMounted, ref } from "vue";

import { useMessage } from "naive-ui";
import { useApi } from '../../helpers/axios';

const csvData = ref([]);
const csvHeaders = ref([]);
const format = ref([]);
const importChange = ref(false);

const handleFileUpload = async (event) => {
  // Get the file from the input element
  const file = event.target.files[0];

  if (file) {
    importChange.value = true;
    // Parse the CSV file using PapaParse
    await Papa.parse(file, {
      complete: (result) => {
        console.log(result); // Output parsed CSV result for debugging

        // Set the headers and data from parsed result
        csvHeaders.value = result.data[0]; // Assuming the first row contains headers
        csvData.value = result.data.slice(1); // Data starts from the second row
        format.value = formattedData(csvData.value);
      },
      header: false, // Disable header processing (optional, if you want to keep it as data)
      skipEmptyLines: true, // Skip empty lines
    });
  }
}

const columns = [
  {
    title: "Jenis",
    sorter: 'default',
    key: "jenis"
  },
  {
    title: "Merk",
    sorter: 'default',
    key: "brand"
  },
  {
    title: "Code",
    sorter: 'default',
    key: "code"
  },
  {
    title: "Type",
    sorter: 'default',
    key: "model"
  }, {
    title: "Model",
    sorter: 'default',
    key: "descr"
  }, {
    title: "Year",
    sorter: 'default',
    key: "year"
  }, {
    title: "Price",
    sorter: 'default',
    align: "right",
    key: "price",
    render(row) {
      return h("div", row.price?.toLocaleString("US"));
    },
  },
]
const formattedData = (e) => {
  console.log(csvHeaders.value);
  const retData = e.map(item => (
    {
      jenis: item[0],
      brand: item[1],
      vehicle: item[2],
      type: item[3],
      model: item[4],
      year: item[5],
      price: item[6],
    }));
  return retData;
}
const message = useMessage();

const importData = async () => {
  let messageReactive = null;
  messageReactive = message.loading("mengupdate data taksasi", { duration: 0 });
  const userToken = localStorage.getItem("token");
  const response = await useApi({
    method: "post",
    api: "taksasi_dump",
    data: format.value,
    token: userToken,
  });
  if (!response.ok) {
    message.error("sesi berakhir");
  } else {
    message.success("update taksasi selesai....");
    messageReactive.destroy();
    messageReactive = null;
  }
}

const dataTakasasi = ref([]);
const getTaksasi = async () => {
  const userToken = localStorage.getItem("token");
  const response = await useApi({
    method: "get",
    api: "taksasi_download",
    token: userToken,
  });
  if (!response.ok) {
    message.error("sesi berakhir");
  } else {
    dataTakasasi.value = response.data;
    console.log(response);
    message.success("data taksasi dimuat....");
  }
}

const tableRef = ref();
const downloadCsv = () => tableRef.value?.downloadCsv({
  fileName: `format_taksasi`,
  keepOriginalData: true
});

onMounted(() => getTaksasi());
</script>

<style scoped>
/* Simple styling for the table */
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
</style>
<script setup>
const pelunasan = reactive({
  LOAN_NUMBER: null,
  METODE_PEMBAYARAN: "cash",
  SISA_POKOK: 0,
  BUNGA_BERJALAN: 0,
  TUNGGAKAN_BUNGA: 0,
  DENDA: 0,
  PINALTI: 0,
  UANG_PELANGGAN: 0,
  DISKON: 0,
  BAYAR_POKOK: 0,
  BAYAR_BUNGA: 0,
  BAYAR_PINALTI: 0,
  BAYAR_DENDA: 0,
  DISKON_POKOK: 0,
  DISKON_PINALTI: 0,
  DISKON_BUNGA: 0,
  DISKON_DENDA: 0,
  JUMLAH_TAGIHAN: computed(
      () =>
          pelunasan.SISA_POKOK +
          pelunasan.TUNGGAKAN_BUNGA +
          pelunasan.PINALTI +
          pelunasan.DENDA
  ),
  TOTAL_BAYAR: computed(
      () =>
          pelunasan.SISA_POKOK +
          pelunasan.TUNGGAKAN_BUNGA +
          pelunasan.PINALTI +
          pelunasan.DENDA
  ),
  JUMLAH_BAYAR: computed(
      () =>
          pelunasan.BAYAR_POKOK +
          pelunasan.BAYAR_BUNGA +
          pelunasan.BAYAR_PINALTI +
          pelunasan.BAYAR_DENDA
  ),
  JUMLAH_DISKON: computed(
      () =>
          pelunasan.DISKON_POKOK +
          pelunasan.DISKON_BUNGA +
          pelunasan.DISKON_PINALTI +
          pelunasan.DISKON_DENDA
  ),
  PEMBULATAN: 0,
  KEMBALIAN: computed(() =>
      pelunasan.UANG_PELANGGAN - pelunasan.JUMLAH_TAGIHAN - pelunasan.PEMBULATAN <
      0
          ? 0
          : pelunasan.UANG_PELANGGAN -
          pelunasan.JUMLAH_TAGIHAN -
          pelunasan.PEMBULATAN
  ),
});
const pushJumlahUang = async () => {
  let sisaBayarPokok = pelunasan.UANG_PELANGGAN - pelunasan.SISA_POKOK;
  if (sisaBayarPokok >= 0) {
    pelunasan.BAYAR_POKOK = pelunasan.SISA_POKOK;
    pelunasan.DISKON_POKOK = 0;
    let sisaBayarBunga = sisaBayarPokok - pelunasan.TUNGGAKAN_BUNGA;
    if (sisaBayarBunga > 0) {
      pelunasan.BAYAR_BUNGA = pelunasan.TUNGGAKAN_BUNGA;
      pelunasan.DISKON_BUNGA = 0;
      let sisaBayarPinalti = sisaBayarBunga - pelunasan.PINALTI;
      if (sisaBayarPinalti > 0) {
        pelunasan.BAYAR_PINALTI = pelunasan.PINALTI;
        pelunasan.DISKON_PINALTI = 0;
        let sisaBayarDenda = sisaBayarPinalti - pelunasan.DENDA;
        if (sisaBayarDenda > 0) {
          pelunasan.BAYAR_DENDA = pelunasan.DENDA;
          pelunasan.DISKON_DENDA = 0;
        } else {
          pelunasan.BAYAR_DENDA = sisaBayarDenda + pelunasan.DENDA;
          pelunasan.DISKON_DENDA = pelunasan.DENDA - pelunasan.BAYAR_DENDA;
        }
      } else {
        pelunasan.BAYAR_PINALTI = sisaBayarPinalti + pelunasan.PINALTI;
        pelunasan.DISKON_PINALTI = pelunasan.PINALTI - pelunasan.BAYAR_PINALTI;
        pelunasan.DISKON_DENDA = pelunasan.DENDA;
      }
    } else {
      pelunasan.BAYAR_BUNGA = pelunasan.TUNGGAKAN_BUNGA + sisaBayarBunga;
      pelunasan.DISKON_POKOK = 0;
      pelunasan.DISKON_BUNGA = Math.abs(sisaBayarBunga);
      pelunasan.DISKON_DENDA = pelunasan.DENDA;
      pelunasan.DISKON_PINALTI = pelunasan.PINALTI;
    }
  } else {
    pelunasan.BAYAR_POKOK = sisaBayarPokok + pelunasan.SISA_POKOK;
    pelunasan.DISKON_POKOK = pelunasan.SISA_POKOK - pelunasan.UANG_PELANGGAN;
    pelunasan.DISKON_BUNGA = pelunasan.TUNGGAKAN_BUNGA;
    pelunasan.DISKON_DENDA = pelunasan.DENDA;
    pelunasan.DISKON_PINALTI = pelunasan.PINALTI;
  }
};
</script>
