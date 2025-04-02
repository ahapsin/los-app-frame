<template>
    <n-form ref="formJaminan" :model="jaminan" :rules="rulesJaminan" require-mark-placement="right-hanging">
        <div class="md:grid md:grid-cols-2 gap-2">
            <n-form-item label="Status Jaminan" path="status" class="w-full">
                <n-select filterable placeholder="Pilih Status"
                    />
            </n-form-item>
            <n-form-item label="No Deposito" path="no_billyet" class="w-full">
                <n-input placeholder="No Billyet" @input="upCase" v-model:value="jaminan.no_billyet" />
            </n-form-item>
            <n-form-item label="Tanggal Valuta" path="tanggal valuta" class="w-full">
                <n-date-picker
                v-model:value="jaminan.tgl_valuta"
                type="month"
                 :default-value="Date.now()"
                format="y MMM"
                month-format="MMM"
                clearable
              />
            </n-form-item>
            <n-form-item label="jangka Waktu" path="imb" class="w-full">
                <n-input placeholder="Jangka Waktu" @input="upCase" v-model:value="jaminan.jangka_waktu" />
            </n-form-item>
            <n-form-item label="Nominal" path="lokasi" class="w-full">
                <n-input placeholder="Nominal" @input="upCase" v-model:value="jaminan.nilai" >
                </n-input>
            </n-form-item>
            <n-form-item label="Atas Nama" path="lokasi" class="w-full">
                <n-input placeholder="atas nama" @input="upCase" v-model:value="jaminan.atas_nama" />
            </n-form-item>

        </div>

    </n-form>
</template>
<script setup>
import { ref } from 'vue';
const jaminan = ref([]);
const emit = defineEmits();
emit('childData', jaminan);
</script>
