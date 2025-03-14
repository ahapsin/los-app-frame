<template>
  <n-card>
    <template #header>Pending Transfer</template>
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
        <n-button v-show="!searchField" strong secondary circle @click="handleExpand">
          <template #icon>
            <n-icon>
              <full-icon />
            </n-icon>
          </template>
        </n-button>
      </n-space>
    </template>
    <div>
      <n-data-table striped size="small" :row-key="(row) => row.loan_number" :columns="columns" :data="dataPayment"
        :max-height="300" class="pb-2" :pagination="pagination" />
    </div>
  </n-card>
  <n-modal class="w-2/5" title="Upload Berkas Pencairan" v-model:show="showModal">
    <n-card :bordered="false" aria-modal="true">
      <div class="flex justify-between">
        <div>
          <div class="flex">
            <label class="w-36">Tanggal</label><span>
              <n-text strong> {{ bodyModal.tgl_transaksi }}</n-text></span>
          </div>
          <div class="flex">
            <label class="w-36">No Kontrak</label><span>
              <n-text strong> {{ bodyModal.no_fasilitas }}</n-text></span>
          </div>
          <div class="flex">
            <label class="w-36">No Transaksi</label><span>
              <n-text strong> {{ bodyModal.no_transaksi }}</n-text></span>
          </div>
          <div class="flex">
            <label class="w-36">Atas Nama </label><span>
              <n-text strong> {{ bodyModal.nama }}</n-text></span>
          </div>
          <div class="flex">
            <label class="w-36">Alamat</label><span>
              <n-text strong> {{ bodyModal.alamat }}</n-text></span>
          </div>
          <div class="flex">
            <label class="w-36">Total Bayar</label><span>
              <n-text strong>
                {{ bodyModal.total_bayar.toLocaleString("US") }}</n-text></span>
          </div>
          <div class="flex">
            <label class="w-36">Jumlah Uang</label><span>
              <n-text strong>
                {{ bodyModal.jumlah_uang.toLocaleString("US") }}</n-text></span>
          </div>
          <div class="flex">
            <label class="w-36">Pembulatan</label><span>
              <n-text strong>
                {{ bodyModal.pembulatan.toLocaleString("US") }}</n-text></span>
          </div>
          <div class="flex">
            <label class="w-36">Metode Pembayaran</label><span>
              <n-text strong> {{ bodyModal.payment_method }}</n-text></span>
          </div>
          <div class="flex">
            <label class="w-36">kembalian</label><span>
              <n-text strong>
                {{ bodyModal.kembalian.toLocaleString("US") }}</n-text></span>
          </div>
          <div class="flex">
            <label class="w-36">Untuk Pembayaran</label>
            <n-space>
              <n-tag size="small" v-for="pembayaran in bodyModal.pembayaran" :bordered="false" :key="pembayaran">{{
                pembayaran.title }}
                {{ parseInt(pembayaran.bayar_angsuran).toLocaleString("US") }}
                <span v-show="pembayaran.bayar_denda > 0">,denda
                  {{
                    parseInt(pembayaran.bayar_denda).toLocaleString("US")
                  }}</span>
              </n-tag>
            </n-space>
          </div>
        </div>
        <div class="flex gap-2">
          <label>Status</label><span>
            <n-tag strong :type="statusTag(bodyModal.STATUS)">
              {{ bodyModal.STATUS }}</n-tag></span>
        </div>
        <n-popconfirm :show-icon="false" @positive-click="handlePositiveClick(bodyModal.no_transaksi)"
          positive-text="konfirmasi" negative-text="reject"
          @negative-click="handleNegativeClick(bodyModal.no_transaksi)">
          <template #activator>
            <n-button :loading="loadingConf" type="primary" v-show="bodyModal.STATUS == 'PENDING'">Konfirmasi</n-button>
          </template>
          <n-input type="textarea" placeholder="keterangan" v-model:value="keterangan"></n-input>
        </n-popconfirm>
      </div>
      <div v-show="bodyModal.payment_method == 'transfer'">
        <n-divider>bukti transfer</n-divider>
        <n-image :src="bodyModal.attachment" class="max-w-36" />
      </div>
    </n-card>
  </n-modal>
</template>
<script setup>
import { useApi } from "../../../../helpers/axios";
// import { useSearch } from "../../../../helpers/searchObject";
import router from "../../../../router";
import _ from "lodash";
import {
  AccessTimeRound as pendingIcon,
  OpenInFullRound as fullIcon,
} from "@vicons/material";
import {
  useMessage,
  NIcon,
  NTag,
  NButton,
  NBadge,
  NInput,
  useLoadingBar,
  ellipsisProps,
} from "naive-ui";
import { computed, onMounted, reactive, h, ref } from "vue";
const searchField = ref(false);
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
    api: "payment",
    token: userToken,
  });
  if (!response.ok) {
    console.log(reponse.error);
  } else {
    loadingBar.finish();
    loadDataPayment.value = false;
    dataPayment.value = response.data;
    dataPending.value = _.filter(dataPayment.value, { STATUS: "PENDING" });
  }
};
const handleExpand = () => {
  const fullPage = router.resolve({ name: "expand transaction" });
  window.open(fullPage.href, "_blank");
};
onMounted(() => getDataPayment());
</script>
