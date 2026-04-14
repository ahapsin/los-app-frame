<template>

    <n-card :class="`shadow-lg`" title="Daftar Tagihan" :segmented="true" size="small" v-if="width > 412"
        class="shadow-lg">
        <template #header-extra>
            <n-space>
                <n-input clearable v-model:value="boxSearch" placeholder="cari">
                    <template #suffix>
                        <v-icon name="bi-search"></v-icon>
                    </template>
                </n-input>
                <n-button type="success" secondary @click="exportToExcel(filteredDataList)" :disabled="isLoading">
                    <template #icon>
                        <v-icon name="bi-download"></v-icon>
                    </template>
                    Export Excel
                </n-button>
                <n-button quaternary circle @click="getData" :disabled="isLoading">
                    <template #icon>
                        <v-icon name="bi-arrow-clockwise"></v-icon>
                    </template>
                </n-button>
            </n-space>
        </template>
        <div>
            <!-- <n-space>
                <n-form-item label-placement="left" label="PIC">
                    <n-input type="text" placeholder="PIC" v-model:value="filter.pic" />
                </n-form-item>
                <n-form-item label-placement="left" label="CYCLE AWAL">
                    <n-input type="text" placeholder="Cycle" v-model:value="filter.cycle_awal" />
                </n-form-item>
                <n-form-item label-placement="left" label="CYCLE AKHIR">
                    <n-input type="text" placeholder="Cycle" v-model:value="filter.cycle_akhir" />
                </n-form-item>
            </n-space> -->
            <n-space vertical :size="12">
                <n-data-table :columns="columnBebanTagih" :data="filteredDataList" :filter-value="filterValue"
                    @update:filters="onFilterChange" :loading="isLoading" size="small" :pagination="pagination"
                    :scroll-x="3000" striped="true" />

            </n-space>
        </div>
    </n-card>
    <div v-else class="m-2">
        <n-input type="text" placeholder="cari ?" v-model:value="boxSearch" @blur="searchData" />
        <n-infinite-scroll style="height: 80dvh" :distance="10" class="mt-2">
            <div class="flex flex-col gap-2">
                <div class="flex justify-between p-6 border rounded-2xl focus:bg-red-500 bg-white" v-for="i in dataList"
                    @click="handleDetail(i)">
                    <div class="flex flex-col">
                        <p>Surat #:<n-text class="font-bold text-pr">{{ i.no_surat }}</n-text></p>
                        <n-text class="font-bold text-neutral">{{ i.nama_customer }}</n-text>
                        <n-button size="small" type="warning" secondary v-if="i.no_lkp">LKP : {{ i.no_lkp }}</n-button>
                    </div>
                    <div class="flex flex-col gap-4 items-end">
                        <n-text class="font-bold">{{ i.angsuran?.toLocaleString() }}</n-text>
                        <n-button size="small">{{ i.tgl_jatuh_tempo }}</n-button>
                    </div>
                </div>
            </div>
        </n-infinite-scroll>
    </div>
    <n-modal v-model:show="modalDetail" :mask-closable="false">
        <n-card :class="`shadow-lg`" class="w-full md:w-5/6" title="DETAIL TAGIHAN" :segmented="true" size="small">
            <template #header-extra>
                <n-space align="center">

                    <!-- <n-button size="small" quaternary type="info" @click="handleInquiry()">
                        <template #icon>
                            <v-icon name="bi-list" />
                        </template>
        Inquiry
        </n-button> -->
                    <n-button size="small" quaternary type="info" @click="handleHistory(bodyDetail.no_surat)">
                        <template #icon>
                            <v-icon name="bi-clock-history" />
                        </template>
                        History
                    </n-button>
                    <n-button size="small" type="error" circle quaternary @click="modalDetail = false">
                        <template #icon>
                            <v-icon name="bi-x-lg" />
                        </template>
                    </n-button>
                </n-space>
            </template>
            <n-card size="small" title="Kunjungan terakhir" class="mb-2">
                <n-descriptions :columns="4" bordered size="small">
                    <n-descriptions-item label="Tanggal Kunjungan">
                        {{ bodyDetail.kunjungan_terakhir.tgl_kunjungan }}
                    </n-descriptions-item>
                    <n-descriptions-item label="Tanggal Janji Bayar">
                        {{ bodyDetail.kunjungan_terakhir.tgl_jb }}
                    </n-descriptions-item>
                    <n-descriptions-item label="Hasil Kunjungan">
                        {{ bodyDetail.kunjungan_terakhir.hasil_kunjungan }}
                    </n-descriptions-item>
                    <n-descriptions-item label="Dokumen Kunjungan">
                        <n-image v-for="i in bodyDetail.kunjungan_terakhir.path" :src="i" class="w-[40px]" />
                    </n-descriptions-item>
                </n-descriptions>
            </n-card>
            <n-card :class="`shadow-lg`" class="mb-2" size="small" embedded>
                <div class="grid grid-cols-2 md:grid-cols-5 gap-4 overflow-auto">
                    <div class="flex flex-col flex-1 w-full ">
                        <small class="text-reg">NO SURAT</small>
                        <n-text strong class="text-md">{{ bodyDetail.no_surat }}</n-text>
                    </div>
                    <div class="flex flex-col flex-1 w-full ">
                        <small class="text-reg">CABANG</small>
                        <n-text strong class="text-md">{{ bodyDetail.cabang }}</n-text>
                    </div>

                    <div class="flex flex-col flex-1 w-full " v-if="bodyDetail?.no_lkp">
                        <small class="text-reg">NO LKP</small>
                        <n-text type="error">
                            <strong>{{ bodyDetail.no_lkp }}</strong>
                        </n-text>
                    </div>
                    <div class="flex flex-col flex-1 w-full ">
                        <small class="text-reg">No Kontrak</small>
                        <n-text strong class="text-md">{{ bodyDetail.no_kontrak }}</n-text>
                    </div>
                    <div class="flex flex-col flex-1 w-full ">
                        <small class="text-reg">Customer</small>
                        komposisi kredit
                        <n-text strong class="text-md">{{ bodyDetail.nama_customer }}</n-text>
                    </div>
                    <div class="flex flex-col flex-1 w-full ">
                        <small class="text-reg">Bayar</small>
                        <n-ellipsis class="text-md font-semibold">{{ bodyDetail.bayar }}</n-ellipsis>
                    </div>
                    <div class="flex flex-col flex-1 w-full ">
                        <small class="text-reg">Tanggal Bayar</small>
                        <n-ellipsis class="text-md font-semibold">{{ bodyDetail.tgl_bayar }}</n-ellipsis>
                    </div>
                    <div class="flex flex-col flex-1 w-full ">
                        <small class="text-reg">Tgl Jatuh Tempo</small>
                        <n-ellipsis class="text-md font-semibold">{{ bodyDetail.tgl_jatuh_tempo }}</n-ellipsis>
                    </div>
                    <div class="flex flex-col flex-1 w-full ">
                        <small class="text-reg">Cycle Awal</small>
                        <n-ellipsis class="text-md font-semibold">{{ bodyDetail.cycle_awal }}</n-ellipsis>
                    </div>
                    <div class="flex flex-col flex-1 w-full ">
                        <small class="text-reg">Cycle Akhir</small>
                        <n-ellipsis class="text-md font-semibold">{{ bodyDetail.cycle_akhir }}</n-ellipsis>
                    </div>
                    <div class="flex flex-col flex-1 w-full ">
                        <small class="text-reg">Angsuran ke</small>
                        <n-ellipsis class="text-md font-semibold">{{ bodyDetail.angusran_ke }}</n-ellipsis>
                    </div>
                    <div class="flex flex-col flex-1 w-full ">
                        <small class="text-reg">Angsuran</small>
                        <n-ellipsis class="text-md font-semibold">{{ bodyDetail.angsuran?.toLocaleString()
                        }}</n-ellipsis>
                    </div>
                    <div class="flex flex-col w-full">
                        <small class="text-reg">Alamat</small>
                        <n-text strong class="text-md">{{ bodyDetail.alamat }}</n-text>
                    </div>
                    <div class="flex flex-col flex-1 w-full ">
                        <small class="text-reg">DENDA</small>
                        <n-ellipsis class="text-md font-semibold">{{ bodyDetail.denda }}</n-ellipsis>
                    </div>
                    <div class="flex flex-col flex-1 w-full ">
                        <small class="text-reg">TENOR</small>
                        <n-ellipsis class="text-md font-semibold">{{ bodyDetail.tenor }}</n-ellipsis>
                    </div>
                    <div class="flex flex-col flex-1 w-full ">
                        <small class="text-reg">MCF</small>
                        <n-ellipsis class="text-md font-semibold">{{ bodyDetail.mcf }}</n-ellipsis>
                    </div>
                    <div class="flex flex-col flex-1 w-full ">
                        <small class="text-reg">PIC</small>
                        <n-ellipsis class="text-md font-semibold">{{ bodyDetail.nama_pic }}</n-ellipsis>
                    </div>
                    <div class="flex flex-col flex-1 w-full ">
                        <small class="text-reg">CATATAN SURVEYOR</small>
                        <n-text class="text-md font-semibold">{{ bodyDetail.catatan_survey }}</n-text>
                    </div>
                    <div class="flex flex-col flex-1 w-full ">
                        <small class="text-reg">UNIT</small>
                        <n-text class="text-md font-semibold">{{ bodyDetail.unit }}</n-text>
                    </div>
                    <div class="flex flex-col flex-1 w-full ">
                        <small class="text-reg">NO POLISI</small>
                        <n-ellipsis class="text-md font-semibold">{{ bodyDetail.no_polisi }}</n-ellipsis>
                    </div>
                    <div class="flex flex-col flex-1 w-full ">
                        <small class="text-reg">TAHUN MOTOR</small>
                        <n-ellipsis class="text-md font-semibold">{{ bodyDetail.tahun_motor }}</n-ellipsis>
                    </div>
                    <div class="flex flex-col flex-1 w-full ">
                        <small class="text-reg">NO HP</small>
                        <n-ellipsis class="text-md font-semibold">{{ bodyDetail.no_hp }}</n-ellipsis>
                    </div>
                </div>
            </n-card>
            <n-divider title-placement="left">Dokumen Pelanggan</n-divider>
            <n-image-group>
                <div class="flex gap-2">
                    <n-image v-for="i in bodyDetail.col_path" :src="i" width="40" :height="40" object-fit="fill"
                        class="w-[40px] h-[40px]" />
                </div>
            </n-image-group>
            <n-divider title-placement="left">Dokumen Pendukung</n-divider>
            <n-image-group>
                <div class="flex gap-2">
                    <n-image v-for="i in bodyDetail.other_path" :src="i" width="40" :height="40" object-fit="fill"
                        class="w-[40px] h-[40px]" />
                </div>
            </n-image-group>
            <!-- <n-table size="small">
                <thead>
                    <tr>
                        <th>Angsuran Ke</th>
                        <th>Tgl Jatuh Tempo</th>
                        <th>Tunggakan</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="i in bodyDetail.detail" :key="i.angs_ke">
                        <td>{{ i.angs_ke }}</td>
                        <td>{{ i.tgl_jth_tempo }}</td>
                        <td align="right">{{ Number(i.jumlah).toLocaleString('id-ID') }}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="2">TOTAL</td>
                        <td align="right">
                            <strong>
                                {{
                                    bodyDetail.detail
                                        .reduce((acc, item) => acc + Number(item.jumlah), 0)
                                        .toLocaleString('id-ID')
                                }}
                            </strong>
                        </td>
                    </tr>
                </tfoot>
            </n-table> -->

            <div v-if="bodyDetail?.no_lkp">
                <n-divider title-placement="left">Hasil Kunjungan</n-divider>

                <n-form-item label="No surat">
                    <n-input v-model:value="bodyDetail.no_surat" disabled> </n-input>
                </n-form-item>
                <n-form-item label="Hasil Kunjungan">
                    <n-input type="textarea" v-model:value="formDataKunjungan.keterangan"></n-input>
                </n-form-item>
                <n-form-item label="Tanggal JB/FU">
                    <n-date-picker placeholder="Tanggal JB/FU" class="w-full" value-format="yyyy-MM-dd"
                        format="dd-MM-yyyy" type="date" v-model:value="formDataKunjungan.tgl_jb"
                        :is-date-disabled="isDateDisabled" />
                </n-form-item>
                <n-form-item label="Dokumen Kunjungan">
                    <file-upload :def_preview="true" :multi="true" title="dokumen kunjungan" endpoint="cl_survey_upload"
                        type="other" @fallback="handleFallback" @onUpload="handleOnUpload" />
                </n-form-item>
            </div>

            <template #footer>
                <div class="flex gap-2" v-if="bodyDetail?.no_lkp">

                    <n-button type="primary" @click="handleSubmitKunjungan" :disabled="isSubmitDisabled"
                        :loading="isLoading">Simpan</n-button>
                    <n-button type="secondary" @click="modalDetail = false">Batal</n-button>
                </div>
            </template>
            <n-modal v-model:show="modalHistory">
                <div class="w-full md:w-1/2">
                    <n-card :class="`shadow-lg`" title="History Surat" :segmented="true" size="small">
                        <n-tabs type="segment" animated>
                            <n-tab-pane name="timeline" tab="TIMELINE">
                                <n-scrollbar style="max-height: 300px">
                                    <n-timeline>
                                        <n-timeline-item type="success" v-for="(i, index) in bodyHistory" :key="i"
                                            :content="i.description" :time="i.create_date" />
                                    </n-timeline>
                                </n-scrollbar>
                            </n-tab-pane>
                            <n-tab-pane name="hasil_kunjungan" tab="HASIL KUNJUNGAN">
                                <n-scrollbar style="max-height: 400px">
                                    <!-- <n-timeline>
                        <n-timeline-item type="warning" v-for="i in bodyHistorySurat" :key="i" :content="i.description"
                            :time="timeAgo(i.create_date)" />
                    </n-timeline> -->
                                    <n-collapse>
                                        <n-collapse-item :title="moment(i.tgl_buat).format('DD-MM-YYYY HH:mm')"
                                            v-for="i in bodyHistorySurat">
                                            <n-descriptions :column="3" size="small" bordered class="mb-2">
                                                <n-descriptions-item label="NO SURAT">
                                                    {{ i.no_surat }}
                                                </n-descriptions-item>

                                                <n-descriptions-item label="PETUGAS">
                                                    {{ i.oleh }}
                                                </n-descriptions-item>

                                                <n-descriptions-item label="JB">
                                                    {{ i.tgl_jb }}
                                                </n-descriptions-item>

                                                <n-descriptions-item label="KETERANGAN">
                                                    {{ i.ket }}
                                                </n-descriptions-item>
                                            </n-descriptions>
                                            <div class="flex flex-col p-2 border rounded-lg">
                                                <small class="text-reg">DOK KUNJUNGAN</small>
                                                <div class="flex gap-2">
                                                    <n-image :src="f" v-for="f in i.file" width="60" />
                                                </div>
                                            </div>
                                        </n-collapse-item>
                                    </n-collapse>
                                </n-scrollbar>
                            </n-tab-pane>
                        </n-tabs>
                    </n-card>
                </div>
            </n-modal>
        </n-card>
    </n-modal>

</template>
<script setup>
import { CreateOutlined, RemoveRedEyeOutlined } from "@vicons/material";
import { useWindowSize } from "@vueuse/core";
import { saveAs } from 'file-saver';
import moment from 'moment';
import { NButton, NIcon, NTag, useLoadingBar, useMessage } from "naive-ui";
import { onMounted, ref } from "vue";
import * as XLSX from 'xlsx';
import { useApi } from "../../../helpers/axios.js";
import { useMeStore } from "../../../stores/me";
const { width } = useWindowSize();
const me = useMeStore();
const message = useMessage();
const isLoading = ref(false);
const modalHistory = ref(false);

const startOfDay = (date) => {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d
}

const isSubmitDisabled = computed(() => {
    return (
        !formDataKunjungan.value.keterangan ||
        !formDataKunjungan.value.tgl_jb ||
        statsUpload.value ||
        !formDataKunjungan.value.path?.length ||
        isLoading.value === true
    )
})

const isDateDisabled = (ts) => {
    const today = startOfDay(new Date())

    const maxDate = new Date(today)
    maxDate.setDate(today.getDate() + 5)

    return ts < today.getTime() || ts > maxDate.getTime()
}
const selectedBranch = ref();
const bodyHistory = ref([]);
const handleHistory = async (e) => {
    modalHistory.value = true;
    await getHistory(e);
    await getHistorySurat(e);
}
const bodyHistorySurat = ref()
const getHistorySurat = async (e) => {
    isLoading.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "GET",
        api: `cl_survey_detail/${e}`,
        token: userToken,
    });
    if (!response.ok) {
        console.log(response.error);
    } else {
        // console.log(response.data.response)
        isLoading.value = false;
        bodyHistorySurat.value = response.data;
    }
};

const exportToExcel = (data) => {
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'DAFTAR TAGIHAN.xlsx')
}

function timeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now - date) / 1000); // selisih dalam detik

    const intervals = [
        { label: 'tahun', seconds: 31536000 },
        { label: 'bulan', seconds: 2592000 },
        { label: 'hari', seconds: 86400 },
        { label: 'jam', seconds: 3600 },
        { label: 'menit', seconds: 60 },
        { label: 'detik', seconds: 1 }
    ];

    for (const interval of intervals) {
        const count = Math.floor(diff / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}${count > 1 ? '' : ''} yang lalu`;
        }
    }

    return 'baru saja';
}
const getHistory = async (e) => {
    isLoading.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "GET",
        api: `cl_logs/${e}`,
        token: userToken,
    });
    if (!response.ok) {
        console.log(response.error);
    } else {
        loadingBar.finish();
        // console.log(response.data.response)
        isLoading.value = false;
        bodyHistory.value = response.data;
    }
};


const convertObjectToArray = (obj) => {
    if (!Array.isArray(obj) || obj.length === 0) {
        return [];
    }
    const keys = Object.keys(obj[0]);
    return keys.map(key => ({ title: key, key: key }));
}
const rangeDate = ref();
let messageReactive = null;
const loadingBar = useLoadingBar();
const handleSubmit = () => {
    let a = {
        dari: rangeDate.value,
        cabang_id: selectedBranch.value?.id ? selectedBranch.value.id : me.me.cabang_id,
    }
    messageReactive = message.loading('memuat data listing beban', { duration: 0 });
    grabListBan(a);
}
const formDataKunjungan = ref({
    no_surat: null,
    keterangan: null,
    tgl_jb: null,
    lkp_number: null,
    path: []
});

const screenData = (list) => {
    list.map(item => ({
        NO_SURAT: item.no_surat,
        CUSTOMER: item.nama_customer,
        NO_LKP: item.no_lkp,
        NO_KONTRAK: item.no_kontrak,
        TGL_JATUH_TEMPO: item.tgl_jatuh_tempo,
        ANGSURAN_KE: item.angsuran_ke,
        ANGSURAN: item.angsuran,
        ALAMAT: item.alamat
    }));
}

const statsUpload = ref(false);
const handleFallback = (e) => {
    formDataKunjungan.value.path.push(e);
}
const handleOnUpload = (e) => {
    statsUpload.value = e;
}
const handleSubmitKunjungan = async () => {
    formDataKunjungan.value.lkp_number = bodyDetail.value.no_lkp;
    await postKunjungan(formDataKunjungan.value);
    modalDetail.value = false;
    getData();
}


const postKunjungan = async (e) => {
    isLoading.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "POST",
        api: `cl_survey_add`,
        data: e,
        token: userToken,
    });
    if (!response.ok) {
        isLoading.value = false;
        console.log(response.error);
    } else {
        message.success("kunjungan berhasil ditambahkan");
        isLoading.value = false;
        bodyHistory.value = response.data;
    }
};

const dataListBan = ref([]);
const loadingData = ref(false);
const timer = ref(60);
const disbaledButton = ref(false);
const ctrDownload = ref(true);
const grabListBan = async (e) => {
    loadingData.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "POST",
        api: "listBanTest",
        data: e,
        token: userToken,
    });
    if (!response.ok) {
        messageReactive.destroy();
        disbaledButton.value = true;
        var interval;
        interval = setInterval(() => {
            if (timer.value > 0) {
                timer.value--
            } else {
                clearInterval(interval);
                timer.value = 60;
                handleSubmit();
            }
        }, 1000);
        messageReactive = message.loading(() => (`data listban sedang sibuk mencoba ulang dalam ${timer.value} s`), { duration: 60000 });
    } else {
        messageReactive.destroy();
        messageReactive = null;
        disbaledButton.value = false;
        dataListBan.value = response.data;
        loadingData.value = false;
        ctrDownload.value = false;
    }

}



const columnBebanTagih = [
    {
        title: "CABANG",
        key: "cabang",
        sorter: 'default',
        fixed: "left",
        width: 100
    },
    {
        title: "NO SURAT",
        key: "no_surat",
        sorter: 'default',
        fixed: "left",
        width: 100
    },
    {
        title: "CUSTOMER",
        key: "nama_customer",
        sorter: 'default',
        width: 100,
        fixed: "left",
        ellipsis: {
            tooltip: true,
        }
    },
    {
        title: "NO LKP",
        width: 100,
        render(row) {
            return h(NTag, {
                type: row.no_lkp ? 'primary' : 'default',
                size: "small",
                secondary: true,
                onClick: () => handleDetail(row),
            }, { default: () => row.no_lkp ? row.no_lkp : 'Belum Ada' })
        }
    },
    {
        title: "HASIL KUNJUNGAN",
        width: 100,
        render(row) {
            const hasLkp = !!row.no_lkp
            const isEmpty = row.kunjungan_terakhir == null

            // 🔥 tentukan icon & label
            let icon = RemoveRedEyeOutlined
            let label = "Detail"

            if (hasLkp && isEmpty) {
                icon = CreateOutlined
                label = "Isi"
            }

            return h(NButton, {
                type: hasLkp && isEmpty ? 'info' : 'default',
                size: "small",
                onClick: () => handleDetail(row),
            }, {
                default: () => [
                    h("div", {
                        style: "display:flex; align-items:center; gap:4px;"
                    }, [
                        h(NIcon, { size: 16 }, { default: () => h(icon) }),
                        isEmpty ? label : 'Lihat'
                    ])
                ]
            })
        }
    },
    {
        title: "NO KONTRAK",
        key: "no_kontrak",
        width: 100,
        sorter: 'default',
    },
    {
        title: "ALAMAT",
        key: "alamat",
        sorter: 'default',
        width: 120,
        ellipsis: {
            tooltip: true,
        }
    },
    {
        title: "PIC",
        key: "nama_pic",
        sorter: 'default',
        width: 100,
        filter: true,
        filterMultiple: true,
        filterOptions: [],
    },
    {
        title: "TGL BAYAR",
        key: "tgl_bayar",
        sorter: 'default',
        width: 100
    },

    {
        title: "PEMBAYARAN",
        key: "total_bayar",
        sorter: 'default',
        width: 100,
        render(row) {
            return h("div", row.total_bayar.toLocaleString())
        }
    },
    {
        title: "CYCLE AWAL",
        key: "cycle_awal",
        sorter: 'default',
        width: 100, filter: true,
        filterMultiple: true,
        filterOptions: [],
    },
    {
        title: "CYCLE AKHIR",
        key: "cycle_akhir",
        sorter: 'default',
        width: 100, filter: true,
        filterMultiple: true,
        filterOptions: [],
    },
    {
        title: "KUNJ. TERAKHIR",
        key: "hasil_kunjungan",
        sorter: 'default',
        width: 100,
        ellipsis: {
            tooltip: true,
        }
    },
    {
        title: "TGL KUNJ. TERAKHIR",
        key: "tgl_kunjungan",
        sorter: 'default',
        width: 100
    },
    {
        title: "TGL JTH TEMPO",
        key: "tgl_jatuh_tempo",
        sorter: 'default',
        width: 100,
    },
    {
        title: "TGL JB",
        key: "tgl_jb",
        sorter: 'default',
        width: 100,
    },
    {
        title: "ANGS KE",
        key: "angusran_ke",
        sorter: 'default',
        width: 100,
    },
    {
        title: "ANGSURAN",
        key: "angsuran",
        sorter: 'default',
        width: 100,
        render(row) {
            return h("div", row.angsuran.toLocaleString())
        }
    },


];
const dataList = ref([]);
const getData = async () => {
    isLoading.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "GET",
        api: "list_tagihan_collector",
        token: userToken,
    });
    if (!response.ok) {
        console.log(response.error);
    } else {
        loadingBar.finish();
        // console.log(response.data.response)
        isLoading.value = false;
        dataList.value = response.data;
        const uniqueValues = (key) => {
            return [...new Set(response.data.map((item) => item[key]).filter(Boolean))];
        };

        const setFilterOptions = (key, sortNumeric = false) => {
            const col = columnBebanTagih.find((c) => c.key === key);
            if (col) {
                let values = [...new Set(dataList.value.map((item) => item[key]).filter(Boolean))];

                if (sortNumeric) {
                    values = values.sort((a, b) => Number(a) - Number(b));
                } else {
                    // 🔥 SORT ALPHABET
                    values = values.sort((a, b) => a.localeCompare(b));
                }

                col.filterOptions = values.map((val) => ({
                    label: val,
                    value: val,
                }));
            }
        };
        setFilterOptions("nama_pic");
        setFilterOptions("cycle_awal");
        setFilterOptions("cycle_akhir");
    }
};

const modalDetail = ref(false);
const bodyDetail = ref();
const handleDetail = async (e) => {
    formDataKunjungan.value = {
        no_surat: null,
        keterangan: null,
        tgl_jb: null,
        path: []
    }
    await getDetail(e)
    modalDetail.value = true;
    formDataKunjungan.value.no_surat = e.no_surat;
}

const getDetail = async (e) => {
    isLoading.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "GET",
        api: `list_tagihan_collector/detail/${e.id}`,
        token: userToken,
    });
    if (!response.ok) {
        isLoading.value = false;
        console.log(response.error);
    } else {
        isLoading.value = false;
        bodyDetail.value = response.data;
    }
};

function onFilterChange(newFilter) {
    Object.keys(newFilter).forEach((key) => {
        filterValue[key] = newFilter[key] || [];
    });
}

const filterValue = reactive({
    NBOT: [],
    KECAMATAN: [],
    SURVEYOR: [],
    "SURVEYOR STATUS": [],
});
const boxSearch = ref();
const filteredDataList = computed(() => {
    let filteredData = dataList.value;

    for (const key in filterValue) {
        if (filterValue[key].length > 0) {
            filteredData = filteredData.filter((row) =>
                filterValue[key].includes(row[key])
            );
        }
    }

    // Terapkan filter pencarian global jika ada
    if (boxSearch.value) {
        const searchTerm = boxSearch.value.toLowerCase();
        filteredData = filteredData.filter((row) => {
            return Object.values(row).some((val) =>
                String(val).toLowerCase().includes(searchTerm)
            );
        });
    }

    return filteredData;
});
// A computed property to get only the filters that have values
const activeFilters = computed(() => {
    const active = {};
    for (const key in filterValue) {
        if (filterValue[key] && filterValue[key].length > 0) {
            active[key] = filterValue[key];
        }
    }
    return active;
});

const hasActiveFilters = computed(() => {
    return Object.keys(activeFilters.value).length > 0;
});

// Function to remove a single filter tag
const removeFilter = (key, valueToRemove) => {
    const values = filterValue[key];
    if (values) {
        const index = values.indexOf(valueToRemove);
        if (index > -1) {
            values.splice(index, 1);
        }
    }
};
const pagination = reactive({
    pageSize: 5,
    showSizePicker: true,
    pageSizes: [10, 20, 30, 50, 100],
    onChange: (page) => {
        pagination.page = page;
    },
    onUpdatePageSize: (pageSize) => {
        pagination.pageSize = pageSize;
        pagination.page = 1;
    }
})


onMounted(() => {
    loadingBar.finish();
    getData();
}
)
    ;

</script>
