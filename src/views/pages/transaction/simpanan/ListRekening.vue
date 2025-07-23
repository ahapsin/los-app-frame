<template>
    <div class="flex gap-4 w-full">
        <div class="w-full">
            <n-space vertical>
                <n-card :title="`Data Rekening`" :segmented="true" size="small">
                    <template #header-extra>
                        <n-button quaternary type="success" @click="handleBukaRekening">
                            <v-icon name="bi-folder-plus" scale="1.2" />
                            Buka Rekening
                        </n-button>
                        <n-button quaternary type="error" @click="handleTutupRekening">
                            <v-icon name="bi-x-square" scale="1.2" />
                            Tutup Rekening
                        </n-button>
                    </template>
                    <n-space vertical :size="12">
                        <n-data-table size="small" :columns="columns" :data="data" :pagination="pagination"
                            :loading="isLoading" />
                    </n-space>
                </n-card>
            </n-space>
        </div>
    </div>
    <n-modal v-model:show="modalBukaRekening">
        <div class="w-[80%]">
            <BukaRekening @saved="handleSavedNewAccount" />
        </div>
    </n-modal>
    <n-modal v-model:show="modalTutupRekening">
        <div class="w-[80%]">
            <TutupRekening />
        </div>
    </n-modal>
</template>
<script setup>
import { onMounted } from 'vue';
import { useApi } from '../../../../helpers/axios';
import { NTag, useMessage } from 'naive-ui';
import BukaRekening from "./BukaRekening.vue";
import TutupRekening from './TutupRekening.vue';



const data = ref([]);
const isLoading = ref(false);
const message = useMessage();

const modalBukaRekening = ref(false);
const modalTutupRekening = ref(false);

const handleBukaRekening = () => {
    modalBukaRekening.value = true;
}

const handleSavedNewAccount = async () => {
    await fetchData();
    modalBukaRekening.value = false;
    message.success('Rekening berhasil ditambahkan');
}
const handleTutupRekening = () => {
    modalTutupRekening.value = true;
}

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
        render(row) {
            return h(
                NTag,
                {
                    type: row.status === 'active' ? 'success' : 'error',
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