<template>


    <n-card class="w-full" title="Tutup Rekening" :segmented="true" size="small">
        <n-card embedded>
            <div class="flex gap-4">
                <n-form-item label="Tanggal Valuta">
                    <n-date-picker type="date" v-model:value="tgl_valuta"></n-date-picker>
                </n-form-item>
                <n-form-item label="Pilih No Deposito" class="w-full">
                    <n-select filterable v-model:value="rekening" :options="selectOptions"
                        @update:value="handleUpdateValue" />
                </n-form-item>
            </div>
            <n-space vertical>
                <n-card v-if="selectedRekening">
                    <div class="grid grid-cols-1 md:grid-cols-3  bg-white">
                        <div v-for="(value, key) in selectedRekening" :key="key">
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
                <n-card>
                    <n-form>
                        <div>
                            <n-form-item label="Keterangan" class="w-full">
                                <n-input autosize class="w-full" v-model:value="keterangan" />
                            </n-form-item>
                        </div>
                    </n-form>
                </n-card>
                <n-space>
                    <n-button type="primary" @click="handleSave">Simpan</n-button>
                    <n-button type="error" @click="handleBatal">Batal</n-button>
                </n-space>
            </n-space>
        </n-card>
    </n-card>
</template>
<script setup>
import _ from 'lodash';
import { useApi } from '../../../../helpers/axios';

const dataRekening = ref([]);
const dataRekeningClosed = ref([]);
const isLoading = ref(false);
const tgl_valuta = ref(new Date);
const rekening = ref();
const keterangan = ref();
const selectedRekening = ref(null);
const selectOptions = ref([]);
const modalRekening = ref(false);

const fetchData = async () => {
    isLoading.value = true;
    const response = await useApi({ url: 'http://localhost:3001/closed_rekening' });
    if (!response.ok) {
        message.error("error");
        isLoading.value = false;
    } else {
        isLoading.value = false;
        dataRekeningClosed.value = response.data;
    }
}
const fetchRekening = async () => {
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
        dataRekening.value = response.data;
        selectOptions.value = response.data.map(row => ({
            label: `${row.no_rekening} ${row.nama_pemilik}`,
            value: row.no_rekening,
            disabled: row.status === 'inactive'
        }));
    }
}
const postClosedRekening = async (e) => {
    isLoading.value = true;
    const response = await useApi({
        url: 'http://localhost:3001/closed_rekening',
        method: 'POST',
        data: e
    });
    if (!response.ok) {
        message.error("error");
        isLoading.value = false;
    } else {
        isLoading.value = false;
    };
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
        title: "Tanggal Pencairan",
        key: "tgl_tutup"
    },
    {
        title: "Keterangan",
        key: "keterangan"
    },
];

const handleAdd = () => {
    modalRekening.value = true;
    fetchRekening();
}
const handleSave = async () => {
    const body = {
        no_rekening: selectedRekening.value.no_rekening,
        alamat: selectedRekening.value.alamat,
        nama_pemilik: selectedRekening.value.nama_pemilik,
        nama_ibu_kandung: selectedRekening.value.nama_ibu_kandung,
        cabang: selectedRekening.value.cabang,
        no_identitas: selectedRekening.value.no_identitas,
        tgl_tutup: tgl_valuta.value,
        saldo: selectedRekening.value.saldo,
        keterangan: keterangan.value
    }
    await postClosedRekening(body);
    await fetchData();
    modalRekening.value = false;
}

const handleBatal = () => {
    modalRekening.value = false;
    selectedRekening.value = null;
    rekening.value = null;
    emit('cancel');
}
const emit = defineEmits();
const handleUpdateValue = (val, options) => {
    selectedRekening.value = _.find(dataRekening.value, { no_rekening: val });
}
function formatKey(key) {
    return key.replace(/_/g, ' ')
}
onMounted(() => fetchData());
</script>