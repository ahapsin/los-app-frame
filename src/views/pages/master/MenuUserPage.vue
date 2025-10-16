<template>
    <n-card :segmented="{
        content: true,
        footer: 'soft'
    }" :title="`Form ${$route.name}`">
        <n-form ref="formRef" :model="model" :rules="rules" :label-placement="width <= 920 ? 'top' : 'left'"
            require-mark-placement="right-hanging" :size="size" label-width="auto">
            <n-space>
                <n-form-item label="Username" path="kode">
                    <n-input placeholder="Username" v-model:value="dynamicForm.username" disabled />
                </n-form-item>
                <n-form-item label="Nama" path="nama">
                    <n-input placeholder="Nama" v-model:value="dynamicForm.nama" disabled />
                </n-form-item>
                <n-form-item label="Cabang" path="cabang">
                    <n-select filterable placeholder="Pilih Cabang" label-field="nama" value-field="id"
                        :options="dataBranch" v-model:value="dynamicForm.cabang_id" disabled />
                </n-form-item>
                <n-form-item label="Jabatan" path="jabatan">
                    <n-select filterable placeholder="Pilih Jabatan" :options="optJabatan"
                        v-model:value="dynamicForm.jabatan" disabled />
                </n-form-item>
            </n-space>
            <n-divider title-placement="left">Atur Menu</n-divider>
            <n-flex>
                <n-transfer ref="transfer" size="large" source-title="Menu tersedia" target-title="Menu dipilih"
                    v-model:value="getUserMenuData" virtual-scroll :options="getMenuData" clear-text="hapus semua"
                    source-filter-placeholder="cari menu" select-all-text="pilih semua" source-filterable />
            </n-flex>
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
import { useMessage } from 'naive-ui';
import { ref, reactive, onMounted } from 'vue';
import { useWindowSize } from '@vueuse/core';
const { width, height } = useWindowSize();
import { useApi } from '../../../helpers/axios';
import router from '../../../router';
import { useRoute } from 'vue-router';
const dataBranch = ref();

const dynamicForm = reactive({
    photo_personal: '',
    username: '',
    password: '',
    name: '',
    cabang_id: null,
    cabang_nama: null,
    jabatan: '',
    gender: '',
    status: '',
});
const loading = ref(false);
const action = ref("POST");
const url = ref();
const message = useMessage();
const PageData = ref();
const bodyUpdate = reactive({
    menu_list: [],
})
const getMenuData = ref();
const getUserMenuData = ref();
const baseRoute = useRoute();
const param = baseRoute.params.iduser;
const userToken = localStorage.getItem("token");
const handleCancel = () => router.replace('/master/users');

const response = () => useApi({
    method: 'get',
    api: `users/${param}`,
    token: userToken
}).then(res => {
    if (res.ok) {
        message.loading("memuat karyawan");
        PageData.value = res.data.response;
        Object.assign(dynamicForm, res.data.response);
    } else {
        message.error("error");
    }
});

const handleSave = async (e) => {
    e.preventDefault(e);

    let a = getUserMenuData.value.map((v, i) => ({ menu_id: v }));
    Object.assign(bodyUpdate.menu_list, a);
    loading.value = true;
    action.value = "PUT";
    url.value = `user_access_menu/${param}`;

    const response = await useApi({
        method: action.value,
        api: url.value,
        data: bodyUpdate,
        token: userToken
    });

    if (!response.ok) {
        message.error("data gagal disimpan");
        loading.value = false;
    } else {
        message.success("data berhasil disimpan");
        loading.value = false;
        router.replace({ name: 'pengguna' });
    }
}
const getBranch = useApi({
    method: 'GET',
    api: `cabang`,
    token: userToken
}).then(res => {
    if (!res.ok) {
        message.error("error koneksi api");
    } else {
        dataBranch.value = res.data.response;
    }
});
const getMenu = useApi({
    method: 'GET',
    api: `menu`,
    token: userToken
}).then(res => {
    if (!res.ok) {
        message.error("error koneksi api");
    } else {
        getMenuData.value = Array.from(res.data.response).map((v, i) => ({
            label: `${v.parent?v.parent:'Parent'}->${v.menu_name}`,
            value: v.id,
        }));
    }
});
const getUserMenu = useApi({
    method: 'GET',
    api: `user_access_menu/${param}`,
    token: userToken
}).then(res => {
    if (!res.ok) {
        message.error("error koneksi api");
    } else {
        getUserMenuData.value = Array.from(res.data.response).map((v, i) => v.id);
    }
});

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
const optStatus = ["Active", "InActive"].map(
    (v) => ({
        label: v,
        value: v
    }));
onMounted(() => {
    if (param) { response() }
});
</script>