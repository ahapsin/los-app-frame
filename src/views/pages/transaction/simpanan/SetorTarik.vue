<template>
    <div class="flex gap-4 w-full">
        <div class="w-full">
            <n-space vertical>
                <n-card :title="`Transaksi Simpanan`" :segmented="true" size="small">
                    <template #header-extra>
                        <n-space>
                            <n-button type="primary" @click="modalSetor = true">
                                <template #icon>
                                    <v-icon name="bi-plus-lg" />
                                </template>
                                Setor
                            </n-button>
                            <n-button type="warning" @click="modalTarik = true">
                                <template #icon>
                                    <v-icon name="bi-plus-lg" />
                                </template>
                                Tarik
                            </n-button>
                            <!-- <n-divider vertical></n-divider>
                            <n-button type="primary" @click="handleAdd">
                                <template #icon>
                                    <v-icon name="bi-plus-lg" />
                                </template>
                                Pindah Buku
                            </n-button> -->
                        </n-space>
                    </template>
                    <n-space vertical :size="12">
                        <n-data-table size="small" :columns="columnsAktifitas" :data="dataAktifitas"
                            :pagination="pagination" :loading="isLoading" />
                    </n-space>
                </n-card>
            </n-space>
        </div>
    </div>
    <n-modal v-model:show="modalSetor" :mask-closable="false">
        <n-card class="w-5/6" title="Setoran Tunai" :segmented="true" size="small">
            <n-card embedded>
                <div class="flex gap-4">
                    <n-form-item label="Tanggal Valuta">
                        <n-date-picker type="date" v-model:value="tgl_valuta"></n-date-picker>
                    </n-form-item>
                    <n-form-item label="Pilih Rekening" class="w-full">
                        <n-select filterable v-model:value="rekening" :options="selectOptions"
                            @update:value="handleUpdateValue" />
                    </n-form-item>
                </div>
                <n-space vertical>
                    <n-card v-if="selectedRekening">
                        <div class="grid grid-cols-1 md:grid-cols-6  bg-white">
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
                                <n-form-item label="Nominal" class="w-full">
                                    <n-input-number :parse="parse" :format="format" :show-button="false"
                                        v-model:value="nominal" size="large" />

                                </n-form-item>
                                <n-form-item label="Keterangan" class="w-full">
                                    <n-input autosize class="w-full" v-model:value="keterangan" />
                                </n-form-item>
                            </div>
                        </n-form>
                    </n-card>
                    <n-space>
                        <n-button type="primary" @click="handleSaveSetor">Simpan</n-button>
                        <n-button type="error" @click="handleBatalSetor">Batal</n-button>
                    </n-space>
                </n-space>
            </n-card>
        </n-card>
    </n-modal>
    <n-modal v-model:show="modalTarik" :mask-closable="false">
        <n-card class="w-5/6" title="Tarik Tunai" :segmented="true" size="small">
            <n-card embedded>
                <div class="flex gap-4">
                    <n-form-item label="Tanggal Valuta">
                        <n-date-picker type="date" v-model:value="tgl_valuta"></n-date-picker>
                    </n-form-item>
                    <n-form-item label="Pilih Rekening" class="w-full">
                        <n-select filterable v-model:value="rekening" :options="selectOptions"
                            @update:value="handleUpdateValue" />
                    </n-form-item>
                </div>
                <n-space vertical>
                    <n-card v-if="selectedRekening">
                        <div class="grid grid-cols-1 md:grid-cols-3  bg-white">
                            <div v-for="(value, key) in selectedRekening" :key="key">
                                <div class="flex flex-col">
                                    <strong class="capitalize">{{ formatKey(key) }}:</strong>
                                    <n-image v-if="key === 'dok_ktp'" width="20"
                                        :src="'https://www.qoalaplus.com/_nuxt/img/temp_ktp-placeholder.6551496.png'" />
                                    <label v-else>{{ value }}</label>
                                </div>
                            </div>
                        </div>
                    </n-card>
                    <n-card>
                        <n-form>
                            <div>
                                <n-form-item label="Nominal" class="w-full">
                                    <n-input-number :parse="parse" :format="format" :show-button="false"
                                        v-model:value="nominal" size="large" />
                                </n-form-item>
                                <n-form-item label="Keterangan" class="w-full">
                                    <n-input autosize class="w-full" v-model:value="keterangan" />
                                </n-form-item>
                            </div>
                        </n-form>
                    </n-card>
                    <n-space>
                        <n-button type="primary" @click="handleSaveTarik">Simpan</n-button>
                        <n-button type="error" @click="handleBatalTarik">Batal</n-button>
                    </n-space>
                </n-space>
            </n-card>
        </n-card>
    </n-modal>
    <n-modal v-model:show="modalPrint">
        <n-dialog title="Transaksi Berhasil" content="Apakah ingin mencetak buku tabungan?" negative-text="Tidak"
            positive-text="Ya" @positive-click="handlePositiveClick" @negative-click="modalPrint = false"
            @close="modalPrint = false" />
    </n-modal>
    <n-modal v-model:show="modalPinbuk">
        <n-card class="w-[80%]" title="Pindah Buku Antar Rekening" :segmented="true" size="small">
            <n-form-item label="Tanggal Valuta">
                <n-date-picker type="date" v-model:value="tgl_valuta"></n-date-picker>
            </n-form-item>
            <div class="flex gap-4 items-center">
                <n-card :segmented="true" embedded size="small" title="Rekening Debet">
                    <div class="flex gap-4">
                        <n-form-item label="Pilih Rekening" class="w-full">
                            <n-select filterable v-model:value="rekeningDebet" :options="selectOptions"
                                @update:value="handleUpdateValue" />
                        </n-form-item>
                    </div>
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
                </n-card>
                <v-icon name="bi-arrow-right" />
                <n-card :segmented="true" embedded size="small" title="Rekening Kredit">
                    <div class="flex gap-4">
                        <n-form-item label="Pilih Rekening" class="w-full">
                            <n-select filterable v-model:value="rekeningKredit" :options="selectOptions"
                                @update:value="handleUpdateValueKredit" />
                        </n-form-item>
                    </div>
                    <n-card v-if="selectedRekeningKredit">
                        <div class="grid grid-cols-1 md:grid-cols-3  bg-white">
                            <div v-for="(value, key) in selectedRekeningKredit" :key="key">
                                <div class="flex flex-col">
                                    <strong class="capitalize">{{ formatKey(key) }}:</strong>
                                    <n-image v-if="key === 'dok_ktp'" width="20"
                                        :src="'https://www.qoalaplus.com/_nuxt/img/temp_ktp-placeholder.6551496.png'" />
                                    <label v-else>{{ value }}</label>
                                </div>
                            </div>
                        </div>
                    </n-card>
                </n-card>
            </div>
            <n-card class="mt-4">
                <n-form>
                    <div>
                        <n-form-item label="Nominal" class="w-full">
                            <n-input-number :parse="parse" :format="format" :show-button="false" v-model:value="nominal"
                                size="large" />
                        </n-form-item>
                        <n-form-item label="Keterangan" class="w-full">
                            <n-input autosize class="w-full" />
                        </n-form-item>
                    </div>
                </n-form>
            </n-card>
            <n-space class="mt-4">
                <n-button type="primary" @click="handleSave">Simpan</n-button>
                <n-button type="error" @click="handleBatal">Batal</n-button>
            </n-space>
        </n-card>
    </n-modal>
</template>

<script setup>
import { onMounted } from 'vue';
import { useApi } from '../../../../helpers/axios';
import _ from 'lodash';
import moment from 'moment';

const modalSetor = ref(false);
const modalTarik = ref(false);
const modalPrint = ref(false);
const keterangan = ref();

const dataRekening = ref([]);
const dataAktifitas = ref([]);
const isLoading = ref(false);
const rekening = ref();
const tgl_valuta = ref(new Date());
const selectedRekening = ref(null);
const nominal = ref(null);
const selectOptions = ref([]);

const fetchData = async () => {
    selectedRekening.value = null;
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
const postData = async (e) => {
    const response = await useApi({
        url: 'http://localhost:3001/aktivitas',
        method: 'POST',
        data: e
    });
    if (!response.ok) {
        message.error("error");
        isLoading.value = false;
    } else {
        isLoading.value = false;
    }
}

const fetchDataAktifitas = async () => {
    isLoading.value = true;
    const response = await useApi({ url: 'http://localhost:3001/aktivitas' });
    if (!response.ok) {
        message.error("error");
        isLoading.value = false;
    } else {
        isLoading.value = false;
        dataAktifitas.value = response.data;
    }
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

const handleSaveSetor = async () => {
    const body = {
        tgl_transaksi: tgl_valuta.value,
        nomor_rekening: selectedRekening.value.no_rekening,
        atas_nama: selectedRekening.value.nama_pemilik,
        sandi_transaksi: '1001',
        type_transaksi: "kredit",
        nominal: nominal.value,
        saldo: selectedRekening.value.saldo,
        keterangan: keterangan.value,
        operator: "DEB",
        buku: 1,
        hal: 1,
        baris: 1
    }
    await postData(body);
    await fetchDataAktifitas();
    modalSetor.value = false;
    modalPrint.value = true;
}
const handleSaveTarik = async () => {
    const body = {
        tgl_transaksi: tgl_valuta.value,
        nomor_rekening: selectedRekening.value.no_rekening,
        atas_nama: selectedRekening.value.nama_pemilik,
        sandi_transaksi: '1002',
        type_transaksi: "debet",
        nominal: nominal.value,
        saldo: selectedRekening.value.saldo,
        keterangan: keterangan.value,
        operator: "DEB",
        buku: 1,
        hal: 1,
        baris: 1
    }
    await postData(body);
    await fetchDataAktifitas();
    modalTarik.value = false;

}
const handleBatalSetor = () => {
    modalSetor.value = false;
    selectedRekening.value = null;
    rekening.value = null;
    nominal.value = null;
    keterangan.value = null;
}

const handleBatalTarik = () => {
    modalTarik.value = false;
    selectedRekening.value = null;
    rekening.value = null;
}

const renderLabel = (option) => {
    return `${option.no_rekening} ${option.nama_pemilik} ${option.status}`;
}

const handleUpdateValue = (val, options) => {
    selectedRekening.value = _.find(dataRekening.value, { no_rekening: val });
}
function formatKey(key) {
    return key.replace(/_/g, ' ')
}
const columnsAktifitas = [
    {
        title: "Tgl Transaksi",
        key: "tgl_transaksi",
        ellipsis: {
            tooltip: true
        },
        render(row) {
            return h("div", moment(row.tgl_transaksi).fromNow());
        }
    },
    {
        title: "No Rekening",
        key: "nomor_rekening"
    },
    {
        title: "Pemilik",
        key: "atas_nama"
    },
    {
        title: "Sandi",
        key: "sandi_transaksi"
    },
    {
        title: "Nominal",
        key: "nominal",
        render(row) {
            return h("div", row.nominal.toLocaleString())
        }
    },
    {
        title: "Operator",
        key: "operator"
    },
];

onMounted(() => { fetchData(); fetchDataAktifitas(); });
</script>