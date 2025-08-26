<template>
    <div class="flex gap-4 w-full">
        <div class="w-full">
            <n-space vertical>
                <n-card :title="`Data Deposito`" :segmented="true" size="small">
                    <template #header-extra>
                        <n-button quaternary type="success" @click="handleBukaRekening">
                            <v-icon name="bi-folder-plus" scale="1.2" />
                            Buka Deposito
                        </n-button>
                        <n-button quaternary type="info" @click="handleTutupRekening">
                            <v-icon name="bi-coin" scale="1.2" />
                            Pencairan Deposito
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
            <BukaRekening @saved="handleSavedNewAccount" @cancel="handleCancelBuka" />
        </div>
    </n-modal>
    <n-modal v-model:show="modalTutupRekening" :mask-closable="false">
        <div class="w-2/4">
            <TutupRekening @cancel="handleCancelTutup" />
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
const handleCancelTutup = () => {
    modalTutupRekening.value = false;
}
const handleCancelBuka = () => {
    modalBukaRekening.value = false;
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
        title: "No Deposito",
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
        title: "Nominal",
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