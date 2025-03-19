<template>
  <div class="relative">
    <div class="sticky top-0 z-50 px-4  items-center gap-2 justify-between  bg-white ">
      <div class="flex items-center justify-between p-2 border-b">
        <div class="text-lg font-semibold">Data Order</div>
      </div>
    </div>
    <div class="p-2 px-4 bg-white">
      <n-input placeholder="cari" size="large" v-model:value="searchBox" clearable/>
    </div>
    <div class="p-2 flex flex-col gap-2">
      <n-card v-if="loadData">
        <n-skeleton text :repeat="2"/>
        <n-skeleton text style="width: 60%"/>
      </n-card>
      <div v-if="!loadData && showData.length == 0">
        <div>
          <n-alert>
            <template #icon>
              <n-icon>
                <nodata-icon/>
              </n-icon>
            </template>
            Data tidak ada
          </n-alert>
        </div>
      </div>
      <div class="overflow-clip flex flex-col gap-4 bg-white rounded-lg border" v-else v-for="data in showData"
           :key="data.id" :title="data.nama_debitur">
        <div class="flex justify-between px-4 pt-4">
          <div class="font-bold flex flex-col">
            <span :style="`color:${app_base_color}`">#{{ data.order_number }}</span>
            <span>{{ data.nama_debitur }}</span>
            <small>{{ data.visit_date }}</small>
          </div>
          <div class="font-bold" :style="`color:${appAccentColor}`">{{ data.plafond.toLocaleString() }}</div>
        </div>
        <div class="flex justify-between px-4">
          <div class="font-sm">{{ data.alamat }}</div>
          <div class="font-bold">
            <n-tag :type="statusTag(data.status_code)" size="small"
                   round>{{ data.status }}
            </n-tag>
          </div>
        </div>
        <div class="bg-sf flex gap-2 p-2">
<!--          if (status === "CROR") {-->
<!--          return "Update Order";-->
<!--          }-->
<!--          if (status === "REORADM") {-->
<!--          return "Update Order";-->
<!--          }-->
          <n-button size="small" type="primary" @click="handleDetail(data)">detail</n-button>
          <n-button size="small" type="info" v-if="data.status_code === 'CROR'" @click="handleEdit(data)">Ubah</n-button>
          <n-button size="small" @click="uploadBerkas(data)">Upload</n-button>
          <n-button size="small" type="error" @click="handleConfirm(data)"
                    v-if="data.status_code === 'DRSVY'">Hapus
          </n-button>
        </div>
      </div>

    </div>
  </div>
  <n-modal class="w-11/12" title="Upload Berkas Pencairan" v-model:show="showModal" :mask-closable="false">
    <n-card :bordered="false" aria-modal="true">
      <n-grid :cols="1">
        <n-gi>
          <div class="flex">
            <label class="w-24">No Order</label><span>
                            <n-text strong> {{ selectedData.order_number }}</n-text></span>
          </div>
          <div class="flex">
            <label class="w-24">Nama </label><span>
                            <n-text strong> {{ selectedData.nama_debitur }}</n-text></span>
          </div>
          <div class="flex">
            <label class="w-24">Plafond</label><span>
                            <n-text strong>
                                {{ selectedData.plafond.toLocaleString("US") }}</n-text></span>
          </div>
        </n-gi>
        <n-gi>
          <div class="flex">
            <label class="w-24">Alamat</label><span>
                            <n-text strong> {{ selectedData.alamat }}</n-text></span>
          </div>
          <div class="flex">
            <label class="w-24">No Hp</label><span>
                            <n-text strong> {{ selectedData.hp }}</n-text></span>
          </div>
        </n-gi>
      </n-grid>
      <n-divider/>
      <div class="flex flex-col gap-2">
        <file-upload  class="w-full" title="Surat Pernyataan" endpoint="image_upload_prospect" :type="`sp`"
                     :idapp="selectedData.id" :def_value="findDocByType(selectedData.attachment, 'sp')"/>
        <file-upload title="PK" endpoint="image_upload_prospect" :type="`pk`" :idapp="selectedData.id"
                     :def_value="findDocByType(selectedData.attachment, 'pk')"/>
        <file-upload title="Dokumentasi" endpoint="image_upload_prospect" :type="`dok`" :idapp="selectedData.id"
                     :def_value="findDocByType(selectedData.attachment, 'dok')"/>
      </div>

      <div class="pt-4 flex justify-end">
        <n-button @click="handleSelesai" secondary type="primary" round>Selesai</n-button>
      </div>
    </n-card>
  </n-modal>
</template>
<script setup>
import {ref, onMounted, h, computed, reactive} from "vue";
import {useApi} from "../../../../helpers/axios.js";
import {useSearch} from "../../../../helpers/searchObject.js";
import router from "../../../../router/index.js";
import {
  useDialog,
  useMessage,
  NIcon,
  NTag,
  NButton,
} from "naive-ui";
import {
  DirectionsRunOutlined as NodataIcon,
} from "@vicons/material";
import {
  EditOutlined as EditIcon,
  DeleteOutlined as DeleteIcon,
  ListAltOutlined as DetailIcon,
} from "@vicons/material";
import {useLoadingBar} from "naive-ui";
import _ from "lodash";

const applogo = import.meta.env.VITE_APP_LOGO;
const app_base_color = import.meta.env.VITE_APP_BASE_COLOR;
const loadingBar = useLoadingBar();
const message = useMessage();
const dialog = useDialog();
const loadData = ref(false);
const dataTable = ref([]);
const showModal = ref(false);

const selectedData = ref();
const uploadBerkas = (e) => {
  showModal.value = true;
  selectedData.value = e;
}
const handleSelesai = () => {
  getData();
  showModal.value = false;
};
const findDocByType = (c, e) => {
  const docPath = ref(_.find(c, {TYPE: e}));
  if (docPath.value) return docPath.value.PATH;
};
const searchBox = ref();
const statusTag = (e) => {
  if (e === "DRSVY") {
    return "warning";
  }
  if (e === "CROR") {
    return "primary";
  }
  if (e === "APKPS") {
    return "success";
  }
  if (e === "WAKPS") {
    return "info";
  }
  if (e === "WADM") {
    return "warning";
  }
  if (e === "APHO") {
    return "success";
  }
  if (e === "REORKPS") {
    return "error";
  }
};

const dynamicSearch = reactive({
  no_order: null,
  atas_nama: null,
  tanggal: null
});

const handleConfirm = (row, index) => {
  dialog.warning({
    title: "Confirm",
    content: "Apakah anda yakin ingin menghapus data ?",
    positiveText: "Ya",
    negativeText: "Batal",
    onPositiveClick: async () => {
      let userToken = localStorage.getItem("token");
      const response = await useApi({
        method: "DELETE",
        api: `kunjungan/${row.id}`,
        token: userToken,
      });
      if (!response.ok) {
        message.error("api transaction error");
      } else {
        dataTable.value.splice(index, 1);
        message.success("Data berhasil dihapus");
        getData();
      }
    },
    onNegativeClick: () => {
      message.error("Batal hapus data !");
    },
  });
};
const handleDetail = (evt) => {
  if (evt.status_code === "WADM") {
    router.push({name: "detail survey", params: {idsurvey: evt.id}});
  } else if (evt.status_code === "CROR") {
    router.push({name: "Detail Kredit", params: {idapplication: evt.id}});
  } else {
    router.push({name: "detail survey", params: {idsurvey: evt.id}});
  }
};

const handleEdit = (evt) => {
  router.push({name: "edit survey", params: {idsurvey: evt.id}});
};

const getData = async () => {
  loadData.value = true;
  let userToken = localStorage.getItem("token");
  const response = await useApi({
    method: "GET",
    api: `kunjungan_admin?no_order=${dynamicSearch.no_order == null ? '' : dynamicSearch.no_order}&nama=${dynamicSearch.atas_nama == null ? '' : dynamicSearch.atas_nama}&tgl_order=${dynamicSearch.tanggal == null ? '' : dynamicSearch.tanggal}`,
    token: userToken,
  });
  if (!response.ok) {
    console.log(response.error);
  } else {
    loadingBar.finish();
    loadData.value = false;
    dataTable.value = response.data.response;
  }
};

const showData = computed(() => {
  return useSearch(dataTable.value, searchBox.value?.toLowerCase());
});

onMounted(() => getData());
</script>