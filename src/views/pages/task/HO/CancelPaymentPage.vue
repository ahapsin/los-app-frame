<template>
  <n-card :class="`shadow-lg`">
    <template #header>Batal Pembayaran</template>
    <div>
      <n-data-table striped size="small" :row-key="(row) => row.loan_number" :columns="columns" :data="props.data"
                    :max-height="300" class="pb-2" :pagination="pagination"/>
    </div>
  </n-card :class="`shadow-lg`">
  <n-modal v-model:show="confModal" preset="dialog" title="Konfirmasi" positive-text="Yakin"
           negative-text="Hmm, belum yakin" @positive-click="handleCancel" @negative-click="cancelCallback">
    Jadi, kamu yakin ingin batalin pembayaran ini ?
    <n-input type="textarea" placeholder="tulis alasannya disini" v-model:value="bodyCancel.descr_ho"/>
  </n-modal>
</template>
<script setup>
import {useApi} from "../../../../helpers/axios";
import {
  NButton, useMessage
} from "naive-ui";
import {computed, h, reactive, ref} from "vue";

const checkedRowCredit = ref([]);
const pagination = ref({pageSize: 10});
const totalPay = computed(() => {
  const totalInstallment = () =>
      checkedRowCredit.value.reduce(
          (total, installment) => total + installment.bayar_angsuran,
          0
      );
  const totalPenalty = () =>
      checkedRowCredit.value.reduce(
          (total, installment) => total + installment.bayar_denda,
          0
      );
  const combinedTotal = () => totalInstallment() + totalPenalty();
  return combinedTotal();
});
const pageData = reactive({
  no_facility: null,
  total_bayar: totalPay,
  jumlah_uang: 0,
  payment_method: "cash",
  pembulatan: 0,
  kembalian: computed(() =>
      pageData.jumlah_uang
          ? pageData.jumlah_uang - pageData.total_bayar - pageData.pembulatan
          : 0
  ),
  struktur: checkedRowCredit,
  bank_tujuan: null,
  no_rekening: null,
  bukti_transafer: null,
});

const props = defineProps({
  data: Object,
});
const createColumns = () => {
  return [
    {
      title: "No Pembayaran",
      sorter: "default",
      key: "no_invoice",
    },
    {
      title: "Tgl Pembayaran",
      sorter: "default",
      key: "tgl_transaksi",
    },
    {
      title: "Tanggal Permohonan",
      sorter: "default",
      key: "request_date",
    },
    {
      title: "Pemohon",
      sorter: "default",
      key: "request_by",
    },
    {
      title: "Cabang",
      sorter: "default",
      key: "request_branch",
    },
    {
      title: "Alasan",
      sorter: "default",
      key: "request_descr",
    },
    {
      align: "right",
      render(row) {
        return h(
            NButton,
            {
              secondary: false,
              size: "small",
              type: "success",
              onClick: () => {
                handleConf(row);
              },
            },
            {
              default: () => "konfirmasi",
            }
        );
      }
    }
  ];
};


const columns = createColumns();
const message = useMessage();


const confModal = ref(false);
const bodyCancel = reactive({
  descr_ho: null,
  no_invoice: null,
  value: null,
});
const handleConf = (row) => {
  confModal.value = true;
  bodyCancel.no_invoice = row.no_invoice;
  bodyCancel.value = row.value,
      bodyCancel.req_flag = "cancel";
  bodyCancel.flag = "yes";
}

const emit = defineEmits();

const handleCancel = async () => {
  let userToken = localStorage.getItem("token");
  const response = await useApi({
    method: "POST",
    data: bodyCancel,
    api: "payment_cancel",
    token: userToken,
  });
  if (!response.ok) {
    message.error("ERROR API");
  } else {
    emit('conf', true);
    bodyCancel.descr_ho = null;
    message.success("pembayaran berhasil dibatalkan !");
    confModal.value = false;
  }
};
</script>
