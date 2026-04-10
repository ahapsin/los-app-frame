<template>
    <n-card title="Data Canvasing" size="small">
        <template #header-extra>
            <n-space>
                <json-excel :data="dataList" :name="`Data Canvasing`" :fields="json_fields">
                    <n-button type="success" secondary>Download</n-button>
                </json-excel>
                <n-button @click="handleAdd" type="primary">Tambah</n-button>
            </n-space>
        </template>
        <div class="flex gap-2">
            <n-form-item label="tanggal">
                <n-date-picker v-model:value="searchBox.tanggal" type="date" />
            </n-form-item>
            <n-form-item label="Nama MCF">
                <n-input v-model:value="searchBox.nama_mcf" clearable />
            </n-form-item>
        </div>
        <n-data-table :columns="columnList" :data="filteredData" :loading="loadList" :pagination="pagination" />
    </n-card>
    <n-modal v-model:show="viewModal">
        <n-card class="w-full md:w-3/4" title="Form Canvasing">
            <AddCanvasing @canceled="handleCancel" />
        </n-card>
    </n-modal>
</template>
<script setup>
import { NButton, NImage, NTag } from 'naive-ui';
import { h, onMounted, ref } from 'vue';
import JsonExcel from "vue-json-excel3";
import { useApi } from '../../../../helpers/axios';
import AddCanvasing from './AddCanvasing.vue';

const loadList = ref(false)
const viewModal = ref(false)
const searchBox = reactive({
    tanggal: null,
    nama_mcf: null
});

const handleAdd = () => {
    viewModal.value = true
}

const dataList = ref([
])

const columnList = [
    {
        title: "Tanggal",
        key: "TanggalKunjungan",
        sorter: "default",
    },
    {
        title: "Tipe",
        key: "Status",
        render(row) {
            return h(
                NTag,
                {
                    type: row.Status === 'Baru' ? 'success' : 'info'
                },
                { default: () => row.Status }
            )
        }
    },
    {
        title: "Nama MCF",
        key: "NamaMcf",
        sorter: "default",
    },
    {
        title: "Nama Nasabah",
        key: "Nama",
    },
    {
        title: "Alamat",
        key: "Alamat",
    },
    {
        title: "No HP",
        key: "NoHandphone",
    },
    {
        title: "Hasil Follwup",
        key: "HasilFollowup",
    },
    {
        title: "Sumber Order",
        key: "SumberOrder",
    },
    {
        title: "Keterangan",
        key: "Keterangan",
    },
    {
        title: "Dokumen",
        key: "Dokumen",
        render(row) {
            return h(NImage, {
                src: row.Path ? row.Path : noImage,
                style: "border-radius: 6px; height:30px;",
                objectFit: "cover",
                width: 30,
            })
        }
    },
    // {
    //     title: "Aksi",
    //     key: "aksi",
    //     render(row) {
    //         return h(NButton, {
    //             size: "small",
    //             type: "primary",
    //             onClick: () => alert(`Detail ID: ${row.id}`)
    //         }, { default: () => "Detail" })
    //     }
    // }
]

const noImage = 'https://res.cloudinary.com/dfjruncxv/image/upload/v1754368196/10275344_meozgk.png';

const getList = async () => {
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "GET",
        api: "canvasing",
        token: userToken,
    });
    if (!response.ok) {
        console.error(response.error);
    } else {
        dataList.value = response.data;
    }
}

const pagination = reactive({
    pageSize: 5,
    showSizePicker: true,
    pageSizes: [10, 20, 30, 50, 100],
    onChange: (page) => {
        pagination.page = page;
    },
    onUpdatePageSize: (pageSize) => {
        pagination.pageSize = pageSize;
        pagination.page = 1;
    }
})

const handleCancel = () => {
    viewModal.value = false;
    getList();
}
const filteredData = computed(() => {
    return dataList.value.filter((item) => {
        const matchTanggal = searchBox.tanggal
            ? new Date(item.TanggalKunjungan).toDateString() ===
            new Date(searchBox.tanggal).toDateString()
            : true;

        const matchNama = searchBox.nama_mcf
            ? item.NamaMcf?.toLowerCase().includes(searchBox.nama_mcf.toLowerCase())
            : true;

        return matchTanggal && matchNama;
    });
});
onMounted(() => {
    getList();
})
</script>
