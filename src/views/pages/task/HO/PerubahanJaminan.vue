<template>
  <n-card size="small" :segmented="true">
    <template #header>Perubahan Jaminan</template>
    <!-- <template #header-extra>
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
    </template> -->
    <div>
      <n-data-table striped size="small" :row-key="(row) => row.loan_number" :columns="columns" :data="dataPayment"
        class="pb-2" :pagination="pagination" :loading="loadDataPayment" />
    </div>
  </n-card>
  <n-modal v-model:show="showModal">
    <n-card title="Konfirmasi perubahan data jaminan" class="w-1/2" :segmented="true" size="small">
      <template #header-extra>
        <n-space>
          <n-button type="error" secondary size="small" @click="handleTolak(bodyModal.id)">Tolak</n-button>
          <n-button type="success" size="small" @click="handleSetuju(bodyModal.id)">Setuju</n-button>

        </n-space>
      </template>
      <div class="grid grid-cols-3 gap-4 p-2">
        <div class="flex flex-col">
          <small class="text-reg">Tanggal</small>
          <n-text strong class="text-md border-b"> {{ bodyModal.tanggal }}</n-text>
        </div>
        <div class="flex flex-col">
          <small class="text-reg">Pemohon</small>
          <n-text strong class="text-md border-b"> {{ bodyModal.dari }}</n-text>
        </div>
        <div class="flex flex-col">
          <small class="text-reg">Keterangan</small>
          <n-text strong class="text-md border-b"> {{ bodyModal.keterangan ? bodyModal.keterangan : 'N/A' }}</n-text>
        </div>
      </div>
      <div class="gap-2 flex flex-col">
        <div class="border border-red-500 rounded-lg overflow-clip">
          <div class="border-b p-2 border-red-500 bg-red-50 font-bold">Data Lama</div>
          <div class="p-2">
            <div class="grid grid-cols-3 gap-4 p-2">
              <div class="flex flex-col">
                <small class="text-reg">Atas Nama</small>
                <n-text strong class="text-md border-b"> {{ bodyModal.atas_nama }}</n-text>
              </div>
              <div class="flex flex-col">
                <small class="text-reg">No Polisi</small>
                <n-text strong class="text-md border-b"> {{ bodyModal.no_polisi }}</n-text>
              </div>
              <div class="flex flex-col">
                <small class="text-reg">No Rangka</small>
                <n-text strong class="text-md border-b"> {{ bodyModal.no_rangka }}</n-text>
              </div>
              <div class="flex flex-col col-span-3">
                <small class="text-reg">Alamat BPKB</small>
                <n-text strong class="text-md border-b"> {{ bodyModal.alamat_bpkb }}</n-text>
              </div>
              <div class="flex flex-col">
                <small class="text-reg">No STNK</small>
                <n-text strong class="text-md border-b"> {{ bodyModal.no_stnk }}</n-text>
              </div>
              <div class="flex flex-col">
                <small class="text-reg">No Faktur</small>
                <n-text strong class="text-md border-b"> {{ bodyModal.no_faktur }}</n-text>
              </div>
              <div class="flex flex-col">
                <small class="text-reg">No Faktur</small>
                <n-text strong class="text-md border-b"> {{ bodyModal.tgl_stnk }}</n-text>
              </div>
            </div>
          </div>
        </div>
        <div class="border border-green-500 rounded-lg overflow-clip">
          <div class="border-b p-2 border-green-500 bg-green-50 font-bold">Data Baru</div>
          <div class="p-2">
            <div class="grid grid-cols-3 gap-4 p-2">
              <div class="flex flex-col">
                <small class="text-reg">Atas Nama</small>
                <n-text strong class="text-md border-b"> {{ bodyModal.after.atas_nama }}</n-text>
              </div>
              <div class="flex flex-col">
                <small class="text-reg">No Polisi</small>
                <n-text strong class="text-md border-b"> {{ bodyModal.after.no_polisi }}</n-text>
              </div>
              <div class="flex flex-col">
                <small class="text-reg">No Rangka</small>
                <n-text strong class="text-md border-b"> {{ bodyModal.after.no_rangka }}</n-text>
              </div>
              <div class="flex flex-col col-span-3">
                <small class="text-reg">Alamat BPKB</small>
                <n-text strong class="text-md border-b"> {{ bodyModal.after.alamat_bpkb }}</n-text>
              </div>
              <div class="flex flex-col">
                <small class="text-reg">No STNK</small>
                <n-text strong class="text-md border-b"> {{ bodyModal.after.no_stnk }}</n-text>
              </div>
              <div class="flex flex-col">
                <small class="text-reg">No Faktur</small>
                <n-text strong class="text-md border-b"> {{ bodyModal.after.no_faktur }}</n-text>
              </div>
              <div class="flex flex-col">
                <small class="text-reg">No Faktur</small>
                <n-text strong class="text-md border-b"> {{ bodyModal.after.tgl_stnk }}</n-text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </n-card>
  </n-modal>
</template>
<script setup>
import _ from "lodash";
import {
  NBadge,
  NButton,
  useDialog,
  useLoadingBar,
  useMessage
} from "naive-ui";
import { computed, h, onMounted, reactive, ref } from "vue";
import { useApi } from "../../../../helpers/axios";

const dialog = useDialog();
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
      title: "tanggal",
      sorter: "default",
      key: "tanggal",
    },
    {
      title: "dari",
      sorter: "default",
      key: "dari",
    },
    {
      title: "No Jaminan",
      sorter: "default",
      key: "no_bpkb",
    },
    {
      title: "Atas Nama",
      sorter: "default",
      key: "atas_nama",
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
const columns = createColumns();
const handleSetuju = (e) => {
  dialog.warning({
    title: 'Setuju ?',
    content: 'Yakin setujui perubahan jaminan?',
    positiveText: 'Ya',
    negativeText: 'Tidak',
    draggable: true,
    onPositiveClick: async () => {
      const response = await useApi({
        method: "POST",
        data: {
          request_id: e,
          flag_approval: 'yes'
        },
        api: "collateral_approval",
        token: localStorage.getItem('token'),
      });
      if (response.ok) {
        message.info('SELESAI');
        showModal.value=false;
        getDataPayment();
      }else{
         showModal.value=false;
      }
    },
    onNegativeClick: () => {
       
    }
  });
}
const handleTolak = (e) => {
  dialog.warning({
    title: 'Tolak ?',
    content: 'Yakin tolak perubahan jaminan?',
    positiveText: 'Ya',
    negativeText: 'Tidak',
    draggable: true,
    onPositiveClick: async () => {
      const response = await useApi({
        method: "POST",
        data: {
          request_id: e,
          flag_approval: 'no'
        },
        api: "collateral_approval",
        token: localStorage.getItem('token'),
      });
      if (response.ok) {
        message.info('SELESAI');
        getDataPayment();
        showModal.value=false;
      }else{
         showModal.value=false;
      }
    },
    onNegativeClick: () => {
       
    }
  });
}
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
