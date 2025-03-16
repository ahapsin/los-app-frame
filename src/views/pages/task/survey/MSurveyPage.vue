<template>
  <div class="relative">
    <div class="sticky top-0 z-50 flex items-center gap-2 justify-between p-2  bg-white ">
      <n-button quaternary circle @click="router.back()">
        <n-icon>
          <back-icon/>
        </n-icon>
      </n-button>
      <div class="text-lg font-semibold">Data Survey</div>
      <div>
        <n-button quaternary circle @click="router.push('new-survey')">
          <n-icon size="20">
            <add-icon/>
          </n-icon>
        </n-button>
      </div>
    </div>
    <div class="p-2  bg-white">
      <n-input placeholder="cari" size="large" v-model:value="searchBox" clearable/>
    </div>
    <div class="p-2 flex flex-col gap-2">

      <n-card v-if="loadData">
        <n-skeleton text :repeat="2" /> <n-skeleton text style="width: 60%" />
      </n-card>
      <div @click="" class="p-4 flex flex-col gap-4 bg-white rounded-lg border" v-else v-for="data in showData" :key="data.id" :title="data.nama_debitur">
        <div class="flex justify-between">
          <div class="font-bold flex flex-col">
            <span>{{data.nama_debitur}}</span>
          <small>{{data.visit_date}}</small>
          </div>
          <div class="font-bold" :style="`color:${appAccentColor}`">{{data.plafond.toLocaleString()}}</div>
        </div>
        <div class="flex justify-between">
          <div class="font-sm">{{data.alamat}}</div>
          <div class="font-bold"><n-tag type="warning" size="small" round>{{data.status}}</n-tag></div>
        </div>
        {{data.alamat}}
      </div>
    </div>
  </div>
</template>
<script setup>
import {ref, onMounted, h, computed} from "vue";
import {useApi} from "../../../../helpers/axios.js";
import {useSearch} from "../../../../helpers/searchObject.js";
import router from "../../../../router/index.js";
import {
  useDialog,
  useMessage,
  NDropdown,
  NIcon,
  NTag,
  NButton,
} from "naive-ui";
import {
  ArrowBackIosNewRound as BackIcon,
  MoreVertFilled as MoreIcon,
  AddFilled as AddIcon,
  SearchOutlined as SearchIcon,
  FileDownloadOutlined as DownloadIcon,
} from "@vicons/material";
import {
  EditOutlined as EditIcon,
  DeleteOutlined as DeleteIcon,
  ListAltOutlined as DetailIcon,
} from "@vicons/material";
import {useLoadingBar} from "naive-ui";
import {useWindowSize} from "@vueuse/core";

const loadingBar = useLoadingBar();
const message = useMessage();
const dialog = useDialog();
const loadData = ref(false);
const dataTable = ref([]);
const tableRef = ref();
const downloadCsv = () =>
    tableRef.value?.downloadCsv({fileName: "export-data-survey"});


const {width} = useWindowSize();
const columns = [
  {
    title: "Tanggal",
    sorter: "default",
    key: "visit_date",
  },
  {
    title: "Nama",
    sorter: "default",
    key: "nama_debitur",
    fixed: "left",
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: "Plafond",
    sorter: "default",
    align: 'right',
    key: "plafond",
    render(row) {
      return h("div", format(row.plafond));
    },
  },
  {
    title: "Tipe",
    sorter: "default",
    align: 'right',
    key: "jenis_angsuran",
    render(row) {
      return h("div", row.jenis_angsuran);
    },
  },
  {
    title: "Status",
    sorter: "default",
    key: "status",
    render(row) {
      return h(
          NTag,
          {
            round: true,
            type: statusTag(row.status_code),
            size: "small",
          },
          {default: () => statusLabel(row.status)}
      );
    },
  },
  {
    title: "",
    align: "right",
    key: "more",
    fixed: "left",
    render(row, index) {
      return h(
          NDropdown,
          {
            options: options(row),
            size: "small",
            onSelect: (e) => {
              if (e === "hapus") {
                handleConfirm(row, index);
              }
              if (e === "detail") {
                handleDetail(row);
              }
              if (e === "edit") {
                handleEdit(row);
              }
            },
          },
          {
            default: () => h(
                NButton,
                {
                  round: true,
                  type: statusTag(row.status_code),
                  size: "small",
                },
                {default: () => "Action"}
            ),
          }
      );
    },
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
const handleAdd = () => {
  router.push("/task/new-survey");
};
const getData = async () => {
  loadData.value = true;
  let userToken = localStorage.getItem("token");
  const response = await useApi({
    method: "GET",
    api: "kunjungan",
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
  return useSearch(dataTable.value, searchBox.value);
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
onMounted(() => getData());
</script>
