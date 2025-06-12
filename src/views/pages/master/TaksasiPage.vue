<template>
    <div>
        <n-space vertical>
            <n-card :title="`Tabel ${$route.name}`" :segmented="true" size="small">
                <template #header-extra>
                    <n-space class="!gap-1">
                        <div class="me-1">
                            <n-popover trigger="click" placement="bottom-end">
                                <template #trigger>
                                    <n-button circle>
                                        <n-icon>
                                            <search-icon />
                                        </n-icon>
                                    </n-button>
                                </template>
                                <n-input autofocus="true" clearable placeholder="cari disini.."
                                    v-model:value="searchBox" />
                            </n-popover>
                        </div>
                        <!-- <div class="hidden md:flex">
                            <n-button>
                                <template #icon>
                                    <n-icon>
                                        <download-icon />
                                    </n-icon>
                                </template>
                                <strong class="hidden md:!block">download</strong>
                            </n-button>
                        </div> -->
                        <div class="md:hidden">
                            <n-button>
                                <template #icon>
                                    <n-icon>
                                        <download-icon />
                                    </n-icon>
                                </template>
                            </n-button>
                        </div>
                        <div class="hidden md:flex gap-2">
                            <n-button type="primary" @click="handleAdd">
                                <template #icon>
                                    <n-icon>
                                        <add-icon />
                                    </n-icon>
                                </template>
                                <strong>tambah</strong>
                            </n-button>
                            <n-button type="warning" @click="handleUpdateBatch">
                                <template #icon>
                                    <n-icon>
                                        <edit-icon />
                                    </n-icon>
                                </template>
                                <strong>Update Taksasi</strong>
                            </n-button>
                        </div>
                        <div class=" md:hidden">
                            <n-button type="primary" @click="handleAdd">
                                <template #icon>
                                    <n-icon>
                                        <add-icon />
                                    </n-icon>
                                </template>
                            </n-button>
                            <n-button type="warning" @click="handleUpdateBatch">
                                <template #icon>
                                    <n-icon>
                                        <edit-icon />
                                    </n-icon>
                                </template>
                            </n-button>
                        </div>
                    </n-space>
                </template>
                <n-space vertical :size="12" class="pt-4">

                    <n-data-table size="small" :columns="columns" :data="showData" :pagination="pagination"
                        :loading="loading" />
                </n-space>
            </n-card>
        </n-space>
    </div>
</template>
<script setup>
import {
    AddCircleOutlineRound as AddIcon,
    DeleteOutlined as DeleteIcon,
    ListAltOutlined as DetailIcon,
    FileDownloadOutlined as DownloadIcon,
    SyncFilled as EditIcon,
    SearchOutlined as SearchIcon,
} from "@vicons/material";
import { NButton, NDropdown, NIcon, useDialog, useLoadingBar, useMessage } from "naive-ui";
import { h, onMounted, ref } from "vue";
import { useApi } from "../../../helpers/axios";
import { useSearch } from "../../../helpers/searchObject";
import router from '../../../router';


const message = useMessage();
const dialog = useDialog();
const dataTable = ref([]);
const searchBox = ref();

const columns = [
     {
        title: "MERK",
        sorter: 'default',
        key: "merk"
    },
    {
        title: "TIPE",
        sorter: 'default',
        key: "tipe"
    },
   
    {
        title: "JENIS",
        sorter: 'default',
        key: "jenis"
    },
    {
        title: "KETERANGAN",
        sorter: 'default',
        key: "keterangan"
    },
    {
        title: "TAHUN",
        sorter: 'default',
        key: "tahun",
        render(row){
return h("div",`${row.dari} - ${row.sampai}`)
        }
    },
    {
        title: "",
        align: "right",
        key: "more",
        render(row, index) {
            return h(
                NDropdown,
                {
                    options: options,
                    size: "small",
                    onSelect: (e) => {
                        if (e === "hapus") {
                            handleConfirm(row, index);
                        }
                        if (e === "detail") {
                            handleDetail(row);
                        }
                        if (e === "edit") {
                            handleUpdate(row);
                        }
                    }
                },
                {
                    default: () => h(NButton, {
                        size: "small",
                    }, { default: () => 'Action' })
                }
            );
        }
    }
];
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
                api: `taksasi/${row.id}`,
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
const handleDetail = (evt) => {
    router.push(`/master/taksasi-action/${evt.id}`);
}
const handleUpdate = (evt) => {
    router.push(`/master/branch-action/${evt.id}`);
}
const handleAdd = () => {
    router.push('/master/taksasi-action');
}
const handleUpdateBatch = () => {
    router.push({ name: "taksasi batch" });
}
const loading = ref(false);
const loadingBar = useLoadingBar();
const getData = async () => {
    loading.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: 'GET',
        api: 'taksasi',
        token: userToken
    });
    if (!response.ok) {
        console.log(reponse.error);
    } else {
        loadingBar.finish();
        loading.value = false;
        dataTable.value = response.data;
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

onMounted(() => getData());
const showData = computed(() => {
    return useSearch(dataTable.value, searchBox.value);
    // return filterIt(dataTable.value, searchBox.value);
});
</script>
