<template>
    <n-card :segmented="{
        content: true,
        footer: 'soft'
    }" :title="`Form ${$route.name}`">
        <n-form ref="formRef" :model="model" :rules="rules" label-placement="left"
            require-mark-placement="right-hanging" :size="size" label-width="auto">
            <n-form-item label="Photo personal" path="photo_personal">
                <n-upload :data="{ 'type': 'personal' }" list-type="image-card" :custom-request="handleImagePost">
                    Upload Photo Personal
                </n-upload>
            </n-form-item>
            <n-form-item label="Cabang" path="cabang">
                <n-select filterable placeholder="Pilih Cabang" label-field="nama" value-field="id"
                    :options="dataBranch" v-model:value="dynamicForm.cabang_nama" />
            </n-form-item>
            <n-form-item label="Jabatan" path="jabatan">
                <n-select filterable placeholder="Pilih Jabatan" :options="optJabatan"
                    v-model:value="dynamicForm.jabatan" />
            </n-form-item>
            <n-form-item label="No KTP" path="no_ktp">
                <n-input placeholder="No KTP" v-model:value="dynamicForm.no_ktp" />
            </n-form-item>
            <n-form-item label="Nama" path="nama">
                <n-input placeholder="nama" v-model:value="dynamicForm.nama" />
            </n-form-item>
            <n-form-item label="Tempat Tanggal lahir" path="ttl">
                <n-input-group>
                    <n-input placeholder="tempat lahir" v-model:value="dynamicForm.tempat_lahir" />
                    <n-input placeholder="tanggal lahir" type="date" v-model:value="dynamicForm.tgl_lahir" />
                </n-input-group>
            </n-form-item>
            <n-form-item label="Jenis Kelamin" path="jk">
                <n-select filterable :options="optJenisKelamin" placeholder="Jenis Kelamin"
                    v-model:value="dynamicForm.gender" />
            </n-form-item>
            <n-form-item label="Golongan Darah" path="blood">
                <n-input placeholder="Golongan Darah" v-model:value="dynamicForm.blood_type" />
            </n-form-item>
            <n-divider title-placement="left">
                Alamat KTP
            </n-divider>
            <n-form-item label="Alamat KTP" path="alamat">
                <n-input-group>
                    <n-input placeholder="alamat" v-model:value="dynamicForm.alamat_ktp" />
                    <n-input placeholder="rt" v-model:value="dynamicForm.rt_ktp">
                        <template #prefix>
                            <n-text depth="3">
                                RT
                            </n-text>
                        </template>
                    </n-input>
                    <n-input placeholder="rw" v-model:value="dynamicForm.rw_ktp">
                        <template #prefix>
                            <n-text depth="3">
                                RW
                            </n-text>
                        </template>
                    </n-input>
                </n-input-group>
            </n-form-item>
            <select-state-region v-model:provinsi="dynamicForm.provinsi_ktp" v-model:kota="dynamicForm.kota_ktp"
                v-model:kecamatan="dynamicForm.kecamatan_ktp" v-model:desa="dynamicForm.kelurahan_ktp" />
            <n-form-item label="Kode POS" path="kodepos">
                <n-input placeholder="kodepos" v-model:value="dynamicForm.kode_pos_ktp" />
            </n-form-item>
            <n-divider title-placement="left">
                Alamat Domisili
            </n-divider>
            <n-form-item label="Alamat Domisili" path="alamat">
                <n-input-group>
                    <n-input placeholder="alamat" v-model:value="dynamicForm.alamat_tinggal" />
                    <n-input placeholder="rt" v-model:value="dynamicForm.rt">
                        <template #prefix>
                            <n-text depth="3">
                                RT
                            </n-text>
                        </template>
                    </n-input>
                    <n-input placeholder="rw" v-model:value="dynamicForm.rw">
                        <template #prefix>
                            <n-text depth="3">
                                RW
                            </n-text>
                        </template>
                    </n-input>
                </n-input-group>
            </n-form-item>
            <select-state-region v-model:provinsi="dynamicForm.provinsi" v-model:kota="dynamicForm.kota"
                v-model:kecamatan="dynamicForm.kecamatan" v-model:desa="dynamicForm.kelurahan" />
            <n-form-item label="Kode POS" path="kodepos">
                <n-input placeholder="kodepos" v-model:value="dynamicForm.kode_pos" />
            </n-form-item>
            <n-form-item label="Agama" path="agama">
                <n-select filterable :options="optAgama" placeholder="Agama" v-model:value="dynamicForm.agama" />
            </n-form-item>
            <n-form-item label="Nama Ibu Kandung" path="ibu_kandung">
                <n-input placeholder="Nama Ibu Kandung" v-model:value="dynamicForm.ibu_kandung" />
            </n-form-item>
            <n-form-item label="Nama Pasangan" path="pasangan">
                <n-input placeholder="Nama Pasangan" v-model:value="dynamicForm.nama_pasangan" />
            </n-form-item>
            <n-form-item label="Jumlah Tanggungan" path="tanggungan">
                <n-input placeholder="Jumlah Tanggungan" v-model:value="dynamicForm.tanggungan" />
            </n-form-item>
            <n-form-item label="No Handphone" path="handphone">
                <n-input placeholder="No Handphone" v-model:value="dynamicForm.hp" />
            </n-form-item>
            <n-form-item label="Email" path="email">
                <n-input placeholder="Email" v-model:value="dynamicForm.email" />
            </n-form-item>
            <n-form-item label="Rekening" path="rekening">
                <n-input placeholder="Rekening" v-model:value="dynamicForm.no_rek_tf" />
            </n-form-item>
            <n-form-item label="NPWP" path="npwp">
                <n-input placeholder="NPWP" v-model:value="dynamicForm.npwp" />
            </n-form-item>
            <n-form-item label="Pendidikan" path="pendidikan">
                <n-input placeholder="Pendidikan" v-model:value="dynamicForm.pendidikan" />
            </n-form-item>
            <n-form-item label="Jurusan" path="jurusan">
                <n-input placeholder="Jurusan" v-model:value="dynamicForm.jurusan" />
            </n-form-item>
            <n-form-item label="IPK" path="ipk">
                <n-input placeholder="IPK" v-model:value="dynamicForm.ipk" />
            </n-form-item>
            <n-form-item label="Dokumen" path="ipk">
                <n-upload :data="{ 'type': 'file_kary' }" list-type="image-card" :custom-request="handleImagePost">
                </n-upload>
            </n-form-item>
        </n-form>
        <template #action>
            <n-space>
                <n-button :loading="loading" type="primary" @click="handleSave">
                    <span v-if="!param">Simpan</span>
                    <span v-else>Ubah</span>
                </n-button>
                <n-button type="error" @click="handleCancel">
                    Batal
                </n-button>
            </n-space>
        </template>
    </n-card>
</template>
<script setup>
import { v4 as uuidv4 } from 'uuid';
import { useMessage } from 'naive-ui';
import { ref, reactive, onMounted } from 'vue';
import { useApi } from '../../../helpers/axios';
import router from '../../../router';
import { useRoute } from 'vue-router';

const uuid = uuidv4();
const status = [{
    label: 'Aktif',
    value: 'Aktif'
}, {
    label: 'Tidak Aktif',
    value: 'Tidak Aktif'
}];
const optJabatan = ["MCF", "ADMIN", "KAPOS", "HO", "SUPERADMIN"].map(
    (v) => ({
        label: v,
        value: v
    }));
const optJenisKelamin = ["Laki-laki", "Perempuan"].map(
    (v) => ({
        label: v,
        value: v
    }));

const dynamicForm = reactive({
    employee_id: uuid,
    cabang_nama: null,
    nama: "",
    jabatan: null,
    blood_type: "",
    gender: null,
    pendidikan: "",
    universitas: "",
    jurusan: "",
    ipk: "",
    ibu_kandung: "",
    status_karyawan: "",
    nama_pasangan: "",
    tanggungan: "",
    no_ktp: "",
    nama_ktp: "",
    alamat_ktp: " ",
    rt_ktp: "",
    rw_ktp: "",
    provinsi_ktp: "",
    kota_ktp: "",
    kelurahan_ktp: "",
    kecamatan_ktp: "",
    kode_pos_ktp: "",
    alamat_tinggal: "",
    rt: "",
    rw: "",
    provinsi: "",
    kota: "",
    kelurahan: "",
    kecamatan: "",
    kode_pos: "",
    tgl_lahir: null,
    tempat_lahir: "",
    agama: "",
    telp: "",
    hp: "",
    no_rek_cf: "",
    no_rek_tf: "",
    email: "",
    npwp: "",
    sumber_loker: "",
    ket_loker: "",
    interview: "",
    tgl_keluar: null,
    alasan_keluar: "",
    cuti: "",
    photo_loc: "",
    spv_id: "",
    status_mst: "",
    photo_personal: "",
    dokumen: []
});
const loading = ref(false);
const action = ref("POST");
const url = ref();
const message = useMessage();
const PageData = ref();
const baseRoute = useRoute();
const param = baseRoute.params.idemployee;
const dataBranch = ref();
const userToken = localStorage.getItem("token");
const handleCancel = () => router.push('/master/branch');

const response = () => useApi({
    method: 'get',
    api: `karyawan/${param}`,
    token: userToken
}).then(res => {
    if (res.ok) {
        message.loading("memuat data karyawan");
        PageData.value = res.data.response;
        Object.assign(dynamicForm, res.data.response);
    }
});

const handleSave = async (e) => {
    e.preventDefault(e);
    loading.value = true;
    if (param) {
        action.value = "PUT";
        url.value = `karyawan/${param}`;
    } else {
        url.value = `karyawan`;
        action.value = "POST";
    }
    const response = await useApi({
        method: action.value,
        api: url.value,
        data: dynamicForm,
        token: userToken
    });
    if (!response.ok) {
        message.error("data gagal disimpan");
        loading.value = false;
    } else {
        message.success("data berhasil disimpan");
        loading.value = false;
        router.push({ name: 'karyawan' });
    }
}
const getBranch = useApi({
    method: 'GET',
    api: `cabang`,
    token: userToken
}).then(res => {

    if (!res.ok) {
        message.error("error koneksi api");
    }
});
onMounted(() => {
    if (param) { response() }
});
</script>