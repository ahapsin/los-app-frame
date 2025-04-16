<template>
  <div class="flex items-center gap-4 p-1 cursor-pointer rounded-full">
    <div class="flex gap-2">
      
      <n-popover placement="bottom-end" width="250">
        <template #trigger>
          <n-badge :value="tasks.length">
            <n-button type="primary" tertiary circle @click="handleTask">
              <template #icon>
                <v-icon name="bi-bell" />
              </template>
            </n-button>
          </n-badge>
        </template>
        {{ tasks }}
        <!-- <n-skeleton text :repeat="2" /> <n-skeleton text style="width: 60%" v-show="false"/> -->
        <div v-for="task in tasks" :key="task" @click="tasks = []">
          <div><b>{{ task.type }}</b></div>
          <div>{{ task.descr }}</div>
          <div>{{ task.created_at }}</div>
        </div>
      </n-popover>
    </div>
    <div></div>
    <n-dropdown trigger="hover" :options="options">
      <div class="flex items-center gap-2">
        <span class="flex flex-col items-end">
          <n-text type="primary" class="text-primary uppercase"><strong>{{ dataUser?.nama }}</strong></n-text>
          <!-- <small class="text-primary hidden md:flex uppercase"> POS :{{ dataUser?.cabang_nama }}</small> -->
        </span>
        <n-avatar round size="small" class="aspect-square" :src="dataUser
          ? dataUser.PHOTO_URL
          : 'https://icones.pro/wp-content/uploads/2021/02/icone-utilisateur-vert.png'
          ">
          {{ dataUser?.nama.at(0) }}
        </n-avatar>
      </div>
    </n-dropdown>
  </div>
</template>
<script setup>
import { ref, h, onMounted } from "vue";
import router from "../../router";
import { useMessage, NIcon } from "naive-ui";
import {
  AccountCircleOutlined as Account,
  LockOutlined as Locked,
  LogOutOutlined as SignOut,
} from "@vicons/material";

import { useApi } from "../../helpers/axios";
import { useMeStore } from "../../stores/me";
import { useTaskStore } from "../../stores/task";
import { useCollateralStore } from "../../stores/collateral.js";

const message = useMessage();
const me = useMeStore();
const dataUser = ref();
const options = [
  {
    label: `Akun`,
    icon() {
      return h(NIcon, null, {
        default: () => h(Account),
      });
    },
    key: 1,
    props: {
      onClick: () => {
        handleAccount();
      },
    },
  },
  {
    label: "Ganti Password",
    icon() {
      return h(NIcon, null, {
        default: () => h(Locked),
      });
    },
    key: 2,
    props: {
      onClick: () => {
        handleChangePassword();
      },
    },
  },
  {
    type: "divider",
    key: "d1",
  },
  {
    label: "Logout",
    icon() {
      return h(NIcon, null, {
        default: () => h(SignOut),
      });
    },
    key: 3,
    props: {
      onClick: () => {
        LogOut();
      },
    },
  },
];

const task = useTaskStore();
const coll = useCollateralStore();
const approvalCenter = () => {
  router.push({ name: "approval-center" })
}
const handleAccount = () => {
  router.push({ name: "myaccount" });
};
const handleChangePassword = () => {
  router.push({ name: "changepassword" });
};

const GetMe = async () => {
  let userToken = localStorage.getItem("token");
  const response = await useApi({
    method: "GET",
    api: "me",
    token: userToken,
  });
  if (!response.ok) {
    message.info('SESI BERAKHIR');
  } else {
    dataUser.value = response.data.response;
    me.storeMe(response.data.response);
    task.storeTask(response.data.response);
  }
};

const tasks=ref([]);
const handleTask = async () => {
  let userToken = localStorage.getItem("token");
  const response = await useApi({
    method: "GET",
    api: "task_pusher",
    token: userToken,
  });
  if (!response.ok) {
    message.info('SESI BERAKHIR');
  } else {
    tasks.value = response.data;
  }
};

// const getDataColl = async () => {
//   let userToken = localStorage.getItem("token");
//
//   const response = await useApi({
//     method: "GET",
//     api: "jaminan",
//     token: userToken,
//   });
//   if (!response.ok) {
//     console.log(response);
//   } else {
//     coll.storeCollateral(response.data);
//   }
// };

const GetPayment = async () => {
  let userToken = localStorage.getItem("token");
  const response = await useApi({
    method: "GET",
    api: "me",
    token: userToken,
  });
  if (!response.ok) {
    message.info('SESI BERAKHIR');
  } else {
    dataUser.value = response.data.response;
    me.storeMe(response.data.response);
    task.storeTask(response.data.response);
  }
};



const LogOut = async () => {

  localStorage.removeItem("token");
  message.success("logout berhasil");
  router.go();
  // }
};
onMounted(() => {
  GetMe();
});
</script>
