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
    <n-modal v-model:show="modalOpen">
        <div class="w-1/2">
            <n-card size="small" title="Tambah Fee">
                <n-form label-placement="top">

                    <n-form-item label="Plafond">
                        <n-input-number v-model:value="DynamicForm.Plafond" :format="formatCurrency"
                            :parse="parseCurrency" :precision="0" :min="0" placeholder="Masukkan plafond"
                            style="width: 100%" :show-button="false" />
                    </n-form-item>

                    <n-form-item label="Bunga">
                        <!-- kalau bunga persen, lebih cocok pakai % -->
                        <n-input-number v-model:value="DynamicForm.Bunga" :precision="2" :min="0" suffix="%"
                            placeholder="Masukkan bunga" style="width: 100%" :show-button="false" />
                    </n-form-item>

                    <n-form-item label="Angsuran">
                        <n-input-number v-model:value="DynamicForm.Angsuran" :format="formatCurrency"
                            :parse="parseCurrency" :precision="0" :min="0" placeholder="Masukkan angsuran"
                            style="width: 100%" :show-button="false" />
                    </n-form-item>

                    <n-form-item label="Biaya Admin">
                        <n-input-number v-model:value="DynamicForm.BiayaAdmin" :format="formatCurrency"
                            :parse="parseCurrency" :precision="0" :min="0" placeholder="Masukkan biaya admin"
                            style="width: 100%" :show-button="false" />
                    </n-form-item>

                    <n-form-item label="Biaya Bunga">
                        <n-input-number v-model:value="DynamicForm.BiayaBunga" :format="formatCurrency"
                            :parse="parseCurrency" :precision="0" :min="0" placeholder="Masukkan biaya bunga"
                            style="width: 100%" :show-button="false" />
                    </n-form-item>

                    <n-form-item label="Biaya Proses">
                        <n-input-number v-model:value="DynamicForm.BiayaProses" :format="formatCurrency"
                            :parse="parseCurrency" :precision="0" :min="0" placeholder="Masukkan biaya proses"
                            style="width: 100%" :show-button="false" />
                    </n-form-item>

                </n-form>
                <template #action>
                    <n-space justify="end">
                        <n-button type="primary" size="small" @click="handleSave">
                            Simpan
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
import {
    AddCircleOutlineRound as AddIcon,
    DeleteOutlined as DeleteIcon,
    ListAltOutlined as DetailIcon,
    FileDownloadOutlined as DownloadIcon,
    SearchOutlined as SearchIcon,
} from "@vicons/material";
import { NButton, NIcon, NPopconfirm, useLoadingBar, useMessage } from "naive-ui";
import { h, onMounted, ref } from "vue";
import { useApi } from "../../../../helpers/axios";
import { useSearch } from "../../../../helpers/searchObject";


const message = useMessage();
const dataTable = ref([]);
const searchBox = ref();
const DynamicForm = reactive({
    Plafond: null,
    Bunga: null,
    Angsuran: null,
    BiayaAdmin: null,
    BiayaBunga: null,
    BiayaProses: null
})
const NumberLocal = (value) => {
    if (value === null || value === undefined) return '-'
    return Number(value).toLocaleString('id-ID')
}
const renderCurrency = (key) => {
    return (row) => h('div', {}, NumberLocal(row[key]))
}
const columns = [
    {
        title: "Plafond",
        key: "Plafond",
        sorter: 'default',
        render: renderCurrency("Plafond")
    },
    {
        title: "Bunga",
        key: "Bunga",
        sorter: 'default',
        render(row) {
            return h('div', {}, (row.Bunga ?? 0) + ' %')
        }
    },
    {
        title: "Angsuran",
        key: "Angsuran",
        sorter: 'default',
        render: renderCurrency("Angsuran")
    },
    {
        title: "Biaya Admin",
        key: "BiayaAdmin",
        sorter: 'default',
        render: renderCurrency("BiayaAdmin")
    },
    {
        title: "Biaya Bunga",
        key: "BiayaBunga",
        sorter: 'default',
        render: renderCurrency("BiayaBunga")
    },
    {
        title: "Biaya Proses",
        key: "BiayaProses",
        sorter: 'default',
        render: renderCurrency("BiayaProses")
    }, {
        key: "actions",
        render(row) {
            return h(
                'div',
                { style: 'display: flex; gap: 8px; justify-content: flex-end;' },
                [
                    // EDIT
                    h(
                        NButton,
                        {
                            size: 'small',
                            type: 'warning',
                            onClick: () => handleEdit(row)
                        },
                        { default: () => 'Edit' }
                    ),

                    // DELETE pakai popconfirm
                    h(
                        NPopconfirm,
                        {
                            onPositiveClick: () => handleDelete(row)
                        },
                        {
                            trigger: () =>
                                h(
                                    NButton,
                                    {
                                        size: 'small',
                                        type: 'error'
                                    },
                                    { default: () => 'Hapus' }
                                ),
                            default: () => 'Yakin mau hapus data ini?'
                        }
                    )
                ]
            )
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

const handleEdit = (row) => {
    DynamicForm.Plafond = row.Plafond
    DynamicForm.Bunga = row.Bunga
    DynamicForm.Angsuran = row.Angsuran
    DynamicForm.BiayaAdmin = row.BiayaAdmin
    DynamicForm.BiayaBunga = row.BiayaBunga
    DynamicForm.BiayaProses = row.BiayaProses

    selectOpen.value = row // simpan ID untuk update
    modalOpen.value = true
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
const handleSave = async () => {
    loadState.value = true
    let userToken = localStorage.getItem("token")

    const isEdit = !!selectOpen.value?.ID

    const response = await useApi({
        method: isEdit ? 'PUT' : 'POST',
        api: isEdit
            ? `BungaMenurunFee/${selectOpen.value.ID}`
            : `BungaMenurunFee`,
        data: DynamicForm,
        token: userToken
    })

    if (!response.ok) {
        loadState.value = false
    } else {
        message.success(isEdit ? 'Berhasil update data' : 'Berhasil tambah data')
        modalOpen.value = false
        loadState.value = false
        getData()
    }
}
const handleDelete = async (row) => {
    let userToken = localStorage.getItem("token")

    const response = await useApi({
        method: 'DELETE',
        api: `BungaMenurunFee/${row.ID}`,
        token: userToken
    })

    if (!response.ok) {
        message.error('Gagal hapus data')
    } else {
        message.success('Berhasil hapus data')
        getData()
    }
}
const handleAdd = () => {
    Object.keys(DynamicForm).forEach(key => DynamicForm[key] = null)
    selectOpen.value = null
    modalOpen.value = true
}
const loadingBar = useLoadingBar();
const getData = async () => {
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: 'GET',
        api: 'BungaMenurunFee',
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

const parseCurrency = (value) => {
    const nums = value.replace(/(,|\$|\s)/g, "").trim();
    if (/^\d+(\.(\d+)?)?$/.test(nums))
        return Number(nums);
    return nums === "" ? null : Number.NaN;
}
const formatCurrency = (value) => {
    if (value === null)
        return "";
    return value.toLocaleString("en-US");
}

onMounted(() => getData());
const showData = computed(() => {
    return useSearch(dataTable.value, searchBox.value);
    // return filterIt(dataTable.value, searchBox.value);
});
</script>
