<template>
  <div class="pt-4">
    <n-space vertical>
      <n-card :title="`Tabel ${$route.name}`">

        <n-space vertical :size="12" class="pt-4">
          <div class="flex flex-col md:flex-row gap-2 pt-4 pr-4 ps-4">
            <n-form-item label="NO KONTRAK" class="w-full">
              <n-input v-model:value="dynamicSearch.no_kontrak" type="text" placeholder="NO KONTRAK"
                       clearable/>
            </n-form-item>
            <n-form-item label="ATAS NAMA" class="w-full">
              <n-input v-model:value="dynamicSearch.atas_nama" type="text" placeholder="ATAS NAMA"
                       clearable/>
            </n-form-item>
            <n-form-item label="NO POLISI" class="w-full">
              <n-input v-model:value="dynamicSearch.no_polisi" type="text" placeholder="NO POLISI"
                       clearable/>
            </n-form-item>
            <n-form-item label="NO BPKB" class="w-full">
              <n-input v-model:value="dynamicSearch.no_bpkb" type="text" placeholder="NO BPKB"
                       clearable/>
            </n-form-item>
            <n-form-item class="w-full">
              <n-button type="primary" @click="handleSearch" class="px-4"> Cari</n-button>
            </n-form-item>
          </div>
          <n-data-table size="small" :columns="columns" :data="dataTable"
                        :pagination="pagination"/>
        </n-space>
      </n-card>
    </n-space>
  </div>
  <n-modal v-model:show="modalDetail">
    <n-card class="w-11/12  overflow-x-auto " title="Jaminan">
      <div class="grid grid-cols-4 w-full gap-2">
        <n-form-item label="TIPE" path="nama" class="w-full">
          <n-input placeholder="TIPE" v-model:value="bodyModal.tipe" disabled/>
        </n-form-item>
        <n-form-item label="MERK" path="nama" class="w-full">
          <n-input placeholder="MERK" v-model:value="bodyModal.merk" disabled/>
        </n-form-item>
        <n-form-item label="TAHUN" path="nama" class="w-full">
          <n-input placeholder="TAHUN" v-model:value="bodyModal.tahun" disabled/>
        </n-form-item>
        <n-form-item label="WARNA" path="nama" class="w-full">
          <n-input placeholder="WARNA" v-model:value="bodyModal.warna" disabled/>
        </n-form-item>
        <n-form-item label="ATAS NAMA" path="nama" class="w-full">
          <n-input placeholder="ATAS NAMA" v-model:value="bodyModal.atas_nama"/>
        </n-form-item>
        <n-form-item label="NO POLISI" path="nama" class="w-full">
          <n-input placeholder="NO POLISI" v-model:value="bodyModal.no_polisi"/>
        </n-form-item>
        <n-form-item label="NO RANGKA" path="nama" class="w-full">
          <n-input placeholder="NO RANGKA" v-model:value="bodyModal.no_rangka"/>
        </n-form-item>
        <n-form-item label="NO MESIN" path="nama" class="w-full">
          <n-input placeholder="NO MESIN" v-model:value="bodyModal.no_mesin"/>
        </n-form-item>
        <n-form-item label="NO BPKB" path="nama" class="w-full">
          <n-input placeholder="NO BPKB" v-model:value="bodyModal.no_bpkb"/>
        </n-form-item>
        <n-form-item label="NO STNK" path="nama" class="w-full">
          <n-input placeholder="NO STNK" v-model:value="bodyModal.no_stnk"/>
        </n-form-item>
        <n-form-item label="NO FAKTUR" path="nama" class="w-full">
          <n-input placeholder="No Faktur" v-model:value="bodyModal.no_faktur"/>
        </n-form-item>
        <n-form-item label="TANGGAL STNK" class="w-full">
          <n-date-picker v-model:formatted-value="bodyModal.tgl_stnk" :default-value="Date.now()" clearable
                         format="yyyy-MM-dd"
                         placeholder="TANGGAL STNK" class="w-full"/>
        </n-form-item>
        <n-form-item label="NILAI TAKSASI" path="nama" class="w-full">
          <n-input placeholder="NILAI TAKSASI" v-model:value="bodyModal.nilai" disabled/>
        </n-form-item>
      </div>
      <n-form-item path="nama" class="w-full">
        <n-button type="primary" @click="handleUbah">Ubah</n-button>
      </n-form-item>
    </n-card>
  </n-modal>
</template>
<script setup>
import {ref, onMounted, h} from "vue";
import {useApi} from "../../../../helpers/axios";
import {useDialog, useMessage, NDropdown, NIcon, NButton} from "naive-ui";
import {
  AddCircleOutlineRound as AddIcon,
  SearchOutlined as SearchIcon,
  FileDownloadOutlined as DownloadIcon,

} from "@vicons/material"
import {
  EditOutlined as EditIcon,
  DeleteOutlined as DeleteIcon,
  ListAltOutlined as DetailIcon
} from "@vicons/material";

const dynamicSearch = reactive({
  no_polisi: "",
  atas_nama: "",
  no_bpkb: "",
  no_kontrak:"",
});

const message = useMessage();
const dialog = useDialog();
const dataTable = ref();

const columns = [
  {
    title: "NO KONTRAK",
    key: "loan_number"
  },{
    title: "ATAS NAMA",
    key: "atas_nama"
  },
  {
    title: "NO POLISI",
    key: "no_polisi"
  },
  {
    title: "NO RANGKA",
    key: "no_rangka"
  },
  {
    title: "NO MESIN",
    key: "no_mesin"
  },
  {
    title: "NO BPKB",
    key: "no_bpkb"
  },
  {
    title: "NO STNK",
    key: "no_stnk"
  },
  {
    title: "TGL STNK",
    key: "tgl_stnk"
  },
  {
    title: "",
    align: "right",
    key: "more",
    render(row) {
      return h(
          NDropdown,
          {
            options: options,
            size: "small",
            onSelect: (e) => {

              if (e === "edit") {
                handleUpdate(row);
              }
            },
          },
          {
            default: h(NButton, {
              size: "small",
            }, {default: () => 'Action'})
          }
      );
    }
  }];

const modalDetail = ref(false)
const statusTag = (e) => {
  if (e === "Active") {
    return "success";
  } else if (e === "Non-Active") {
    return "warning";
  }

}
const bodyModal = ref();
const handleUpdate = (row) => {
  modalDetail.value = true;
  bodyModal.value = row;
}
const getData = async () => {
  let userToken = localStorage.getItem("token");
  const response = await useApi({
    method: 'GET',
    api: `collateral?atas_nama=${dynamicSearch.atas_nama}&no_polisi=${dynamicSearch.no_polisi}&no_bpkb=${dynamicSearch.no_bpkb}&no_kontrak=${dynamicSearch.no_kontrak}`,
    token: userToken
  });
  if (!response.ok) {
    console.log(reponse.error);
  } else {
    dataTable.value = response.data;
  }
}

const handleUbah = () => {
  dialog.warning({
    title: "Confirm",
    content: "Apakah anda yakin ingin mengubah data ?",
    positiveText: "Ya",
    negativeText: "Batal",
    onPositiveClick: async () => {
      let userToken = localStorage.getItem("token");
      const response = await useApi({
        method: 'PUT',
        api: `collateral/${bodyModal.value.id}`,
        data: bodyModal.value,
        token: userToken
      });
      if (!response.ok) {
        message.error("api transaction error");
      } else {
        getData();
        modalDetail.value = false;
        message.success("Data berhasil diubah");
      }

    },
    onNegativeClick: () => {
      message.error("Batal ubah data !");
    }
  });
}


const renderIcon = (icon) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    });
  };
};
const options = [
  {
    label: "Update",
    key: "edit",
    icon: renderIcon(DetailIcon)
  }
];
const pagination = {
  pageSize: 10
}
const handleSearch = () => {
  getData();
}
onMounted(() => getData());
</script>
