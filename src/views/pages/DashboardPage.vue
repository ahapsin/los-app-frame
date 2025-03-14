<template>
  <n-card>
    Hi,<b>{{ me.me.nama }} 👋</b>
  </n-card>
  <div class="grid grid-flow-dense md:grid-cols-3 gap-2 mt-2">
<!--    <n-card v-for="dashCard in me.me.accessMenu" :title="dashCard">-->
<!--      <div>-->
<!--        {{ dashCard }}-->
<!--      </div>-->
<!--    </n-card>-->
<!--    {{ findAccessMenu('Oas') ? 'a' : 'b' }}-->
    <OrderBoard v-if="findAccessMenu('Order')"/>
    <PaymentBoard v-if="findAccessMenu('Pembayaran')"/>
    <JaminanBoard v-if="findAccessMenu('jaminan')"/>
  </div>
</template>
<script setup>
import {defineAsyncComponent} from 'vue'
import _ from "lodash";
import {useMessage} from "naive-ui";
import {useApi} from "../../helpers/axios.js";
import {useMeStore} from "../../stores/me.js";

const appbackdrop = import.meta.env.VITE_APP_BACKDROP;
const appbase = import.meta.env.VITE_APP_BASE_COLOR;
const me = useMeStore();
const message = useMessage();
const dataMenu = ref();
const getMenu = async () => {
  let userToken = localStorage.getItem("token");
  const response = await useApi({
    method: 'GET',
    api: 'menu-sub-list',
    token: userToken
  });
  if (!response.ok) {
    message.error(response.error.data.message);
  } else {
    dataMenu.value = response.data.response;
  }
}

const findAccessMenu = (e) => {
  return _.includes(me.me.accessMenu, e);
}

const OrderBoard = defineAsyncComponent(() => import("./board/OrderBoard.vue"));
const PaymentBoard = defineAsyncComponent(() => import("./board/PaymentBoard.vue"));
const JaminanBoard = defineAsyncComponent(() => import("./board/JaminanBoard.vue"));
onMounted(() => {
  getMenu();
})

</script>
