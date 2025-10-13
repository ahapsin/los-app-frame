<script setup>
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver';
import { useApi } from '../../../helpers/axios';
import AddLkp from './addLkp.vue';
import { NButton } from 'naive-ui';
const modalAdd = ref(false);
const addDeploy = () => {
    modalAdd.value = true;
}
const modalDetail = ref(false);
const bodyModalDetail = ref([]);
const handleDetail = (e) => {
    modalDetail.value = true;
    getDetail(e.no_lkp);
    // console.log(e.no_lkp);

}
const getDetail = async (e) => {
    isLoading.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "GET",
        api: `cl_lkp_detail/${e}`,
        token: userToken,
    });
    if (!response.ok) {
        isLoading.value = false;
        console.error(response.error);
    } else {
        isLoading.value = false;
        bodyModalDetail.value = response.data;
    }
};
const columnDeploy = reactive([
    {
        title: "NO LKP",
        key: "no_lkp",
        sorter: "default",
    },
    {
        title: "PETUGAS",
        key: "petugas",
        sorter: "default",
    },
    {
        title: "TANGGAL",
        key: "tanggal",
        sorter: "default",
    },
    {
        title: "Jumlah Surat Tagih",
        key: "jml_surat_tgh",
        sorter: "default",
    },
    {
        key: "jml_surat_tgh",
        align: "right",
        render(row) {
            return h(NButton, {
                size: "small",
                onClick: () => handleDetail(row),
            }, {
                default: () => "Detail",
            })
        }
    }
]);
const handleCancel = () => {
    modalAdd.value = false;
}
const exportToExcel = (data) => {
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'data.xlsx')
}
const isLoading = ref(false);
const dataList = ref([]);
const getList = async () => {
    isLoading.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "GET",
        api: "cl_lkp_list",
        token: userToken,
    });
    if (!response.ok) {
        isLoading.value = false;
        console.error(response.error);
    } else {
        isLoading.value = false;
        dataList.value = response.data;
    }
};

const handleSaved = () => {
    modalAdd.value = false;
    getList();
}
const columnBebanTagih = reactive([
    {
        title: "NO KONTRAK",
        key: "no_kontrak",
        width: 150,
        sorter: "default",
    },
    {
        title: "NAMA KONSUMEN",
        key: "nama_customer",
        width: 200,
        sorter: "default",
    },
    {
        title: "DESA",
        key: "desa",
        sorter: "default",
        filter: true,
        filterMultiple: true,
        filterOptions: [],
        width: 150,
    },
    {
        title: "KEC",
        key: "kec",
        sorter: "default",
        filter: true,
        filterMultiple: true,
        filterOptions: [],
        width: 150,
    },
    {
        title: "TGL JATUH TEMPO",
        key: "tgl_jatuh_tempo",
        width: 200,
        sorter: "default",
    },
    {
        title: "CYCLE",
        key: "cycle_awal",
        sorter: "default",
        width: 150,
    },
    {
        title: "ANGSURAN KE",
        key: "angusran_ke",
        sorter: "default",
        width: 150,
    },
    {
        title: "ANGSURAN ",
        key: "angsuran",
        sorter: "default",
        width: 150,
    },
    {
        title: "BAYAR ",
        key: "bayar",
        sorter: "default",
        width: 150,
    },
    {
        title: "HASIL KUNJUNGAN ",
        key: "hasil_kunjungan",
        sorter: "default",
        width: 150,
    },

]);
onMounted(() => {
    getList();
});
</script>

<template>
    <n-card title="List LKP" size="small" :segmented="true">
        <template #header-extra>
            <n-space>
                <!-- <n-button type="success" secondary @click="exportToExcel(dataList)">
                    <template #icon>
                        <v-icon name="bi-download"></v-icon>
                    </template>
Export Excel
</n-button> -->
                <n-button type="primary" secondary link @click="modalAdd = true">
                    <template #icon>
                        <v-icon name="bi-plus-lg"></v-icon>
                    </template>
                    Buat LKP
                </n-button>
                <n-button quaternary circle @click="getList">
                    <template #icon>
                        <v-icon name="bi-arrow-clockwise"></v-icon>
                    </template>

                </n-button>
            </n-space>
        </template>
        <n-data-table :columns="columnDeploy" :data="dataList" :filter-value="filterValue"
            @update:filters="onFilterChange" :checked-row-keys="checkedRowKeys" :row-key="(row) => row"
            @update:checked-row-keys="handleCheck" :loading="isLoading" size="small" :pagination="{ pageSize: 10 }" />
    </n-card>
    <n-modal v-model:show="modalAdd">
        <div class="w-4/5">
            <AddLkp @cancel="handleCancel" @saved="handleSaved" />
        </div>
    </n-modal>
    <n-modal v-model:show="modalDetail">
        <n-card class="w-4/5" title="Detail LKP" size="small" :segmented="true">
            <div>
                <n-card class="mb-2" size="small" embedded>
                    <div class="flex  gap-4">
                        <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                            <small class="text-reg">No LKP</small>
                            <n-text strong class="text-md">{{ bodyModalDetail.no_lkp }}</n-text>
                        </div>

                        <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                            <small class="text-reg">Petugas</small>
                            <n-text strong class="text-md">{{ bodyModalDetail.petugas }}</n-text>
                        </div>

                        <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                            <small class="text-reg">Tanggal</small>
                            <n-ellipsis class="text-md font-semibold">{{ bodyModalDetail.tanggal }}</n-ellipsis>
                        </div>

                        <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                            <small class="text-reg">Jumlah Surat Tagih</small>
                            <n-text strong class="text-md">{{ bodyModalDetail.jml_surat_tgh }}</n-text>
                        </div>

                    </div>
                </n-card>
                <n-data-table :columns="columnBebanTagih" :data="bodyModalDetail.details" :filter-value="filterValue"
                    @update:filters="onFilterChange" :checked-row-keys="checkedRowKeys" :row-key="(row) => row"
                    @update:checked-row-keys="handleCheck" size="small" :pagination="{ pageSize: 10 }"
                    :scroll-x="1800" />
            </div>
        </n-card>
    </n-modal>
</template>