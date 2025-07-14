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
                            <div class="grid grid-cols-1 md:grid-cols-4  bg-white">
                                <div v-for="(value, key) in selectedCustomer" :key="key">
                                    <div class="flex gap-2">
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
                                <div class="flex flex-col-3 gap-4">
                                    <n-form-item label="Nomor Rekening" class="w-full">
                                        <n-select :options="optNoRekening" value-field="v" label-field="l"></n-select>
                                    </n-form-item>
                                    <n-form-item label="Jenis Tabungan" class="w-full">
                                        <n-select v-model:value="noRekening" :options="optNoRekening" value-field="v"
                                            label-field="l"></n-select>
                                    </n-form-item>
                                    <n-form-item label="Setoran awal" class="w-full">
                                        <n-input />
                                    </n-form-item>
                                </div>
                                <n-button type="primary">simpan</n-button>
                            </n-form>
                        </n-card>
                    </n-space>

                </n-card>
            </n-space>
        </div>
        <n-modal v-model:show="modalState">
            <n-card :segmented="true" class="w-3/4" title="Tambahkan Customer Baru" size="small">
                <template #header-extra>
                    <n-button circle quartenary type="error" @click="modalState = false">
                        <v-icon name="bi-x-lg"></v-icon>
                    </n-button>
                </template>
                <new-customer />
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

const optNoRekening = Array.from({ length: 100 }, () => {
    const value = Math.floor(100000 + Math.random() * 900000);
    return { v: value, l: value };
});


const dataCustomer = ref([]);
const isLoading = ref(false);

const fetchData = async () => {
    isLoading.value = true;
    const response = await useApi({ url: 'http://localhost:3001/customers' });
    if (!response.ok) {
        message.error("error");
        isLoading.value = false;
    } else {
        isLoading.value = false;
        dataCustomer.value = response.data;
    }
}
const handleUpdateValue = (val, options) => {
    selectedCustomer.value = options;
}
const renderLabel = (option) => {
    return `${option.nama} ${option.no_identitas} `;
}
function formatKey(key) {
    return key.replace(/_/g, ' ')
}

onMounted(() => fetchData());
</script>