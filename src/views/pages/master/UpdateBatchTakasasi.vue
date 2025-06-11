<template>
  <div id="app">
    <n-card title="Update taksasi" size="small" :segmented="true">
      <template #header-extra>
        <n-space v-if="!loadDataRef">
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

      <n-data-table :columns="columns" :data="dataTakasasi" :pagination="{ pageSize: 10 }" ref="tableRef"
        :loading="loadDataRef"></n-data-table>

    </n-card>

  </div>
</template>
<script setup>
import { useMessage } from "naive-ui";
import Papa from 'papaparse'; // Import PapaParse
import { h, onMounted, ref } from "vue";
import { useApi } from "../../../helpers/axios";

const csvData = ref([]);
const csvHeaders = ref([]);
const format = ref([]);
const importChange = ref(false);


const loadDataRef = ref(false);
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
      model: item[2],
      descr: item[3],
      year: item[4],
      price: item[5],
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
  loadDataRef.value = true;
  message.loading("memuat data taksasi....");
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
    loadDataRef.value = false;
    message.success("data taksasi dimuat....");
  }
}

const tableRef = ref();
const time = Date.now();

const downloadCsv = () => tableRef.value?.downloadCsv({

  fileName: `format_taksasi${time}`,
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

th {
  background-color: #f4f4f4;
}
</style>
