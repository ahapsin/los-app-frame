<template>
  <n-card size="small" :segmented="true">
    <template #header>Perubahan Jaminan</template>
    <template #header-extra>
      <n-space>
        <n-badge :value="dataPending.length" :max="99" type="warning">
          <n-button v-show="!searchField" strong secondary type="warning" @click="dataPayment = dataPending">
            <template #icon>
              <n-icon>
                <pending-icon />
              </n-icon>
            </template>
            acc HO
          </n-button>
        </n-badge>
      </n-space>
    </template>
    <div>
      <n-data-table striped size="small" :row-key="(row) => row.loan_number" :columns="columns" :data="dataPayment"
        :max-height="300" class="pb-2" :pagination="pagination" />
    </div>
  </n-card>
  
</template>
<script setup>
import {
  AccessTimeRound as pendingIcon
} from "@vicons/material";
import _ from "lodash";
import {
  NBadge,
  NButton,
  NIcon,
  NTag,
  useLoadingBar,
  useMessage
} from "naive-ui";
import { computed, h, onMounted, reactive, ref } from "vue";
import { useApi } from "../../../../helpers/axios";
import router from "../../../../router";
const checkedRowCredit = ref([]);
const pagination = ref({ pageSize: 10 });
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
const createColumns = () => {
  return [
    {
      title: "cabang",
      sorter: "default",
      key: "cabang",
    },
    {
      title: "no kontrak",
      sorter: "default",
      key: "no_fasilitas",
    },
    {
      title: "no transaksi",
      sorter: "default",
      ellipsis: {
        tooltip: true
      },
      key: "no_transaksi",
    },
    {
      title: "tanggal",
      key: "tgl_transaksi",
      sorter: "default",
    },
    {
      title: "metode",
      key: "payment_method",
      sorter: "default",
    },
    {
      title: "atas nama",
      key: "nama",
      sorter: "default",
    },
    {
      title: "nominal",
      key: "total_bayar",
      align: 'right',
      render(row) {
        return h("div", row.total_bayar.toLocaleString("US"));
      },
      sorter: "default",
    },
    {
      title: "status",
      key: "STATUS",
      render(row) {
        return h(
          NTag,
          {
            type: statusTag(row.STATUS),
            onClick: () => {
              handleAction(row);
            },
          },
          {
            default: () => row.STATUS,
          }
        );
      },
    },
    {
      align: "right",
      key: "action",
      render(row) {
        return h(
          NBadge,
          {
            dot: true,
            show: row.STATUS == "PENDING" ? true : false,
          },
          {
            default: () => {
              return h(
                NButton,
                {
                  secondary: true,
                  round: true,
                  onClick: () => {
                    handleAction(row);
                  },
                },
                {
                  default: () => "detail",
                }
              );
            },
          }
        );
      },
    },
  ];
};
const showModal = ref(false);
const bodyModal = ref([]);
const handleAction = (e) => {
  showModal.value = true;
  bodyModal.value = e;
};

const statusTag = (e) => {
  if (e === "CANCEL") {
    return "error";
  }
  if (e === "PAID") {
    return "success";
  }
  if (e === "PENDING") {
    return "warning";
  }
}
const columns = createColumns();
let userToken = localStorage.getItem("token");
const keterangan = ref();
const loadingConf = ref(false);
const handlePositiveClick = async (e) => {
  loadingConf.value = true;
  const bodyPost = {
    no_invoice: e,
    flag: "yes",
    keterangan: keterangan.value,
    struktur: bodyModal.value.struktur,
  };
  const response = await useApi({
    method: "POST",
    api: `payment_approval`,
    data: bodyPost,
    token: userToken,
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
const handleNegativeClick = async (e) => {
  loadingConf.value = true;
  const bodyPost = {
    no_invoice: e,
    flag: "no",
    keterangan: keterangan.value,
    struktur: bodyModal.value.struktur,
  };
  const response = await useApi({
    method: "POST",
    api: `payment_approval`,
    data: bodyPost,
    token: userToken,
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
const dataPayment = ref([]);
const loadDataPayment = ref(false);
const dataPending = ref([]);
const message = useMessage();
const loadingBar = useLoadingBar();
const getDataPayment = async () => {
  loadDataPayment.value = true;
  let userToken = localStorage.getItem("token");
  const response = await useApi({
    method: "GET",
    api: "collateral_approval_list",
    token: userToken,
  });
  if (!response.ok) {
    console.log(response.error);
  } else {
    loadingBar.finish();
    loadDataPayment.value = false;
    dataPayment.value = response.data;
    dataPending.value = _.filter(dataPayment.value, { STATUS: "PENDING" });
  }
};
onMounted(() => getDataPayment());
</script>
