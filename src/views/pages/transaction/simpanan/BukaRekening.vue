<template>
    <div class="flex gap-4 w-full">
        <div class="w-full">
            <n-space vertical>
                <n-card :title="`Buka Rekening Baru`" :segmented="true" size="small">
                    <n-space vertical>
                        <n-card embedded>
                            <n-form-item label="Pilih Customer" class="w-1/2">
                                <n-select filterable v-model:value="customer" :options="dataCustomer"
                                    :render-label="renderLabel" label-field="nama" value-field="id"
                                    @update:value="handleUpdateValue" />
                                <n-divider vertical></n-divider>
                                <n-button type="primary" @click="modalState = true">
                                    <template #icon>
                                        <v-icon name="bi-plus-lg"></v-icon>
                                    </template>
                                    customer</n-button>
                            </n-form-item>
                        </n-card>
                        <n-card v-if="selectedCustomer">
                            <div class="grid grid-cols-1 md:grid-cols-6 gap-4 bg-white">
                                <div v-for="(value, key) in selectedCustomer" :key="key">
                                    <div class="flex">
                                        <div class="flex flex-col">
                                            <div><strong class="capitalize">{{ formatKey(key) }}</strong></div>
                                            <div>
                                                <n-ellipsis style="max-width: 120px">{{ value ? value : 'N/A'
                                                }}</n-ellipsis>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </n-card>
                        <n-card>
                            <n-form>
                                <div class="flex flex-col-3 gap-4">
                                    <n-form-item label="Nomor Rekening" class="w-full">
                                        <n-select :options="optNoRekening" value-field="v" label-field="l" tag
                                            filterable v-model:value="no_rekening"></n-select>
                                    </n-form-item>
                                    <n-form-item label="Jenis Tabungan" class="w-full">
                                        <n-select v-model:value="jenis_tabungan" :options="dataSavings" value-field="id"
                                            label-field="nama_jenis" @update-value="handleUpdateSavings"></n-select>
                                    </n-form-item>
                                    <n-form-item label="Setoran awal" class="w-full">
                                        <n-input-number :parse="parse" :format="format" :show-button="false"
                                            v-model:value="setoran_awal" />
                                    </n-form-item>
                                </div>
                                <n-card embedded v-if="selectedSaving">
                                    <div class="grid grid-cols-1 md:grid-cols-4 ">
                                        <div v-for="(value, key) in selectedSaving" :key="key">
                                            <div class="flex flex-col">
                                                <div><strong class="capitalize">{{ formatKey(key) }}</strong></div>
                                                <div>
                                                    <n-ellipsis style="max-width: 120px">{{ value ? value : 'N/A'
                                                        }}</n-ellipsis>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </n-card>
                            </n-form>
                        </n-card>
                    </n-space>
                    <n-button type="primary" @click="handleSaveNewRekening" class="mt-4">Simpan</n-button>
                </n-card>
            </n-space>
        </div>
        <n-modal v-model:show="modalState" :mask-closable="false">
            <n-card :segmented="true" class="w-3/4" title="Tambahkan Customer Baru" size="small">
                <template #header-extra>
                    <n-button circle quartenary type="error" @click="modalState = false" size="small">
                        <v-icon name="bi-x-lg"></v-icon>
                    </n-button>
                </template>
                <new-customer @saved="handleSavedNewCustomers" />
            </n-card>
        </n-modal>
    </div>
</template>
<script setup>
import { useApi } from "../../../../helpers/axios";
import NewCustomer from "./NewCustomer.vue";

const modalState = ref(false);
const customer = ref(null);
const selectedCustomer = ref(null);

const no_rekening = ref(null);
const jenis_tabungan = ref(null);
const setoran_awal = ref(null);
const emit = defineEmits(['saved']);

const year = new Date().getFullYear(); // Misalnya: 2025
const prefix = `2${year}`; // Akan jadi '22025'
const optNoRekening = Array.from({ length: 10000 }, (_, i) => {
  const urut = String(i + 1).padStart(5, '0'); // Tambah leading zero sampai 5 digit
  const value = Number(`${prefix}${urut}`);
  return { v: value, l: value };
});


const dataCustomer = ref([]);
const isLoading = ref(false);

const fetchData = async () => {
    isLoading.value = true;
    const response = await useApi(
        {
            api: 'customers',
            method: 'GET',
            token: localStorage.getItem('token'),
        }
    );
    if (!response.ok) {
        message.error("error");
        isLoading.value = false;
    } else {
        isLoading.value = false;
        dataCustomer.value = response.data;
    }
}

const dataSavings = ref([]);
const selectedSaving = ref();
const fetchJenisTabungan = async () => {
    isLoading.value = true;
    const response = await useApi({
        api: 'saving',
        token: localStorage.getItem('token')
    });
    if (!response.ok) {
        message.error("error");
        isLoading.value = false;
    } else {
        isLoading.value = false;
        dataSavings.value = response.data;
    }
}

const saveData = async (e) => {
    isLoading.value = true;
    const response = await useApi({
        api: 'account',
        method: 'POST',
        data: e,
        token: localStorage.getItem('token')
    });
    if (!response.ok) {
        message.error("error");
        isLoading.value = false;
    } else {
        isLoading.value = false;
    }
}
const handleUpdateValue = (val, options) => {
    selectedCustomer.value = options;
}
const handleUpdateSavings = (val, opt) => {
    setoran_awal.value = opt.minimal_saldo;
    selectedSaving.value = opt;
}
const renderLabel = (option) => {
    return `${option.nama} ${option.no_identitas} `;
}
function formatKey(key) {
    return key.replace(/_/g, ' ')
}

const handleSavedNewCustomers = async () => {
    await fetchData()
    modalState.value = false;
}
const handleSaveNewRekening = async () => {
    const body = {
        customer: selectedCustomer.value,
        no_rekening: no_rekening.value,
        tabungan: selectedSaving.value,
        setoran_awal: setoran_awal.value,
    }
    await saveData(body);
    emit('saved', true);
}

const parse = (input) => {
    const nums = input.replace(/,/g, "").trim();
    if (/^\d+(\.(\d+)?)?$/.test(nums)) return Number(nums);
    return nums === "" ? null : Number.NaN;
};

const format = (value) => {
    if (value === null) return "";
    return value.toLocaleString("en-US");
};

onMounted(() => { fetchData(); fetchJenisTabungan(); });
</script>