<template>
    <div>
        <n-space vertical>
            <n-card :title="`Tabel ${$route.name}`">
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
                        <div class="hidden md:flex">
                            <n-button type="primary" @click="handleAdd">
                                <template #icon>
                                    <n-icon>
                                        <add-icon />
                                    </n-icon>
                                </template>
                                <strong>tambah</strong>
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
                        </div>
                    </n-space>
                </template>
                <n-space vertical :size="12" class="pt-4">
                    <n-data-table size="small" :columns="columns" :data="showData" :pagination="pagination" />
                </n-space>
            </n-card>
        </n-space>
    </div>
</template>
<script setup>
import { ref, onMounted, h } from "vue";
import { useApi } from "../../../../helpers/axios";
import { useSearch } from "../../../../helpers/searchObject";
import router from '../../../../router';
import { useDialog, useMessage, NDropdown, NIcon, NTag, NButton, NEllipsis } from "naive-ui";
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

import { useLoadingBar } from "naive-ui";

const message = useMessage();
const dialog = useDialog();
const dataTable = ref([]);
const searchBox = ref();
const loadingBar=useLoadingBar();
const columns = [
    {
        title: "Nama Menu",
        key: "menu_name",
        sorter: 'default',
    },
    {
        title: "Parent",
        key: "parent",
        sorter: 'default',
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
                    default:()=> h(NButton, {
                        size: "small",
                    }, { default: () => 'Action' })
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
const handleDetail = (evt) => {
    router.push(`/master/menu-action/${evt.id}`);
}
const handleUpdate = (evt) => {
    router.push(`/master/branch-action/${evt.id}`);
}
const handleAdd = () => {
    router.push({name:'menu action'});
}
const getData = async () => {
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: 'GET',
        api: 'menu',
        token: userToken
    });
    if (!response.ok) {
      console.log(reponse.error);
      router.push("/");
    } else {
        loadingBar.finish();
        dataTable.value = response.data.response;
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