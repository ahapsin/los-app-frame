<template>
  <div class="flex p-1 border bg-slate-50 shadow rounded-lg">
    <div class="flex flex-col p-2 w-1/4 justify-between">
      <div class="flex flex-col sticky top-4">
        <div class="flex gap-2">
          <n-avatar>{{ queryData.nama_cust?.at(0) }}</n-avatar>
          <div class="flex flex-col">
            <small>{{ queryData.id }}</small>
            <strong>{{ queryData.nama_cust }}</strong>
          </div>
        </div>
        <div class="py-4 flex flex-col gap-y-2">
          <n-button @click="addParam(param)" type="primary" quaternary :key="param.id" v-for="param in paramScoring"
                    class="w-full justify-start p-2  flex  cursor-pointer hover:bg-slate-200 rounded" :disabled="false">
            <n-icon size="large">
              <add-icon/>
            </n-icon>
            <div>{{ param.param }}
            </div>
          </n-button>
        </div>
      </div>

      <div class="p-4">
        <n-progress
            type="line"
            :show-indicator="false"
            status="info"
            :percentage="100/paramScoring.length*(bucketParam.length ? bucketParam.length : 0)"
        />
        <div class="py-2">{{ bucketParam.length ? bucketParam.length : 0 }} parameter dari {{ paramScoring.length }}
        </div>
        <n-button type="info" tertiary class="shadow" @click="prevModal = true">Preview</n-button>
      </div>
    </div>
    <div class="w-full bg-white min-h-[500px] max-h-[500px] rounded-lg p-4 overflow-auto">
      <div class="grid  grid-cols-2 gap-4  p-4">
        <n-form-item label="Permohonan nasabah">
          <n-select :options="optObject(optParamScoring.permohonan_nasabah_opt)" placeholder="Silahkan pilih"/>
        </n-form-item>
        <n-form-item label="Status nasabah">
          <n-select :options="optObject(optParamScoring.status_nasabah_opt)" placeholder="Silahkan pilih"/>
        </n-form-item>
      </div>
      <div v-for="(listBucket,i) in bucketParam" :key="listBucket.key">
        <n-card :title="listBucket.param" size="small" :segmented="true">
          <template #header-extra>
            <n-button quaternary circle @click="removeParam(i)">
              <n-icon>
                <remove-icon/>
              </n-icon>
            </n-button>
          </template>
          <div v-for="itemParam in listBucket.paramlist" :key="itemParam.key">
            <n-form-item class="w-full" v-if="itemParam.mode.type == 'area'" :label="itemParam.title">
              <n-input type="textarea" placeholder="Isi disini"
                       v-model:value="itemParam.val"/>
            </n-form-item>
            <n-card embedded v-else-if="itemParam.mode.type == 'table'" :title="itemParam.title" class="mb-4">
              <template #header-extra>
                <div class="flex item-center gap-2">
                  <n-upload
                      action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
                      :default-file-list="defaultFileList" @change="fileUpload"
                      :show-file-list="false"
                  >
                    <n-button type="info">Upload File</n-button>
                  </n-upload>

                  <n-button type="primary" @click="downloadCsv">download header</n-button>
                </div>
              </template>
              <n-data-table ref="tableRef" :data="dataParse?.data" :columns="convertObjectToArray(dataParse?.data)"/>
            </n-card>
            <n-form-item class="w-full" v-else :label="itemParam.title">
              <n-select
                  v-model:value="itemParam.val" placeholder="Silakan pilih"
                  :options="optObject(itemParam.mode.options)"/>
            </n-form-item>
          </div>
        </n-card>

      </div>

    </div>
  </div>
  <n-modal v-model:show="prevModal">
    <n-card class="w-4/6">
      <n-watermark
          ref="printAreaRef"
          cross
          selectable
          :font-size="16"
          :line-height="16"
          :width="192"
          :height="128"
          :x-offset="12"
          :y-offset="28"
          :rotate="-10"
          class="p-4">
        <div class="flex flex-col gap-y-4">
          <div class="flex justify-between">
            <div class="flex items-center gap-2">
              <img :src="applogo" class="w-[32px] h-[34px]"/>
              <div class="text-xl font-bold">{{ apptitle }}</div>
            </div>
            <div class="w-fit flex-col border items-center flex px-4 border-black">
              <div class="font-bold">FORM ANALISA KREDIT</div>
              <div class="text-sm flex justify-end font-mono"><small>NO. {{ queryData.id }}</small></div>
            </div>
          </div>
          <div>
            <div class="border border-black p-2">
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <div class="font-bold">
                    Sdr. {{ queryData.nama_cust }}
                  </div>
                  <div>
                    {{ queryData.alamat }}
                  </div>
                </div>
                <div>
                  <table>
                    <tr>
                      <td>Produk</td>
                      <td>:</td>
                      <td><b>KAMU (Kredit Agunan Multiguna)</b></td>
                    </tr>
                    <tr>
                      <td>Tujuan penggunaan</td>
                      <td>:</td>
                      <td><i>Penambahan modal usaha</i></td>
                    </tr>
                    <tr>
                      <td>Plafon</td>
                      <td>:</td>
                      <td><i>{{ queryData.plafon.toLocaleString('US') }}</i></td>
                    </tr>
                    <tr>
                      <td>Jangka Waktu</td>
                      <td>:</td>
                      <td><i>32 bulan</i></td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div class="" v-for="(param,k) in _.sortBy(bucketParam, [function(o) { return o.key; }])" :key="param.key">
            <div class="text-md font-bold">{{ k + 1 }}. {{ param.param.toUpperCase() }}</div>
            <div class="grid grid-flow-dense grid-cols-2 gap-2 border border-black p-2">
              <div v-for="(list,i,n) in param.paramlist" :key="list.id">
                <div class="px-1">{{ n + 1 }}. {{ list.title }}</div>
                <div class="border p-1.5 bg-slate-50"><i>{{ list.val }}</i></div>
              </div>
            </div>
          </div>
        </div>
      </n-watermark>
      <template #footer>
        <n-space>
          <n-button type="info" @click="handlePrintAnalisa">Cetak</n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>
<script setup>
import _ from "lodash";
import {h} from "vue";
import {NInput, NButton, NDatePicker} from "naive-ui";

const apptitle = import.meta.env.VITE_APP_TITLE;
const applogo = import.meta.env.VITE_APP_LOGO;
import {useAnalisaModalKerja} from "../../../../models/parameter_analisa.js";
import {CloseRound as RemoveIcon, AddCircleRound as AddIcon} from "@vicons/material";
import {useOptAnalisaModalKerja} from "../../../../models/opt_analisa_modal_kerja.js";
import {useVueToPrint} from "vue-to-print";
import router from "../../../../router/index.js";
import {useLoadingBar} from "naive-ui";
import Papa from "papaparse";

const loadingPage = useLoadingBar();

loadingPage.finish();
const prevModal = ref(false);
const paramScoring = reactive(useAnalisaModalKerja);
const optParamScoring = reactive(useOptAnalisaModalKerja);
const currentRef = ref(1);
const modalSt = ref(false);
const stStep1 = () => {
  modalSt.value = true;
}

const bucketParam = ref([]);

const queryData = {
  id: "CFA-0001",
  tgl: "22-08-1994",
  nama_cust: "Hinata",
  no_hp: "088878987978",
  plafon: 12000000000,
  alamat: "lemahwungkuk rt 12 rw 2 kab.burau"
};

const findMatchParameter = (col, val) => {
  let a = _.findIndex(col, function (o) {
    return o.range_min <= val && o.range_max >= val;
  });
  return a > 0 ? col[a] : col[0];
}
const findParam = (a, m) => computed(() => {
  return _.includes(a, m);
})
const addParam = (e) => {
  console.log(e);
  bucketParam.value.unshift(e);
}
const removeParam = (e) => {
  bucketParam.value.splice(e, 1);
}
const currentStatus = ref("process");
const tableRef = ref(null);
const downloadCsv = (e) =>
    tableRef.value?.downloadCsv({fileName: e});
const uploadedFile = ref();
const dataParse = ref();
const fileUpload = (e) => {
  uploadedFile.value = e.file.file;
  Papa.parse(uploadedFile.value, {
    complete: function (results) {
      dataParse.value = results;
    }
  });
}


const modelArray = (e) => Object.keys(e).map(key => key);
const tableAnalisaModel = [
  {
    bulan: null,
    mutasi_debet: null,
    mutasi_kredit: null,
    saldo_akhir: null,
  }
];
const refTable = reactive({
  rek_tabungan: [{
    bulan: null,
    mutasi_debet: null,
    mutasi_kredit: null,
    saldo_akhir: null,
  }],
});
const createColumns = () => [
  {
    render(row, index) {
      return h(NButton, {
        type: !index % 2 ? "primary" : "info",
        secondary: true,
        onClick: () => {
          if (!index % 2) {
            refTable.rek_tabungan.push(tableAnalisaModel);
          } else {
            refTable.rek_tabungan.splice(1);
          }
        }
      }, {
        default: () => !index % 2 ? "+" : "-",
      });
    }
  },
  {
    title: "Bulan",
    key: "bulan",
    render(row, index) {
      return h(NDatePicker, {
        type: "month",
        format: "MMyyyy",
        value: row.bulan,
        onUpdateValue(v) {
          refTable.rek_tabungan[index].bulan = v;
        }
      });
    }
  },
  {
    title: "Mutasi Debet",
    key: "mutasi_debet",
    render(row, index) {
      return h(NInput, {
        value: row.address,
        onUpdateValue(v) {
          refTable.rek_tabungan[index].mutasi_debet = v;
        }
      });
    }
  }, {
    title: "Mutasi Kredit",
    key: "mutasi_kredit",
    render(row, index) {
      return h(NInput, {
        value: row.address,
        onUpdateValue(v) {
          refTable.rek_tabungan[index].mutasi_kredit = v;
        }
      });
    }
  }, {
    title: "Saldo Akhir",
    key: "saldo_akhir",
    render(row, index) {
      return h(NInput, {
        value: row.address,
        onUpdateValue(v) {
          refTable.rek_tabungan[index].saldo_akhir = v;
        }
      });
    }
  }
];
const optObject = (e) => {
  return e.map((v) => ({
    label: v,
    value: v,
  }));
}
const columns = createColumns();
const printAreaRef = ref(null);
const {handlePrint} = useVueToPrint({
  content: printAreaRef,
  documentTitle: "form analisa",
});
const handlePrintAnalisa = () => {
  handlePrint();
  router.go(-1)
}

const convertObjectToArray = (obj) => {
  if (!Array.isArray(obj) || obj.length === 0) {
    return [];
  }
  const keys = Object.keys(obj[0]);
  return keys.map(key => ({title: key, key: key}));
}

onMounted(() => {
  optParamScoring;
});
</script>
