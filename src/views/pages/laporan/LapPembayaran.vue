<template>
  <n-card content-style="padding: 0;" :segmented="{
        content: true,
        footer: 'soft',
    }" size="small">
    <template #header>Laporan Pembayaran
    </template>
    <template #header-extra>
      <n-space>
        <n-button strong type="warning" @click="searchField=!searchField">
          <template #icon>
            <n-icon v-if="!searchField">
              <filter-icon/>
            </n-icon>
            <n-icon v-else>
              <close-icon/>
            </n-icon>
          </template>
          <span class="hidden md:flex">Filter</span>
        </n-button>
      </n-space>
    </template>
    <div>
      <div class="flex gap-2 p-4 bg-sc-50/50 border-b" v-if="searchField">

        <n-form-item label="POS" class="w-full" v-if="me.me.cabang_nama === 'Head Office'">
          <n-select :loading="loadingBranch" filterable placeholder="Pilih POS" label-field="nama"
                    value-field="id" :default-value="defBranch" :options="dataBranch"
                    v-model:value="selectBranch" />
        </n-form-item>
        <n-form-item label="TANGGAL" class="w-full">
          <n-date-picker placeholder="CARI TANGGAL" v-model:formatted-value="dynamicSearch.dari"
                         :default-value="Date.now()" clearable format="yyyy-MM-dd"
                         class="w-full"
          />
        </n-form-item>
        <n-form-item class="w-full">
          <n-button type="primary" @click="handleSearch" class="px-4"> Cari</n-button>
        </n-form-item>
      </div>
      <n-data-table ref="tableRef" striped size="small" :row-key="(row) => row.loan_number" :columns="columns"
                    :scroll-x="870" :data="showData" :max-height="500" :on-update:checked-row-keys="handleFasilitas"
                    :loading="loadDataPayment" class="p-4" :pagination="{ pageSize: 10 }"/>
    </div>
  </n-card>
  <n-modal class="w-fit" title="Upload Berkas Pencairan" v-model:show="showModal" :on-after-leave="onAfterLeave">
    <n-card title="Detail Pembayaran" :segmented="{
            content: true,
            footer: 'soft',
        }">
      <template #header-extra>
        <div class="flex gap-2">
          <n-space>
            <n-tag strong
                   :type="bodyModal.STATUS == 'PENDING' ? 'warning' : bodyModal.STATUS == 'PAID' ? 'success' : 'error'">
              {{ bodyModal.STATUS }}
            </n-tag>
            <n-button circle secondary @click="showModal = false">X</n-button>
          </n-space>
        </div>
      </template>

      <div ref="printReceiptRef" class="flex flex-col" :class="width > 850 ? 'p-4' : 'p-0'" v-if="!uploadState">
        <n-watermark
            :content="apptitle"
            cross
            selectable
            :font-size="16"
            :line-height="16"
            :width="192"
            :height="128"
            :x-offset="12"
            :y-offset="28"
            :rotate="-15"
        >
          <div class="p-2">
            <div class="flex items-center gap-2 pb-2 justify-between border-b border-dashed border-black">
              <div class="flex gap-2 items-center">
                <img class="h-10 md:h-10" :src="applogo" alt="logo_company"/>
                <div class="flex flex-col">
                  <span class="text-xl font-bold">{{ apptitle }}</span>
                  <n-text strong class="text-md"> POS: {{ bodyModal.cabang }}</n-text>
                </div>
              </div>
              <div class="text-lg font-bold hidden md:flex">KWITANSI {{
                  bodyModal.payment_type ==
                  'pelunasan' ? 'PELUNASAN' : 'PEMBAYARAN'
                }}
              </div>
            </div>
            <div class="flex justify-between">
              <n-text strong class="text-md"> {{ bodyModal.tgl_transaksi }}</n-text>
              <n-text strong class="text-md"> {{ bodyModal.payment_method == 'cash' ? 'TUNAI' : 'TRANSFER' }}</n-text>

            </div>
            <div class="flex justify-between border-b border-dashed border-black"
                 :class="width > 850 ? 'flex-row' : 'flex-col'">
              <div class="flex flex-col py-4">
                <small class="text-reg">No Transaksi : </small>
                <n-text class="text-reg font-bold"> {{ bodyModal.no_transaksi }}</n-text>
                <small class="text-reg">No Kontrak : </small>
                <n-text class="text-reg font-bold"> {{ bodyModal.no_fasilitas }}</n-text>
              </div>
              <div class="flex flex-col py-4">
                <small class="text-reg">Terima dari (No Pelanggan) : </small>
                <n-text class="text-lg font-bold"> {{ bodyModal.nama }}</n-text>
                <small class="text-reg">({{ bodyModal.cust_code }})</small>
              </div>
            </div>

            <div class="grid border-b border-dashed border-black pb-2"
                 :class="width > 850 ? 'grid-cols-5 gap-4' : 'grid-cols-1 '"
                 v-if="bodyModal.payment_type != 'pelunasan'">
              <div class="flex flex-col">
                <small class="text-reg">JML. ANGS</small>
                <n-text strong class="text-md"> {{
                    bodyModal.bayar_angsuran.toLocaleString('US') ?
                        bodyModal.bayar_angsuran.toLocaleString('US') : 'n/a'
                  }}
                </n-text>
              </div>
              <div class="flex flex-col">
                <small class="text-reg">JML. DENDA</small>
                <n-text strong class="text-md">
                  {{ bodyModal.bayar_denda.toLocaleString() }}
                </n-text>
              </div>
              <div class="flex flex-col">
                <small class="text-reg">CUST. BAYAR</small>
                <n-text strong class="text-md"> {{ bodyModal.jumlah_uang.toLocaleString("US") }}</n-text>
              </div>
              <div class="flex flex-col">
                <small class="text-reg">PEMBULATAN</small>
                <n-text strong class="text-md"> {{ bodyModal.pembulatan.toLocaleString() }}</n-text>
              </div>

              <div class="flex flex-col">
                <small class="text-reg">KEMBALIAN</small>
                <td>
                  <n-text strong class="text-md"> {{ bodyModal.kembalian.toLocaleString("US") }}</n-text>
                </td>
              </div>

            </div>
            <div class="grid border-b border-dashed border-black pb-2"
                 :class="width > 850 ? 'grid-cols-5 gap-4' : 'grid-cols-1 '" v-else>
              <div class="flex flex-col">
                <small class="text-reg">Total Pelunasan</small>
                <n-text class="text-md font-bold"> {{
                    bodyModal.total_bayar.toLocaleString('US') ?
                        bodyModal.total_bayar.toLocaleString('US') : 'n/a'
                  }}
                </n-text>
              </div>
              <div class="flex flex-col">
                <small class="text-reg">Pembulatan</small>
                <n-text class="text-md font-bold"> {{ bodyModal.pembulatan }}</n-text>
              </div>
              <div class="flex flex-col">
                <small class="text-reg">Cust. Bayar</small>
                <n-text class="text-md font-bold"> {{
                    bodyModal.jumlah_uang.toLocaleString("US")
                  }}
                </n-text>
              </div>
              <div class="flex flex-col">
                <small class="text-reg">Diskon</small>
                <n-text class="text-md font-bold"> {{
                    (bodyModal.total_bayar - bodyModal.jumlah_uang).toLocaleString("US")
                  }}
                </n-text>
              </div>
              <div class="flex flex-col">
                <small class="text-reg">Metode Pembayaran</small>
                <n-text class="text-md font-bold"> {{ bodyModal.payment_method }}
                  {{ bodyModal.payment_type == 'pelunasan' ? '/ pelunasan' : '' }}
                </n-text>
              </div>
            </div>
          </div>
          <div class="px-3">

            <table width="100%" class="border border-black" v-if="bodyModal.payment_type != 'pelunasan'">
              <tr>
                <th class="border border-black">ANGS. KE</th>
                <th class="border border-black">TANGGAL JT.</th>
                <th class="border border-black">BYR. ANGS</th>
                <th class="border border-black">BYR. DENDA</th>
                <th class="border border-black">DISKON</th>
                <!--              <th class="border border-black">Jumlah</th>-->
              </tr>
              <tr v-for="angs in bodyModal.struktur" :key="angs.id">
                <td class="border text-center border-black">{{ angs.angsuran_ke }}</td>
                <td class="border  border-black text-center">{{ angs.tgl_angsuran }}</td>
                <td class="border pe-2 border-black text-right">{{
                    parseInt(angs.bayar_angsuran).toLocaleString('US')
                  }}
                </td>
                <td class="border pe-2 border-black text-right">{{
                    parseInt(angs.bayar_denda).toLocaleString('US')
                  }}
                </td>
                <td align="right" class="border pe-2 border-black text-right">
                  {{
                    (angs.diskon_denda).toLocaleString(('US'))
                  }}
                </td>
                <!--              <td class="border pe-2 border-black text-right">-->
                <!--                {{ (parseInt(angs.bayar_denda) + parseInt(angs.bayar_pokok + angs.bayar_bunga)+parseInt(angs.diskon_pokok) +-->
                <!--                  parseInt(angs.diskon_bunga) + parseInt(angs.diskon_denda)).toLocaleString('US') }}-->
                <!--              </td>-->

              </tr>
              <!--            <tr>-->
              <!--              <td><strong>Total</strong></td>-->
              <!--              <td colspan="5" align="right" class="pe-2">-->
              <!--                <strong>{{ bodyModal.total_bayar.toLocaleString("US") }}</strong>-->
              <!--              </td>-->
              <!--            </tr>-->
            </table>
          </div>
          <div class="flex flex-col border-b border-dashed border-black pb-4 ms-3">
            <div class="flex gap-4">
              <div class="border-b border-black pt-20 px-4">
                <n-text strong class="text-md font-bold"> {{ bodyModal.created_by }}</n-text>
              </div>
              <div class="border-b border-black pt-20 px-4">
                <n-text strong class="text-md font-bold"> {{ bodyModal.nama }}</n-text>
              </div>
            </div>
          </div>
        </n-watermark>
      </div>
      <div v-else>
        <file-upload title="Upload Nota" type="nota" :idapp="bodyModal.payment_id" endpoint="payment_attachment"
                     :def_value="bodyModal.attachment"/>
      </div>
      <div v-show="bodyModal.payment_method == 'transfer'">
        <n-divider>bukti transfer</n-divider>
        <n-image :src="bodyModal.attachment" class="max-w-36"/>
      </div>
    </n-card>
  </n-modal>
  <n-modal v-model:show="confCancelModal" preset="dialog" draggable title="Konfirmasi"
           positive-text="Ya, Ajukan Sekarang !" negative-text="hmm, nanti dulu deh"
           @positive-click="postCancelPayment">
    <div>Batalin sekarang, yakin?
    </div>
    <n-input type="textarea" placeholder="isi dulu alasannya disini" v-model:value="bodyCancel.descr"/>
  </n-modal>
</template>
<script setup>
import {useApi} from "../../../helpers/axios";
import {useSearch} from "../../../helpers/searchObject";
import router from "../../../router";

import {
  FilterAltSharp as filterIcon,
  CloseRound as closeIcon,
  AttachFileFilled as fileIcon,
  LocalPrintshopOutlined as PrintIcon,
} from "@vicons/material";
import {useWindowSize} from "@vueuse/core";
import {useLoadingBar} from "naive-ui";

const loadingBar = useLoadingBar();
import {useMessage, NIcon, NTag, NButton, NInput, NImage} from "naive-ui";
import {computed, onMounted, reactive, ref, h} from "vue";
import {useVueToPrint} from "vue-to-print";
import {useMeStore} from "../../../stores/me.js";
const dataBranch = ref([]);
const selectBranch = ref();
const defBranch = ref('SEMUA CABANG');
const userToken = localStorage.getItem("token");
const loadingBranch = ref(false);
const apptitle = import.meta.env.VITE_APP_TITLE;
const applogo = import.meta.env.VITE_APP_LOGO;
const uploadState = ref(false);
const dynamicSearch = reactive({
  cabang_id:computed(()=>selectBranch.value),
  no_transaksi: '',
  atas_nama: '',
  no_kontrak: '',
  dari: null,
});
const searchField = ref(false);
const searchBox = ref();
const checkedRowCredit = ref([]);
const tableRef = ref();
const {width} = useWindowSize();
const printReceiptRef = ref();
const {handlePrint} = useVueToPrint({
  content: printReceiptRef,
  documentTitle: "Receipt",
});



const getBranch = async () => {
  loadingBranch.value = true;
  const response = await useApi({
    method: "GET",
    api: "cabang",
    token: userToken,
  });
  if (!response.ok) {
    message.error("ERROR API");
  } else {
    loadingBranch.value = false;

    if (me.me.cabang_nama != "Head Office") {
      defBranch.value = me.me.cabang_nama;
      selectBranch.value = me.me.cabang_id;
    } else {
      selectBranch.value = "SEMUA CABANG";
      dataBranch.value = response.data.response;
      dataBranch.value.unshift({
        id: "",
        nama: "SEMUA CABANG"
      });
    }
  }
}
const onAfterLeave = () => {
  getDataPayment();
}


const thisDays = computed(() => {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, '0'); // Ensure two digits
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = now.getFullYear();

  return `${day}-${month}-${year}`;
});

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

const confCancelModal = ref(false);
const bodyCancel = reactive({
  no_invoice: null,
  descr: null,
});

const handleCancelPayment = (e) => {
  const date = e.split(" ");
  if (date[0] == thisDays.value) {
    confCancelModal.value = true;
    bodyCancel.no_invoice = bodyModal.value.no_transaksi;
  } else {
    message.error('pengajuan batal melebihi batas hari');
  }
}

const createColumns = () => {
  return [
    {
      title: "",
      width: 30,
      render(row) {
        return row.attachment ? h(
            NImage,
            {
              src: row.attachment,
              width: 20,
              height: 20,
            },
            {
              default: () => row.attachment,
            }
        ) : h(
            NButton,
            {
              size: "small",
              type: "error",
              circle: true,
              onClick: () => {
                handleAction(row);
              },
            },
            {
              default: () => "!",
            }
        );
      },
    }, {
      title: "NO TRX",
      width: 100,
      ellipsis:  {
        tooltip: true,
      },
      tooltip: true,
      key: "no_transaksi",
      sorter: "default",
    },
    {
      title: "NO KONTRAK",
      width: 150,
      key: "no_fasilitas",
      sorter: "default",
    },
    {
      title: "TANGGAL",
      width: 120,
      key: "tgl_transaksi",
      sorter: "default",
    },
    {
      title: "ATAS NAMA",
      key: "nama",
      fixed: "left",
      width: 200,
    },
    {
      title: "METODE",
      width: 100,
      key: "payment_method",
      sorter: "default",
    }, {
      title: "VIA",
      width: 100,
      key: "position",
      sorter: "default",
    },
    {
      title: "NOMINAL",
      width: 100,
      align: 'right',
      key: "total_bayar",
      render(row) {
        return h("div", row.total_bayar.toLocaleString("US"));
      },
      sorter: "default",
    },
    {
      title: "STATUS",
      width: 100,
      key: "STATUS",
      defaultFilterOptionValues: ["PAID", "UNPAID"],
      render(row) {
        return h(
            NTag,
            {
              type: row.STATUS == "PENDING" ? "warning" : row.STATUS == "PAID" ? "success" : "error",
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
      width: 100,
      align: "right",
      key: "action",
      render(row) {
        return h(
            NButton,
            {
              secondary: true,
              round: true,
              size: "small",
              onClick: () => {
                handleAction(row);
              },
            },
            {
              default: () => "detail",
            }
        );
      },
    },
  ];
};
const showModal = ref(false);
const bodyModal = ref([]);
const descPay = ref([]);
const handleAction = (e) => {
  descPay.value = [];
  showModal.value = true;
  bodyModal.value = e;
  e.pembayaran.forEach((v) => {
    descPay.value.push([
      v.title,
      parseInt(v.bayar_angsuran).toLocaleString("US"),
      "denda " + parseInt(v.bayar_denda).toLocaleString("US"),
    ]);
  });
};
const columns = createColumns();
const dataAngsuran = ref(false);
const loadingAngsuran = ref(false);
const loadStructure = ref(false);
const handleFasilitas = (e) => {
  pageData.struktur = [];
  getSkalaCredit(e);
};
const dataPayment = ref([]);
const loadDataPayment = ref(false);
const message = useMessage();

const postCancelPayment = async () => {

  loadDataPayment.value = true;

  let userToken = localStorage.getItem("token");
  const response = await useApi({
    method: "POST",
    data: bodyCancel,
    api: "payment_cancel",
    token: userToken,
  });
  if (!response.ok) {
    showModal.value = true;
    message.error("error api");
    getDataPayment();
  } else {
    showModal.value = false;
    message.success("pengajuan batal berhasil");
    getDataPayment();
  }
};

const handleSearch = () => {
  getDataPayment();
}
const getDataPayment = async () => {
  loadDataPayment.value = true;
  let userToken = localStorage.getItem("token");
  const response = await useApi({
    method: "POST",
    api: `lap_pembayaran`,
    token: userToken,
    data: dynamicSearch,
  });
  if (!response.ok) {
    message.error("ERROR API");
  } else {
    loadingBar.finish();
    loadDataPayment.value = false;
    dataPayment.value = response.data;
  }
};
const printCount = ref(2);
const dataStrukturKredit = ref([]);
const getSkalaCredit = async (e) => {
  pageData.no_facility = e[0];
  loadStructure.value = true;
  const dynamicBody = {
    loan_number: pageData.no_facility,
    jumlah_uang: pageData.jumlah_uang,
  };
  loadingAngsuran.value = true;
  let userToken = localStorage.getItem("token");
  const response = await useApi({
    method: "POST",
    api: "struktur_kredit",
    data: dynamicBody,
    token: userToken,
  });
  if (!response.ok) {
    console.log(reponse.error);
  } else {
    dataStrukturKredit.value = response.data;
    dataAngsuran.value = true;
    loadStructure.value = false;
  }
};
const handleAddPay = () => {
  router.push({name: "tambah penerimaan"});
};
const showData = computed(() => {
  return useSearch(dataPayment.value, searchBox.value);
});
const me = useMeStore();
onMounted(() => {
  getBranch();
  me;
});
</script>
