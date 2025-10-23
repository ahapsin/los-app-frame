<template>
    <n-card :segmented="{
        content: true,
        footer: 'soft',
    }">

        <template #header>Tambah Penarikan Sebagian</template>
        <template #header-extra>
            <n-button circle secondary type="error">
                <template #icon>
                    <v-icon name="bi-x-lg" />
                </template>
            </n-button>
        </template>
        <span class="hidden">{{ pelunasan }}</span>
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
        <n-data-table :row-props="rowProps" striped :row-class-name="rowClassName" :scroll-x="1200" size="small"
            :row-key="(row) => row.loan_number" :columns="columns" :data="dataSearch" :max-height="150"
            :on-update:checked-row-keys="handleFasilitas" :loading="loadSearch" class="pb-4"
            v-show="props.embed ? true : displayFasilitas" />
        <n-spin v-if="displayDetail" :show="spinnerShow">

            <div class="flex gap-4 rounded-xl bg-yellow-50 p-4 mb-4" >
                <n-table size="small">
                    <tr>
                        <th colspan="2">Pinjaman</th>
                    </tr>
                    <tr>
                        <th>No Pinjaman</th>
                        <td>1, 235, 560,158</td>
                    </tr>
                    <tr>
                        <th>Nama</th>
                        <td>1, 235, 560,158</td>
                    </tr>
                    <tr>
                        <th>Tgl Pinjaman</th>
                        <td>1, 235, 560,158</td>
                    </tr>
                </n-table>

                <n-table size="small">
                    <tr>
                        <th colspan="2">Fasilitas</th>
                    </tr>
                    <tr>
                        <th>Jml Fasilitas</th>
                        <td>1, 235, 560,158</td>
                    </tr>
                    <tr>
                        <th>Terpakai</th>
                        <td><strong class="text-er">1, 235, 560,158</strong></td>
                    </tr>
                    <tr >
                        <th>Tersedia</th>
                        <td><strong class="text-pr">1, 235, 560,158</strong></td>
                    </tr>
                </n-table>

                <n-table size="small">
                    <tr>
                        <th colspan="2">Pokok</th>
                    </tr>
                    <tr>
                        <th>Nilai Pinjman</th>
                        <td>1, 235, 560,158</td>
                    </tr>
                    <tr>
                        <th>Nilai Pembayaran</th>
                        <td>1, 235, 560,158</td>
                    </tr>
                    <tr>
                        <th>Sisa / Outstanding</th>
                        <td>1, 235, 560,158</td>
                    </tr>
                    <tr>
                        <th>Tunggakan</th>
                        <td>1, 235, 560,158</td>
                    </tr>
                    <tr>
                        <th>Angsuran</th>
                        <td>1, 235, 560,158</td>
                    </tr>
                </n-table>
            </div>

            <div class="md:flex gap-2 bg-pr/10 rounded-xl items-center pt-4 px-4"
                v-show="props.embed ? true : displayFasilitas">
                
                <n-form-item path="nestedValue.path2" label="Nilai Penarikan" class="w-full">
                    <n-input-number placeholder="Jumlah Pembayaran" size="large"
                        v-model:value="pelunasan.UANG_PELANGGAN" :show-button="false" :parse="parseCurrency"
                        :format="formatCurrency" clearable @clear="clearUangPelaanggan" @blur="pushJumlahUang"
                        class="w-full" ref="uangPelangganRef" @click="handleUangPelangganFocus">
                    </n-input-number>
                </n-form-item>
                <n-form-item path="nestedValue.path2" label="Tanggal Valuta" class="w-full">
                   <n-date-picker  type="date" />
                </n-form-item>
                <n-form-item label="No referensi" class="w-full">
                    <n-input :show-button="false" :parse="parseCurrency" :format="formatCurrency"
                       clearable class="w-full" :disabled="pelunasan.UANG_PELANGGAN < pelunasan.JUMLAH_TAGIHAN ? true : false
                            " />
                </n-form-item>
                <n-form-item label="Keterangan" class="w-full">
                    <n-input 
                        class="w-full" />
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
        </n-spin>
    </n-card>
    <n-modal class="w-1/4" v-model:show="buktiTransfer" preset="card" :segmented="true">
        <file-upload title="Bukti Transfer" :def_value="dataBuktiTransfer" endpoint="payment_attachment"
            type="bukti_transfer" :idapp="pelunasan.uid" @fallback="handleResBack" />
    </n-modal>
    <n-modal v-model:show="modalProsesPayment" :mask-closable="false">
        <n-card class="`shadow` :class=" width> 850 ? 'w-1/2' : 'w-fit'">
            <div class="flex items-center gap-4" v-if="loadProses">
                <n-spin size="small" />
                <n-text>memproses pelunasan</n-text>
            </div>
            
        </n-card>
    </n-modal>
</template>
<script setup>
import {
    ChevronLeftRound as backIcon,
    CheckCircleRound as checkIcon,
} from "@vicons/material";
import {
    NButton,
    NIcon,
    NInput,
    NInputNumber,
    useDialog,
    useMessage,
} from "naive-ui";
import { computed, h, onMounted, reactive, ref } from "vue";
import { useVueToPrint } from "vue-to-print";
import { useApi } from "../../../helpers/axios";
import { v4 as uuidv4 } from "uuid";
import router from "../../../router";
const uuid = uuidv4();
const apptitle = import.meta.env.VITE_APP_TITLE;
const applogo = import.meta.env.VITE_APP_LOGO;
const searchField = ref(false);
const checkedRowCredit = ref([]);
const spinnerShow = ref(true);
const dialogProses = ref(false);
const dataBuktiTransfer = ref([]);
const buktiTransfer = ref(false);
const paymentData = ref([]);
const lunasDiskon = ref(false);

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

const parseCurrency = (value) => {
    const nums = value.replace(/(,|\$|\s)/g, "").trim();
    if (/^\d+(\.(\d+)?)?$/.test(nums))
        return Number(nums);
    return nums === "" ? null : Number.NaN;
}
const formatCurrency = (value) => {
    if (value === null)
        return "";
    return value.toLocaleString("en-US");
}
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
        api: "payment_bunga_menurun",
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
        api: "search_customer_bunga_menurun",
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
    uid: uuid,
    LOAN_NUMBER: null,
    METODE_PEMBAYARAN: "cash",
    SISA_POKOK: 0,
    BUNGA_BERJALAN: 0,
    TUNGGAKAN_BUNGA: 0,
    DENDA: 0,
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

            pelunasan.DENDA
    ),
    TOTAL_BAYAR: computed(
        () =>
            pelunasan.SISA_POKOK +
            pelunasan.TUNGGAKAN_BUNGA +

            pelunasan.DENDA
    ),
    JUMLAH_BAYAR: computed(
        () =>
            pelunasan.BAYAR_POKOK +
            pelunasan.BAYAR_BUNGA +

            pelunasan.BAYAR_DENDA
    ),
    JUMLAH_DISKON: 0,
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
    pelunasan.JUMLAH_DISKON = 0;
    lunasDiskon.value = false;
    Object.assign(pelunasan, formPelunasan);
    let BayarBunga = pelunasan.UANG_PELANGGAN - pelunasan.TUNGGAKAN_BUNGA;
    if (BayarBunga >= 0) {
        pelunasan.BAYAR_BUNGA = pelunasan.TUNGGAKAN_BUNGA;
        let sisaBayarBunga = BayarBunga - pelunasan.SISA_POKOK;
        if (sisaBayarBunga > 0) {
            pelunasan.BAYAR_POKOK = pelunasan.SISA_POKOK;
        } else {
            pelunasan.BAYAR_POKOK = BayarBunga;
            pelunasan.DISKON_POKOK = pelunasan.SISA_POKOK - pelunasan.BAYAR_POKOK;
        }
    } else {
        pelunasan.BAYAR_BUNGA = pelunasan.UANG_PELANGGAN;
        pelunasan.DISKON_BUNGA = pelunasan.TUNGGAKAN_BUNGA - pelunasan.BAYAR_BUNGA;
        pelunasan.DISKON_POKOK = pelunasan.SISA_POKOK - pelunasan.BAYAR_POKOK;
        pelunasan.DISKON_DENDA = pelunasan.DENDA;
    }
    if (pelunasan.JUMLAH_DISKON > 0) {
        lunasDiskon.value = true;
    }
    // let sisaBayarPokok = pelunasan.UANG_PELANGGAN - pelunasan.TUNGGAKAN_BUNGA;
    // if (sisaBayarPokok >= 0) {
    //     pelunasan.BAYAR_POKOK = pelunasan.SISA_POKOK;
    //     pelunasan.DISKON_POKOK = 0;
    //     let sisaBayarBunga = sisaBayarPokok - pelunasan.TUNGGAKAN_BUNGA;
    //     if (sisaBayarBunga > 0) {
    //         pelunasan.BAYAR_BUNGA = pelunasan.TUNGGAKAN_BUNGA;
    //         pelunasan.DISKON_BUNGA = 0;
    //         let sisaBayarPinalti = sisaBayarBunga - pelunasan.PINALTI;
    //         if (sisaBayarPinalti > 0) {
    //             pelunasan.BAYAR_PINALTI = pelunasan.PINALTI;
    //             pelunasan.DISKON_PINALTI = 0;
    //             let sisaBayarDenda = sisaBayarPinalti - pelunasan.DENDA;
    //             if (sisaBayarDenda > 0) {
    //                 pelunasan.BAYAR_DENDA = pelunasan.DENDA;
    //                 pelunasan.DISKON_DENDA = 0;
    //             } else {
    //                 pelunasan.BAYAR_DENDA = sisaBayarDenda + pelunasan.DENDA;
    //                 pelunasan.DISKON_DENDA = pelunasan.DENDA - pelunasan.BAYAR_DENDA;
    //             }
    //         } else {
    //             pelunasan.BAYAR_PINALTI = sisaBayarPinalti + pelunasan.PINALTI;
    //             pelunasan.DISKON_PINALTI = pelunasan.PINALTI - pelunasan.BAYAR_PINALTI;
    //             pelunasan.DISKON_DENDA = pelunasan.DENDA;
    //         }
    //     } else {
    //         pelunasan.BAYAR_BUNGA = pelunasan.TUNGGAKAN_BUNGA + sisaBayarBunga;
    //         pelunasan.DISKON_POKOK = 0;
    //         pelunasan.DISKON_BUNGA = Math.abs(sisaBayarBunga);
    //         pelunasan.DISKON_DENDA = pelunasan.DENDA;
    //     }
    // } else {
    //     pelunasan.BAYAR_POKOK = sisaBayarPokok + pelunasan.SISA_POKOK;
    //     pelunasan.DISKON_POKOK = pelunasan.SISA_POKOK - pelunasan.UANG_PELANGGAN;
    //     pelunasan.DISKON_BUNGA = pelunasan.TUNGGAKAN_BUNGA;
    //     pelunasan.DISKON_DENDA = pelunasan.DENDA;
    // }
};

const handleLunasDiskon = (e) => {
    if (e) {
        pelunasan.JUMLAH_DISKON = pelunasan.DISKON_POKOK + pelunasan.DISKON_BUNGA + pelunasan.DISKON_DENDA;
    } else {
        pelunasan.JUMLAH_DISKON = 0;
    }
}
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
