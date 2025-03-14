<template>
  <n-card title="Inquery Piutang" :segmented="true">
    <TabInqPinjaman :columns="columnsPinjaman" :data="dataInqPinjaman" :loading="loadInqPinjaman"
                    @cari="handleCariInqPinjaman" :available="inqView"/>
  </n-card>
  <n-modal v-model:show="modalDetail">
    <n-card content-style="padding: 0;" class="w-11/12">
      <n-tabs type="line" :tabs-padding="20" pane-style="padding: 20px;" @before-leave="handleBeforeLeaveModal">
        <n-tab-pane name="Kartu Piutang">
          <n-spin v-if="spinAngsuran"/>
          <n-card v-else>
            <div ref="printKartuRef" class="p-4">
              <div
                  class="flex items-center gap-2 pb-2 justify-between border-b border-dashed border-black">
                <div class="flex gap-2 items-center">
                  <img class="h-10 md:h-10" :src="applogo" alt="logo_company"/>
                  <div class="flex-col">
                    <div class="text-xl font-bold">{{ apptitle }}</div>
                    <div class="small">POS {{ me.me.cabang_nama }}</div>
                  </div>
                </div>
                <div class="text-lg font-bold hidden md:flex">KARTU PIUTANG</div>
              </div>
              <div class="grid grid-cols-2 font-mono border-b border-dashed border-black">
                <table>
                  <tr>
                    <td>NO KONTRAK</td>
                    <td>:</td>
                    <td>{{ dataHeaderAngsuran.no_kontrak }}</td>
                  </tr>
                  <tr>
                    <td>TGL KONTRAK</td>
                    <td>:</td>
                    <td>{{ dataHeaderAngsuran.tgl_kontrak }}</td>
                  </tr>
                  <tr>
                    <td>PELANGGAN</td>
                    <td>:</td>
                    <td>
                      {{ dataHeaderAngsuran.nama }}/
                      {{ dataHeaderAngsuran.no_pel }}
                    </td>
                  </tr>
                </table>
                <table>
                  <tr>
                    <td>STATUS</td>
                    <td>:</td>
                    <td>{{ dataHeaderAngsuran.status }}
                    </td>
                  </tr>
                </table>
              </div>
              <div class="font-mono border-b border-dashed border-black">
                <table class="w-full">
                  <tr class="border-b border-dashed border-black">
                    <th class="p-2" align="right"
                        v-for="head in convertObjectToArray(dataDetailAngsuran)" :key="head.id">{{
                        head.title
                      }}
                    </th>
                  </tr>
                  <tr v-for="list in convertToValuesArray(dataDetailAngsuran)" :key="list.id">
                    <td v-for="item in list" :key="item.id" align="right">{{ item }}</td>
                  </tr>
                  <tr class="border-t border-dashed border-black">
                    <td colspan="3">JUMLAH</td>
                    <th align="right">
                      {{ dataFooter.ttlAmtAngs.toLocaleString() }}
                    </th>
                    <th align="right" colspan="3">
                    </th>

                    <th align="right">
                      {{ dataFooter.ttlAmtBayar.toLocaleString()}}
                    </th>
                    <th align="right">
                      {{ dataFooter.ttlSisaAngs.toLocaleString() }}
                    </th>
                    <th align="right">
                      {{ dataFooter.ttlDenda.toLocaleString() }}
                    </th>
                    <th align="right">
                      {{ dataFooter.ttlBayarDenda.toLocaleString() }}
                    </th>
                    <th align="right">
                    </th>
                  </tr>
                </table>
              </div>
            </div>
            <template #footer>
              <n-button type="primary" @click="handlePrintKartu">Cetak Kartu Piutang</n-button>
            </template>
          </n-card>
        </n-tab-pane>
        <n-tab-pane name="Pelanggan">
          <n-scrollbar style="max-height: 500px" trigger="none">
            <div class="grid grid-cols-5 gap-4">
              <div class="flex flex-col" v-for="(val, name) in dataDetailPelanggan.pelanggan"
                   :key="val.id">
                <small class="text-reg">{{ name.toUpperCase() }}</small>
                <n-text strong class="text-md border-b"> {{ val ? val : 'N/A' }}</n-text>
              </div>
              <div class="flex flex-col" v-for="(val, name) in dataDetailPelanggan.pekerjaan"
                   :key="val.id">
                <small class="text-reg">{{ name.toUpperCase() }}</small>
                <n-text strong class="text-md border-b "> {{ val ? val : 'N/A' }}</n-text>
              </div>
            </div>

            <n-divider title-placement="left">
              Kontak Darurat
            </n-divider>
            <div class="grid grid-cols-5 gap-4 font-mono">
              <div class="flex flex-col" v-for="(val, name) in dataDetailPelanggan.kerabat_darurat"
                   :key="val.id">
                <small class="text-reg">{{ name.toUpperCase() }}</small>
                <n-text strong class="text-md border-b"> {{ val ? val : 'N/A' }}</n-text>
              </div>
            </div>
            <n-divider title-placement="left">
              Informasi Alamat Identitas
            </n-divider>
            <div class="grid grid-cols-5 gap-4 font-mono">
              <div class="flex flex-col" v-for="(val, name) in dataDetailPelanggan.alamat_identitas"
                   :key="val.id">
                <small class="text-reg">{{ name.toUpperCase() }}</small>
                <n-text strong class="text-md border-b"> {{ val ? val : 'N/A' }}</n-text>
              </div>
            </div>
            <n-divider title-placement="left">
              Informasi Alamat Tagih
            </n-divider>
            <div class="grid grid-cols-5 gap-4 font-mono">
              <div class="flex flex-col" v-for="(val, name) in dataDetailPelanggan.alamat_tagih"
                   :key="val.id">
                <small class="text-reg">{{ name.toUpperCase() }}</small>
                <n-text strong class="text-md border-b"> {{ val ? val : 'N/A' }}</n-text>
              </div>
            </div>
          </n-scrollbar>
        </n-tab-pane>
        <n-tab-pane name="Pinjaman">
          <n-spin :show="spinPinjaman">
            <div class="grid grid-rows-4 grid-flow-col gap-4 font-mono" v-if="dataDetailPinjaman">
              <div class="flex flex-col" v-for="list in dataDetailPinjaman"
                   :key="list.id">
                <small class="text-reg">{{ list.title.toUpperCase() }}</small>
                <n-text strong class="text-md border-b"> {{ list.value ? list.value : 'N/A' }}</n-text>
              </div>
            </div>
          </n-spin>
        </n-tab-pane>
        <n-tab-pane name="Jaminan">
          <n-spin :show="spinJaminan">
            <table class="font-mono">
              <thead>
              <th v-for="head in convertObjectToArray(dataDetailJaminan)" class="py-2 px-1 border border-black"
                  :key="head.id">{{ head.title }}
              </th>
              </thead>
              <tbody>
              <tr v-for="body in dataDetailJaminan" :key="body.id">
                <td v-for="head in convertObjectToArray(dataDetailJaminan)" class="text-[12px] px-1 border border-black"
                    :key="head.id">
                  {{ body[head.title] }}
                </td>
              </tr>
              </tbody>
            </table>
          </n-spin>
        </n-tab-pane>
        <n-tab-pane name="Pembayaran">
          <n-spin :show="spinPembayaran">
            <table class="font-mono">
              <thead>
              <th v-for="head in convertObjectToArray(dataDetailPembayaran)" class="py-2 border border-black"
                  :key="head.id">{{ head.title }}
              </th>
              </thead>
              <tbody>
              <tr v-for="body in dataDetailPembayaran" :key="body.id">
                <td v-for="head in convertObjectToArray(dataDetailPembayaran)"
                    class="text-[12px] px-1 border border-black"
                    :key="head.id">{{ body[head.title] }}
                </td>
              </tr>
              </tbody>
            </table>
          </n-spin>
        </n-tab-pane>
        <n-tab-pane name="Tunggakan">
          <table class="font-mono">
            <thead>
            <th v-for="head in convertObjectToArray(dataDetailTunggakan)" class="py-2 border border-black"
                :key="head.id">{{ head.title }}
            </th>
            </thead>
            <tbody>
            <tr v-for="body in dataDetailTunggakan" :key="body.id">
              <td v-for="head in convertObjectToArray(dataDetailTunggakan)" class="border border-black"
                  :key="head.id">{{ body[head.title] }}
              </td>
            </tr>
            </tbody>
          </table>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </n-modal>
</template>

<script setup>
import {ref, h} from "vue";
import {useApi} from "../../../helpers/axios";


import {
  useMessage, NButton,
} from "naive-ui";

import TabInqPinjaman from "./TabInqPinjaman.vue";

import {useMeStore} from "../../../stores/me.js";
import {useVueToPrint} from "vue-to-print";

const apptitle = import.meta.env.VITE_APP_TITLE;
const applogo = import.meta.env.VITE_APP_LOGO;
const message = useMessage();
const me = useMeStore();
const dataArusKas = ref([]);

const spinPinjaman = ref(false);
const spinJaminan = ref(false);

const printKartuRef = ref(null);
const {handlePrint} = useVueToPrint({
  content: printKartuRef,
  documentTitle: "Kartu Piutang",
});
const handlePrintKartu = () => {
  handlePrint();
}
const columns = [
  {
    title: "Tanggal",
    key: "ENTRY_DATE",
    sorter: "default",
  },
  {
    title: "Type",
    key: "TYPE",
    sorter: "default",
    filterOptions: [
      {
        label: 'CASH-IN',
        value: 'CASH-IN'
      },
      {
        label: 'CASH-OUT',
        value: 'CASH-OUT'
      }
    ],
    filter(value, row) {
      return !!~row.TYPE.indexOf(value);
    }
  },
  {
    title: "Keterangan",
    key: "JENIS",
    sorter: "default",
  },
  {
    title: "Cabang",
    key: "BRANCH",
    sorter: "default",
  },
  {
    title: "Jumlah",
    align: "right",
    key: "ORIGINAL_AMOUNT",
    sorter: "default",
    render(row) {
      return h("div", row.ORIGINAL_AMOUNT.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }));
    }
  },
];

const convertObjectToArray = (obj) => {
  if (!Array.isArray(obj) || obj.length === 0) {
    return [];
  }
  const keys = Object.keys(obj[0]);
  return keys.map(key => ({title: key, key: key}));
}

function convertToValuesArray(dataArray) {
  if (dataArray) {
    return dataArray.map(item => Object.values(item));
  } else {
    return [];
  }
}

const columnsPinjaman = [
  {
    title: "Nomor Order",
    key: "loan_number",
    sorter: "default",
  }, {
    title: "Nama Debitur",
    key: "customer_name",
    sorter: "default",
  }, {
    title: "Nomor Polisi",
    key: "police_number",
    sorter: "default",
  }, {
    title: "Tanggal Pencairan",
    key: "entry_date",
    sorter: "default",
  }, {
    title: "Cabang",
    key: "branch_name",
    sorter: "default",
  },
  {
    title: "Action",
    align: "right",
    width: 100,
    key: "more",
    render(row) {
      return h(
          NButton,
          {
            secondary: false,
            size: "small",
            onClick: () => handleDetailRow(row),
          },
          {
            default: "detail",
          }
      );
    },
  },

];

let messageReactive = null;


const modalDetail = ref(false);
const modalBody = ref();
const handleDetailRow = async (e) => {

  let trow = await e;
  getDetailPelanggan(trow.cust_id);
  modalBody.value = e;
  getDetailAngsuran(trow.loan_number);
  getDetailPinjaman(trow.credit_id);
  modalDetail.value = true;

}

const loadData = ref(false);

const handleBeforeLeaveModal = (t) => {
  switch (t) {
    case "Pelanggan":
      getDetailPelanggan(modalBody.value.cust_id);
      return true;
    case "Jaminan":
      getDetailJaminan(modalBody.value.credit_id);
      return true;
    case "Pinjaman":
      getDetailPinjaman(modalBody.value.credit_id);
      return true;
    case "Pembayaran":
      getDetailPembayaran(modalBody.value.loan_number);
      return true;
    case "Angsuran":
      getDetailAngsuran(modalBody.value.loan_number);
      return true;
    case "Tunggakan":
      getDetailTunggakan(modalBody.value.loan_number);
      return true;
    default:
      return true;
  }
}

const dataDetailPelanggan = ref();
const dataPelanggan = ref([]);
const dataPekerjaan = ref([]);
const alamatIdentitas = ref([]);
const alamatTagih = ref([]);
const getDetailPelanggan = async (e) => {
  let userToken = localStorage.getItem("token");
  const response = await useApi({
    method: "GET",
    api: `customerReport/${e}`,
    token: userToken,
  });
  if (!response.ok) {
    message.error("ERROR API");
  } else {
    Object.assign(dataPelanggan.value, response.data.pelanggan);
    Object.assign(dataPekerjaan.value, response.data.pekerjaan);
    Object.assign(alamatIdentitas.value, response.data.alamat_identitas);
    Object.assign(alamatTagih.value, response.data.alamat_tagih);
    dataDetailPelanggan.value = response.data;
  }
}
const dataDetailJaminan = ref();
const getDetailJaminan = async (e) => {
  let userToken = localStorage.getItem("token");
  spinJaminan.value = true;
  const response = await useApi({
    method: "GET",
    api: `collateralReport/${e}`,
    token: userToken,
  });
  if (!response.ok) {
    message.error("ERROR API");
  } else {
    spinJaminan.value = false;
    dataDetailJaminan.value = response.data;
  }
}
const dataDetailPinjaman = ref();
const getDetailPinjaman = async (e) => {
  spinPinjaman.value = true;
  let userToken = localStorage.getItem("token");
  const response = await useApi({
    method: "GET",
    api: `creditReport/${e}`,
    token: userToken,
  });
  if (!response.ok) {
    message.error("ERROR API");
  } else {
    spinPinjaman.value = false;
    dataDetailPinjaman.value = response.data;
  }
}

const dataDetailPembayaran = ref();
const spinPembayaran = ref(false);
const getDetailPembayaran = async (e) => {
  spinPembayaran.value = true;
  let userToken = localStorage.getItem("token");
  const response = await useApi({
    method: "GET",
    api: `paymentReport/${e}`,
    token: userToken,
  });
  if (!response.ok) {
    message.error("ERROR API");
  } else {
    spinPembayaran.value = false;
    dataDetailPembayaran.value = response.data;
  }
}

const dataDetailAngsuran = ref();
const dataHeaderAngsuran = ref();
const dataFooter = ref();
const spinAngsuran = ref(false);
const getDetailAngsuran = async (e) => {
  spinAngsuran.value = true;
  let userToken = localStorage.getItem("token");
  const response = await useApi({
    method: "GET",
    api: `strukturCredit/${e}`,
    token: userToken,
  });
  if (!response.ok) {
    message.error("ERROR API ");
  } else {
    spinAngsuran.value = false;
    dataFooter.value = response.data.total;
    dataHeaderAngsuran.value = response.data.detail;
    dataDetailAngsuran.value = response.data.data_credit;
  }
}


const dataDetailTunggakan = ref();
const spinTunggakan = ref(false);
const getDetailTunggakan = async (e) => {
  spinTunggakan.value = true;
  let userToken = localStorage.getItem("token");
  const response = await useApi({
    method: "GET",
    api: `arrearsReport/${e}`,
    token: userToken,
  });
  if (!response.ok) {
    message.error("ERROR API");
  } else {
    spinTunggakan.value = false;
    dataDetailTunggakan.value = response.data;
  }
}

const getArusKas = async (e) => {
  message.loading('memuat data LKBH');
  let userToken = localStorage.getItem("token");
  const response = await useApi({
    method: "POST",
    api: "arus_kas",
    data: e,
    token: userToken,
  });
  if (!response.ok) {
    console.log(reponse.error);
  } else {
    loadData.value = false;
    dataArusKas.value = response.data;
  }
}
const dataListBan = ref([]);
const loadListingBeban = ref(false);


const getListBan = async () => {
  messageReactive = message.loading('memuat data listing beban', {duration: 0});
  loadListingBeban.value = true;
  let userToken = localStorage.getItem("token");
  const response = await useApi({
    method: "GET",
    api: "listBan",
    token: userToken,
  });
  if (!response.ok) {
    console.log(reponse.error);
  } else {
    loadListingBeban.value = false;
    messageReactive.destroy();
    messageReactive = null;
    dataListBan.value = response.data;
  }
}

const dataInqPinjaman = ref();
const loadInqPinjaman = ref(false);
const inqView = ref(false);
const handleCariInqPinjaman = (e) => {
  getInqPinjaman(e);
  inqView.value = true;
}
const getInqPinjaman = async (e) => {
  loadInqPinjaman.value = true;
  messageReactive = message.loading('memuat inquery pinjaman');
  let userToken = localStorage.getItem("token");
  const response = await useApi({
    method: "POST",
    data: e,
    api: "inquiryList",
    token: userToken,
  });
  if (!response.ok) {
    console.log(reponse.error);
  } else {
    messageReactive.destroy();
    messageReactive = null;
    loadInqPinjaman.value = false;
    dataInqPinjaman.value = response.data;
  }
}


</script>

<style lang="scss" scoped></style>
