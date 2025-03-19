<template>
  <div>
    <n-space vertical>
      <n-card :title="`Laporan`">
        <n-tabs type="card" animated @before-leave="handleBeforeLeave" @update:value="handleUpdateValue">
          <n-tab-pane name="inq_pinjaman" tab="INQUERY PIUTANG">
            <TabInqPinjaman :columns="columnsPinjaman" :data="dataInqPinjaman" :loading="loadInqPinjaman"
                            @cari="handleCariInqPinjaman" :available="inqView"/>
          </n-tab-pane>
          <n-tab-pane name="arus_kas" tab="LKBH">
            <TabArusKas :data="dataArusKas" :columns="columns" :load="loadData" :page-size="10"
                        @filter-form="handleRange"/>
          </n-tab-pane>
          <n-tab-pane name="listing_beban" tab="LISTING BEBAN">
            <TabListBan :data="dataListBan" :columns="convertObjectToArray(dataListBan)" :load="loadListingBeban"
                        :page-size="10"
                        @filter-form="handleRange"/>
          </n-tab-pane>
          <!--          <n-tab-pane name="lkbh" tab="LKBH">-->
          <!--            <TabArusKas :data="dataArusKas" :columns="columns" :load="loadData" :page-size="10"-->
          <!--                        @filter-form="handleRange"/>-->
          <!--          </n-tab-pane>-->
        </n-tabs>

      </n-card>
    </n-space>
    <n-modal v-model:show="modalDetail">
      <n-card content-style="padding: 0;" class="w-11/12 ">
        <n-tabs
            type="line"
            :tabs-padding="20"
            pane-style="padding: 20px;"
            @before-leave="handleBeforeLeaveModal"
        >
          <n-tab-pane name="Kartu Piutang">
            <n-spin v-if="spinAngsuran"/>
            <n-card v-else>
              <div ref="printKartuRef" class="p-4">
                <div class="flex items-center gap-2 pb-2 justify-between border-b border-dashed border-black">
                  <div class="flex gap-2 items-center">
                    <img
                        class="h-10 md:h-10"
                        :src="applogo"
                        alt="logo_company"
                    />
                    <div class="flex-col">
                      <div class="text-xl font-bold">{{apptitle}}</div>
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
                      <th class="p-2" align="right" v-for="head in convertObjectToArray(dataDetailAngsuran)"
                          :key="head.id">{{
                          head.title
                        }}
                      </th>
                    </tr>
                    <tr v-for="list in convertToValuesArray(dataDetailAngsuran)" :key="list.id">
                      <td v-for="item in list" :key="item.id" align="right">{{ item }}</td>
                    </tr>
                    <!--                    <tr class="border-t border-dashed border-black">-->
                    <!--                      <td colspan="3">JUMLAH</td>-->
                    <!--                      <th align="right">-->
                    <!--                        {{-->
                    <!--                          convertToValuesArray(dataDetailAngsuran).reduce((sum, row) => sum + parseInt(row[3].replace(/,/g, '')), 0).toLocaleString('US')-->
                    <!--                        }}-->
                    <!--                      </th>-->
                    <!--                      <th align="right">-->
                    <!--                        {{-->
                    <!--                          convertToValuesArray(dataDetailAngsuran).reduce((sum, row) => sum + parseInt(row[4].replace(/,/g, '')), 0).toLocaleString('US')-->
                    <!--                        }}-->
                    <!--                      </th>-->
                    <!--                      <th align="right">-->
                    <!--                        {{-->
                    <!--                          convertToValuesArray(dataDetailAngsuran).reduce((sum, row) => sum + parseInt(row[5].replace(/,/g, '')), 0).toLocaleString('US')-->
                    <!--                        }}-->
                    <!--                      </th>-->
                    <!--                      <th align="right">-->
                    <!--                        {{-->
                    <!--                          convertToValuesArray(dataDetailAngsuran).reduce((sum, row) => sum + parseInt(row[6].replace(/,/g, '')), 0).toLocaleString('US')-->
                    <!--                        }}-->
                    <!--                      </th>-->
                    <!--                      <th align="right">-->
                    <!--                        {{-->
                    <!--                          convertToValuesArray(dataDetailAngsuran).reduce((sum, row) => sum + parseInt(row[7].replace(/,/g, '')), 0).toLocaleString('US')-->
                    <!--                        }}-->
                    <!--                      </th>-->
                    <!--                      <th align="right">-->
                    <!--                        {{-->
                    <!--                          convertToValuesArray(dataDetailAngsuran).reduce((sum, row) => sum + parseInt(row[8].replace(/,/g, '')), 0).toLocaleString('US')-->
                    <!--                        }}-->
                    <!--                      </th>-->
                    <!--                      <th align="right">-->
                    <!--                        {{-->
                    <!--                          convertToValuesArray(dataDetailAngsuran).reduce((sum, row) => sum + parseInt(row[9].replace(/,/g, '')), 0).toLocaleString('US')-->
                    <!--                        }}-->
                    <!--                      </th>-->
                    <!--                      <th align="right">-->
                    <!--                        {{-->
                    <!--                          convertToValuesArray(dataDetailAngsuran).reduce((sum, row) => sum + parseInt(row[10].replace(/,/g, '')), 0).toLocaleString('US')-->
                    <!--                        }}-->
                    <!--                      </th>-->
                    <!--                    </tr>-->
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
              <n-form ref="formPelanggan" :model="dataPelanggan" :rules="rulesPelanggan"
                      :label-placement="width <= 920 ? 'top' : 'top'" require-mark-placement="right-hanging"
                      :disabled="true" label-width="auto">
                <div class="flex w-full gap-2">
                  <n-form-item label="Nama" path="nama" class="w-full">
                    <n-input placeholder="nama" v-model:value="dataPelanggan.nama"
                             @input="$event => (dataPelanggan.nama = $event.toUpperCase())"/>
                  </n-form-item>
                  <n-form-item label="Nama Panggilan" path="nama_panggilan" class="w-full">
                    <n-input placeholder="nama panggilan" v-model:value="dataPelanggan.nama_panggilan"
                             @input="$event => (dataPelanggan.nama_panggilan = $event.toUpperCase())"/>
                  </n-form-item>
                </div>
                <div class="flex w-full gap-2">
                  <n-form-item label="Jenis kelamin" path="jenis_kelamin" class="w-full">
                    <n-select filterable placeholder="Jenis Kelamin" :options="optJenisKelamin"
                              v-model:value="dataPelanggan.jenis_kelamin"/>
                  </n-form-item>
                  <n-form-item label="Tempat Lahir" path="tempat_lahir" class="w-full">
                    <n-input placeholder="tempat lahir" v-model:value="dataPelanggan.tempat_lahir"
                             @input="$event => (dataPelanggan.tempat_lahir = $event.toUpperCase())"/>
                  </n-form-item>
                  <n-form-item label="Tanggal lahir" path="tgl_lahir" class="w-full">
                    <n-date-picker placeholder="Tanggal Lahir" v-model:formatted-value="dataPelanggan.tgl_lahir"
                                   value-format="yyyy-MM-dd" format="dd-MM-yyyy" type="date"
                                   @update:value="handleTanggalLahir" class="w-full"/>
                    <span
                        class="absolute text-xs text-orange-500 top-6 bg-orange-50 w-full p-0.5 mt-2 animate-pulse"
                        v-show="notifUsia">{{ noteUsia }}</span>
                  </n-form-item>
                  <n-form-item label="Status Kawin" path="status_kawin" class="w-full">
                    <n-input-group>
                      <n-select filterable placeholder="Status Kawin" :options="optStatusKawin"
                                v-model:value="dataPelanggan.status_kawin"/>
                    </n-input-group>
                  </n-form-item>
                </div>
                <div class="flex w-full gap-2">
                  <n-form-item label="Tipe Identitas" path="tipe_identitas" class="w-full">
                    <n-select filterable placeholder="Jenis Identitas" :options="optJenisIdentitas"
                              v-model:value="dataPelanggan.tipe_identitas"/>
                  </n-form-item>
                  <n-form-item label="No Identitas" path="no_identitas" class="w-full">
                    <n-input :allow-input="onlyAllowNumber" class="w-full" placeholder="No Identitas" show-count
                             :maxlength="16" v-model:value="dataPelanggan.no_identitas">
                    </n-input>
                  </n-form-item>
                  <n-form-item label="No KK" path="no_kk" class="w-full">
                    <n-input :allow-input="onlyAllowNumber" placeholder="No Kartu Keluarga"
                             v-model:value="dataPelanggan.no_kk" show-count :maxlength="16"/>
                  </n-form-item>
                </div>
              </n-form>
              <n-form ref="formPelangganPekerjaan" :model="dataPekerjaan" :rules="rulesPekerjaan" :disabled="true"
                      :label-placement="width <= 920 ? 'top' : 'top'" require-mark-placement="right-hanging"
                      label-width="auto">
                <div class="flex gap-4">
                  <n-form-item label="Sektor" path="pekerjaan_id" class="w-full">
                    <n-select filterable placeholder="pekerjaan" :options="optPekerjaan"
                              v-model:value="dataPekerjaan.pekerjaan_id"/>
                  </n-form-item>
                  <n-form-item label="Pendidikan" path="pendidikan" class="w-full">
                    <n-select filterable placeholder="pendidikan" :options="optPendidikan"
                              v-model:value="dataPekerjaan.pendidikan"/>
                  </n-form-item>
                </div>
                <div class="flex gap-2">
                  <n-form-item label="Telepon Selullar 1" path="telepon_selular" class="w-full">
                    <n-input placeholder="Telepon Sellular 1" :allow-input="onlyAllowNumber"
                             v-model:value="dataPekerjaan.telepon_selular" maxlength="13"/>
                  </n-form-item>

                  <n-form-item label="Telepon Selullar 2" path="telepon_rumah" class="w-full">
                    <n-input placeholder="Telepon Sellular 2" v-model:value="dataPekerjaan.telepon_rumah"
                             :allow-input="onlyAllowNumber">
                    </n-input>
                  </n-form-item>
                </div>
                <n-divider title-placement="left">
                  Informasi Alamat Identitas
                </n-divider>
              </n-form>
              <n-form ref="formPelangganAlamatIdentitas" :model="alamatIdentitas" :rules="rulesIdentitas"
                      :disabled="true" :label-placement="width <= 920 ? 'top' : 'top'"
                      require-mark-placement="right-hanging" label-width="auto">
                <div class="flex gap-2">
                  <n-form-item label="Alamat" class="w-full" path="alamat">
                    <n-input placeholder="Alamat" v-model:value="alamatIdentitas.alamat"
                             @input="$event => (alamatIdentitas.alamat = $event.toUpperCase())"/>
                  </n-form-item>
                  <n-form-item label="RT" path="rt">
                    <n-input placeholder="RT" v-model:value="alamatIdentitas.rt" :allow-input="onlyAllowNumber"
                             :maxlength="3" @input="$event => (alamatIdentitas.rt = $event.toUpperCase())">
                    </n-input>
                  </n-form-item>
                  <n-form-item label="RW" path="rw">
                    <n-input placeholder="RW" v-model:value="alamatIdentitas.rw" :allow-input="onlyAllowNumber"
                             :maxlength="3" @input="$event => (alamatIdentitas.rw = $event.toUpperCase())">
                    </n-input>
                  </n-form-item>
                </div>

                <select-state-region v-model:provinsi="alamatIdentitas.provinsi" v-model:kota="alamatIdentitas.kota"
                                     v-model:kecamatan="alamatIdentitas.kecamatan"
                                     v-model:desa="alamatIdentitas.kelurahan"
                                     v-model:kodepos="alamatIdentitas.kode_pos"/>
                <n-divider title-placement="left">
                  Informasi Alamat Tagih
                </n-divider>
              </n-form>
              <n-form ref="formPelangganAlamatTagih" :model="alamatTagih" :rules="rulesAlamatTagih"
                      :disabled="true" :label-placement="width <= 920 ? 'top' : 'top'"
                      require-mark-placement="right-hanging" label-width="auto">
                <div class="flex gap-2">
                  <n-form-item label="Alamat" class="w-full" path="alamat">
                    <n-input placeholder="Alamat" v-model:value="alamatTagih.alamat"
                             @input="$event => (alamatTagih.alamat = $event.toUpperCase())"/>
                  </n-form-item>
                  <n-form-item label="RT" path="rt">
                    <n-input placeholder="RT" v-model:value="alamatTagih.rt" :allow-input="onlyAllowNumber"
                             :maxlength="3" @input="$event => (alamatTagih.rt = $event.toUpperCase())">
                    </n-input>
                  </n-form-item>
                  <n-form-item label="RW" path="rw">
                    <n-input placeholder="RW" v-model:value="alamatTagih.rw" :allow-input="onlyAllowNumber"
                             :maxlength="3" @input="$event => (alamatTagih.rw = $event.toUpperCase())">
                    </n-input>
                  </n-form-item>
                </div>
                <select-state-region v-model:provinsi="alamatTagih.provinsi" v-model:kota="alamatTagih.kota"
                                     v-model:kecamatan="alamatTagih.kecamatan" v-model:desa="alamatTagih.kelurahan"
                                     v-model:kodepos="alamatTagih.kode_pos"/>

              </n-form>
            </n-scrollbar>
          </n-tab-pane>
          <n-tab-pane name="Pinjaman">
            <n-spin :show="spinPinjaman">
              <div class="grid grid-rows-4 grid-flow-col gap-2 " v-if="dataDetailPinjaman">
                <n-form-item :label="list.title" path="status" class="w-full" v-for="list in dataDetailPinjaman"
                             :key="list.id">
                  <n-input :value="list.value" disabled></n-input>
                </n-form-item>

              </div>
            </n-spin>
          </n-tab-pane>
          <n-tab-pane name="Jaminan">
            <n-spin :show="spinJaminan">
              <n-data-table :data="dataDetailJaminan" :columns="convertObjectToArray(dataDetailJaminan)" sortable/>
            </n-spin>
          </n-tab-pane>
          <n-tab-pane name="Angsuran">
            <n-spin :show="spinAngsuran">
              <n-data-table :data="dataDetailAngsuran"
                            :columns="convertObjectToArray(dataDetailAngsuran)"></n-data-table>
            </n-spin>
          </n-tab-pane>
          <n-tab-pane name="Pembayaran">
            <n-spin :show="spinPembayaran">
              <n-data-table :data="dataDetailPembayaran"
                            :columns="convertObjectToArray(dataDetailPembayaran)"></n-data-table>
            </n-spin>
          </n-tab-pane>
          <n-tab-pane name="Tunggakan">
            <n-data-table :data="dataDetailTunggakan"
                          :columns="convertObjectToArray(dataDetailTunggakan)"></n-data-table>
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </n-modal>
  </div>
</template>
<script setup>
import {ref, h} from "vue";
import {useApi} from "../../../helpers/axios";


import {
  useMessage, NButton,
} from "naive-ui";
import TabArusKas from "./TabArusKas.vue";
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
  modalDetail.value = true;
  let trow = await e;
  getDetailPelanggan(trow.cust_id);
  modalBody.value = e;
  getDetailAngsuran(trow.loan_number);
  getDetailPinjaman(trow.credit_id);
}

const loadData = ref(false);
const handleRange = (value) => {
  getArusKas(value);
}

const handleBeforeLeave = async (t) => {
  switch (t) {
    case "arus_kas":
      await getArusKas();
      return true;
    case "inq_pinjaman":
      await getInqPinjaman();
      return true;
    case "pembayaran":
      await getDetailPembayaran();
      return true;
    case "listing_beban":
      await getListBan();
      return true;
    default:
      return true;
  }
}
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
