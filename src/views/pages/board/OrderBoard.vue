<template>
    <n-card :class="`shadow-lg`" size="small" class="shadow-lg" :segmented="{
        content: true,
        footer: 'soft',
    }">
        <template #header>Credit</template>
        <template #header-extra>
            <n-button @click="router.push({ name: 'Order' })" size="small" quaternary>detail</n-button>
        </template>
        <n-spin :show="loadData">
            <div class="grid grid-cols-2 justify-stretch">
                <n-statistic label="Order dibuat">
                    {{ createdSuccess.length }}
                </n-statistic>
                <n-statistic label="Order diproses">
                    {{ proccessOrder.length }}
                </n-statistic>
                <n-statistic label="Total Plafon">
                    {{ totalPencairan.toLocaleString() }}
                </n-statistic>
                <n-statistic label="Total Plafon diproses">
                    {{ totalProses.toLocaleString() }}
                </n-statistic>
            </div>
        </n-spin>
        <template #footer>
            <div class="text-slate-400">
                <v-icon name="bi-dot" class="text-xl" />
                summary Credit bulan berjalan
            </div>
        </template>
    </n-card :class="`shadow-lg`">
</template>

<script setup>
import _ from "lodash";
import { ref } from "vue";
import { useMessage } from 'naive-ui';
import { useApi } from "../../../helpers/axios.js";
import router from "../../../router/index.js";

const loadData = ref(false);
const data = ref([]);
const message = useMessage();
const getMenu = async () => {
    loadData.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: 'GET',
        api: 'kunjungan_admin',
        token: userToken
    });
    if (!response.ok) {
        loadData.value = false;
        message.error(response.error.data.message);
    } else {
        loadData.value = false;
        data.value = response.data.response;
    }
}
const createdSuccess = computed(() => _.filter(data.value, { 'status_code': 'APHO' }));
const proccessOrder = computed(() => _.filter(data.value, (o) => o.status_code != 'APHO'));
const totalPencairan = computed(() => createdSuccess.value.reduce((sum, i) => sum + i.plafond, 0));
const totalProses = computed(() => proccessOrder.value.reduce((sum, i) => sum + i.plafond, 0));
onMounted(() => getMenu())
</script>
