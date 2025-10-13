<script setup>
import ListDeploy from './listDeploy.vue';
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver';
import { useApi } from '../../../helpers/axios';
const modalAdd = ref(false);
const addDeploy = () => {
    modalAdd.value = true;
}
const columnDeploy = reactive([
    {
        title: "PIC",
        key: "nama_pic",
        width: 100,
        sorter: "default",
    },
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
        title: "CYCLE AWAL",
        key: "cycle_awal",
        sorter: "default",
        width: 150,
    },
    {
        title: "NBOT",
        key: "nbot",
        sorter: "default",
        filter: true,
        filterMultiple: true,
        filterOptions: [],
        width: 120,
    },
    {
        title: "DESA",
        key: "desa",
        sorter: "default",
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
        title: "MCF",
        key: "mcf",
        sorter: "default",
        filter: true,
        filterMultiple: true,
        filterOptions: [],
        width: 150,
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
        api: "cl_deploy_list",
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

onMounted(() => {
    getList();
});
</script>

<template>
    <n-card title="List Deploy" size="small" :segmented="true">
        <template #header-extra>
            <n-space>
                <n-button type="success" secondary @click="exportToExcel(dataList)">
                    <template #icon>
                        <v-icon name="bi-download"></v-icon>
                    </template>
                    Export Excel
                </n-button>
                <n-button type="primary" secondary link @click="addDeploy">
                    <template #icon>
                        <v-icon name="bi-plus-lg"></v-icon>
                    </template>
                    Buat Depoly
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
        <n-modal v-model:show="modalAdd">
            <div class="w-5/6">
                <ListDeploy @cancel="handleCancel" />
            </div>
        </n-modal>
    </n-card>
</template>