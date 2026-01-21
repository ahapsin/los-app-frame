<template>
  <n-card :class="`shadow-lg`"
      :segmented="{
      content: true,
      footer: 'soft',
    }"
      :title="`Form ${$route.name}`"
  >
    <n-form
        ref="formRef"
        :model="dynamicForm"
        :rules="rules"
        :label-placement="width <= 920 ? 'top' : 'left'"
        require-mark-placement="right-hanging"
        label-width="auto"
    >
      <n-form-item label="Photo personal" path="photo_personal">
        <n-upload
            :data="{ type: 'personal' }"
            list-type="image-card"
            :custom-request="handleImagePost"
        >
          Upload Photo Personal
        </n-upload>
      </n-form-item>
      <n-form-item label="Username" path="kode">
        <n-input placeholder="Username" v-model:value="dynamicForm.username"/>
      </n-form-item>
      <n-form-item label="No KTP" path="no_ktp">
        <n-input-number
            placeholder="no KTP"
            v-model:value="dynamicForm.no_ktp"
            :show-button="false"
            class="w-full"
        />
      </n-form-item>
      <n-form-item label="Nama" path="nama">
        <n-input placeholder="Nama" v-model:value="dynamicForm.nama"/>
      </n-form-item>
      <n-form-item label="Cabang" path="cabang">
        <n-select
            :loading="loadingBranch"
            filterable
            placeholder="Pilih Cabang"
            label-field="nama"
            value-field="id"
            :options="dataBranch"
            v-model:value="dynamicForm.cabang_id"
        />
      </n-form-item>
      <n-form-item label="Jabatan" path="jabatan">
        <n-select
            filterable
            :loading="loadingPosition"
            label-field="name"
            value-field="name"
            placeholder="Pilih Jabatan"
            :options="dataPosition"
            v-model:value="dynamicForm.jabatan"
        />
      </n-form-item>
      <n-form-item label="Alamat" path="ho">
        <n-input
            type="textarea"
            autosize
            placeholder="alamat"
            v-model:value="dynamicForm.alamat"
        />
      </n-form-item>
      <n-form-item label="No HP" path="ho">
        <n-input placeholder="no HP" v-model:value="dynamicForm.no_hp"/>
      </n-form-item>
      <n-form-item label="Jenis Kelamin" path="jk">
        <n-select
            filterable
            :options="optJenisKelamin"
            placeholder="Jenis Kelamin"
            v-model:value="dynamicForm.gender"
        />
      </n-form-item>
      <n-form-item label="Status" path="ho">
        <n-select
            filterable
            placeholder="Status"
            :options="optStatus"
            v-model:value="dynamicForm.status"
        />
      </n-form-item>
    </n-form>
    <template #action>
      <n-space>
        <n-button :loading="loading" type="primary" @click="handleSave">
          <span v-if="!param">Simpan</span>
          <span v-else>Ubah</span>
        </n-button>
        <n-button type="error" @click="handleCancel"> Batal</n-button>
      </n-space>
    </template>
  </n-card :class="`shadow-lg`">
</template>
<script setup>
import {useMessage} from "naive-ui";
import {ref, reactive, onMounted} from "vue";
import {useWindowSize} from "@vueuse/core";

const {width} = useWindowSize();
import {useApi} from "../../../helpers/axios";
import router from "../../../router";
import {useRoute} from "vue-router";

const dynamicForm = reactive({
  photo_personal: "",
  username: "",
  password: "",
  name: "",
  no_ktp: null,
  cabang_id: null,
  cabang_nama: null,
  jabatan: null,
  gender: "",
  status: "",
});
const loading = ref(false);
const action = ref("POST");
const url = ref();
const message = useMessage();
const PageData = ref();
const baseRoute = useRoute();
const param = baseRoute.params.iduser;
const userToken = localStorage.getItem("token");
const handleCancel = () => router.push("/master/users");

const rules = {
  no_ktp: {
    trigger: "blur",
    min: 16,
    message: "No identitas minimal 16 karakter",
  },
};
const response = () =>
    useApi({
      method: "get",
      api: `users/${param}`,
      token: userToken,
    }).then((res) => {
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
  loading.value = true;
  if (param) {
    action.value = "PUT";
    url.value = `users/${param}`;
  } else {
    url.value = `users`;
    action.value = "POST";
  }
  const response = await useApi({
    method: action.value,
    api: url.value,
    data: dynamicForm,
    token: userToken,
  });

  if (!response.ok) {
    message.error("data gagal disimpan");
    loading.value = false;
  } else {
    message.success("data berhasil disimpan");
    loading.value = false;
    router.push({name: "pengguna"});
  }
}
const loadingBranch = ref(false);
const dataBranch = ref([]);
const getBranch = async () => {
  loadingBranch.value = true;
  const response = await useApi({
    method: "GET",
    api: "cabang",
    token: userToken,
  });
  if (!response.ok) {
    message.error("ERROR API");
    loadingBranch.value = false;
  } else {
    dataBranch.value = response.data.response;
    loadingBranch.value = false;
  }
}
const loadingPosition = ref(false);

const dataPosition = ref([]);
const getPosition = async () => {
  loadingPosition.value = true;
  const response = await useApi({
    method: "GET",
    api: "position",
    token: userToken,
  });
  if (!response.ok) {
    message.error("ERROR API");
    loadingPosition.value = false;
  } else {
    dataPosition.value = response.data;
    loadingPosition.value = false;
  }
}

const optJenisKelamin = ["Laki-laki", "Perempuan"].map((v) => ({
  label: v,
  value: v,
}));
const optStatus = ["Active", "InActive","Resign","Mutasi POS","Mutasi Jabatan"].map((v) => ({
  label: v,
  value: v,
}));

const handleImagePost = () => {
};
onMounted(() => {
  if (param) {
    response();
  }
  getBranch();
  getPosition();
});
</script>