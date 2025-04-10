<template>
  <n-form ref="formRef" :model="dynamicForm" :rules="rules" :label-placement="top"
    require-mark-placement="right-hanging">
    <div class="p-2 bg-red-100 rounded-xl border border-red-400">
      <div class="grid grid-cols-1 md:grid-cols-4 p-2 gap-2">
        <n-form-item path="old" label="Password Lama" required>
          <n-input type="password" show-password-on="mousedown" v-model:value="dynamicForm.old"
            placeholder="password lama" />
        </n-form-item>
        <n-form-item path="baru" label="Password Baru" required>
          <n-input type="password" v-model:value="dynamicForm.new" show-password-on="mousedown"
            placeholder="password baru" />
        </n-form-item>
        <n-form-item path="conf" label="Konfirmasi Password Baru" required>
          <n-input type="password" v-model:value="dynamicForm.conf" show-password-on="mousedown"
            placeholder="konfirmasi password baru" @blur="handleConf" />
        </n-form-item>
        <n-form-item class="w-full">
          <n-button class="flex w-full md:w-fit" type="primary" @click="handleUpdate"
            :disabled="dynamicForm.conf != dynamicForm.new">update</n-button>
        </n-form-item>
      </div>
    </div>
  </n-form>

</template>
<script setup>
import { computed, reactive } from "vue";
import { useApi } from "../../../helpers/axios";
import { useMeStore } from "../../../stores/me";
import router from "../../../router";
import { useMessage } from "naive-ui";

const message = useMessage();
const meData = useMeStore();

const userToken = localStorage.getItem("token");
const handleUpdate = async () => {
  const response = await useApi({
    method: "POST",
    api: `change_password`,
    data: dynamicForm,
    token: userToken,
  });
  if (!response.ok) {
    message.error("password gagal diubah");
  } else {
    message.success("password berhasil diubah");
    router.push("/");
  }
};

const dynamicForm = reactive({
  old: "",
  new: "",
  conf: "",
  same: "",
  username: meData.me.username,
  password: computed(() => dynamicForm.old),
  new_password: computed(() => dynamicForm.new),
});
const handleConf = () => {
  if (dynamicForm.new != dynamicForm.conf) {
    message.error("konfirmasi password baru tidak sama");
  }
};
</script>
