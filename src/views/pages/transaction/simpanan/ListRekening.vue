<template>
    <div class="flex gap-4 w-full">
        <div class="w-full">
            <n-space vertical>
                <n-card :title="`Data Rekening`" :segmented="true" size="small">
                    <n-space vertical :size="12">
                        <n-data-table size="small" :columns="columns" :data="data" :pagination="pagination"
                            :loading="isLoading" />
                    </n-space>
                </n-card>
            </n-space>
        </div>
    </div>
</template>
<script setup>
import { onMounted } from 'vue';
import { useApi } from '../../../../helpers/axios';
import { NTag } from 'naive-ui';

const data = ref([]);
const isLoading = ref(false);

const fetchData = async () => {
    isLoading.value = true;
    const response = await useApi({
        api: 'account',
        method: 'GET',
        token: localStorage.getItem('token')
    });
    if (!response.ok) {
        message.error("error");
        isLoading.value = false;
    } else {
        isLoading.value = false;
        data.value = response.data;
    }
}

const columns = [
    {
        title: "No Rekening",
        key: "no_rekening"
    },
    {
        title: "Atas Nama",
        key: "nama_pemilik"
    },
    {
        title: "Alamat",
        key: "alamat"
    },
    {
        title: "Ibu Kandung",
        key: "nama_ibu_kandung"
    },
    {
        title: "Saldo",
        key: "saldo"
    },
    {
        title: "Status",
        key: "status",
        render(row){
           return h(
                NTag,
                {
                    type: row.status === 'active'?'success':'error',
                },
                {
                    default: () => row.status,
                }
            );
        }
    },
]


onMounted(() => fetchData());
</script>