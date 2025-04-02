<template>
    <n-form ref="formJaminan" :model="jaminan" :rules="rulesJaminan" require-mark-placement="right-hanging">
        <div class="md:grid md:grid-cols-2 gap-2">
            <n-form-item label="Status Jaminan" path="status" class="w-full">
                <n-select filterable placeholder="Pilih Status"
                    />
            </n-form-item>
            <n-form-item label="Kode Emas" path="no_billyet" class="w-full">
                <n-input placeholder="Kode Emas" @input="upCase" v-model:value="jaminan.kode_emas" />
            </n-form-item>
            <n-form-item label="Berat" path="no_billyet" class="w-full">
                <n-input placeholder="berat" @input="upCase" v-model:value="jaminan.berat">
                    <template #suffix> gram</template>
                </n-input>
            </n-form-item>
            <n-form-item label="Nominal" path="nominal" class="w-full">
                <n-input placeholder="Nominal" @input="upCase" v-model:value="jaminan.nilai" >
                </n-input>
            </n-form-item>
            <n-form-item label="Atas Nama" path="atas_nama" class="w-full">
                <n-input placeholder="atas nama" @input="upCase" v-model:value="jaminan.atas_nama" />
            </n-form-item>

        </div>

    </n-form>
</template>
<script setup>
import { reactive } from 'vue';
// const emas = {
//     kode_emas: null,
//     berat: null,
//     unit: null,
//     nilai: null,
//     atas_nama: null,
// };
const jaminan = reactive({});
const emit = defineEmits();
emit('childData', jaminan);
</script>
