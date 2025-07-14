<<template>
    <div class="flex gap-4 w-full">
        <div class="w-full">
            <n-space vertical>
                <n-card :title="`Cetak Buku Rekening`" :segmented="true" size="small">
                  
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
                        <n-date-picker type="date"></n-date-picker>
                    </n-form-item>
                    <n-form-item label="Pilih Customer" class="w-full">
                        <n-select filterable />
                    </n-form-item>
                </div>
                <n-space vertical>
                    <n-card>
                        [[fetch-data-customer]]
                    </n-card>
                    <n-card>
                        <n-form>
                            <div>
                                <n-form-item label="Nominal" class="w-full">
                                    <n-input size="large"/>
                                </n-form-item>
                                <n-form-item label="Keterangan" class="w-full">
                                    <n-input autosize class="w-full"/>
                                </n-form-item>
                            </div>
                        </n-form>
                    </n-card>
                    <n-space>
                        <n-button type="primary">Simpan</n-button>
                        <n-button type="error">Batal</n-button>
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
                    <n-form-item label="Pilih Customer" class="w-full">
                        <n-select filterable />
                    </n-form-item>
                </div>
                <n-space vertical>
                    <n-card>
                        [[fetch-data-customer]]
                    </n-card>
                    <n-card>
                        <n-form>
                            <div>
                                <n-form-item label="Nominal" class="w-full">
                                    <n-input size="large"/>
                                </n-form-item>
                                <n-form-item label="Keterangan" class="w-full">
                                    <n-input autosize class="w-full"/>
                                </n-form-item>
                            </div>
                        </n-form>
                    </n-card>
                    <n-space>
                        <n-button type="primary">Simpan</n-button>
                        <n-button type="error">Batal</n-button>
                    </n-space>
                </n-space>
            </n-card>
        </n-card>
    </n-modal>
</template>

<script setup>
const modalSetor = ref(false);
const modalTarik = ref(false);
</script>>