<template>
    <div class="flex gap-4 w-full">
        <div class="w-full">
            <n-space vertical>
                <n-card :title="`Pindah Buku Antar Rekening`" :segmented="true" size="small">
                    <template #header-extra>
                        <n-space>
                            <n-button type="primary" @click="modalPinbuk = true">
                                <template #icon>
                                    <v-icon name="bi-plus-lg" />
                                </template>
                                Pindah Buku
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
    <n-modal v-model:show="modalPinbuk">
        <n-card class="w-2/4" title="Pindah Buku Antar Rekening" :segmented="true" size="small">
            <n-form-item label="Tanggal Valuta">
                <n-date-picker type="date"></n-date-picker>
            </n-form-item>
            <div class="flex gap-4 items-center">
                <n-card :segmented="true" embedded size="small" title="Rekening Debet">
                    <div class="flex gap-4">
                        <n-form-item label="Pilih Customer" class="w-full">
                            <n-select filterable />
                        </n-form-item>
                    </div>
                    <n-card>
                        [[fetch-data-customer]]
                    </n-card>

                </n-card>
                <v-icon name="bi-arrow-right"/>
                <n-card :segmented="true" embedded size="small" title="Rekening Kredit">
                    <div class="flex gap-4">
                        <n-form-item label="Pilih Customer" class="w-full">
                            <n-select filterable />
                        </n-form-item>
                    </div>
                    <n-card>
                        [[fetch-data-customer]]
                    </n-card>

                </n-card>
            </div>
            <n-card class="mt-4">
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
            <n-space class="mt-4">
                <n-button type="primary">Simpan</n-button>
                <n-button type="error">Batal</n-button>
            </n-space>
        </n-card>
    </n-modal>
</template>

<script setup>
const modalPinbuk = ref(false);
</script>