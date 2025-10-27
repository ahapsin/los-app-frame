<template>
    <div>
        <n-space vertical>
            <n-card :title="`Tabel Sumber Order`" :segmented="true" size="small" class="shadow-lg">
                <template #header-extra>
                    <n-space>
                        <n-input clearable v-model:value="searchBox" placeholder="cari">
                            <template #suffix>
                                <v-icon name="bi-search"></v-icon>
                            </template>
                        </n-input>
                        <n-button type="success" secondary @click="handleExport(showData)">
                            <template #icon>
                                <v-icon name="bi-download"></v-icon>
                            </template>
                            Export Excel
                        </n-button>
                        <n-button type="primary" secondary link @click="handleAdd()">
                            <template #icon>
                                <v-icon name="bi-plus-lg"></v-icon>
                            </template>
                            Sumber Order
                        </n-button>


                        <n-button quaternary circle @click="refreshData">
                            <template #icon>
                                <v-icon name="bi-arrow-clockwise"></v-icon>
                            </template>
                        </n-button>
                    </n-space>
                </template>
                <n-space vertical :size="12" class="pt-4">
                    <n-data-table size="small" :columns="columns" :data="showData" :pagination="pagination"
                        :loading="isLoading" />
                </n-space>
            </n-card>
        </n-space>
        <n-modal v-model:show="modalRef">
            <n-card class="w-1/2" size="small" title="Tambah Sumber Order Baru" :segmented="true">
                <n-form-item label="Nama Sumber">
                    <n-input v-model:value="formData.nama" />
                </n-form-item>
                <n-form-item label="No Handphone">
                    <n-input v-model:value="formData.no_hp" />
                </n-form-item>
                <n-form-item label="Keterangan">
                    <n-input type="textarea" v-model:value="formData.keterangan" />
                </n-form-item>
                <template #footer>
                    <n-space>
                        <n-button type="primary" @click="handleSave" :loading="isLoading"
                            :disabled="isLoading">Simpan</n-button>
                        <n-button type="secondary" @click="handleCancel">Batal</n-button>
                    </n-space>
                </template>
            </n-card>
        </n-modal>
    </div>
</template>
<script setup>
import { ref, onMounted, h } from "vue";
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver';
import { useDialog, useMessage, NDropdown, NIcon, NButton, useLoadingBar, NSwitch } from "naive-ui";
import {
    EditOutlined as EditIcon,
    DeleteOutlined as DeleteIcon,
    ListAltOutlined as DetailIcon
} from "@vicons/material";
import { useApi } from "../../../../helpers/axios";
import { useSearch } from "../../../../helpers/searchObject";
import router from "../../../../router";


const message = useMessage();
const dialog = useDialog();
const dataTable = ref([]);
const searchBox = ref();

const columns = [
    {
        title: "KODE",
        key: "KODE",
        sorter: 'default',
    },
    {
        title: "NAMA",
        key: "NAMA",
        sorter: 'default',
    },
    {
        title: "NO HP",
        key: "NO_HP",
        sorter: 'default',
    },
    {
        title: "KETERANGAN",
        key: "KETERANGAN",
        sorter: 'default',
    },
    {
        title: "STATUS",
        sorter: 'default',
        key: "STATUS",
        ellipsis: {
            tooltip: true,
        }
    },
    {
        title: "",
        align: "right",
        key: "more",
        render(row, index) {
            return h(
                NSwitch,
                {
                    value: row.STATUS === 'Aktif' ? true : false,
                    options: options,
                    size: "small",
                    onUpdateValue: (value) => handleSwitch(row, value)
                }
            );
        }
    }
];

const statusTag = (e) => {
    if (e === "Active") {
        return "success";
    } else if (e === "Non-Active") {
        return "warning";
    }

}
const handleSwitch = async (row, value) => {
    console.log('Switched:', row, 'to', value);
    await setSwitch({ id: row.ID, status: value ? 'Aktif' : 'Tidak Aktif' })
    getData()
}
const modalRef = ref(false);
const refreshData = () => {
    getData()
};

const formData = ref({
    nama: null,
    nomor_hp: null,
    keterangan: null
})
const handleConfirm = (row, index) => {
    dialog.warning({
        title: "Confirm",
        content: "Apakah anda yakin ingin menghapus data ?",
        positiveText: "Ya",
        negativeText: "Batal",
        onPositiveClick: async () => {
            let userToken = localStorage.getItem("token");
            const response = await useApi({
                method: 'DELETE',
                api: `cabang/${row.id}`,
                token: userToken
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
        }
    });
}
const handleAdd = () => {
    modalRef.value = true;
}
const loadingBar = useLoadingBar();
const getData = async () => {
    isLoading.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: 'GET',
        api: 'order_resources',
        token: userToken
    });
    if (!response.ok) {
        console.log(reponse.error);
    } else {
        isLoading.value = false;
        dataTable.value = response.data;
    }
}
const setSwitch = async (e) => {
    isLoading.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: 'POST',
        api: `order_resources_status`,
        data: e,
        token: userToken
    });
    if (!response.ok) {
        console.log(reponse.error);
    } else {
        isLoading.value = false;
        message.info('berhasil ubah status');
    }
}
const postData = async (e) => {
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: 'POST',
        api: 'order_resources',
        data: e,
        token: userToken
    });
    if (!response.ok) {
        console.log(reponse.error);
    } else {
        message.success('Berhasil Ditambahkan');
        modalRef.value = false;
        isLoading.value = false;
        getData();
    }
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
        label: "Hapus",
        key: "hapus",
        icon: renderIcon(DeleteIcon)
    },
    {
        label: "Detail",
        key: "detail",
        icon: renderIcon(DetailIcon)
    }
];
const pagination = {
    pageSize: 10
}
const isLoading = ref(false);
const handleSave = async () => {
    isLoading.value = true;
    await postData(formData.value);
}
const handleCancel = () => {
    modalRef.value = false;
}
const handleExport = (data) => {
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'DAFTAR SUMBER ORDER.xlsx')
}
onMounted(() => getData());
const showData = computed(() => {
    return useSearch(dataTable.value, searchBox.value);
    // return filterIt(dataTable.value, searchBox.value);
});
</script>