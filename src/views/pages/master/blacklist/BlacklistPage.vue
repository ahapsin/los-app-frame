<template>
    <div>
        <n-space vertical>
            <n-card :class="`shadow-lg`" :title="`Tabel ${$route.name}`" :segmented="true" size="small">
                <template #header-extra>
                    <n-space class="!gap-1">
                        <div class="me-1">
                            <n-input autofocus="true" clearable placeholder="cari disini.." v-model:value="searchBox">
                                <template #prefix>
                                    <n-icon>
                                        <search-icon />
                                    </n-icon>
                                </template>
                            </n-input>
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
                        <!-- <div class="hidden md:flex">
                            <n-button type="primary" @click="handleAdd">
                                <template #icon>
                                    <n-icon>
                                        <add-icon />
                                    </n-icon>
                                </template>
                                <strong>tambah</strong>
                            </n-button>
                        </div> -->
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
            </n-card :class="`shadow-lg`">
        </n-space>
    </div>
    <n-modal v-model:show="modalOpen">
        <div class="w-1/2">
            <n-card size="small">
                <n-alert type="warning" title="Konfirmasi" class="mb-2">
                    Apakah Anda yakin ingin membuka blacklist ini?
                </n-alert>
                <n-descriptions bordered :column="4" size="small">
                    <n-descriptions-item label="No. Pinjaman">
                        {{ selectOpen.LOAN_NUMBER }}
                    </n-descriptions-item>
                    <n-descriptions-item label="Nama Nasabah">
                        {{ selectOpen.NAME }}
                    </n-descriptions-item>
                    <n-descriptions-item label="No. KTP">
                        {{ selectOpen.KTP }}
                    </n-descriptions-item>
                    <n-descriptions-item label="No. KK">
                        {{ selectOpen.KK }}
                    </n-descriptions-item>
                    <n-descriptions-item label="Input Oleh">
                        {{ selectOpen.PERSON }}
                    </n-descriptions-item>
                    <n-descriptions-item label="Tanggal Input">
                        {{ selectOpen.DATE_ADD }}
                    </n-descriptions-item>

                    <n-descriptions-item label="Keterangan">
                        {{ selectOpen.NOTE }}
                    </n-descriptions-item>
                </n-descriptions>
                <n-form-item label="Keterangan">
                    <n-input v-model:value="keterangan" type="textarea" placeholder="Keterangan" />
                </n-form-item>
                <template #action>
                    <n-space justify="end">
                        <n-button type="error" size="small" @click="handleConfirm">
                            Ya, Buka
                        </n-button>
                        <n-button size="small" @click="handleCancel">
                            Batal
                        </n-button>
                    </n-space>
                </template>
            </n-card>
        </div>
    </n-modal>
</template>
<script setup>
import { ref, onMounted, h } from "vue";
import { useApi } from "../../../../helpers/axios";
import { useSearch } from "../../../../helpers/searchObject";
import router from '../../../../router';
import { useDialog, useMessage, NDropdown, NIcon, NTag, NButton, NEllipsis, useLoadingBar } from "naive-ui";
import {
    AddCircleOutlineRound as AddIcon,
    SearchOutlined as SearchIcon,
    FileDownloadOutlined as DownloadIcon,

} from "@vicons/material";
import {
    Lock as LockIcon,
    LockOpen as UnlockIcon
} from "@vicons/tabler"
import {
    EditOutlined as EditIcon,
    DeleteOutlined as DeleteIcon,
    ListAltOutlined as DetailIcon
} from "@vicons/material";


const message = useMessage();
const dataTable = ref([]);
const searchBox = ref();

const columns = [
    {
        title: "Loan Number",
        key: "LOAN_NUMBER",
        sorter: 'default',
    },
    {
        title: "KTP",
        key: "KTP",
        sorter: 'default',
    },
    {
        title: "KK",
        key: "KK",
        sorter: 'default',
    },
    {
        title: "Catatan",
        sorter: 'default',
        key: "NOTE",
    },
    {
        render(row) {
            return h(
                NButton,
                {
                    size: "small",
                    disabled: row.STATUS === 'ACTIVE' ? false : true,
                    secondary: true,
                    type: row.STATUS === 'ACTIVE' ? "error" : "default",
                    onClick: () => handleOpen(row),
                    circle: true
                },
                {
                    default: () =>
                        h(
                            NIcon,
                            null,
                            { default: () => h(row.STATUS === 'ACTIVE' ? LockIcon : UnlockIcon) }
                        )
                }
            );
        }
    }
];
const keterangan = ref();
const modalOpen = ref(false);
const selectOpen = ref([]);
const handleOpen = (evt) => {
    selectOpen.value = evt;
    modalOpen.value = true;
    keterangan.value = null;
}
const loadState = ref(false);
const handleCancel = () => {
    modalOpen.value = false;
    selectOpen.value = [];
}
const handleConfirm = async (e) => {
    loadState.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: 'PUT',
        api: `blacklist/${selectOpen.value?.ID}`,
        data: {
            note: keterangan.value
        },
        token: userToken
    });
    if (!response.ok) {
        loadState.value = false;
        modalOpen.value = false;
    } else {
        loadState.value = false;
        message.success('Berhasil buka blacklist');
        modalOpen.value = false;
        getData();
    }
}
const handleAdd = () => {
    router.push('/master/branch-action');
}
const loadingBar = useLoadingBar();
const getData = async () => {
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: 'GET',
        api: 'blacklist',
        token: userToken
    });
    if (!response.ok) {
        console.log(reponse.error);
    } else {
        loadingBar.finish();
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