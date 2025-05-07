<template>
  <div>
    <n-space vertical>
      <n-card title="Data Prospek" :segmented="{
        content: true,
        footer: 'soft',
      }" size="small">
        <template #header-extra>
          <n-space class="!gap-1">
            <div class="me-1">
              <n-popover trigger="click" placement="bottom-end">
                <template #trigger>
                  <n-button :circle="width <= 520 ? true : false">
                    <n-icon>
                      <search-icon />
                    </n-icon>
                    <span v-if="width >= 520">Cari</span>
                  </n-button>
                </template>
                <n-space vertical>
                  <n-input autofocus="true" clearable placeholder="cari disini.." v-model:value="searchBox" />
                  <n-date-picker :default-value="[Date.now(), Date.now()]" :update-value-on-close="updateValueOnClose"
                    type="daterange" @update:value="onConfirmDate" v-if="width > 480" />
                </n-space>
              </n-popover>
            </div>
            <div>
              <n-button type="primary" secondary @click="downloadCsv" :circle="width <= 520 ? true : false">
                <template #icon>
                  <n-icon>
                    <download-icon />
                  </n-icon>
                </template>
                <span v-if="width >= 520">Download</span>
              </n-button>
            </div>
            <div>
              <n-button type="primary" strong @click="handleAdd" :circle="width <= 520 ? true : false">
                <template #icon>
                  <v-icon name="bi-plus-lg" />
                </template>
                <span v-if="width >= 520">Tambah</span>
              </n-button>
            </div>
          </n-space>
        </template>
        <n-space vertical :size="12" class="pt-4">
          <n-data-table striped ref="tableRef" :scroll-x="750" size="small" :columns="columns"
            :data="visitStore.listData" :pagination="pagination" :loading="visitStore.loading" />
        </n-space>
      </n-card>
    </n-space>
    <n-modal :mask-closable="false" v-model:show="modalView" class="w-11/12">
      <AddVisit />
    </n-modal>
  </div>
</template>
<script setup>
import { computed, defineAsyncComponent, h, onMounted, ref } from "vue";
import { useApi } from "../../../../helpers/axios.js";
import { useSearch } from "../../../../helpers/searchObject";
import router from "../../../../router";

import {
  DeleteOutlined as DeleteIcon,
  ListAltOutlined as DetailIcon,
  FileDownloadOutlined as DownloadIcon,
  EditOutlined as EditIcon,
  SearchOutlined as SearchIcon
} from "@vicons/material";
import { useWindowSize } from "@vueuse/core";
import {
  NButton,
  NIcon,
  useDialog,
  useMessage
} from "naive-ui";
import { useVisitStore } from "../../../../stores/visit.js";

const AddVisit = defineAsyncComponent(() => import("../../task/visit/AddVisit.vue"));
const message = useMessage();
const dialog = useDialog();
const loadData = ref(false);
const dataTable = ref([]);
const tableRef = ref();
const downloadCsv = () =>
  tableRef.value?.downloadCsv({ fileName: "export-data-survey" });


const { width } = useWindowSize();
const columns = [
  {
    title: "Tanggal",
    sorter: "default",
    key: "tgl_kunjungan",
    width: 100,
  },
  {
    title: "Nama Nasabah",
    sorter: "default",
    key: "nama_nasabah",
    fixed: "left",
    ellipsis: {
      tooltip: true,
    },
    width: 200,
  },
];
const searchBox = ref();
const statusTag = (e) => {
  if (e === "DRSVY") {
    return "warning";
  }
  if (e === "CROR") {
    return "primary";
  }
  if (e === "APKPS") {
    return "primary";
  }
  if (e === "WAKPS") {
    return "info";
  }
  if (e === "WADM") {
    return "info";
  }
  if (e === "APHO") {
    return "primary";
  }
  if (e === "REORKPS") {
    return "error";
  }
};
const statusLabel = (e) => {
  let upLabel = e;
  return upLabel.toUpperCase();
};
const format = (e) => {
  const toNum = parseInt(e);
  return toNum.toLocaleString("en-US");
};
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
      }
    },
    onNegativeClick: () => {
      message.error("Batal hapus data !");
    },
  });
};
const handleDetail = (evt) => {
  if (evt.status_code === "WADM") {
    router.push({ name: "detail survey", params: { idsurvey: evt.id } });
  } else if (evt.status_code === "CROR") {
    router.push({ name: "Detail Kredit", params: { idapplication: evt.id } });
  } else {
    router.push({ name: "detail survey", params: { idsurvey: evt.id } });
  }
};
const handleEdit = (evt) => {
  router.push({ name: "edit survey", params: { idsurvey: evt.id } });
};
const modalView = ref(false);
const handleAdd = () => {
  // modalView.value = true;
  router.push({ name: 'addvisit' });
};


const showData = computed(() => {
  return useSearch(dataTable.value, searchBox.value?.toLowerCase());

});
const renderIcon = (icon) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    });
  };
};
const options = (e) => {
  let status = e.status_code;
  if (status === "DRSVY") {
    return [
      {
        label: "Edit",
        key: "edit",
        icon: renderIcon(EditIcon),
      },
      {
        label: "Hapus",
        key: "hapus",
        icon: renderIcon(DeleteIcon),
      },
    ];
  } else {
    return [
      {
        label: "Detail",
        key: "detail",
        icon: renderIcon(DetailIcon),
      },
    ];
  }
};
const pagination = {
  pageSize: 10,
};
const visitStore = useVisitStore();
onMounted(() => visitStore.getData());
</script>
