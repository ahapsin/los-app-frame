<template>
    <div class="flex gap-4 w-full">
        <div class="w-full">

            <n-space vertical>
                <n-card :title="`Buka Rekening Baru`" :segmented="true" size="small">
                    <template #header-extra>
                        <n-space class="!gap-1">
                            <!-- <div class="hidden md:flex">
                                <n-button>
                                    <template #icon>
                                        <n-icon>
                                            <download-icon />
                                        </n-icon>
                                    </template>
<strong class="hidden md:!block">download</strong>
</n-button>
</div> -->
                            <div class="md:hidden">
                                <n-button>
                                    <template #icon>
                                        <n-icon>
                                            <download-icon />
                                        </n-icon>
                                    </template>
                                </n-button>
                            </div>
                            <div class="hidden md:flex gap-2">
                                <n-dropdown :options="optAction">
                                    <n-button circle quaternary>
                                        <v-icon name="bi-three-dots-vertical" />
                                    </n-button>
                                </n-dropdown>
                            </div>
                            <div class=" md:hidden">
                                <n-button type="primary" @click="handleAdd">
                                    <template #icon>
                                        <n-icon>
                                            <add-icon />
                                        </n-icon>
                                    </template>
                                </n-button>
                            </div>
                        </n-space>
                    </template>
                    <n-space vertical>
                        <n-card embedded>
                            <n-form-item label="Pilih Customer" class="w-1/2">
                                <n-select filterable/>
                                <n-divider vertical></n-divider>
                                <n-button type="primary" @click="modalState = true">
                                    <template #icon>
                                        <v-icon name="bi-plus-lg"></v-icon>
                                    </template>
                                    customer</n-button>
                            </n-form-item>
                        </n-card>
                        <n-card>
                        [[fetch-data-customer]]
                        </n-card>
                        <n-card>
                            <n-form>
                                <div class="flex flex-col-3 gap-4">
                                    <n-form-item label="Nomor Rekening" class="w-full">
                                        <n-select  :options="optNoRekening" value-field="v"
                                            label-field="l"></n-select>
                                    </n-form-item>
                                    <n-form-item label="Jenis Tabungan" class="w-full">
                                        <n-select v-model:value="noRekening" :options="optNoRekening" value-field="v"
                                            label-field="l"></n-select>
                                    </n-form-item>
                                    <n-form-item label="Setoran awal" class="w-full">
                                        <n-input/>
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

        <div v-if="group" class="w-1/3">

            <n-card size="small" title="Group Menu">
                <template #header-extra>
                    <n-space>
                        <n-button type="primary">
                            <template #icon>
                                <v-icon name="bi-plus-circle"></v-icon>
                            </template>
                            Group</n-button>
                        <n-button circle secondary @click="group = !group">
                            <template #icon>
                                <v-icon name="bi-x"></v-icon>
                            </template>
                        </n-button>
                    </n-space>
                </template>
                group menu
            </n-card>
        </div>
    </div>
</template>
<script setup>
import NewCustomer from "./NewCustomer.vue"
const modalState = ref(false);
const optNoRekening = Array.from({ length: 100 }, () => {
    const value = Math.floor(100000 + Math.random() * 900000);
    return { v: value, l: value };
});

console.log(optNoRekening);


</script>