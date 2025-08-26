<template>
    <n-card size="small" title="Informasi Data Pelanggan" :segmented="{ content: true, footer: 'soft' }">
        <n-form ref="formPelanggan" :label-placement="width <= 920 ? 'top' : 'top'"
            require-mark-placement="right-hanging" label-width="auto">
            <div class="flex w-full gap-2">
                <n-form-item label="Nama" path="nama" class="w-full">
                    <n-input placeholder="nama" v-model:value="modelCustomer.nama" />
                </n-form-item>
                <n-form-item label="Nama Panggilan" path="nama_panggilan" class="w-full">
                    <n-input placeholder="nama panggilan" v-model:value="modelCustomer.nama_panggilan" />
                </n-form-item>
            </div>

            <div class="flex w-full gap-2">
                <n-form-item label="Jenis kelamin" path="jenis_kelamin" class="w-full">
                    <n-select filterable v-model:value="modelCustomer.jenis_kelamin" label-field="l" value-field="v"
                        placeholder="Jenis Kelamin" :options="optJenisKelamin" />
                </n-form-item>
                <n-form-item label="Tempat Lahir" path="tempat_lahir" class="w-full">
                    <n-input placeholder="tempat lahir" />
                </n-form-item>
                <n-form-item label="Tanggal lahir" path="tgl_lahir" class="w-full">
                    <n-date-picker input-readonly placeholder="Tanggal Lahir" :disabled="props.viewMode"
                        value-format="yyyy-MM-dd" format="dd-MM-yyyy" type="date" class="w-full" />

                </n-form-item>
                <n-form-item label="Status Kawin" path="status_kawin" class="w-full">
                    <n-input-group>
                        <n-input v-if="viewMode" />
                        <n-select v-else filterable placeholder="Status Kawin" :options="optKawin" />
                    </n-input-group>
                </n-form-item>
            </div>

            <div class="flex w-full gap-2">
                <n-form-item label="Tipe Identitas" path="tipe_identitas" class="w-full">
                    <n-input v-if="viewMode" />
                    <n-select v-else filterable placeholder="Jenis Identitas" :options="optJenisIdentitas" />
                </n-form-item>
                <n-form-item label="No Identitas" path="no_identitas" class="w-full">
                    <n-input :allow-input="onlyAllowNumber" class="w-full" placeholder="No Identitas" show-count
                        :maxlength="16" />
                </n-form-item>

            </div>
        </n-form>

        <n-form ref="formPelangganPekerjaan" :label-placement="width <= 920 ? 'top' : 'top'"
            require-mark-placement="right-hanging" label-width="auto">
            <div class="flex gap-4">
                <n-form-item label="Pekerjaan" path="pekerjaan_id" class="w-full">
                    <n-select v-model:value="modelCustomer.pekerjaan" filterable placeholder="pekerjaan"
                        :options="optPekerjaan" />
                </n-form-item>
                <n-form-item label="Nama Ibu" path="nama_ibu" class="w-full">
                    <n-input v-model:value="modelCustomer.nama_ibu" />
                </n-form-item>

            </div>
            <div class="flex gap-2">
                <n-form-item label="Pendidikan" path="pendidikan" class="w-full">
                    <n-select v-model:value="modelCustomer.pendidikan" filterable placeholder="pendidikan"
                        :options="optPendidikan" />
                </n-form-item>
                <n-form-item label="No Handphone" path="telepon_selular" class="w-full">
                    <n-input v-model:value="modelCustomer.hp" :allow-input="onlyAllowNumber" maxlength="13" />
                </n-form-item>

            </div>
            <n-divider title-placement="left">Informasi Alamat Identitas</n-divider>
        </n-form>

        <n-form ref="formPelangganAlamatIdentitas" :label-placement="width <= 920 ? 'top' : 'top'"
            require-mark-placement="right-hanging" label-width="auto">
            <div class="flex gap-2">
                <n-form-item label="Alamat" class="w-full" path="alamat">
                    <n-input placeholder="Alamat" v-model:value="modelCustomer.alamat" />
                </n-form-item>
                <n-form-item label="RT" path="rt">
                    <n-input placeholder="RT" v-model:value="modelCustomer.rt" :allow-input="onlyAllowNumber"
                        :maxlength="3" />
                </n-form-item>
                <n-form-item label="RW" path="rw">
                    <n-input placeholder="RW" :allow-input="onlyAllowNumber" v-model:value="modelCustomer.rw"
                        :maxlength="3" />
                </n-form-item>
            </div>
            <select-state-region v-model:provinsi="modelCustomer.provinsi" v-model:kota="modelCustomer.kota"
                v-model:kecamatan="modelCustomer.kecamatan" v-model:desa="modelCustomer.kelurahan"
                v-model:kodepos="modelCustomer.kodepos" :viewMode />
        </n-form>

        <n-form ref="formPelangganAlamatTagih" :label-placement="width <= 920 ? 'top' : 'top'"
            require-mark-placement="right-hanging" label-width="auto">

            <n-divider title-placement="left">Dokumen Identitas</n-divider>
            <n-space justify="space-between">
                <n-space>
                    <file-upload title="KTP" endpoint="upload_saving_doc" type="ktp" :idapp="modelCustomer.no_ktp" />
                </n-space>
            </n-space>
        </n-form>
        <template #action>
            <n-space>
                <n-button type="primary" @click="handleSave">Simpan</n-button>
            </n-space>
        </template>
    </n-card>
</template>
<script setup>
import { useApi } from '../../../../helpers/axios';

const viewMode = ref(false);
const isLoading = ref(false);
const props = defineProps({
    viewMode: false,
})
const alamat = ref({
    provinsi: null,

});
const modelCustomer = ref({
    nama: null,
    nama_panggilan: null,
    jenis_kelamin: null,
    tempat_lahir: null,
    tanggal_lahir: null,
    status_kawin: null,
    tipe_identitas: null,
    no_identitas: null,
    nama_ibu: null,
    pekerjaan: null,
    pendidikan: null,
    hp: null,
    alamat: null,
    rt: null,
    rw: null,
    provinsi: null,
    kota: null,
    kecamatan: null,
    desa: null,
    kode_pos: null,
    dok_ktp: null
});

const optPendidikan = [
    "SEKOLAH DASAR",
    "SEKOLAH MENENGAH PERTAMA",
    "SEKOLAH MENENGAH ATAS",
    "DIPLOMA 1",
    "DIPLOMA 2",
    "DIPLOMA 3",
    "SARJANA S1",
].map((v) => ({
    label: v,
    value: v,
}));
const optJenisIdentitas = ["KTP"].map((v) => ({
    label: v,
    value: v,
}));
const optJenisKelamin = [
    {
        v: 'laki-laki',
        l: "laki-laki"
    }, {
        v: 'perempuan',
        l: "Perempuan"
    }
];
const optPekerjaan = [
    "BURUH HARIAN LEPAS",
    "BURUH PABRIK",
    "GURU",
    "MENGURUS RUMAH TANGGA",
    "NELAYAN",
    "PEDAGANG",
    "PEDAGANG KELONTONG",
    "PEDAGANG MAKANAN",
    "PEGAWAI SWASTA",
    "PELAJAR",
    "PETANI / PEKEBUN",
    "PNS",
    "SOPIR",
    "WIRASWASTA",
].map((v) => ({
    label: v,
    value: v,
}));
const optKawin = [
    "LAJANG",
    "MENIKAH",
    "JANDA/DUDA",
].map((v) => ({
    label: v,
    value: v,
}));
const postData = async (e) => {
    const response = await useApi({
        api: 'customers',
        method: 'POST',
        token:localStorage.getItem('token'),
        data: e
    });
    if (!response.ok) {
        message.error("error");
        isLoading.value = false;
    } else {
        isLoading.value = false;
    }
}

const emit = defineEmits();

const handleSave = async () => {
    await postData(modelCustomer.value);
    emit('saved', true);
}
</script>