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
      :size="size"
      label-width="auto"
    >
      <n-alert
        v-show="errorAPI"
        title="Peringatan"
        type="warning"
        closable
        class="my-4"
      >
        {{ errorAPI }}
      </n-alert>
      <n-form-item label="Nama Jabatan">
        <n-input
          placeholder="nama menu"
          v-model:value="dynamicForm.name"
        />
      </n-form-item>
      
    </n-form>
    <template #action>
      <n-space>
        <n-button :loading="loading" type="primary" @click="handleSave">
          <span v-if="!param">Simpan</span>
          <span v-else>Ubah</span>
        </n-button>
        <n-button type="error" @click="handleCancel"> Batal </n-button>
      </n-space>
    </template>
  </n-card :class="`shadow-lg`">
</template>
<script setup>
import { useMessage } from "naive-ui";
import { ref, reactive, onMounted } from "vue";
import { useWindowSize } from "@vueuse/core";
const { width, height } = useWindowSize();
import { useApi } from "../../../../helpers/axios";
import router from "../../../../router";
import { useRoute } from "vue-router";

const dynamicForm = reactive({
  name: "",
});
const loading = ref(false);
const action = ref("POST");
const url = ref();
const formRef = ref(null);
const errorAPI = ref(null);
const message = useMessage();
const PageData = ref([]);
const baseRoute = useRoute();
const param = baseRoute.params.idbranch;
const userToken = localStorage.getItem("token");

const rules = {
  CODE: {
    required: true,
    trigger: ["blur", "input"],
    message: "nama wajib diisi",
  },
  NAME: {
    required: true,
    trigger: ["blur"],
    message: "nama wajib diisi",
  },
};

const handleCancel = () => router.go(-1);
const dataMenu = ref();
const response = () =>
  useApi({
    method: "get",
    api: `menu`,
    token: userToken,
  }).then((res) => {
    if (res.ok) {
      dataMenu.value = res.data.response;
    }
  });

const handleSave = async (e) => {
  e.preventDefault(e);
  loading.value = true;
  const response = await useApi({
    method: "POST",
    api: "position",
    data: dynamicForm,
    token: userToken,
  });

  if (!response.ok) {
    message.error("data gagal disimpan");
    loading.value = false;
    errorAPI.value = response.error.data.message;
  } else {
    message.success("data berhasil disimpan");
    loading.value = false;
    router.replace({ name: "position" });
  }
};
onMounted(() => {
  response();
});
</script>