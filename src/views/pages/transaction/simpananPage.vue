<template>
    <n-space class="mb-4">
        {{ expandMenu }}
        <n-button @click="expandMenu = true">
            <v-icon name="bi-folder-plus" scale="1.2" />
            Buka Rekening
        </n-button>
        <n-button>
            <v-icon name="bi-x-square" scale="1.2" />
            Tutup Rekening
        </n-button>
        <n-button>
            <v-icon name="bi-arrow-clockwise" scale="1.2" />
            Update Rekening
        </n-button>
        <n-button>
            <v-icon name="bi-cash-coin" scale="1.2" />
            Update Saldo
        </n-button>
        <n-button>
            <v-icon name="bi-journals" scale="1.2" />
            Pindah Buku
        </n-button>
    </n-space>
    <div class="flex gap-4">
        <div class="w-full">
            <n-space vertical>
                <n-card :title="`${$route.name}`" :segmented="true" size="small">
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
                            <div class="hidden md:flex gap-2">
                                <n-dropdown :options="optAction">
                                    <n-button circle quaternary>
                                        <v-icon name="bi-three-dots-vertical" />
                                    </n-button>
                                </n-dropdown>
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
    <n-modal v-model:show="expandMenu">
        asdasd
        <!-- <component :is="currentComponent" /> -->
    </n-modal>
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
import router from "../../../router";

const expandMenu = ref(false);
const currentComponent = ref('');
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

const optAction = [
    {
        label: "Buka Rekening",
        key: "buka_rekening",
    },
    {
        label: "Tutup Rekening",
        key: "tutup_rekening",
    },
    {
        label: "Update Rekening",
        key: "update_rekening",
    },
    {
        label: "Update saldo",
        key: "update_saldo",
    },
    {
        label: "Pindah Buku",
        key: "pindah_buku",
    },
    {
        label: "Rekening Aktif",
        key: "rekening_aktif",
    },
];

const bukaRekening = () => {
    router.push({ path: 'buka_rekening' });
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