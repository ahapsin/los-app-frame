<template>

  <n-card>
    <n-tabs @update:value="handleUpdateValue" class="card-tabs" default-value="jaminan" size="medium" animated
            pane-wrapper-style="margin: 0 -4px" type="card"
            pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;">
      <n-tab-pane name="Approve Order" tab="Order">
        <template #tab>
          Order
        </template>
        <ApprovalHOPage/>
      </n-tab-pane>
      <n-tab-pane name="Transfer" tab="Transfer">
        <PendingTransferPage/>
      </n-tab-pane>
      <n-tab-pane name="Diskon" tab="Permintaan Diskon">
        <n-data-table :columns="columns" :data="dataTable"/>
      </n-tab-pane>
      <n-tab-pane name="Order" tab="Order">
        <template #tab>
          <n-space>
            Batal Order
            <n-badge :value="dataCancelOrder.length"/>
          </n-space>
        </template>
        <CancelOrderPage :data="dataCancelOrder" @conf="handleConfCancelOrder"/>
      </n-tab-pane>
      <n-tab-pane name="Pembayaran" tab="Pembayaran">
        <template #tab>
          <n-space>
            Batal Bayar
            <n-badge :value="dataCancelPayment.length"/>
          </n-space>
        </template>
        <CancelPaymentPage :data="dataCancelPayment"/>
      </n-tab-pane>
      <template #suffix>
        <n-dropdown trigger="hover" :options="options" @select="handleSelect" v-if="addButtonDisplay">
          <n-button type="primary">Tambah Transaksi</n-button>
        </n-dropdown>
      </template>
    </n-tabs>
  </n-card>
</template>
<script setup>
import PendingTransferPage from './PendingTransferPage.vue';
import CancelOrderPage from './CancelOrderPage.vue';
import {useApi} from '../../../../helpers/axios';
import CancelPaymentPage from './CancelPaymentPage.vue';
import ApprovalHOPage from "../ApprovalHOPage.vue";

const dataCancelOrder = ref([]);
const dataCancelPayment = ref([]);

const getdataCancel = async () => {
  let userToken = localStorage.getItem("token");
  const response = await useApi({
    method: "GET",
    api: "pk_cancel_list",
    token: userToken,
  });
  if (!response.ok) {
    console.log(response.error);
  } else {
    dataCancelOrder.value = response.data;
  }
};
const getdataCancelPayment = async () => {
  let userToken = localStorage.getItem("token");
  const response = await useApi({
    method: "GET",
    api: "payment_cancel_list",
    token: userToken,
  });
  if (!response.ok) {
    console.log(response.error);
  } else {
    dataCancelPayment.value = response.data;
  }
};
const handleConfCancelOrder = (e) => {
  console.log(e)
  getdataCancel();
}
onMounted(() => {
  getdataCancel();
  getdataCancelPayment();
})
</script>
