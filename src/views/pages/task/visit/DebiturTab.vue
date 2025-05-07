<template>
    <n-scrollbar class="border p-2 rounded-xl">
        <n-form ref="formPelanggan" :model="pelanggan" :rules="rulesPelanggan" require-mark-placement="right-hanging">
            <n-collapse accordion :header="false">
                <n-collapse-item title="DATA PRIBADI PEMOHON" class="item-collapse">
                    <div class="md:flex gap-2">
                        <n-form-item label="Status Pemohon " path="status_pemohon" class="w-full">
                            <n-select :options="optSttsPemohon" label-field="label" value-field="value"
                                v-model:value="order.stts_pemohon" />
                        </n-form-item>
                        <n-form-item label="Hubungan dengan BPRCF " path="status_pemohon" class="w-full">
                            <n-select :options="optHubBPRCF" label-field="label" value-field="value"
                                v-model:value="order.hub_kantor" />
                        </n-form-item>
                        <n-form-item label="Jenis Kelamin " path="jenis_kelamin" class="w-full">
                            <n-select :options="optJenisKelamin" label-field="label" value-field="value"
                                v-model:value="order.jenis_kelamin" />
                        </n-form-item>
                        <n-form-item label="Agama " path="agama" class="w-full">
                            <n-select :options="optAgama" label-field="label" value-field="value"
                                v-model:value="order.agama" />
                        </n-form-item>
                    </div>
                    <div class="flex gap-2">
                        <n-form-item label="No KTP" path="no_ktp" class="w-full">
                            <div class="flex gap-2">
                                <n-input :show-button="false" :allow-input="onlyAllowNumber" placeholder="NO KTP"
                                    v-model:value="pelanggan.no_ktp" :loading="loadingKTP" @change="handleKtp"
                                    class="w-full" maxlength="16" clearable />
                                <n-date-picker placeholder="Tanggal Terbit"
                                    v-model:formatted-value="pelanggan.tgl_lahir" value-format="yyyy-MM-dd"
                                    format="dd-MM-yyyy" type="date" @update:value="handleTanggalTerbit" />
                                <n-date-picker placeholder="Tanggal Terbit"
                                    v-model:formatted-value="pelanggan.tgl_lahir" value-format="yyyy-MM-dd"
                                    format="dd-MM-yyyy" type="date" @update:value="handleTanggalTerbit" />
                            </div>
                        </n-form-item>
                        <n-form-item label="No KK" path="no_kk" class="w-full">
                            <n-input :allow-input="onlyAllowNumber" placeholder="No Kartu Keluarga"
                                v-model:value="pelanggan.no_kk" maxlength="16" />
                        </n-form-item>
                    </div>
                    <div class="flex gap-2">
                        <n-form-item label="Status Kawin" path="stts_kawin" class="w-full">
                            <n-select :options="optSttsKawin" label-field="label" value-field="value"
                                v-model:value="order.stts_kawin" />
                        </n-form-item>
                        <n-form-item label="Jumlah Tanggungan" path="jml_tanggungan" class="w-full">
                            <n-input :allow-input="onlyAllowNumber" placeholder="No Kartu Keluarga"
                                v-model:value="pelanggan.jml_tanggunan" maxlength="16" />
                        </n-form-item>
                    </div>
                    <div class="md:flex gap-2">
                        <n-form-item label="Nama" path="nama" class="w-full">
                            <n-input placeholder="Nama" v-model:value="pelanggan.nama"
                                @input="$event => (pelanggan.nama = $event.toUpperCase())" />
                        </n-form-item>
                        <n-form-item label="Tempat lahir" path="tmpt_lahir" class="w-full">
                            <n-input placeholder="Tempat Lahir" v-model:value="pelanggan.tmpt_lahir" />
                        </n-form-item>
                        <n-form-item label="Tanggal lahir" path="tgl_lahir" class="w-full">
                            <div class="w-full">
                                <n-date-picker placeholder="Tanggal Lahir" class="w-full"
                                    v-model:formatted-value="pelanggan.tgl_lahir" value-format="yyyy-MM-dd"
                                    format="dd-MM-yyyy" type="date" @update:value="handleTanggalLahir" />
                                <span
                                    class="absolute text-xs text-orange-500 bg-orange-50 w-full p-0.5 mt-2 animate-pulse"
                                    v-show="notifUsia">{{ noteUsia }}</span>
                            </div>
                        </n-form-item>
                        <n-form-item label="Pendidikan Terakhir" path="pend_ahir" class="w-full">
                            <n-select :options="optPendAhir" label-field="label" value-field="value"
                                v-model:value="order.pend_ahir" />
                        </n-form-item>
                        <n-form-item label="Telepon Rumah" path="telp_rumah" class="w-full">
                            <n-input placeholder="No Handphone" :allow-input="onlyAllowNumber"
                                v-model:value="pelanggan.telp_rumah" maxlength="13" />
                        </n-form-item>
                        <n-form-item label="No Handphone" path="no_hp" class="w-full">
                            <n-input placeholder="No Handphone" :allow-input="onlyAllowNumber"
                                v-model:value="pelanggan.no_hp" maxlength="13" />
                        </n-form-item>
                    </div>
                    <div class="flex flex-col md:flex-row gap-2 gap-x-2">
                        <n-form-item label="Alamat" path="alamat" class="w-full">
                            <n-input placeholder="Alamat" v-model:value="pelanggan.alamat"
                                @input="$event => (pelanggan.alamat = $event.toUpperCase())" class="w-full" />
                        </n-form-item>

                        <n-form-item path="rt">
                            <n-input-group>
                                <n-input placeholder="RT" v-model:value="pelanggan.rt" :allow-input="onlyAllowNumber"
                                    maxlength="3" />
                                <n-input placeholder="RW" v-model:value="pelanggan.rw" :allow-input="onlyAllowNumber"
                                    maxlength="3" />
                            </n-input-group>
                        </n-form-item>
                    </div>
                    <div>
                        <select-state-region v-model:provinsi="pelanggan.provinsi" v-model:kota="pelanggan.kota"
                            v-model:kecamatan="pelanggan.kecamatan" v-model:desa="pelanggan.kelurahan"
                            v-model:kodepos="pelanggan.kode_pos" />
                    </div>
                    <div class="flex gap-2">
                        <n-form-item label="Status Tempat Tinggal" path="stts_tmp_tinggal" class="w-full">
                            <n-select :options="optSttsTinggal" label-field="label" value-field="value"
                                v-model:value="order.stts_tmp_tinggal" />
                        </n-form-item>
                        <n-form-item label="Lama Tinggal" path="nm_ibu" class="w-full">
                            <n-input placeholder="Lama Tinggal" :allow-input="onlyAllowNumber"
                                v-model:value="pelanggan.lama_tinggal" maxlength="13">
                                <template #suffix>tahun</template>
                            </n-input>
                        </n-form-item>
                        <n-form-item label="Nama Gadis Ibu Kandung" path="nm_ibu" class="w-full">
                            <n-input placeholder="Nama Gadis Ibu Kandung" :allow-input="onlyAllowNumber"
                                v-model:value="pelanggan.nm_ibu" maxlength="13" />
                        </n-form-item>
                        <n-form-item label="NPWP" path="opt_npwp" class="w-full">
                            <n-select :options="optNpwp" label-field="label" value-field="value"
                                v-model:value="order.opt_npwp" />
                            <n-input placeholder="no npwp" v-model:value="no_npwp" v-if="order.opt_npwp === 'ada'" />
                        </n-form-item>

                    </div>
                    <n-divider title-placement="left"> UPLOAD DOKUMEN IDENTITAS</n-divider>
                    <div class="flex flex-col md:flex-row gap-2">
                        <file-upload title="KTP" :def_value="findDocByType(pelanggan.dokumen_indentitas, 'ktp')"
                            endpoint="image_upload_prospect" type="ktp" :idapp="dynamicForm.id" />
                        <file-upload title="KK" :def_value="findDocByType(pelanggan.dokumen_indentitas, 'kk')"
                            endpoint="image_upload_prospect" type="kk" :idapp="dynamicForm.id" />
                        <file-upload title="KTP Pasangan" endpoint="image_upload_prospect" type="ktp_pasangan"
                            :def_value="findDocByType(pelanggan.dokumen_indentitas, 'ktp_pasangan')"
                            :idapp="dynamicForm.id" />
                    </div>
                </n-collapse-item>
                <n-collapse-item title="DATA PEKERJAAN / USAHA" class="item-collapse">
                    <div class="flex gap-2">
                        <n-form-item label="Pekerjaan " path="pekerjaan" class="w-full">
                            <n-select :options="optPekerjaan" label-field="label" value-field="value"
                                v-model:value="order.opt_pekerjaan" />
                        </n-form-item>
                        <n-form-item label="Nama Perusahaan" path="nm_perusahaan" class="w-full">
                            <n-input placeholder="Nama Perusahaan" v-model:value="pelanggan.nm_perusahaan"
                                maxlength="16" />
                        </n-form-item>
                        <n-form-item label="Bidang Usaha" path="bidang_usaha" class="w-full">
                            <n-input placeholder="Bidang Usaha" v-model:value="pelanggan.bidang_usaha" maxlength="16" />
                        </n-form-item>
                        <n-form-item label="Jabatan" path="jabatan" class="w-full">
                            <n-input placeholder="Jabatan" v-model:value="pelanggan.jabatan_usaha" maxlength="16" />
                        </n-form-item>

                    </div>
                    <div class="flex gap-2">
                        <n-form-item label="Alamat Perusahaan" path="alamat_perusahaan" class="w-full">
                            <n-input placeholder="Alamat Perusahaan" v-model:value="pelanggan.alamat_perusahaan"
                                maxlength="16" />
                        </n-form-item>
                        <n-form-item label="Telepon Perusahaan" path="telepon_perusahaan" class="w-full">
                            <n-input placeholder="Telepon Perusahaan" v-model:value="pelanggan.telepon_perusahaan"
                                maxlength="16" />
                        </n-form-item>
                        <n-form-item label="HP" path="hp_perusahaan" class="w-full">
                            <n-input placeholder="HP" v-model:value="pelanggan.hp_perusahaan" maxlength="16" />
                        </n-form-item>
                        <n-form-item label="Penghasilan Bersih" path="hp_perusahaan" class="w-full">
                            <n-input placeholder="Penghasilan Bersih" v-model:value="pelanggan.penghasilan_bersih"
                                maxlength="16">
                                <template #prefix>Rp.</template>
                                <template #suffix>/bulan</template>
                            </n-input>
                        </n-form-item>
                    </div>
                    <n-form-item label="Usaha Sampingan" path="usaha_sampingan" class="w-full">
                        <n-space>
                            <n-input placeholder="usaha sampingan" v-model:value="pelanggan.usaha_sampingan"
                                maxlength="16" />
                            <n-input placeholder="lama usaha / bekerja" v-model:value="pelanggan.usaha_sampingan"
                                maxlength="16" />
                            <n-input placeholder="Penghasilan Bersih" v-model:value="pelanggan.penghasilan_bersih"
                                maxlength="16">
                                <template #prefix>Rp.</template>
                                <template #suffix>/bulan</template>
                            </n-input>
                        </n-space>
                    </n-form-item>
                </n-collapse-item>
                <n-collapse-item title="DATA SUAMI / ISTRI" class="item-collapse">
                    <div class="flex gap-2">
                        <n-form-item label="Nama" path="nama" class="w-full">
                            <n-input placeholder="Nama" v-model:value="pelanggan.nama"
                                @input="$event => (pelanggan.nama = $event.toUpperCase())" />
                        </n-form-item>
                        <n-form-item label="Jenis Kelamin " path="jenis_kelamin" class="w-full">
                            <n-select :options="optJenisKelamin" label-field="label" value-field="value"
                                v-model:value="order.jenis_kelamin" />
                        </n-form-item>
                        <n-form-item label="Tempat lahir" path="tmpt_lahir" class="w-full">
                            <n-input placeholder="Tempat Lahir" v-model:value="pelanggan.tmpt_lahir" />
                        </n-form-item>
                        <n-form-item label="Tanggal lahir" path="tgl_lahir" class="w-full">
                            <div class="w-full">
                                <n-date-picker placeholder="Tanggal Lahir" class="w-full"
                                    v-model:formatted-value="pelanggan.tgl_lahir" value-format="yyyy-MM-dd"
                                    format="dd-MM-yyyy" type="date" @update:value="handleTanggalLahir" />
                                <span
                                    class="absolute text-xs text-orange-500 bg-orange-50 w-full p-0.5 mt-2 animate-pulse"
                                    v-show="notifUsia">{{ noteUsia }}</span>
                            </div>
                        </n-form-item>
                        <n-form-item label="Pendidikan Terakhir" path="pend_ahir" class="w-full">
                            <n-select :options="optPendAhir" label-field="label" value-field="value"
                                v-model:value="order.pend_ahir" />
                        </n-form-item>
                    </div>
                    <n-form-item label="No KTP" path="no_ktp" class="w-full">
                        <div class="flex gap-2">
                            <n-input :show-button="false" :allow-input="onlyAllowNumber" placeholder="NO KTP"
                                v-model:value="pelanggan.no_ktp" :loading="loadingKTP" @change="handleKtp"
                                class="w-full" maxlength="16" clearable />
                            <n-date-picker placeholder="Tanggal Terbit" class="w-full"
                                v-model:formatted-value="pelanggan.tgl_lahir" value-format="yyyy-MM-dd"
                                format="dd-MM-yyyy" type="date" @update:value="handleTanggalTerbit" />
                            <n-date-picker placeholder="Tanggal Terbit" class="w-full"
                                v-model:formatted-value="pelanggan.tgl_lahir" value-format="yyyy-MM-dd"
                                format="dd-MM-yyyy" type="date" @update:value="handleTanggalTerbit" />
                        </div>
                    </n-form-item>
                    <div class="flex gap-2">
                        <n-form-item label="Pekerjaan " path="pekerjaan" class="w-full">
                            <n-select :options="optPekerjaan" label-field="label" value-field="value"
                                v-model:value="order.opt_pekerjaan" />
                        </n-form-item>
                        <n-form-item label="Nama Perusahaan" path="nm_perusahaan" class="w-full">
                            <n-input placeholder="Nama Perusahaan" v-model:value="pelanggan.nm_perusahaan"
                                maxlength="16" />
                        </n-form-item>
                        <n-form-item label="Bidang Usaha" path="bidang_usaha" class="w-full">
                            <n-input placeholder="Bidang Usaha" v-model:value="pelanggan.bidang_usaha" maxlength="16" />
                        </n-form-item>
                        <n-form-item label="Jabatan" path="jabatan" class="w-full">
                            <n-input placeholder="Jabatan" v-model:value="pelanggan.jabatan_usaha" maxlength="16" />
                        </n-form-item>
                    </div>
                    <div class="flex gap-2">
                        <n-form-item label="Alamat Perusahaan" path="alamat_perusahaan" class="w-full">
                            <n-input placeholder="Alamat Perusahaan" v-model:value="pelanggan.alamat_perusahaan"
                                maxlength="16" />
                        </n-form-item>
                        <n-form-item label="Telpon Perusahaan" path="telepon_perusahaan" class="w-full">
                            <n-input placeholder="Telepon Perusahaan" v-model:value="pelanggan.telepon_perusahaan"
                                maxlength="16" />
                        </n-form-item>
                        <n-form-item label="HP" path="hp_perusahaan" class="w-full">
                            <n-input placeholder="HP" v-model:value="pelanggan.hp_perusahaan" maxlength="16" />
                        </n-form-item>
                        <n-form-item label="Penghasilan Bersih" path="hp_perusahaan" class="w-full">
                            <n-input placeholder="Penghasilan Bersih" v-model:value="pelanggan.penghasilan_bersih"
                                maxlength="16">
                                <template #prefix>Rp.</template>
                                <template #suffix>/bulan</template>
                            </n-input>
                        </n-form-item>
                    </div>
                </n-collapse-item>
            </n-collapse>
        </n-form>
    </n-scrollbar>
</template>
<script setup>
import { v4 as uuidv4 } from "uuid";
import { onMounted, reactive, ref } from "vue";

import { useMessage } from "naive-ui";


import _ from "lodash";
import { computed } from "vue";
import { useJaminanStore } from "../../../../stores/jaminan";

const message = useMessage();
const uuid = uuidv4();
const current = ref(1);
const loading = ref(false);
const tipeAngsuran = ref("bulanan");



const jaminanStore = useJaminanStore();
const userToken = localStorage.getItem("token");
const formOrder = ref(null);
const formPelanggan = ref(null);




const statusInformasiOrder = ref(null);
const statusDataPelanggan = ref(null);
const statusDataJaminan = ref(null);
const statusDataSurvey = ref(null);

const optSttsPemohon = ["Perorangan", "PT", "Lainnya"].map((v) => ({
    label: v,
    value: v.toLowerCase(),
}));
const optHubBPRCF = ["Pihak Terkait", "Pihak tidak terkait"].map((v) => ({
    label: v,
    value: v.toLowerCase(),
}));

const optJenisKelamin = ["Laki-laki", "Perempuan"].map((v) => ({
    label: v,
    value: v,
}));
const optSttsTinggal = ["Pribadi", "Keluarga", "Sewa / Kontrak", "Dinas", "Lainnya"].map((v) => ({
    label: v,
    value: v,
}));
const optNpwp = ["Tidak Ada", 'Ada'].map((v) => ({
    label: v,
    value: v.toLowerCase(),
}));
const optPendAhir = ["SD", "SMP", "SMA", "D3", "S1/S2"].map((v) => ({
    label: v,
    value: v,
}));
const optAgama = ["ISLAM", "KRISTEN", "HINDU", "BUDHA", "Lainnya"].map((v) => ({
    label: v,
    value: v,
}));
const optSttsKawin = ["Belum Nikah", "Menikah", "Janda / Duda"].map((v) => ({
    label: v,
    value: v,
}));
const optPekerjaan = ["Pegawai Negeri", "Pegawai Swasta", "Wiraswasta", "Profesional", "Tidak Bekerja"].map((v) => ({
    label: v,
    value: v,
}));

const optSektor = [
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
const order = reactive({
    tujuan_kredit: null,
    plafond: null,
    tenor: 6,
    bunga: 0,
    bunga_tahunan: computed(() => (order.bunga * 12).toFixed(2)),
    angsuran: computed(() => (Math.round((order.plafond * order.bunga / 100) * order.tenor + order.plafond) / order.tenor)),
    category: null,
    jenis_angsuran: "bulanan",
});
const initPelanggan = {
    no_kk: "",
    nama: "",
    no_hp: "",
    tgl_lahir: null,
    name: "",
    alamat: "",
    rt: "",
    rw: "",
    provinsi: "",
    kota: "",
    kecamatan: "",
    kelurahan: "",
};
const pelanggan = reactive({ ...initPelanggan });
var dt = new Date();
let year = dt.getFullYear();
let month = (dt.getMonth() + 1).toString().padStart(2, "0");
let day = dt.getDate().toString().padStart(2, "0");
const survey = reactive({
    lama_bekerja: "",
    penghasilan_pribadi: null,
    penghasilan_pasangan: null,
    penghasilan_lainnya: null,
    pengeluaran: null,
    usaha: "",
    sektor: "",
    catatan_survey: "",
    tgl_survey: `${year}-${month}-${day}`,
});
const dynamicForm = reactive({
    id: uuid,
    flag: false,
    order: order.value,
    data_nasabah: pelanggan,
    data_survey: survey,
    jaminan: computed(() => jaminanStore.listJaminan),
});

const loadingKTP = ref(false);

const findDocByType = (c, e) => {
    const docPath = ref(_.find(c, { TYPE: e }));
    if (docPath.value) return docPath.value.PATH;
};

const notifUsia = ref(false);
const noteUsia = ref();
const handleTanggalLahir = (e) => {
    notifUsia.value = true;
    var month_diff = new Date().getTime() - e;
    var currentAge = month_diff / 31557600000;
    let flor = Math.floor(currentAge);
    if (flor > 19 && flor < 60) {
        notifUsia.value = false;
        noteUsia.value = flor;
    } else {
        if (flor < 19) {
            notifUsia.value = true;
            noteUsia.value = `usia ${flor} tahun, usia < dari 19 Tahun`;
        } else {
            notifUsia.value = true;
            noteUsia.value = `usia ${flor} tahun, usia > dari 60 Tahun`;
        }
    }
};

const plafondValidator = (rule, value) => {
    return value >= 1000000;
};
const numberValidator = (rule, value) => {
    return value > 0;
};
const rulesOrder = {
    plafond: {
        trigger: "blur",
        validator: plafondValidator,
        message: "plafond minimal lebih dari 1.000.000",
    },
    jenis_angsuran: {
        trigger: "blur",
        required: true,
        message: "jenis angsuran harus dipilih",
    },

    bunga: {
        trigger: "blur",
        required: true,
        message: "bunga wajib diisi",
    },
    tujuan_kredit: {
        trigger: "blur",
        required: true,
        message: "tujuan kredit harus dipilih",
    },
};
const rulesPelanggan = {
    no_ktp: {
        trigger: "blur",
        required: true,
        min: 16,
        message: "No identitas minimal 16 karakter",
    },
    no_kk: {
        trigger: "blur",
        required: true,
        min: 16,
        message: "No Kartu Keluarga minimal 16 karakter",
    },
    nama: {
        trigger: "blur",
        required: true,
        message: "Nama harus diisi",
    },
    tgl_lahir: {
        trigger: "blur",
        required: true,
        message: "Tanggal lahir harus diisi",
    },
    no_hp: {
        trigger: "blur",
        required: true,
        message: "No HP harus diisi",
    },
    alamat: {
        trigger: "blur",
        required: true,
        message: "Alamat harus diisi",
    },
};


const onlyAllowNumber = (value) => !value || /^\d+$/.test(value);
onMounted(() => {
    jaminanStore.initJaminan();
});
</script>
<style>
.item-collapse {}
</style>
