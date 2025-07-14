<template>
    <div class="flex gap-4 w-full">
        <div class="w-full">
            <n-space vertical>
                <n-card :title="`Transaksi Setor / Tarik`" :segmented="true" size="small">
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
                        </n-space>
                    </template>
                    <n-space vertical :size="12" class="pt-4">
                        <n-data-table size="small" :columns="columns" :data="showData" :pagination="pagination"
                            :loading="isLoading" />
                    </n-space>
                </n-card>
            </n-space>
        </div>
    </div>
    <n-modal v-model:show="modalSetor">
        <n-card class="w-2/4" title="Setoran Tunai" :segmented="true" size="small">
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
                                    <n-input autosize class="w-full" />
                                </n-form-item>
                            </div>
                        </n-form>
                    </n-card>
                    <n-space>
                        <n-button type="primary">Simpan</n-button>
                        <n-button type="error" @click="handleBatalSetor">Batal</n-button>
                    </n-space>
                </n-space>
            </n-card>
        </n-card>
    </n-modal>
    <n-modal v-model:show="modalTarik">
        <n-card class="w-2/4" title="Tarik Tunai" :segmented="true" size="small">
            <n-card embedded>
                <div class="flex gap-4">
                    <n-form-item label="Tanggal Valuta">
                        <n-date-picker type="date"></n-date-picker>
                    </n-form-item>
                    <n-form-item label="Pilih Rekening" class="w-full">
                        <n-select filterable v-model:value="rekening" :options="dataRekening"
                            :render-label="renderLabel" label-field="nama_pemilik" value-field="id"
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
                                    <n-input size="large" />
                                </n-form-item>
                                <n-form-item label="Keterangan" class="w-full">
                                    <n-input autosize class="w-full" />
                                </n-form-item>
                            </div>
                        </n-form>
                    </n-card>
                    <n-space>
                        <n-button type="primary">Simpan</n-button>
                        <n-button type="error" @click="handleBatalTarik">Batal</n-button>
                    </n-space>
                </n-space>
            </n-card>
        </n-card>
    </n-modal>
</template>

<script setup>
import { onMounted } from 'vue';
import { useApi } from '../../../../helpers/axios';
import _ from 'lodash';

const modalSetor = ref(false);
const modalTarik = ref(false);

const dataRekening = ref([]);
const isLoading = ref(false);
const rekening = ref();
const tgl_valuta = ref(new Date());
const selectedRekening = ref(null);
const selectOptions = ref([]);

const fetchData = async () => {
    selectedRekening.value = null;
    isLoading.value = true;
    const response = await useApi({ url: 'http://localhost:3001/rekening' });
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

const parse = (input) => {
    const nums = input.replace(/,/g, "").trim();
    if (/^\d+(\.(\d+)?)?$/.test(nums)) return Number(nums);
    return nums === "" ? null : Number.NaN;
};
const format = (value) => {
    if (value === null) return "";
    return value.toLocaleString("en-US");
};

const handleBatalSetor = () => {
    modalSetor.value = false;
    selectedRekening.value = null;
    rekening.value = null;
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

onMounted(() => fetchData());
</script>