<template>
    <n-space class="mb-4 bg-white p-2 rounded-lg items-center">
        <n-button @click="currentComponent = 'ListRekening'" quaternary :type="currentComponent === 'ListRekening' ? 'success' : 'default'">
            <v-icon name="bi-table" scale="1.2" />
        </n-button>
        <n-divider vertical></n-divider>
        <n-button quaternary :type="currentComponent === 'SetorTarik' ? 'success' : 'default'"
            @click="currentComponent = 'SetorTarik'">
            <v-icon name="bi-arrow-repeat" scale="1.2" />
            Transaksi
        </n-button>
        <n-button @click="currentComponent = 'BukaRekening'" quaternary
            :type="currentComponent === 'BukaRekening' ? 'success' : 'default'">
            <v-icon name="bi-folder-plus" scale="1.2" />
            Buka Rekening
        </n-button>
        <n-button quaternary @click="currentComponent = 'TutupRekening'"
            :type="currentComponent === 'TutupRekening' ? 'success' : 'default'">
            <v-icon name="bi-x-square" scale="1.2" />
            Tutup Rekening
        </n-button>
        <n-button quaternary @click="currentComponent = 'CetakBuku'"
            :type="currentComponent === 'CetakBuku' ? 'success' : 'default'">
            <v-icon name="bi-printer" scale="1.2" />
            Cetak Buku
        </n-button>
        <!-- <n-button quaternary @click="currentComponent = 'PindahBuku'">
            <v-icon name="bi-journals" scale="1.2" />
            Pindah Buku
        </n-button> -->

    </n-space>
    <div class="flex w-full">
        <component :is="komponenMap[currentComponent]" />
    </div>
</template>
<script setup>
import { ref } from "vue";
import { useDialog, useMessage, NButton } from "naive-ui";


import ListRekening from "./ListRekening.vue";
import BukaRekening from "./BukaRekening.vue";
import SetorTarik from "./SetorTarik.vue";
import CetakBuku from "./CetakBuku.vue";
import PindahBuku from "./PindahBuku.vue";
import TutupRekening from "./TutupRekening.vue";
import UpdateRekening from "./UpdateRekening.vue";

const currentComponent = ref('ListRekening');
const message = useMessage();
const dialog = useDialog();

const dataTable = ref([]);
const komponenMap = {
    ListRekening,
    BukaRekening,
    SetorTarik,
    TutupRekening,
    UpdateRekening,
    PindahBuku,
    CetakBuku
}

// onMounted(() => fetchData());

</script>