<template>
  <div class="w-full">

    <n-form :model="dynamicForm" ref="formRef">
      <div class="flex flex-col md:flex-row gap-4 items-center pb-8">
        <img class="h-14 md:h-16 " :src="applogo" alt="logo_company">
        <div class="flex flex-col justify-center items-center md:items-start">
          <span class="font-bold">LOAN ORIGINATION SYSTEM</span>
          <span class="md:text-2xl font-bold">{{ apptitle }}</span>
        </div>
      </div>
      <div class=" h-full flex flex-col py-4">
        <n-form-item label="username" path="username" :rule="rules.username">
          <n-input v-model:value="dynamicForm.username" placeholder="username" />
        </n-form-item>
        <n-form-item label="password" path="password" :rule="rules.password">
          <n-input type="password" v-model:value="dynamicForm.password" placeholder="Password"
                   show-password-on="mousedown" @keyup.enter="handleLogin" />
        </n-form-item>
        <n-button class="flex w-full" :loading="loading" icon-placement="left" type="primary"
                  @click="handleLogin">
          Login
        </n-button>
        <div class="flex justify-center mt-4 text-sm">
          <n-text>v. {{ appVersion }}</n-text>
        </div>
      </div>
    </n-form>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import { useMessage } from "naive-ui";
import router from '../../router';
import { useApi } from "../../helpers/axios";
import pjson from '../../../package.json';

const apptitle = import.meta.env.VITE_APP_TITLE;
const applogo = import.meta.env.VITE_APP_LOGO;
const appVersion = pjson.version;
const dynamicForm = reactive({
  username: "",
  password: "",
  device_info: "apple",
});
const message = useMessage();
const formRef = ref(null);
const loading = ref(false);
const rules = {
  username: {
    required: true,
    message: 'username harus diisi',
    trigger: ['input', 'blur']
  },
  password: {
    required: true,
    message: 'password harus diisi !',
    trigger: ['input', 'blur']
  }
}
const handleLogin = async (e) => {
  e.preventDefault(e);

  formRef.value?.validate((errors) => {
    if (errors) {
      loading.value = false
    }
  });
  loading.value = true;
  const response = await useApi({
    method: 'POST',
    api: 'auth/login',
    data: {
      username: dynamicForm.username,
      password: dynamicForm.password,
      device_info: dynamicForm.device_info
    }
  });
  if (!response.ok) {

    if (response.error.status == 503) { router.push('no-service'); } else {
      message.error("login gagal,periksa username dan password anda !");
      loading.value = false;
    }
  } else {
    message.success("login berhasil");
    loading.value = false;
    localStorage.token = response.data.token;
    router.push('dashboard');
    router.go();
  }
}

const logged = ref(false);
onMounted(() => {
  logged.value = true;
  if (localStorage.getItem("token")) {
    const userToken = localStorage.getItem("token");
    useApi({
      method: 'get',
      api: `me`,
      token: userToken
    }).then(res => {
      if (!res.ok) {
        localStorage.removeItem("token");
        message.warning("sesi anda sudah berakhir");
        router.go('/');
      } else {
        router.push('/');
        logged.value = false;
      }
    });

  }
});
</script>
