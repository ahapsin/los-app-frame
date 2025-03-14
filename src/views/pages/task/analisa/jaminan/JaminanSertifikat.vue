<template>
    <n-form ref="formJaminan" :model="jaminan" :rules="rulesJaminan" require-mark-placement="right-hanging">
        <div class="md:grid md:grid-cols-2 gap-2">
            <!-- <n-form-item label="Status Jaminan" path="status" class="w-full">
                <n-select filterable placeholder="Pilih Status"  
                    />
            </n-form-item> -->
            <n-form-item label="No Sertifikat" path="no_sertifikat" class="w-full">
                <n-input placeholder="no_sertifikat" @input="upCase" v-model:value="jaminan.no_sertifikat" />
            </n-form-item>
            <n-form-item label="Status Kepemilikan" path="Kepemilikan" class="w-full">
                <n-input placeholder="Kepemilikan" @input="upCase" v-model:value="jaminan.status_kepemilikan" />
            </n-form-item>
            <n-form-item label="IMB" path="imb" class="w-full">
                <n-input placeholder="IMB" @input="upCase" v-model:value="jaminan.imb" />
            </n-form-item>
            <n-form-item label="Luas Tanah" path="luas tanah" class="w-full">
                <n-input placeholder="Luas Tanah" @input="upCase" v-model:value="jaminan.luas_tanah" >
                    <template #suffix>
                        m2
                    </template>
                </n-input>
            </n-form-item>
            <n-form-item label="Luas Bangunan" path="luas tanah" class="w-full">
                <n-input placeholder="Luas Tanah" @input="upCase" v-model:value="jaminan.luas_bangunan" >
                    <template #suffix>
                        m2
                    </template>
                </n-input>
            </n-form-item>
            <n-form-item label="Lokasi" path="lokasi" class="w-full">
                <n-input placeholder="lokasi" @input="upCase" v-model:value="jaminan.lokasi" />
            </n-form-item>
            <component :is="SelectStateRegion"/>
            <n-form-item label="Atas Nama" path="lokasi" class="w-full">
                <n-input placeholder="atas nama" @input="upCase" v-model:value="jaminan.atas_nama" />
            </n-form-item>
            <n-form-item label="Nilai Jaminan" path="lokasi" class="w-full">
                <n-input-number  :parse="parse"
                :format="format" class="w-full" :show-button="false" placeholder="Nilai Jaminan" v-model:value="jaminan.nilai" default-value=0>
                </n-input-number>
            </n-form-item>
        </div>
    </n-form>
</template>
<script setup>
import { reactive } from 'vue';
const props = defineProps({
    def_data:Object,
});

const jaminan = reactive(props.def_data ? props.def_data.atr:{});

const emit = defineEmits();
emit('childData', jaminan);
const parse = (input) => {
  const nums = input.replace(/,/g, "").trim();
  if (/^\d+(\.(\d+)?)?$/.test(nums)) return Number(nums);
  return nums === "" ? null : Number.NaN;
};
const format = (value) => {
  if (value === null) return "";
  return value.toLocaleString("en-US");
};
</script>