<template>
    <n-card :segmented="{
        content: true,
        footer: 'soft',
    }">

        <template #header>Tambah Pelunasan</template>
        <span class="hidden">{{ pelunasan }}</span>
        <template #header-extra>
            <n-space v-if="!props.embed">
                <n-button v-show="!searchField" strong type="warning" @click="handleBack">
                    <template #icon>
                        <n-icon>
                            <back-icon />
                        </n-icon>
                    </template>
                    <p class="hidden md:flex">kembali</p>
                </n-button>
                <!-- <n-button
    v-show="!searchField"
    strong
    secondary
    type="warning"
    round
    @click="handleBtnAngsuran"
  >
    <template #icon>
      <n-icon>
        <angsuran-icon />
      </n-icon>
    </template>
    <span class="hidden md:flex">pindah ke penerimaan</span>
  </n-button> -->

            </n-space>
            <!-- <n-space v-show="props.embed ? true : displayFasilitas">
  <n-tag type="warning"
    >No Kontrak <b>{{ props.atr }}</b></n-tag
  >
</n-space> -->
        </template>
        <div class="flex flex-col md:flex-row gap-2" v-show="!props.embed">
            <n-form-item label="Nama Pelanggan" class="w-full">
                <n-input v-model:value="dynamicSearch.nama" type="text" placeholder="Nama" @blur="handleSearch"
                    clearable />
            </n-form-item>
            <n-form-item label="No Polisi" class="w-full">
                <n-input v-model:value="dynamicSearch.no_polisi" type="text" placeholder="No Polisi"
                    @blur="handleSearch" clearable />
            </n-form-item>
            <n-form-item label="No Kontrak" class="w-full">
                <n-input v-model:value="dynamicSearch.no_kontrak" type="text" placeholder="No Kontrak"
                    @blur="handleSearch" clearable />
            </n-form-item>
        </div>
        <!-- <n-data-table :row-props="rowProps" striped :row-class-name="rowClassName" size="small" :scroll-x="800"
    :row-key="(row) => row.loan_number" :columns="columns" :data="dataSearch" :max-height="300"
    :on-update:checked-row-keys="handleFasilitas" :loading="loadSearch" class="pb-2" v-show="dataFasilitas" /> -->
        <n-data-table :row-props="rowProps" striped :row-class-name="rowClassName" :scroll-x="1200" size="small"
            :row-key="(row) => row.loan_number" :columns="columns" :data="dataSearch" :max-height="300"
            :on-update:checked-row-keys="handleFasilitas" :loading="loadSearch" class="pb-2"
            v-show="props.embed ? true : displayFasilitas" />
        <n-spin v-if="displayDetail" :show="spinnerShow">
            <n-alert type="warning" :show-icon="false" v-show="props.embed ? true : displayFasilitas">
                <div class="flex items-center justify-between">
                    <div>Penghapusan Bunga</div>
                    <div>
                        <n-text><strong>{{ formatter.format(pelunasan.DISC_BUNGA) }}</strong></n-text>
                    </div>
                </div>
            </n-alert>
            <div>
                <n-table size="small" v-show="props.embed ? true : displayFasilitas" class="mb-2" single-column
                    :single-line="false">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th align="right">Tagihan</th>
                            <th align="right">Bayar</th>
                            <th valign="right">Diskon</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Pokok</td>
                            <td align="right">{{ formatter.format(pelunasan.SISA_POKOK) }}</td>
                            <td align="right">{{ formatter.format(pelunasan.BAYAR_POKOK) }}</td>
                            <td align="right">{{ formatter.format(pelunasan.DISKON_POKOK) }}</td>
                        </tr>
                        <tr>
                            <td>Bunga</td>
                            <td align="right">{{ formatter.format(pelunasan.TUNGGAKAN_BUNGA) }}</td>
                            <td align="right">{{ formatter.format(pelunasan.BAYAR_BUNGA) }}</td>
                            <td align="right">{{ formatter.format(pelunasan.DISKON_BUNGA) }}</td>
                        </tr>
                        <tr>
                            <td>Pinalti</td>
                            <td align="right">{{ formatter.format(pelunasan.PINALTI) }}</td>
                            <td align="right">{{ formatter.format(pelunasan.BAYAR_PINALTI) }}</td>
                            <td align="right">{{ formatter.format(pelunasan.DISKON_PINALTI) }}</td>
                        </tr>
                        <tr>
                            <td>Denda</td>
                            <td align="right">{{ formatter.format(pelunasan.DENDA) }}</td>
                            <td align="right">{{ formatter.format(pelunasan.BAYAR_DENDA) }}</td>
                            <td align="right">{{ formatter.format(pelunasan.DISKON_DENDA) }}</td>
                        </tr>
                        <tr>
                            <td class="bg-pr"><strong>Jumlah</strong></td>
                            <td align="right"><strong>{{ formatter.format(pelunasan.JUMLAH_TAGIHAN) }}</strong></td>
                            <td align="right"><strong>{{ formatter.format(pelunasan.JUMLAH_BAYAR) }}</strong></td>
                            <td align="right"><strong>{{ formatter.format(pelunasan.JUMLAH_DISKON) }}</strong></td>
                        </tr>
                    </tbody>
                </n-table>
                <div class="md:flex gap-2 bg-pr/10 rounded-xl items-center pt-4 px-4"
                    v-show="props.embed ? true : displayFasilitas">
                    <n-form-item path="nestedValue.path2" label="Jenis Pembayaran" class="w-full">
                        <div class="flex gap-2">
                            <n-select filterable :options="optTipePay" placeholder="Jenis Pembayaran"
                                v-model:value="pelunasan.METODE_PEMBAYARAN" />
                            <n-button v-show="pelunasan.METODE_PEMBAYARAN == 'transfer'"
                                :type="dataBuktiTransfer.length > 0 ? 'success' : 'warning'"
                                @click="buktiTransfer = true">
                                <template #icon>
                                    <n-icon v-if="dataBuktiTransfer.length > 0">
                                        <check-icon />
                                    </n-icon>
                                </template>
                                Bukti
                            </n-button>
                        </div>
                    </n-form-item>
                    <n-form-item path="nestedValue.path2" label="Total Tagihan" class="w-full">
                        <n-input-number v-bind:dir="isRtl ? 'rtl' : 'ltr'" placeholder="Jumlah Pembayaran"
                            v-model:value="pelunasan.JUMLAH_TAGIHAN" :show-button="false" :parse="parse"
                            :format="format" readonly class="w-full">
                        </n-input-number>
                    </n-form-item>
                    <n-form-item path="nestedValue.path2" label="Uang Pelanggan" class="w-full">
                        <n-input-number v-bind:dir="isRtl ? 'rtl' : 'ltr'" placeholder="Jumlah Pembayaran" size="large"
                            v-model:value="pelunasan.UANG_PELANGGAN" :show-button="false" :parse="parse"
                            :format="format" clearable @clear="clearUangPelaanggan" @blur="pushJumlahUang"
                            class="w-full" ref="uangPelangganRef" @click="handleUangPelangganFocus">
                        </n-input-number>
                    </n-form-item>
                    <n-form-item path="nestedValue.path2" label="Jumlah Diskon" class="w-full">
                        <n-input-number v-bind:dir="isRtl ? 'rtl' : 'ltr'" placeholder="Jumlah Pembayaran"
                            v-model:value="pelunasan.JUMLAH_DISKON" :show-button="false" :parse="parse" :format="format"
                            clearable class="w-full" readonly>
                        </n-input-number>
                    </n-form-item>
                    <n-form-item label="Pembulatan" class="w-full">
                        <n-input-number v-bind:dir="isRtl ? 'rtl' : 'ltr'" :show-button="false" :parse="parse"
                            :format="format" v-model:value="pelunasan.PEMBULATAN" clearable class="w-full" :disabled="pelunasan.UANG_PELANGGAN < pelunasan.JUMLAH_TAGIHAN ? true : false
                                " />
                    </n-form-item>
                    <n-form-item label="Kembalian" class="w-full">
                        <n-input-number v-bind:dir="isRtl ? 'rtl' : 'ltr'" :show-button="false" :parse="parse"
                            :format="format" v-model:value="pelunasan.KEMBALIAN" readonly class="w-full" :disabled="pelunasan.UANG_PELANGGAN < pelunasan.JUMLAH_TAGIHAN ? true : false
                                " />
                    </n-form-item>
                    <n-form-item class="w-full">
                        <n-button type="primary" @click="handleProses" :loading="loadProses" class="w-full" :disabled="pelunasan.UANG_PELANGGAN === 0
                            ? true
                            : pelunasan.jumlah_uang === null
                                ? true
                                : pelunasan.jumlah_uang <= 0
                                    ? true
                                    : pelunasan.kembalian < 0
                                        ? true
                                        : dataBuktiTransfer.length == 0 && pelunasan.METODE_PEMBAYARAN == 'transfer'
                                            ? true
                                            : false">
                            Proses
                        </n-button>
                    </n-form-item>
                </div>
            </div>
        </n-spin>
    </n-card>
    <n-modal class="w-1/4" v-model:show="buktiTransfer" preset="card" :segmented="true">
        <file-upload title="Bukti Transfer" :def_value="dataBuktiTransfer" endpoint="payment_attachment"
            type="bukti_transfer" :idapp="pageData.uid" @fallback="handleResBack" />
    </n-modal>
    <n-modal v-model:show="modalProsesPayment" :mask-closable="false">
        <n-card :class="width > 850 ? 'w-1/2' : 'w-fit'">
            <div class="flex items-center gap-4" v-if="loadProses">
                <n-spin size="small" />
                <n-text>memproses pelunasan</n-text>
            </div>
            <n-result :status="responseProsesPayment.status"
                :title="responseProsesPayment.status == 'success' ? 'Pembayaran Berhasil' : responseProsesPayment.status == 'error' ? 'Pembayaran Gagal' : 'Pembayaran Berhasil'"
                size="small"
                :description="responseProsesPayment.status == 'info' ? 'Proses pembayaran menunggu persetujuan HO' : responseProsesPayment.status == 'error' ? 'Silakan coba beberapa saat lagi' : ''"
                v-else>
                <n-scrollbar>
                    <div ref="printReceiptRef" class="flex flex-col border" :class="width > 850 ? 'p-4' : 'p-0'"
                        v-if="responseProsesPayment.status == 'success'">
                        <div class="p-2">
                            <div
                                class="flex items-center gap-2 pb-2 justify-between border-b border-dashed border-black">
                                <div class="flex gap-2 items-center">
                                    <img class="h-10 md:h-10" :src="applogo" alt="logo_company" />
                                    <span class="text-xl font-bold">{{ apptitle }}</span>
                                </div>

                            </div>
                            <div class="text-md font-bold justify-center pt-4 md:flex"
                                :class="width > 850 ? 'flex' : 'hidden'">KWITANSI PELUNASAN
                            </div>
                            <div class="flex justify-between border-b border-dashed border-black"
                                :class="width > 850 ? 'flex-row' : 'flex-col'">
                                <div class="flex flex-col py-4">
                                    <small class="text-reg">No Transaksi : </small>
                                    <n-text strong class="text-lg font-bold"> {{
                                        responseProsesPayment.res.no_transaksi
                                    }}
                                    </n-text>
                                    <small class="text-reg">No Pelanggan : </small>
                                    <n-text strong class="text-lg font-bold"> {{
                                        responseProsesPayment.res.cust_code
                                    }}
                                    </n-text>
                                </div>
                                <div class="flex flex-col py-4">
                                    <small class="text-reg">Terima dari (No Kontrak)</small>
                                    <n-text strong class="text-lg font-bold"> {{
                                        responseProsesPayment.res.nama
                                    }}
                                    </n-text>
                                    <small class="text-lg">{{ responseProsesPayment.res.no_fasilitas }}</small>
                                </div>
                            </div>
                            <div class="grid border-b border-dashed border-black pb-2"
                                :class="width > 850 ? 'grid-cols-6 gap-4' : 'grid-cols-1 '">
                                <div class="flex flex-col">
                                    <small class="text-reg">Tanggal & Waktu</small>
                                    <n-text strong class="text-md">{{
                                        responseProsesPayment.res.tgl_transaksi
                                    }}
                                    </n-text>
                                </div>
                                <div class="flex flex-col">
                                    <small class="text-reg">Angsuran</small>
                                    <n-text strong class="text-md">
                                        {{ responseProsesPayment.res.installment }}
                                    </n-text>
                                </div>
                                <div class="flex flex-col">
                                    <small class="text-reg">Pembulatan</small>
                                    <n-text strong class="text-md"> {{ responseProsesPayment.res.pembulatan }}</n-text>
                                </div>
                                <div class="flex flex-col">
                                    <small class="text-reg">Jumlah Uang</small>
                                    <n-text strong class="text-md"> {{ responseProsesPayment.res.jumlah_uang }}</n-text>
                                </div>
                                <div class="flex flex-col">
                                    <small class="text-reg">Kembalian</small>
                                    <td>
                                        <n-text strong class="text-md"> {{
                                            responseProsesPayment.res.kembalian
                                        }}
                                        </n-text>
                                    </td>
                                </div>
                                <div class="flex flex-col">
                                    <small class="text-reg">Metode Pembayaran</small>
                                    <n-text strong class="text-md"> {{
                                        responseProsesPayment.res.payment_method
                                    }}
                                    </n-text>
                                </div>
                            </div>
                        </div>
                        <div class="px-3">
                            <table width="100%" class="border border-black">
                                <tr>
                                    <th class="border border-black">Ke</th>
                                    <th class="border border-black">Angsuran</th>
                                    <th class="border border-black">Denda</th>
                                    <th class="border border-black">Jumlah</th>
                                </tr>

                                <tr v-for="angs in responseProsesPayment.res.struktur" :key="angs.id">
                                    <td class="border text-center border-black">{{ angs.angsuran_ke }}</td>
                                    <td class="border pe-2 border-black">{{
                                        parseInt(angs.bayar_angsuran).toLocaleString('US')
                                    }}
                                    </td>
                                    <td class="border pe-2 border-black">{{
                                        parseInt(angs.bayar_denda).toLocaleString('US')
                                    }}
                                    </td>
                                    <td align="right" class="border pe-2 border-black">
                                        {{
                                            parseInt(parseInt(angs.bayar_angsuran) +
                                                parseInt(angs.bayar_denda)).toLocaleString(('US'))
                                        }}
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>Total</strong></td>
                                    <td colspan="3" align="right" class="pe-2">
                                        <strong>{{
                                            responseProsesPayment.res.total_bayar.toLocaleString("US")
                                        }}</strong>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div class="flex flex-col border-b border-dashed border-black pb-4 ms-3">
                            <div class="flex gap-4">
                                <div class="border-b border-black pt-20 px-4">
                                    <n-text strong class="text-md font-bold">{{
                                        responseProsesPayment.res.created_by
                                    }}
                                    </n-text>
                                </div>
                                <div class="border-b border-black pt-20 px-4">
                                    <n-text strong class="text-md font-bold">{{
                                        responseProsesPayment.res.nama
                                    }}
                                    </n-text>
                                </div>
                            </div>
                        </div>
                    </div>
                </n-scrollbar>
                <template #footer>
                    <div class="flex gap-4 justify-center">
                        <n-button type="primary" v-if="responseProsesPayment.status == 'success'"
                            @click="handleCetakKwitansi">Cetak Kwitansi
                        </n-button>
                        <n-button type="warning" @click="backPayment">Tutup</n-button>
                    </div>
                </template>
            </n-result>
        </n-card>
    </n-modal>
</template>
<script setup>
import { useApi } from "../../../helpers/axios";
import router from "../../../router";
import {
    CheckCircleRound as checkIcon,
    ChevronLeftRound as backIcon,
} from "@vicons/material";
import {
    NIcon,
    NButton,
    NInput,
    NInputNumber,
    useMessage,
    useDialog,
} from "naive-ui";
import { computed, reactive, ref, h, onMounted } from "vue";
import { useVueToPrint } from "vue-to-print";
const apptitle = import.meta.env.VITE_APP_TITLE;
const applogo = import.meta.env.VITE_APP_LOGO;
const searchField = ref(false);
const checkedRowCredit = ref([]);
const spinnerShow = ref(true);
const dialogProses = ref(false);
const dataBuktiTransfer = ref([]);
const buktiTransfer = ref(false);
const paymentData = ref([]);
const pageData = reactive({
    no_facility: null,
    total_bayar: 0,
    jumlah_uang: 0,
    payment_method: "cash",
    pembulatan: 0,
    diskon: 0,
    kembalian: computed(() =>
        pageData.jumlah_uang
            ? pelunasan.jumlah_uang - pageData.total_bayar - pageData.pembulatan
            : 0
    ),
    struktur: checkedRowCredit,
    bank_tujuan: null,
    no_rekening: null,
    bukti_transafer: null,
});

const uangPelangganRef = ref(null);

const handleUangPelangganFocus = () => {
    uangPelangganRef.value.select();
}
const dynamicSearch = reactive({
    nama: "",
    no_polisi: "",
    no_kontrak: "",
});
const printReceiptRef = ref(null);
const { handlePrint } = useVueToPrint({
    content: printReceiptRef,
    documentTitle: "Kwitansi Pelunasan",
});
const handleResBack = (data) => {
    dataBuktiTransfer.value = data;
}
const createColumns = () => {
    return [
        {
            title: "No Kontrak",
            key: "loan_number",
            sorter: "default",
        },
        {
            title: "Nama",
            key: "nama",
            sorter: "default",
            fixed: "left",
        },
        {
            title: "No Polisi",
            key: "no_polisi",
            sorter: "default",
        },
        {
            title: "Alamat",
            key: "alamat",
            ellipsis: {
                tooltip: true,
            },
            sorter: "default",
        },
        {
            title: "Angsuran",
            key: "angsuran",
            align: "right",
            render(row) {
                return h("div", formatter.format(row.angsuran));
            },
        },
        // {
        //   title: "Status",
        //   key: "status",
        //   sorter: "default",
        // },
    ];
};
const selectedFasilitas = ref();
const rowProps = (row) => {
    return {
        style: "cursor: pointer;",
        onClick: () => {
            // if (row.status === "LUNAS") {
            //   message.info("Fasilitas Sudah Lunas")
            // } else {
            selectedFasilitas.value = row.loan_number;
            displayDetail.value = true;
            pelunasan.LOAN_NUMBER = row.loan_number;
            pelunasan.UANG_PELANGGAN = 0;
            pelunasan.BAYAR_POKOK = 0;
            pelunasan.BAYAR_BUNGA = 0;
            pelunasan.BAYAR_DENDA = 0;
            pelunasan.BAYAR_PINALTI = 0;
            pelunasan.SISA_POKOK = 0;
            pelunasan.BUNGA_BERJALAN = 0;
            pelunasan.TUNGGAKAN_BUNGA = 0;
            pelunasan.DENDA = 0;
            pelunasan.PINALTI = 0;
            displayDetail.value = true;
            getDataPelunasan(row.loan_number);
            // }
        },
    };
};

const parse = (input) => {
    const nums = input.replace(/,/g, "").trim();
    if (/^\d+(\.(\d+)?)?$/.test(nums)) return Number(nums);
    return nums === "" ? null : Number.NaN;
};
const format = (value) => {
    if (value === null) return "";
    return value.toLocaleString("en-US");
};
const columns = createColumns();
const loadingAngsuran = ref(false);
const displayDetail = ref(false);
const displayPayment = ref(false);
const handleFasilitas = (e) => {
    displayDetail.value = true;
    pelunasan.LOAN_NUMBER = e;
    pelunasan.UANG_PELANGGAN = 0;
    pelunasan.BAYAR_POKOK = 0;
    pelunasan.BAYAR_BUNGA = 0;
    pelunasan.BAYAR_DENDA = 0;
    pelunasan.BAYAR_PINALTI = 0;
    pelunasan.SISA_POKOK = 0;
    pelunasan.BUNGA_BERJALAN = 0;
    pelunasan.TUNGGAKAN_BUNGA = 0;
    pelunasan.DENDA = 0;
    pelunasan.PINALTI = 0;

    displayDetail.value = true;
    getDataPelunasan(e);
};
const formPelunasan = reactive({
    BAYAR_POKOK: 0,
    BAYAR_BUNGA: 0,
    BAYAR_PINALTI: 0,
    BAYAR_DENDA: 0,
    DISKON_POKOK: 0,
    DISKON_PINALTI: 0,
    DISKON_BUNGA: 0,
    DISKON_DENDA: 0,
});


const handleCetakKwitansi = () => {
    handlePrint();
    router.go(-1)
}

const message = useMessage();
const dialog = useDialog();
const loadProses = ref(false);
const handleProses = async () => {
    dialog.warning({
        title: "Konfirmasi",
        content: "apakah data yang anda masukan sudah benar ?",
        positiveText: "Ya",
        negativeText: "cek kembali",
        onPositiveClick: () => {
            postDynamic();
        },
    });
};
const postDynamic = async () => {
    let userToken = localStorage.getItem("token");
    modalProsesPayment.value = true;
    loadProses.value = true;
    const response = await useApi({
        method: "POST",
        api: "payment_pelunasan",
        data: pelunasan,
        token: userToken,
    });
    if (!response.ok) {
        loadProses.value = false;
        responseProsesPayment.value = { status: "error", res: null };
    } else {
        responseProsesPayment.value = {
            status: response.data.STATUS == 'PAID' ? 'success' : 'info',
            res: response.data
        };
        loadProses.value = false;
        paymentData.value = response.data;
        dialogProses.value = true;
    }
};

const modalProsesPayment = ref(false);
const responseProsesPayment = ref();

const backPayment = () => {
    router.go(-1);
}
const dataSearch = ref([]);
const loadSearch = ref(false);
const displayFasilitas = ref(false);
const handleSearch = async () => {
    displayDetail.value = false;
    let userToken = localStorage.getItem("token");
    loadSearch.value = true;
    const response = await useApi({
        method: "POST",
        api: "search_customer",
        data: dynamicSearch,
        token: userToken,
    });
    if (!response.ok) {
        message.error("ERROR API");
    } else {
        displayFasilitas.value = true;
        loadSearch.value = false;
        dataSearch.value = response.data;
    }
};
const optTipePay = [
    {
        label: "Tunai",
        value: "cash",
    },
    {
        label: "Transfer",
        value: "transfer",
    },
];
const dataPelunasan = ref([]);
const pelunasan = reactive({
    LOAN_NUMBER: null,
    METODE_PEMBAYARAN: "cash",
    SISA_POKOK: 0,
    BUNGA_BERJALAN: 0,
    TUNGGAKAN_BUNGA: 0,
    DENDA: 0,
    PINALTI: 0,
    UANG_PELANGGAN: 0,
    DISKON: 0,
    BAYAR_POKOK: 0,
    BAYAR_BUNGA: 0,
    BAYAR_PINALTI: 0,
    BAYAR_DENDA: 0,
    DISKON_POKOK: 0,
    DISKON_PINALTI: 0,
    DISKON_BUNGA: 0,
    DISKON_DENDA: 0,
    JUMLAH_TAGIHAN: computed(
        () =>
            pelunasan.SISA_POKOK +
            pelunasan.TUNGGAKAN_BUNGA +
            pelunasan.PINALTI +
            pelunasan.DENDA
    ),
    TOTAL_BAYAR: computed(
        () =>
            pelunasan.SISA_POKOK +
            pelunasan.TUNGGAKAN_BUNGA +
            pelunasan.PINALTI +
            pelunasan.DENDA
    ),
    JUMLAH_BAYAR: computed(
        () =>
            pelunasan.BAYAR_POKOK +
            pelunasan.BAYAR_BUNGA +
            pelunasan.BAYAR_PINALTI +
            pelunasan.BAYAR_DENDA
    ),
    JUMLAH_DISKON: computed(
        () =>
            pelunasan.DISKON_POKOK +
            pelunasan.DISKON_BUNGA +
            pelunasan.DISKON_PINALTI +
            pelunasan.DISKON_DENDA
    ),
    PEMBULATAN: 0,
    KEMBALIAN: computed(() =>
        pelunasan.UANG_PELANGGAN - pelunasan.JUMLAH_TAGIHAN - pelunasan.PEMBULATAN <
            0
            ? 0
            : pelunasan.UANG_PELANGGAN -
            pelunasan.JUMLAH_TAGIHAN -
            pelunasan.PEMBULATAN
    ),
});
const isRtl = true;

const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});
const getDataPelunasan = async (e) => {
    spinnerShow.value = true;
    const dynamicBody = {
        loan_number: e,
    };
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "POST",
        api: "pelunasan",
        data: dynamicBody,
        token: userToken,
    });
    if (!response.ok) {
      console.log(reponse.error);
    } else {
        spinnerShow.value = false;
        dataPelunasan.value = response.data;
        Object.assign(pelunasan, response.data[0]);
        displayPayment.value = true;
        loadingAngsuran.value = false;
    }
};
const pushJumlahUang = async () => {
    Object.assign(pelunasan, formPelunasan);
    let sisaBayarPokok = pelunasan.UANG_PELANGGAN - pelunasan.SISA_POKOK;
    if (sisaBayarPokok >= 0) {
        pelunasan.BAYAR_POKOK = pelunasan.SISA_POKOK;
        pelunasan.DISKON_POKOK = 0;
        let sisaBayarBunga = sisaBayarPokok - pelunasan.TUNGGAKAN_BUNGA;
        if (sisaBayarBunga > 0) {
            pelunasan.BAYAR_BUNGA = pelunasan.TUNGGAKAN_BUNGA;
            pelunasan.DISKON_BUNGA = 0;
            let sisaBayarPinalti = sisaBayarBunga - pelunasan.PINALTI;
            if (sisaBayarPinalti > 0) {
                pelunasan.BAYAR_PINALTI = pelunasan.PINALTI;
                pelunasan.DISKON_PINALTI = 0;
                let sisaBayarDenda = sisaBayarPinalti - pelunasan.DENDA;
                if (sisaBayarDenda > 0) {
                    pelunasan.BAYAR_DENDA = pelunasan.DENDA;
                    pelunasan.DISKON_DENDA = 0;
                } else {
                    pelunasan.BAYAR_DENDA = sisaBayarDenda + pelunasan.DENDA;
                    pelunasan.DISKON_DENDA = pelunasan.DENDA - pelunasan.BAYAR_DENDA;
                }
            } else {
                pelunasan.BAYAR_PINALTI = sisaBayarPinalti + pelunasan.PINALTI;
                pelunasan.DISKON_PINALTI = pelunasan.PINALTI - pelunasan.BAYAR_PINALTI;
                pelunasan.DISKON_DENDA = pelunasan.DENDA;
            }
        } else {
            pelunasan.BAYAR_BUNGA = pelunasan.TUNGGAKAN_BUNGA + sisaBayarBunga;
            pelunasan.DISKON_POKOK = 0;
            pelunasan.DISKON_BUNGA = Math.abs(sisaBayarBunga);
            pelunasan.DISKON_DENDA = pelunasan.DENDA;
            pelunasan.DISKON_PINALTI = pelunasan.PINALTI;
        }
    } else {
        pelunasan.BAYAR_POKOK = sisaBayarPokok + pelunasan.SISA_POKOK;
        pelunasan.DISKON_POKOK = pelunasan.SISA_POKOK - pelunasan.UANG_PELANGGAN;
        pelunasan.DISKON_BUNGA = pelunasan.TUNGGAKAN_BUNGA;
        pelunasan.DISKON_DENDA = pelunasan.DENDA;
        pelunasan.DISKON_PINALTI = pelunasan.PINALTI;
    }
};
const props = defineProps({
    embed: Boolean,
    atr: String,
});
const clearUangPelaanggan = () => {
    Object.assign(pelunasan, formPelunasan);
    pelunasan.UANG_PELANGGAN = 0;
}
onMounted(() => {
    if (props.embed) {
        dynamicSearch.no_kontrak = props.atr;
        handleSearch();
        getDataPelunasan([props.atr]);
    }
});
const handleBack = () => {
    router.push({ name: "pelunasan" });
};
const rowClassName = (row) => {
    if (row.loan_number == selectedFasilitas.value) {
        return "row-active";
    }
    return "";
};
</script>
<style scoped>
:deep(.row-active td) {
    font-weight: bolder;
    background-color: rgba(24, 160, 88, 0.2) !important;
    color: rgba(24, 160, 88, 1) !important;
}
</style>
