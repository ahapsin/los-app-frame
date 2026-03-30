<template>
    <n-card :class="`shadow-lg`" size="small" :segmented="{
        content: true,
        footer: 'soft',
    }" class="shadow-lg">
        <template #header>Transaksi</template>
        <template #header-extra>
            <n-dropdown trigger="click" :options="options" @select="handleSelect">
                <n-button size="small" secondary circle>
                    <n-icon>
                        <option-icon />
                    </n-icon>
                </n-button>
            </n-dropdown>
        </template>
        <n-spin :show="loadData">
            <div class="grid grid-cols-2 justify-stretch">
                <n-statistic label="Pembayaran Berhasil">
                    {{ createdSuccess.length }}
                </n-statistic>
                <n-statistic label="Jml. Pemb. Berhasil">
                    {{ sumPaidPayment.toLocaleString() }}
                </n-statistic>
                <n-statistic label="Pemb. Pending">
                    {{ pendingPayment.length }}
                </n-statistic>
                <n-statistic label="Jml. Pemb. Pending">
                    {{ sumPendingPayment.toLocaleString() }}
                </n-statistic>
            </div>
        </n-spin>
        <template #footer>
            <div class="text-slate-400">
                <v-icon name="bi-dot" class="text-xl" />
                summary transasksi bulan berjalan
            </div>
        </template>
    </n-card>
</template>

<script setup>
import { DotsVertical as OptionIcon } from "@vicons/tabler";
import _ from "lodash";
import { useMessage } from 'naive-ui';
import { computed, onMounted, ref } from "vue";
import { useApi } from "../../../helpers/axios.js";
import router from "../../../router/index.js";

const loadData = ref(false);
const data = ref([]);
const message = useMessage();
const getData = async () => {
    loadData.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: 'GET',
        api: 'payment',
        token: userToken
    });
    if (!response.ok) {
        loadData.value = false;
        message.error(response.error.data.message);
    } else {
        loadData.value = false;
        data.value = response.data;
    }
}
const options = [
    {
        label: "Tambah Pembayaran",
        key: "tambah penerimaan",
    },
    {
        label: "Tambah Pelunasan",
        key: "tambah pelunasan",
    },
    {
        label: "Detail",
        key: "pembayaran",
    },
];

const handleSelect = (key) => {
    router.push({ name: key });
}
const createdSuccess = computed(() => _.filter(data.value, { 'STATUS': 'PAID' }));
const pendingPayment = computed(() => _.filter(data.value, { 'STATUS': 'PENDING' }));
const sumPaidPayment = computed(() => createdSuccess.value.reduce((sum, i) => sum + i.jumlah_uang, 0));
const sumPendingPayment = computed(() => pendingPayment.value.reduce((sum, i) => sum + i.jumlah_uang, 0));
onMounted(() => getData())
</script>
