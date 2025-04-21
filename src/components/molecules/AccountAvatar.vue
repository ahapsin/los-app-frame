<template>
  <div class="flex items-center gap-4 p-1 cursor-pointer rounded-full">
    <div class="flex gap-2">

      <n-popover placement="bottom-end" width="350">
        <template #trigger>
          <n-badge :value="tasks.length">
            <n-button type="primary" tertiary circle @click="handleTask">
              <template #icon>
                <v-icon name="bi-bell" />
              </template>
            </n-button>
          </n-badge>
        </template>

        <!-- <n-skeleton text :repeat="2" /> <n-skeleton text style="width: 60%" v-show="false"/> -->
        <!-- <div v-for="task in tasks" :key="task" @click="tasks = []">
          <div>
            
          </div>
          <div><b>{{ task.type }}</b></div>
          <div>{{ task.descr }}</div>
          <div class="text-[10px] text-slate-500">{{ task.created_at }}</div>
        </div> -->


        <div v-if="tasks.length != 0" >
          <div v-for="task in tasks" :key="task" class=" hover:bg-pr-50 rounded-lg p-2 cursor-pointer"
            @click="handleDetail(task)">
            <div class="flex gap-2">
              <div secondary v-if="task.type === 'payment'" class="flex text-xl p-1">
                🤑
              </div>
              <div secondary v-if="task.type === 'request_payment'" class="flex text-xl p-1">
                🤑
              </div>
              <div secondary v-if="task.type === 'repayment'" class="flex text-xl p-1">
                🤑
              </div>
              <div secondary v-if="task.type === 'repayment_cancel'" class="flex text-xl p-1">
                🤑
              </div>
              <div circle type="error" secondary v-if="task.type === 'payment_cancel'" class="flex text-xl p-1">
                😤
              </div>
              <div>
                <div class="text-[10px] text-slate-500"><n-tag :type="task.type == 'payment' ? 'success' : 'error'"
                    size="small">{{
                    task.branch_name }}</n-tag> •
                  {{
                    task.created_at }}</div>
                <div><b>{{ task.title }}</b></div>
                <div>{{ task.descr }}</div>
              </div>
            </div>
          </div>
          <div class="flex justify-center p-2">
            <n-button text type="primary" size="small" @click="showAllNotif">Selengkapnya</n-button>
          </div>
        </div>
        <div v-else class="flex">
          <div class="text-gray-300 text-center w-full">Tidak ada notifikasi</div>
        </div>
      </n-popover>
    </div>
    <div></div>
    <n-drawer v-model:show="drawDetail" width="350">

      <n-drawer-content>
        <div class="flex justify-between p-2">
          <div class="text-lg font-bold">Notifikasi</div>
          <n-tag type="error" round>{{ tasks.length }}</n-tag>
        </div>
        <div v-for="task in tasks" :key="task" class="hover:bg-pr-50 rounded-lg p-2 cursor-pointer"
          @click="handleDetail(task)">
          <div class="flex gap-2">
            <div secondary v-if="task.type === 'payment'" class="flex text-xl p-1">
                🤑
              </div>
              <div secondary v-if="task.type === 'request_payment'" class="flex text-xl p-1">
                🤑
              </div>
              <div secondary v-if="task.type === 'repayment'" class="flex text-xl p-1">
                🤑
              </div>
              <div secondary v-if="task.type === 'repayment_cancel'" class="flex text-xl p-1">
                🤑
              </div>
              <div circle type="error" secondary v-if="task.type === 'payment_cancel'" class="flex text-xl p-1">
                😤
              </div>
              <div>
                <div class="text-[10px] text-slate-500"><n-tag :type="task.type == 'payment' ? 'success' : 'error'"
                    size="small">{{
                    task.branch_name }}</n-tag> •
                  {{
                    task.created_at }}</div>
                <div><b>{{ task.title }}</b></div>
                <div>{{ task.descr }}</div>
              </div>
            </div>
        </div>
      </n-drawer-content>
    </n-drawer>
    <n-dropdown trigger="hover" :options="options">
      <div class="flex items-center gap-2">
        <span class="flex-col items-end hidden md:flex">
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

  <n-modal class="w-fit" title="Upload Berkas Pencairan" v-model:show="modalNotif" :on-after-leave="onAfterLeave">
    <kwitansi-pembayaran :id="bodyModal.type_id" :type="bodyModal.type" :route="bodyModal.route" @save="handleModal" :label="bodyModal.title" />
  </n-modal>
</template>
<script setup>
import { ref, h, onMounted } from "vue";
import router from "../../router";
import KwitansiPembayaran from "../molecules/KwitansiPembayaran.vue";
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

const modalNotif = ref(false);

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

const tasks = ref([]);
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
const bodyModal = ref();
const handleModal = (e) => {
  modalNotif.value = e;
}

const getDetailNotif = async (e) => {
  let userToken = localStorage.getItem("token");
  const response = await useApi({
    method: "GET",
    api: `payment/${e}`,
    token: userToken,
  });
  if (!response.ok) {
    message.info('SESI BERAKHIR');
  } else {
    bodyModal.value = response.data;
  }
};

const keterangan = ref();
const handleApprove = async (e) => {
  const bodyPost = {
    no_invoice: e,
    flag: "yes",
    keterangan: keterangan.value,
  };
  const response = await useApi({
    method: "POST",
    api: `payment_approval`,
    data: bodyPost,
    token: localStorage.getItem('token'),
  });
  if (!response.ok) {
    loadingConf.value = true;
    message.error("konfirmasi gagal");
  } else {
    loadingConf.value = false;
    message.success("konfirmasi berhasil");
    getDataPayment();
    showModal.value = false;
    router.push({ name: "pending transfer" });
  }
};

const drawDetail = ref(false);

const showAllNotif = () => {
  drawDetail.value = true;
}

const handleDetail = async (e) => {
  // await getDetailNotif(e.type_id);
  bodyModal.value = e;
  modalNotif.value = true;
}
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
  handleTask();
});
</script>
