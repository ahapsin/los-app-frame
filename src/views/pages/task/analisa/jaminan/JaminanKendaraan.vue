
<template>
    <div class="pb-2" v-if="jaminan.tahun && tahunJaminanValidate >= 10">
        <n-alert type="warning">usia kendaraan {{ tahunJaminanValidate }} tahun</n-alert>
    </div>
    <div>
        <taksasi-select-state v-model:brand="jaminan.merk" v-model:tipe="jaminan.tipe" v-model:tahun="jaminan.tahun"
            v-model:pasar="jaminan.nilai" />
    </div>
    <n-form ref="formJaminan" :model="jaminan" require-mark-placement="right-hanging">
        <div class="md:flex gap-2">
            <n-form-item label="No Polisi" path="no_polisi" class="w-full">
                <n-input placeholder="No Polisi" @input="$event => (jaminan.no_polisi = $event.toUpperCase())"
                    v-model:value="jaminan.no_polisi" :disabled="props.viewMode" />
            </n-form-item>
            <n-form-item label="Warna" path="warna" class="w-full">
                <n-input placeholder="warna" v-model:value="jaminan.warna"
                    @input="$event => (jaminan.warna = $event.toUpperCase())" :disabled="props.viewMode" />
            </n-form-item>
            <n-form-item label="Tanggal Berlaku STNK" path="tgl_stnk" class="w-full">
                <n-date-picker placeholder="Tanggal Berlaku STNK" v-model:formatted-value="jaminan.tgl_stnk"
                    :disabled="props.viewMode" value-format="yyyy-MM-dd" format="dd-MM-yyyy" type="date"
                    class="w-full" />
            </n-form-item>
        </div>
        <div class="grid grid-cols-3 gap-2" v-if="me.me.jabatan != 'MCF' || props.viewMode">
            <n-form-item label="No BPKB" path="no_bpkb" class="w-full">
                <n-input placeholder="No BPKB" v-model:value="jaminan.no_bpkb"
                    @input="$event => (jaminan.no_bpkb = $event.toUpperCase())" :disabled="props.viewMode" />
            </n-form-item>
            <n-form-item label="Alamat BPKB" path="no_bpkb" class="w-full">
                <n-input placeholder="No BPKB" @input="$event => (jaminan.alamat_bpkb = $event.toUpperCase())"
                    v-model:value="jaminan.alamat_bpkb" :disabled="props.viewMode" />
            </n-form-item>
            <n-form-item label="Atas Nama BPKB" path="atas_nama" class="w-full">
                <n-input placeholder="Atas Nama" @input="$event => (jaminan.atas_nama = $event.toUpperCase())"
                    v-model:value="jaminan.atas_nama" :disabled="props.viewMode" />
            </n-form-item>
            <n-form-item label="No Rangka" path="no_rangka" class="w-full">
                <n-input placeholder="No Rangka" v-model:value="jaminan.no_rangka"
                    @input="$event => (jaminan.no_rangka = $event.toUpperCase())" :disabled="props.viewMode" />
            </n-form-item>
            <n-form-item label="No Mesin" path="no_mesin" class="w-full">
                <n-input placeholder="No Mesin" @input="$event => (jaminan.no_mesin = $event.toUpperCase())"
                    v-model:value="jaminan.no_mesin" :disabled="props.viewMode" />
            </n-form-item>
            <n-form-item label="No Faktur" path="no_faktur" class="w-full">
                <n-input placeholder="No Mesin" v-model:value="jaminan.no_faktur"
                    @input="$event => (jaminan.no_faktur = $event.toUpperCase())" :disabled="props.viewMode" />
            </n-form-item>
        </div>
    </n-form>
</template>
<script setup>
import { computed, reactive } from 'vue';
import { useMeStore } from '../../../../../stores/me';

const props = defineProps({
    def_data: Object,
    viewMode:Boolean,
});

const jaminan = reactive(props.def_data ? props.def_data.atr : {});
const tahunJaminanValidate = computed(() => {
      let tahun = new Date().getFullYear();
      let diff = tahun - jaminan.tahun;
      return diff;
});
const me=useMeStore();
// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits();
emit('childData', jaminan);
</script>
