<template>
    <n-card>
        <n-tabs size="medium" @update:value="handleUpdateValue" class="card-tabs" default-value="jaminan" animated
            type="line" pane-wrapper-style="margin: 0 -4px" @before-leave="handleSwitchTab"
            pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;">
            <n-tab-pane name="jaminan" tab="Jaminan">
                <template #tab>
                    <div>
                        Jaminan
                    </div>
                </template>

                <div class="flex flex-col gap-y-2">
                    <!-- Search and Filter -->
                    <div class="flex gap-2">
                        <n-input v-model:value="searchQuery" placeholder="cari disini..." />
                        <n-button @click="findData" type="primary">Cari</n-button>
                        <json-excel v-if="data.length > 0" :data="data" :name="`jaminan_ohd`" :fields="json_fields">
                            <n-button type="primary">Download Xls</n-button>
                        </json-excel>

                    </div>
                    <!-- Data Table -->
                    <div id="drawer-target">
                        <n-data-table :columns="columns" :data="data" :bordered="true" :max-height="300"
                            :loading="loadData" />
                    </div>
                    <!-- Pagination -->
                    <n-pagination v-model:page="currentPage" :page-size="pageSize" :page-sizes="pageSizes"
                        :item-count="totalItems" @update:page="fetchData" v-model:page-size="pageSize" show-size-picker>
                        <template #prefix>
                            Jumlah Jaminan: {{ totalItems }}
                        </template>
                    </n-pagination>
                </div>
            </n-tab-pane>
            <n-tab-pane name="transaksi" tab="Transaksi">
                <n-data-table :columns="columnsTransaction" :data="dataTransaction" size="small"
                    :loading="loadTransaction" />
            </n-tab-pane>
            <n-tab-pane name="approval" tab="approval">
                <template #tab>
                    <div class="flex gap-2">
                        <div>Approval</div>
                    </div>
                </template>
                <n-data-table :columns="columnsTransactionApproval" :data="dataTransactionApproval" size="small"
                    :loading="loadTransactionApproval" :pagination="{ pageSize: 10 }" />
            </n-tab-pane>
            <template #suffix>
                <n-dropdown trigger="hover" :options="options" @select="handleSelect" v-if="addButtonDisplay">
                    <n-button type="primary">Tambah Transaksi</n-button>
                </n-dropdown>
            </template>
        </n-tabs>
    </n-card>
    <n-modal v-model:show="showModal" :mask-closable="false">
        <div class="w-3/4">
            <FormTransaksi @batal="showModal = false" v-if="typeTransaksi == 'kirim'" @simpan="handleSimpanModal"
                type="pengiriman" />
            <FormTransaksi @batal="showModal = false" v-if="typeTransaksi == 'minta'" @simpan="handleSimpanModal"
                type="permintan" />
            <FormUpdate @batal="showModal = false" v-if="typeTransaksi == 'update'" />
        </div>
    </n-modal>
    <n-modal v-model:show="showDetailModal" title="Modal" :on-after-leave="closeModal">
        <n-card class="w-2/3">
            <n-tabs>
                <n-tab-pane name="detail" tab="Detail Jaminan ">

                    <n-table :bordered="false" :single-line="false" size="small">
                        <thead>
                            <tr>
                                <th>Jenis</th>
                                <th>Nama Debitur</th>
                                <th>No Kontrak</th>
                                <th>No BPKB</th>
                                <th>Lokasi</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{ bodyModal.type }}</td>
                                <td>{{ bodyModal.debitur }}</td>
                                <td>{{ bodyModal.no_kontrak }}</td>
                                <td>{{ bodyModal.BPKB_NUMBER }}</td>
                                <td>{{ bodyModal.posisi_berkas }}</td>
                                <td>{{ bodyModal.STATUS }}</td>
                            </tr>
                        </tbody>
                    </n-table>
                    <n-table :bordered="false" :single-line="false" size="small">
                        <tbody>
                            <tr>
                                <th>BPKB Atas Nama</th>
                                <td>{{ bodyModal.ON_BEHALF }}</td>
                            </tr>
                            <tr>
                                <th>Merk/Tipe/Tahun</th>
                                <td>{{ bodyModal.BRAND }} / {{ bodyModal.TYPE }} / {{ bodyModal.PRODUCTION_YEAR
                                    }}</td>
                            </tr>
                            <tr>
                                <th>Warna/No Polisi</th>
                                <td>{{ bodyModal.COLOR }} /{{ bodyModal.POLICE_NUMBER }}</td>
                            </tr>
                            <tr>
                                <th>No Rangka/No Mesin</th>
                                <td>{{ bodyModal.CHASIS_NUMBER }}/ {{ bodyModal.ENGINE_NUMBER }}</td>
                            </tr>
                            <tr>
                                <th>No Faktur</th>
                                <td>{{ bodyModal.INVOICE_NUMBER }}</td>
                            </tr>
                        </tbody>
                    </n-table>
                    <n-text v-show="false">{{ refStatus = bodyModal.STATUS }}</n-text>
                    <n-collapse class="p-2 bg-yellow-50">
                        <n-collapse-item title="Update Status Jaminan" name="1">
                            <div class="flex gap-2">
                                <n-select :options="optStatus" v-model:value="refStatus" />
                                <n-input-number :show-button="false" v-if="refStatus === 'JUAL'" v-model:value="refNilaiJual" class="w-full"
                                    :parse="parse" :format="format" placeholder="nilai jual"></n-input-number>
                                <n-button type="primary" @click="handleUpdateStatus(bodyModal.ID)">Simpan</n-button>
                            </div>
                        </n-collapse-item>
                    </n-collapse>
                </n-tab-pane>
                <n-tab-pane name="rilis" tab="Rilis Jaminan">
                    <n-result v-if="bodyModal.status_kontrak == 'active' && bodyModal.status_jaminan != 'RILIS'"
                        status="403" title="Rilis Jaminan Tidak Tersedia"
                        description="Terdapat kredit aktif, jaminan tidak dapat diproses rilis !"></n-result>
                    <div v-else-if="bodyModal.status_jaminan == 'RILIS'">
                        <div class="border p-2 rounded-xl">
                            <n-alert type="warning">Jaminan Telah Rilis</n-alert>
                            <div>
                                <n-divider title-placement="left">Dokumen Rilis</n-divider>
                                <n-image v-for="doc in bodyModal.document_rilis" :src="doc.PATH" :key="doc.id"
                                    class="w-24  rounded-xl" />
                            </div>
                        </div>
                    </div>
                    <div v-else>

                        <div class="flex bg-white  p-2 rounded-xl flex-col gap-2">

                            <n-form-item label="jenis rilis">
                                <n-select :options="optJenisRilis" v-model:value="modelJenisRilis.jenis" />
                            </n-form-item>
                            <div v-if="modelJenisRilis.jenis === 'atas nama'">
                                <div class="flex gap-2">
                                    <n-form-item label="Atas Nama" class="w-full">
                                        <n-input v-model:value="modelJenisRilis.atas_nama" />
                                    </n-form-item>
                                    <n-form-item label="NO KTP" class="w-full">
                                        <n-input v-model:value="modelJenisRilis.no_ktp" />
                                    </n-form-item>

                                    <file-upload title="Surat Kuasa" endpoint="collateral_attachment_rilis"
                                        :idapp="bodyModal.ID" type="doc_rilis"
                                        :def_value="findDocByType(bodyModal.document_rilis, 'surat Kuasa')" />

                                </div>
                            </div>
                            <!-- <n-button type="info" dashed @click="cetakBuktiTerima">Cetak Surat Rilis</n-button> -->
                            <n-button type="info" dashed @click="modalSuratRilis = true">Preview Surat Rilis</n-button>
                            <n-alert type="warning">
                                upload dokumen rilis yang sudah dicap dan ditanda tangani pemberi dan penerima
                            </n-alert>
                            <file-upload title="Upload bukti rilis" endpoint="collateral_attachment_rilis"
                                :idapp="bodyModal.ID" type="doc_rilis"
                                :def_value="findDocByType(bodyModal.document_rilis, 'doc_rilis')" />
                        </div>
                    </div>
                </n-tab-pane>

            </n-tabs>
        </n-card>
    </n-modal>
    <n-modal v-model:show="modalSuratRilis">
        <n-card class="w-5/6" title="Surat Tanda Terima">
            <template #header-extra>
                <n-button type="info" @click="cetakBuktiTerima">cetak</n-button>
            </template>
            <div class="bg-white border border-black p-8" ref="buktiTerimaRef">
                <div class="flex gap-2 items-center">
                    <img class="h-10 md:h-10" :src="applogo" alt="logo_company" />
                    <div class="flex flex-col">
                        <span class="text-xl font-bold">{{ apptitle }}</span>
                        <n-text strong class="text-md"> POS: {{ bodyModal.pos_pencairan }}</n-text>
                    </div>
                </div>
                <div class="mb-4 text-center text-base">
                    <b>SURAT TANDA TERIMA DOKUMEN</b>
                </div>
                <div class="mb-4">yang bertanda tangan di bawah ini:</div>
                <div class="mb-4" v-if="modelJenisRilis.jenis === 'atas nama'">
                    <table>
                        <tr>
                            <td width="100px">Nama</td>
                            <td width="25">:</td>
                            <td>
                                <b class="uppercase">{{ modelJenisRilis.atas_nama }}</b>
                            </td>
                        </tr>
                        <tr>
                            <td>NO KTP</td>
                            <td width="25">:</td>
                            <td>
                                <b class="uppercase">{{ modelJenisRilis.no_ktp }}</b>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="mb-4" v-if="modelJenisRilis.jenis === 'atas nama'">bertindak atas nama :</div>
                <div class=" mb-4">
                    <table>
                        <tr>
                            <td width="100px">Nama</td>
                            <td width="25">:</td>
                            <td>
                                <b class="uppercase">{{ bodyModal.debitur }}</b>
                            </td>
                        </tr>
                        <tr>
                            <td>No Kontrak</td>
                            <td width="25">:</td>
                            <td>
                                <b class="uppercase">{{ bodyModal.no_kontrak }}</b>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="mb-4 text-justify text-sm">
                    Pada hari ini <b>{{ dayFull.day }}</b> tanggal
                    <b>{{ dayFull.date }}</b> bulan <b>{{ dayFull.month }}</b> tahun
                    <b>{{ dayFull.year }}</b>,Dengan ini telah menerima buku kepemilikan kendaraan (BPKB)
                    dalam keadaan baik dengan rincian sebagai berikut :
                </div>
                <div class="text-justify pt-2">
                    Jenis Dokumen: <b> </b>
                    <table>
                        <tr>
                            <td>BPKB No</td>
                            <td width="25">:</td>
                            <td>{{ bodyModal.BPKB_NUMBER }}</td>
                        </tr>
                        <tr>
                            <td>BPKB atas nama</td>
                            <td width="25">:</td>
                            <td>{{ bodyModal.ON_BEHALF }}</td>
                        </tr>
                        <tr>
                            <td>Merk/Type/Tahun</td>
                            <td width="25">:</td>
                            <td>{{ bodyModal.BRAND }}/{{ bodyModal.TYPE }}/{{ bodyModal.PRODUCTION_YEAR }}</td>
                        </tr>
                        <tr>
                            <td>Warna/No.Polisi</td>
                            <td width="25">:</td>
                            <td>{{ bodyModal.COLOR }}/{{ bodyModal.POLICE_NUMBER }}</td>
                        </tr>
                        <tr>
                            <td>No. Rangka/Mesin</td>
                            <td width="25">:</td>
                            <td>{{ bodyModal.CHASIS_NUMBER }}/{{ bodyModal.ENGIN + NUMBER }}</td>
                        </tr>
                        <tr>
                            <td>No. Faktur</td>
                            <td width="25">:</td>
                            <td>{{ bodyModal.no_faktur }}</td>
                        </tr>
                    </table>
                    <!-- <table v-else>
                        <tr>
                            <td>No Sertifikat</td>
                            <td width="25">:</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Atas Nama</td>
                            <td width="25">:</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Status Kepemilikan</td>
                            <td width="25">:</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>IMB / Luas Tanah / Luas Bangunan</td>
                            <td width="25">:</td>
                            <td>
                            </td>
                        </tr>
                        <tr>
                            <td>Lokasi</td>
                            <td width="25">:</td>
                            <td></td>
                        </tr>
                    </table> -->
                </div>

                <div class="mb-4">
                    <!-- Selanjutnya disebut Penjamin<br /> -->
                    Dokumen tersebut telah diterima dalam keadaan baik untuk
                    ditindaklanjuti sebagaimana mestinya
                </div>
                <div>
                    <table class="!text-sm w-full">
                        <tr>
                            <td class="py-4 pr-4">
                                Pemberi,
                                <br /><br /><br />
                                <u class="uppercase">{{ me.me.nama }}</u>
                            </td>
                            <td class="py-4 pr-4">
                                <div v-if="modelJenisRilis.jenis === 'atas nama'">Atas Nama,
                                    <br /><br /><br />
                                    <u class="uppercase">{{ modelJenisRilis.atas_nama }}</u>
                                </div>
                                <div v-else>Penerima,
                                    <br /><br /><br />
                                    <u class="uppercase">{{ bodyModal.debitur }}</u>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </n-card>
    </n-modal>
    <n-modal v-model:show="modalTrx" title="Modal">
        <n-card class="w-2/3" title="Data Surat">
            <template #header-extra>
                <n-button type="primary" @click="handlePrint">
                    <n-space>
                        <n-icon>
                            <print-icon />
                        </n-icon>
                        Cetak Surat
                    </n-space>
                </n-button>
            </template>
            <div ref="printArea" class="p-4">
                <div class="flex gap-2 p-4">
                    <img class="h-10 md:h-10" :src="applogo" alt="logo_company" />
                    <span class="text-2xl font-bold">{{ apptitle }}</span>
                </div>
                <n-table :bordered="false" :single-line="false" size="small">
                    <thead>
                        <tr>
                            <th>No Surat</th>
                            <th>Transaksi</th>
                            <th>Tanggal</th>
                            <th>Dari</th>
                            <th>Ke</th>
                            <th>Jml Jaminan</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ bodyModalTrx.trx_code }}</td>
                            <td>{{ bodyModalTrx.type }}</td>
                            <td>{{ bodyModalTrx.tgl }}</td>
                            <td>{{ bodyModalTrx.dari_cabang }}</td>
                            <td>{{ bodyModalTrx.ke_cabang }}</td>
                            <td>{{ bodyModalTrx.jml_jaminan }}</td>
                            <td>{{ bodyModalTrx.status }}</td>
                        </tr>
                    </tbody>
                </n-table>
                <n-table :bordered="false" :single-line="false" size="small">
                    <tr>
                        <th style="width:10%">Kurir</th>
                        <td>{{ bodyModalTrx.kurir }}</td>
                    </tr>
                    <tr>
                        <th>Keterangan</th>
                        <td>{{ bodyModalTrx.keterangan }}</td>
                    </tr>
                </n-table>
                <h1 class="font-semibold py-4">Data Jaminan</h1>
                <n-data-table :row-key="(row) => row.id" :checked-row-keys="checkedRowJaminan" :bordered="false"
                    :single-line="false" size="small" :columns="columnsJaminan" :data="bodyModalTrx.jaminan"
                    :on-update:checked-row-keys="handleCheckedJaminan">
                </n-data-table>
                <div class="flex flex-col border-b border-dashed pb-4 ms-3 pt-4">
                    <div class="flex gap-4">
                        <div class="border-b pb-20 px-4 w-36">
                            <n-text strong class="text-md font-bold"> {{ bodyModalTrx.dari_cabang }}</n-text>
                        </div>
                        <div class="border-b pb-20 px-4 w-36">
                            <n-text strong class="text-md font-bold"> {{ bodyModalTrx.kurir }}</n-text>
                        </div>
                        <div class="border-b pb-20 px-4 w-36">
                            <n-text strong class="text-md font-bold"> {{ bodyModalTrx.ke_cabang }}</n-text>
                        </div>
                    </div>
                </div>

            </div>
        </n-card>
    </n-modal>
    <n-modal v-model:show="modalTrxApproval" title="Modal">
        <n-card class="w-2/3">
            <h1 class="font-semibold py-4">Data Surat</h1>
            <n-table :bordered="false" :single-line="false" size="small">
                <thead>
                    <tr>
                        <th>No Surat</th>
                        <th>Transaksi</th>
                        <th>Tanggal</th>
                        <th>Dari</th>
                        <th>Ke</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ bodyModalTrx.trx_code }}</td>
                        <td>{{ bodyModalTrx.type }}</td>
                        <td>{{ bodyModalTrx.tgl }}</td>
                        <td>{{ bodyModalTrx.dari_cabang }}</td>
                        <td>{{ bodyModalTrx.ke_cabang }}</td>
                        <td>{{ bodyModalTrx.status }}</td>
                    </tr>
                </tbody>
            </n-table>
            <n-table :bordered="false" :single-line="false" size="small">
                <tr>
                    <th style="width:10%">Kurir</th>
                    <td>{{ bodyModalTrx.kurir }}</td>
                </tr>
                <tr>
                    <th>Keterangan</th>
                    <td>{{ bodyModalTrx.keterangan }}</td>
                </tr>
            </n-table>
            <h1 class="font-semibold py-4">Data Jaminan</h1>
            <n-data-table :row-key="(row) => row.id" :checked-row-keys="checkedRowJaminan" :bordered="false"
                :single-line="false" size="small"
                :columns="bodyModalTrx.status == 'SELESAI' ? columnsJaminan : columnsJaminanApprove"
                :data="bodyModalTrx.jaminan" :on-update:checked-row-keys="handleCheckedJaminan">
            </n-data-table>

            <div v-if="bodyModalTrx.status != 'SELESAI'">
                <n-form-item label="keterangan" class="pt-2">
                    <n-input type="textarea" v-model:value="bodyApprove.catatan" />
                </n-form-item>
                <n-button type="primary" @click="handleApprove">approve</n-button>
            </div>
        </n-card>
    </n-modal>
</template>

<script setup>
import { computed, h, onMounted, ref } from 'vue';
import { NButton, useLoadingBar, useMessage } from 'naive-ui';
import { useApi } from '../../../helpers/axios';
import FormTransaksi from './trxJaminan.vue';
import FormUpdate from './updateJaminanPage.vue';
import {
    SearchRound as searchIcon,
    LocalPrintshopRound as PrintIcon,
} from "@vicons/material";
import { useSearch } from '../../../helpers/searchObject';
import { reactive } from 'vue';
import { useVueToPrint } from "vue-to-print";
import { useMeStore } from "../../../stores/me.js";
import _ from "lodash";
import JsonExcel from "vue-json-excel3";
import JaminanTable from "./JaminanTable.vue";
import axios from 'axios';

const apptitle = import.meta.env.VITE_APP_TITLE;
const applogo = import.meta.env.VITE_APP_LOGO;
const me = useMeStore();
const message = useMessage();
const showModal = ref(false);
const dataTransaction = ref([]);
const dataTransactionApproval = ref([]);
const loadTransactionApproval = ref();
const loadData = ref(false);
// ===
// Reactive state
const data = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const pageSizes = [{
    label: '10 per halaman',
    value: 10
},
{
    label: '20 per halaman',
    value: 20
},
{
    label: '50 per halaman',
    value: 50
},
{
    label: '100 per halaman',
    value: 100
}];
const totalItems = ref(0);
const searchQuery = ref(""); // Search input
const sortBy = ref("name");
const order = ref("asc");
const props = defineProps({
    type: null,
    selection: {
        type: Boolean,
        default: false
    }
})

// Fetch users with query parameters
const fetchData = async () => {
    try {
        loadData.value = true;
        const params = {
            type: "ondemand",
            page: currentPage.value,
            page_size: pageSize.value,
            search: searchQuery.value,
            sort_by: sortBy.value,
            order: order.value
        }
        const response = await useApi({
            method: "GET",
            api: "jaminan",
            params: params,
            token: localStorage.getItem('token'),
        });
        if (response.ok) {
            loadData.value = false;
            data.value = response.data.data;
            totalItems.value = response.data.total;
        }
    } catch (error) {
        console.error("Error fetching users:", error);
    }
};
const findData = () => {
    currentPage.value = 1;
    fetchData();
}
// Watch for changes & fetch new data
// watchEffect(() => {
//   fetchUsers();
// });
const jamainanSelected = ref();
const handleChecked = (e) => {
    jamainanSelected.value = e;
}

//---


const buktiTerimaRef = ref(null);

const handleApprove = async () => {
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "POST",
        data: bodyApprove,
        api: "jaminan_approval",
        token: userToken,
    });
    if (!response.ok) {
        message.error("error");

    } else {
        message.success("berhasil diapprove");
        modalTrxApproval.value = false;
        getDataTransactionApproval();
    }

}
var dt = new Date();
let year = dt.getFullYear();
let day = dt.getDate().toString().padStart(2, "0");

let thisMonths = (dt.getMonth() + 1).toString().padStart(2, "0");
const thisday = `${year}-${thisMonths}-${day}`;
const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
];
const daysName = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jum'at",
    "Sabtu",
];
const dayFull = reactive({
    day: computed(() => daysName[new Date(thisday).getDay()]),
    date: computed(() => new Date(thisday).getDate()),
    month: computed(() => monthNames[new Date(thisday).getMonth()]),
    year: computed(() => new Date(thisday).getFullYear()),
    full_date_only: computed(
        () => `${dayFull.date} ${dayFull.month} ${dayFull.year}`
    ),
    full_date: computed(
        () => `${dayFull.day}, ${dayFull.date} ${dayFull.month} ${dayFull.year}`
    ),
});
const findDocByType = (c, e) => {
    const docPath = ref(_.find(c, { TYPE: e }));
    if (docPath.value) return docPath.value.PATH;
};
const loadTransaction = ref(false);
const getDataTransaction = async () => {
    loadTransaction.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "GET",
        api: "jaminan_transaction",
        token: userToken,
    });
    if (!response.ok) {
        loadTransaction.value = false;
        console.log(reponse.error);
    } else {
        loadTransaction.value = false;
        dataTransaction.value = response.data;
    }
};
const loadingBar = useLoadingBar();
const getDataTransactionApproval = async () => {
    loadTransactionApproval.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "GET",
        api: "jaminan_list_approval",
        token: userToken,
    });
    if (!response.ok) {
        loadTransactionApproval.value = false;
        message.error("ERROR API");
    } else {
        loadingBar.finish();
        loadTransactionApproval.value = false;
        dataTransactionApproval.value = response.data;
    }
};

const options = [
    {
        label: 'Pengiriman',
        key: 'kirim',
    },
    {
        label: 'Permintaan',
        key: 'minta',
    }
];

const searchBox = ref();
const showData = computed(() => {
    return useSearch(data.value, searchBox.value);
});
const typeTransaksi = ref();
const handleSelect = (e) => {
    showModal.value = true;
    typeTransaksi.value = e;

}
const addButtonDisplay = ref(false);
const handleUpdateValue = (e) => {
    if (e === "transaksi") {
        addButtonDisplay.value = true;
    } else {
        addButtonDisplay.value = false;
    }
}
const columns = [
    {
        title: "No Kontrak",
        key: "no_kontrak",
        sorter: "default",
    },
    {
        title: "Stts Kontrak",
        key: "status_kontrak",
        sorter: "default",
    },
    {
        title: "Nama Debitur",
        key: "debitur",
        sorter: "default",
    }, {
        title: "NO BPKB",
        key: "BPKB_NUMBER",
        sorter: "default",
    }, {
        title: "Atas Nama",
        key: "ON_BEHALF",
        sorter: "default",
    },
    {
        title: "Asal Jaminan",
        key: "pos_pencairan",
        sorter: "default",
    },
    {
        title: "Lokasi Jaminan",
        key: "posisi_berkas",
        sorter: "default",
    },
    {
        title: "Status",
        key: "STATUS",
        sorter: "default",
    },
    {
        width: 100,
        align: "right",
        key: "action",
        render(row) {
            return h(
                NButton,
                {
                    size: "small",
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
    },
];
const columnsTransaction = [
    {
        title: "No Surat",
        key: "trx_code",
        sorter: "default",
    },
    {
        title: "Transaksi",
        key: "type",
        sorter: "default",
    },
    {
        title: "Tanggal",
        key: "tgl",
        sorter: "default",
    },
    {
        title: "Jumlah Jaminan",
        key: "jml_jaminan",
        sorter: "default",
    },
    {
        title: "dari",
        key: "dari_cabang",
        sorter: "default",
    },
    {
        title: "ke",
        key: "ke_cabang",
        sorter: "default",
    },
    {
        title: "Status",
        key: "status",
        sorter: "default",
    },
    {
        width: 100,
        align: "right",
        key: "action",
        render(row) {
            return h(
                NButton,
                {
                    size: "small",
                    secondary: true,
                    round: true,
                    onClick: () => {
                        detailTrx(row);
                    },
                },
                {
                    default: () => "detail",
                }
            );
        },
    },
];
const columnsTransactionApproval = [
    {
        title: "No Surat",
        key: "trx_code",
        sorter: "default",
    },
    {
        title: "Transaksi",
        key: "type",
        sorter: "default",
    },
    {
        title: "Tanggal",
        key: "tgl",
        sorter: "default",
    },
    {
        title: "Jumlah Jaminan",
        key: "jml_jaminan",
        sorter: "default",
    },
    {
        title: "dari",
        key: "dari_cabang",
        sorter: "default",
    },
    {
        title: "ke",
        key: "ke_cabang",
        sorter: "default",
    },
    {
        title: "Status",
        key: "status",
        sorter: "default",
    },
    {
        width: 100,
        align: "right",
        key: "action",
        render(row) {
            return h(
                NButton,
                {
                    size: "small",
                    secondary: true,
                    round: true,
                    onClick: () => {
                        detailTrxApproval(row);
                    },
                },
                {
                    default: () => "detail",
                }
            );
        },
    },
];
const printArea = ref();
const { handlePrint } = useVueToPrint({
    content: printArea,
    documentTitle: "Surat Mutasi Jaminan",
});
const checkedRowJaminan = ref([]);
const cetakBuktiTerima = () => {
    const { handlePrint } = useVueToPrint({
        content: buktiTerimaRef,
        documentTitle: "Surat Rilis Jaminan",
    });
    handlePrint();
}
const modelJaminan = ref();
const bodyApprove = reactive({
    no_surat: null,
    flag: "yes",
    jaminan: checkedRowJaminan,
})
const handleCheckedJaminan = (e) => {

    checkedRowJaminan.value = e;

}
const columnsJaminan = [
    {
        title: "No Kontrak",
        key: "LOAN_NUMBER",
        sorter: "default",
    },
    {
        title: "No BPKB",
        key: "BPKB_NUMBER",
        sorter: "default",
    },
    {
        title: "No Polisi",
        key: "POLICE_NUMBER",
        sorter: "default",
    },
    {
        title: "Atas Nama",
        key: "ON_BEHALF",
        sorter: "default",
    },
    {
        title: "No Rangka",
        key: "CHASIS_NUMBER",
        sorter: "default",
    },
    {
        title: "No Mesin",
        key: "ENGINE_NUMBER",
        sorter: "default",
    }
];
const columnsJaminanApprove = [
    {
        key: "id",
        type: "selection",
    },
    {
        title: "No BPKB",
        key: "BPKB_NUMBER",
        sorter: "default",
    },
    {
        title: "No Polisi",
        key: "POLICE_NUMBER",
        sorter: "default",
    },
    {
        title: "Atas Nama",
        key: "ON_BEHALF",
        sorter: "default",
    },
    {
        title: "No Rangka",
        key: "CHASIS_NUMBER",
        sorter: "default",
    },
    {
        title: "No Mesin",
        key: "ENGINE_NUMBER",
        sorter: "default",
    },
    {
        title: "No Order",
        key: "LOAN_NUMBER",
        sorter: "default",
    }
];
const parse = (input) => {
    const nums = input.replace(/,/g, "").trim();
    if (/^\d+(\.(\d+)?)?$/.test(nums)) return Number(nums);
    return nums === "" ? null : Number.NaN;
};
const format = (value) => {
    if (value === null) return "";
    return value.toLocaleString("en-US");
};
const bodyModal = ref();
const bodyModalTrx = ref();
const showDetailModal = ref(false);
const modalTrx = ref(false);
const modalTrxApproval = ref(false);
const handleAction = (e) => {
    showDetailModal.value = true;
    bodyModal.value = e;
}
const refStatus=ref();
const refNilaiJual=ref();
const optStatus = ["NORMAL", "TITIP", "SITA", "JUAL"].map((v) => ({
    label: v,
    value: v,
}));

const handleUpdateStatus = (e) => {
    const body={
        collateral_id:e,
        status:refStatus.value,
        harga:refNilaiJual.value,
    }
    const response = useApi({
        method:'POST',
        api:"collateral_status",
        token:localStorage.getItem("token"),
        data:body,
    });
    if(!response.ok){
        message.error("gagal update status jaminan");
    }else{
        message.success('ok');
    }

}

const detailTrx = (e) => {
    bodyApprove.no_surat = e.trx_code;
    let jaminan = e.jaminan;
    modelJaminan.value = jaminan.map((o) => {
        return {
            id: o.id,
            flag: "check"
        }
    });
    checkedRowJaminan.value = jaminan.map((o) => o.id);
    bodyModalTrx.value = e;
    modalTrx.value = true;
}
const detailTrxApproval = (e) => {
    bodyApprove.no_surat = e.trx_code;
    let jaminan = e.jaminan;
    modelJaminan.value = jaminan.map((o) => {
        return {
            id: o.id,
            flag: "check"
        }
    });
    checkedRowJaminan.value = jaminan.map((o) => o.id);
    bodyModalTrx.value = e;
    modalTrxApproval.value = true;
}
const closeModal = () => {
    fetchData("ondemand");
}

const modalSuratRilis = ref(false);
const modelJenisRilis = reactive({
    jenis: 'yang bersangkutan',
    atas_nama: null,
    no_ktp: null,
});
const optJenisRilis = ["yang bersangkutan", "atas nama"].map((e) => ({
    label: e,
    value: e
}));

const handleSwitchTab = (t) => {
    switch (t) {
        case "jaminan":
            fetchData("ondemand");
            return true;
        case "transaksi":
            getDataTransaction();
            return true;
        case "approval":
            getDataTransactionApproval();
            return true;
        default:
            return true;
    }
}
onMounted(() => {
    fetchData("ondemand");
});


const handleSimpanModal = () => {
    getDataTransaction();

    showModal.value = false;
}
</script>
