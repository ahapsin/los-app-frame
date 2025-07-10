<template>
    <div class="flex gap-4">
        <div class="w-full">
            <n-space vertical>
                <n-card :title="`Tabel ${$route.name}`" :segmented="true" size="small">
                    <template #header-extra>
                        <n-space class="!gap-1">
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
                                    <strong>Rekening</strong>
                                </n-button>
                            </div>
                            <div class="hidden md:flex">
                                <n-button secondary type="primary" @click="group = !group">
                                    <template #icon>
                                        <v-icon name="bi-menu-app" />
                                    </template>
                                    <strong>Grup Menu</strong>
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
                        <n-data-table size="small" :columns="columns" :data="showData" :pagination="pagination"
                            :loading="isLoading" />
                    </n-space>
                </n-card>
            </n-space>
        </div>
        <div v-if="group" class="w-1/3">
            <n-card size="small" title="Group Menu">
                <template #header-extra>
                    <n-space>
                        <n-button type="primary">
                            <template #icon>
                                <v-icon name="bi-plus-circle"></v-icon>
                            </template>
                            Group</n-button>
                        <n-button circle secondary @click="group = !group">
                            <template #icon>
                                <v-icon name="bi-x"></v-icon>
                            </template>
                        </n-button>
                    </n-space>
                </template>
                group menu
            </n-card>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, h } from "vue";
import { useDialog, useMessage, NDropdown, NIcon, NButton } from "naive-ui";
import {
    AddCircleOutlineRound as AddIcon,
    SearchOutlined as SearchIcon,
    FileDownloadOutlined as DownloadIcon,

} from "@vicons/material"
import {
    DeleteOutlined as DeleteIcon,
    ListAltOutlined as DetailIcon
} from "@vicons/material";

import { OhVueIcon } from "oh-vue-icons";
import { useSearch } from "../../../helpers/searchObject";
import { useApi } from "../../../helpers/axios";

const message = useMessage();
const dialog = useDialog();
const group = ref(false);
const dataTable = ref([]);
const searchBox = ref();
const columns = [
    {
        title: "Icon",
        key: "menu_name",
        sorter: 'default',
        render(row) {
            return h(OhVueIcon, { name: row.leading })
        }
    },
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
    router.push({ name: 'menu action' });
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

// onMounted(() => fetchData());
const showData = computed(() => {
    return useSearch([], searchBox.value);
    // return filterIt(dataTable.value, searchBox.value);
});
</script>