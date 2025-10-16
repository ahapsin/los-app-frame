<template>
    <n-card :segmented="{
        content: true,
        footer: 'soft'
    }" :title="`Form ${$route.name}`">
        <n-form ref="formRef" :model="dynamicForm" :rules="rules" :label-placement="width <= 920 ? 'top' : 'left'"
            require-mark-placement="right-hanging" :size="size" label-width="auto">
            <n-alert v-show="errorAPI" title="Peringatan" type="warning" closable class="my-4">
                {{ errorAPI }}
            </n-alert>
            <n-form-item label="Kode" path="CODE">
                <n-input placeholder="kode" v-model:value="dynamicForm.CODE" />
            </n-form-item>
            <n-form-item label="Nama" path="NAME">
                <n-input placeholder="nama" v-model:value="dynamicForm.NAME" />
            </n-form-item>
            <n-form-item label="Lokasi" path="lokasi">
                <n-input placeholder="lokasi" v-model:value="dynamicForm.LOCATION" />
            </n-form-item>
            <div class="flex gap-2">
                <n-form-item label="Alamat" path="alamat">
                    <n-input placeholder="alamat" v-model:value="dynamicForm.ADDRESS" />
                </n-form-item>
                <n-form-item label="RT" path="rt">
                    <n-input placeholder="RT" v-model:value="dynamicForm.RT" />
                </n-form-item>
                <n-form-item label="RW" path="rw">
                    <n-input placeholder="RW" v-model:value="dynamicForm.RW" />
                </n-form-item>
            </div>

            <select-state-region v-model:provinsi="dynamicForm.PROVINCE" v-model:kota="dynamicForm.CITY"
                v-model:kecamatan="dynamicForm.KECAMATAN" v-model:desa="dynamicForm.KELURAHAN" />
            <n-form-item label="Kode POS" path="kodepos">
                <n-input placeholder="kodepos" v-model:value="dynamicForm.ZIP_CODE" />
            </n-form-item>
            <div class="flex gap-2">
                <n-form-item label="Telepon" path="telepon">
                    <n-input placeholder="Telepon" v-model:value="dynamicForm.PHONE_1" />
                </n-form-item>
                <n-form-item label="Telepon 2" path="telepon2">
                    <n-input placeholder="Telepon 2" v-model:value="dynamicForm.PHONE_2" />
                </n-form-item>
                <n-form-item label="Telepon 3" path="telepon3">
                    <n-input placeholder="Telepon 2" v-model:value="dynamicForm.PHONE_3" />
                </n-form-item>
            </div>
            <n-form-item label="Deskripsi">
                <n-input type="textarea" v-model:value="dynamicForm.DESCR" placeholder="Deskripsi" />
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
import { useMessage } from 'naive-ui';
import { ref, reactive, onMounted } from 'vue';
import { useWindowSize } from '@vueuse/core';
const { width } = useWindowSize();
import { useApi } from '../../../helpers/axios';
import router from '../../../router';
import { useRoute } from 'vue-router';

const dynamicForm = reactive({
    ID: "",
    CODE: "",
    NAME: "",
    ADDRESS: "",
    RT: "",
    RW: "",
    PROVINCE: "",
    CITY: "",
    KELURAHAN: "",
    KECAMATAN: "",
    ZIP_CODE: "",
    LOCATION: "",
    PHONE_1: "",
    PHONE_2: "",
    PHONE_3: "",
    DESCR: "",
});
const loading = ref(false);
const action = ref("POST");
const url = ref();
const formRef = ref(null);
const errorAPI = ref(null);
const message = useMessage();
const PageData = ref();
const baseRoute = useRoute();
const param = baseRoute.params.idbranch;
const userToken = localStorage.getItem("token");

const rules = {
    CODE: {
        required: true,
        trigger: ["blur", "input"],
        message: "nama wajib diisi"
    },
    NAME: {
        required: true,
        trigger: ["blur"],
        message: "nama wajib diisi"
    }
}

const handleCancel = () => router.push('/master/branch');

const response = () => useApi({
    method: 'get',
    api: `cabang/${param}`,
    token: userToken
}).then(res => {
    if (res.ok) {
        message.loading("memuat cabang");
        PageData.value = res.data.response;
        Object.assign(dynamicForm, res.data.response);
    }
});

const handleSave = async (e) => {
    e.preventDefault(e);
    formRef.value?.validate((errors) => {
        return null;
    });
    loading.value = true;
    if (param) {
        action.value = "PUT";
        url.value = `cabang/${param}`;
    } else {
        url.value = `cabang`;
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
        errorAPI.value = response.error.data.message;
    } else {
        message.success("data berhasil disimpan");
        loading.value = false;
        router.push({ name: 'cabang' });
    }
}
onMounted(() => {
    if (param) { response() }
});
</script>