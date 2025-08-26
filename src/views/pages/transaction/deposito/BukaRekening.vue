<template>
    <div class="flex gap-4 w-full">
        <div class="w-full">
            <n-space vertical>
                <n-card :title="`Penempatan Deposito Berjangka`" :segmented="true" size="small">
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
                        <n-card v-if="selectedCustomer" size="small" embedded>
                            <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
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
                                    <n-form-item label="Nomor Deposito" class="w-full">
                                        <n-select :options="optNoRekening" value-field="v" label-field="l" tag
                                            filterable v-model:value="no_rekening"></n-select>
                                    </n-form-item>
                                    <n-form-item label="Periode" class="w-full">
                                        <n-select :options="optPeriode" value-field="v" label-field="l" tag filterable
                                            v-model:value="periode"></n-select>
                                    </n-form-item>
                                    <n-form-item label="Nominal" class="w-full">
                                        <n-input-number :parse="parse" :format="format" :min="1000000"
                                            v-model:value="nominal" placeholder="Nominal" :show-button="false"
                                            class="flex !w-full" />
                                    </n-form-item>
                                    <n-form-item label="Sumber Dana" class="w-full">
                                        <n-select :options="optSumberDana" value-field="v" label-field="l" tag
                                            filterable v-model:value="resPajak"></n-select>
                                    </n-form-item>

                                </div>
                                <div class="flex flex-col-3 gap-4">
                                    <n-form-item label="Sukuk Bunga (%)" class="w-full">
                                        <n-input-number :parse="parse" :format="format" :max="100"
                                            v-model:value="nominal" placeholder="Sukuk Bunga" :show-button="false"
                                            class="flex !w-full" />
                                    </n-form-item>
                                    <n-form-item label="Restitusi Pajak" class="w-full">
                                        <n-select :options="optResPajak" value-field="v" label-field="l" tag filterable
                                            v-model:value="resPajak"></n-select>
                                    </n-form-item>
                                    <n-form-item label="RollOver" class="w-full">
                                        <n-select :options="optRollOver" value-field="v" label-field="l" tag filterable
                                            v-model:value="resPajak"></n-select>
                                    </n-form-item>
                                    <n-form-item label="Pembagi" class="w-full">
                                        <n-select :options="optPembagi" value-field="v" label-field="l" tag filterable
                                            v-model:value="resPajak"></n-select>
                                    </n-form-item>
                                </div>
                                <div>
                                    <n-form-item label="Tanggal Mulai" >
                                        <n-date-picker placeholder="Tanggal Lahir"
                                            v-model:formatted-value="tgl_mulai" value-format="yyyy-MM-dd"
                                            format="dd-MM-yyyy" type="date" @update:value="handleTanggalMulai" />
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
                    <n-space>
                        <n-button type="primary" @click="handleSaveNewRekening" class="mt-4">Simpan</n-button>
                        <n-button type="error" @click="handleBatalNew" class="mt-4">Batal</n-button>
                    </n-space>
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
const periode = ref(null);
const nominal = ref(null);
const emit = defineEmits(['saved']);

const year = new Date().getFullYear(); // Misalnya: 2025
const prefix = `8${year}`; // Akan jadi '22025'
const optNoRekening = Array.from({ length: 10000 }, (_, i) => {
    const urut = String(i + 1).padStart(5, '0'); // Tambah leading zero sampai 5 digit
    const value = Number(`${prefix}${urut}`);
    return { v: value, l: value };
});

const optPeriode = [1, 3, 6, 12, 18, 24, 36].map((v) => ({
    v: v,
    l: v
}));
const optResPajak = ['Ya', 'Tidak'].map((v) => ({
    v: v,
    l: v
}));
const optRollOver = ['Tidak RO', 'RollOver Pokok', 'RollOver Pokok Bunga'].map((v) => ({
    v: v,
    l: v
}));
const optPembagi = [360, 365, 366].map((v) => ({
    v: v,
    l: v
}));

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
const handleBatalNew = async () => {
    emit('cancel', true);
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