<script setup>
import { saveAs } from 'file-saver';
import moment from 'moment';
import { NButton, NProgress, NTag } from 'naive-ui';
import { h, nextTick } from 'vue';
import { useVueToPrint } from 'vue-to-print';
import * as XLSX from 'xlsx';
import { useApi } from '../../../helpers/axios';
import { useSearch } from '../../../helpers/searchObject';
import AddLkp from './addLkp.vue';
import UpdateLkp from './UpdateLkp.vue';



const modalAdd = ref(false);
const modalPrint = ref(false);
const printRef = ref();
const filterDate = ref(null)
const showFilterDate = ref(false);


const addDeploy = () => {
    modalAdd.value = true;
}
const modalDetail = ref(false);
const bodyModalDetail = ref([]);
const handleDetail = (e) => {
    modalDetail.value = true;
    getDetail(e.no_lkp);
    // console.log(e.no_lkp);
}
const bodyModalUpdate = ref();
const handleUpdate = (e) => {
    modalAdd.value = true;
    addMode.value = false;
    bodyModalUpdate.value = e;
}

const disableOtherMonth = (ts) => {
    const currentMonth = moment().month()
    const currentYear = moment().year()

    const date = moment(ts)

    return date.month() !== currentMonth || date.year() !== currentYear
}



const { handlePrint } = useVueToPrint({
    content: printRef,
    documentTitle: "cetak LKP",
});

const printAction = async () => {
    modalPrint.value = true;
}
watch(modalPrint, async (val) => {
    if (val) {
        await nextTick()
        setTimeout(() => {
            handlePrint()
        }, 300) // beri delay kecil supaya modal fully rendered
    }
})

const getDetail = async (e) => {
    isLoading.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "GET",
        api: `cl_lkp_detail/${e}`,
        token: userToken,
    });
    if (!response.ok) {
        isLoading.value = false;
        console.error(response.error);
    } else {
        isLoading.value = false;
        bodyModalDetail.value = response.data;
    }
};
const columnDeploy = reactive([
    {
        title: "CABANG",
        key: "cabang",
        sorter: "default",
    },
    {
        title: "NO LKP",
        key: "no_lkp",
        sorter: "default",
    },
    {
        title: "PETUGAS",
        key: "petugas",
        sorter: "default",
    },
    {
        title: "TANGGAL",
        key: "tanggal",
        sorter: "default",
    },
    {
        title: "JML SURAT",
        key: "jml_surat_tgh",
        sorter: "default",
    },
    {
        title: "PROGRES",
        key: "status",
        sorter: "default",
        render(row) {
            return h(NProgress, {
                percentage: row.presentase,
            }, {})
        }
    },
    {
        title: "STATUS",
        key: "status",
        sorter: "default",
        render(row) {
            return h(NTag, {
                size: "small",
                round: true,
                type: row.status === 'DRAFT' ? 'warning' : row.status === 'OPEN' ? 'success' : 'error'
            }, {
                default: () => row.status
            })
        }
    },

    {
        key: "detail",
        align: "right",
        render(row) {
            return h(NButton, {
                size: "small",
                secondary: true,
                onClick: () => row.status === 'DRAFT' ? handleUpdate(row) : handleDetail(row),
            }, {
                default: () => row.status === 'DRAFT' ? "Edit" : "Detail",
            })
        }
    }
]);

const handleCancel = () => {
    modalAdd.value = false;
}
const exportToExcel = (data) => {
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'DAFTAR LKP.xlsx')
}
const isLoading = ref(false);
const dataList = ref([]);
const getList = async () => {
    isLoading.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "GET",
        api: "cl_lkp_list",
        token: userToken,
    });
    if (!response.ok) {
        isLoading.value = false;
        console.error(response.error);
    } else {
        isLoading.value = false;
        dataList.value = response.data;
    }
};
const boxSearch = ref();

const handleSaved = () => {
    modalAdd.value = false;
    getList();
}
const columnBebanTagih = reactive([
    {
        title: "NO SURAT",
        key: "no_surat",
        width: 150,
        sorter: "default",
    },
    {
        title: "NO KONTRAK",
        key: "no_kontrak",
        width: 150,
        sorter: "default",
    },
    {
        title: "MCF",
        key: "mcf",
        width: 150,
        sorter: "default",
    },
    {
        title: "NAMA KONSUMEN",
        key: "nama_customer",
        width: 200,
        sorter: "default",
    },
    {
        title: "KEC",
        key: "kec",
        sorter: "default",
        width: 150,
    },
    {
        title: "DESA",
        key: "desa",
        sorter: "default",
        width: 150,
    },
    {
        title: "TGL JATUH TEMPO",
        key: "tgl_jatuh_tempo",
        width: 200,
        sorter: "default",
    },
    {
        title: "CYCLE",
        key: "cycle_awal",
        sorter: "default",
        width: 150,
    },
    {
        title: "AMBC TOTAL",
        key: "ambc_total",
        sorter: "default",
        width: 150,
        render(row) {
            return h("div", row.ambc_total?.toLocaleString())
        }
    },
    {
        title: "ANGSURAN KE",
        key: "angusran_ke",
        sorter: "default",
        width: 150,
    },
    {
        title: "TTL ANGSURAN ",
        key: "total_ambc",
        sorter: "default",
        width: 150,
        render(row) {
            return h("div", row.total_angsuran?.toLocaleString())
        }
    },
    {
        title: "ANGSURAN ",
        key: "angsuran",
        sorter: "default",
        width: 150,
        render(row) {
            return h("div", row.angsuran?.toLocaleString())
        }
    },
    {
        title: "BAYAR ",
        key: "bayar",
        sorter: "default",
        width: 150,
        render(row) {
            return h("div", row.bayar?.toLocaleString())
        }
    },
    {
        title: "HASIL KUNJUNGAN ",
        key: "hasil_kunjungan",
        sorter: "default",
        width: 230,
    },
    {
        title: "TGL JB",
        key: "tgl_jb",
        sorter: "default",
        width: 150,
    },
    {
        title: "DETAIL ",
        sorter: "default",
        width: 80,
        render(row) {
            return h(NButton, {
                size: "small",
                secondary: true,
                onClick: () => handleHistorySurat(row.no_surat),
            }, {
                default: () => "Detail",
            })
        }
    },

]);

const modalHistorySurat = ref(false);
const bodyHistorySurat = ref([]);
const handleHistorySurat = async (e) => {
    modalHistorySurat.value = true;
    await getHistorySurat(e);
}

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

const searchBox = ref();
const showData = computed(() => {
    let data = useSearch(dataList.value, searchBox.value)

    if (!filterDate.value) {
        const currentMonth = moment().format("MM")
        const currentYear = moment().format("YYYY")

        return data.filter(item => {
            const m = moment(item.tanggal)
            return m.format("MM") === currentMonth && m.format("YYYY") === currentYear
        })
    }

    const selectedDate = moment(filterDate.value).format("YYYY-MM-DD")

    return data.filter(item => {
        return moment(item.tanggal).format("YYYY-MM-DD") === selectedDate
    })
})

onMounted(() => {
    getList();
});
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

const pagination = reactive({
    pageSize: 10,
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
const addMode = ref(false);
const handleAddLkp = () => {
    modalAdd.value = true;
    addMode.value = true;
}

</script>
<template>
    <n-card :class="`shadow-lg`" title="Daftar LKP" size="small">
        <template #header-extra>
            <n-space>
                <n-input clearable v-model:value="searchBox" placeholder="cari">
                    <template #suffix>
                        <v-icon name="bi-search"></v-icon>
                    </template>
                </n-input>
                <n-date-picker v-model:value="filterDate" type="date" format="yyyy-MM-dd" clearable
                    v-if="showFilterDate" />
                <n-button @click="showFilterDate = !showFilterDate" circle secondary>
                    <template #icon>
                        <v-icon name="bi-calendar" v-if="!showFilterDate"></v-icon>
                        <v-icon name="bi-x" v-else></v-icon>
                    </template>
                </n-button>
                <n-button type="primary" secondary link @click="handleAddLkp">
                    <template #icon>
                        <v-icon name="bi-plus-lg"></v-icon>
                    </template>
                    Buat LKP
                </n-button>
                <n-button type="success" secondary @click="exportToExcel(dataList)">
                    <template #icon>
                        <v-icon name="bi-download"></v-icon>
                    </template>
                    Export Excel
                </n-button>
                <!-- <n-button quaternary circle @click="getList">
                    <template #icon>
                        <v-icon name="bi-arrow-clockwise"></v-icon>
                    </template>

                </n-button> -->
            </n-space>
        </template>
        <n-data-table :columns="columnDeploy" :data="showData" :loading="isLoading" size="small"
            :pagination="pagination" />
    </n-card>
    <n-modal v-model:show="modalAdd">
        <div class="w-4/5">
            <AddLkp v-if="addMode" @cancel="handleCancel" @saved="handleSaved" />
            <UpdateLkp v-if="!addMode" :data="bodyModalUpdate" @cancel="handleCancel" @saved="handleSaved" />
        </div>
    </n-modal>
    <n-modal v-model:show="modalDetail">
        <n-card :class="`shadow-lg`" class="w-4/5" title="Detail LKP" size="small" :segmented="true">
            <template #header-extra>
                <n-button @click="printAction">
                    <template #icon>
                        <v-icon name="bi-printer"></v-icon>
                    </template>
                    Cetak
                </n-button>
            </template>
            <div>
                <n-card :class="`shadow-lg`" class="mb-2" size="small" embedded>
                    <div class="flex  gap-4">
                        <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                            <small class="text-reg">No LKP</small>
                            <n-text strong class="text-md">{{ bodyModalDetail.no_lkp }}</n-text>
                        </div>

                        <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                            <small class="text-reg">Petugas</small>
                            <n-text strong class="text-md">{{ bodyModalDetail.petugas }}</n-text>
                        </div>

                        <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                            <small class="text-reg">Tanggal</small>
                            <n-ellipsis class="text-md font-semibold">{{ bodyModalDetail.tanggal }}</n-ellipsis>
                        </div>

                        <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                            <small class="text-reg">Jumlah Surat Tagih</small>
                            <n-text strong class="text-md">{{ bodyModalDetail.jml_surat_tgh }}</n-text>
                        </div>

                    </div>
                </n-card>
                <n-data-table :columns="columnBebanTagih" :data="bodyModalDetail.details" :filter-value="filterValue"
                    @update:filters="onFilterChange" size="small" :loading="isLoading" :pagination="pagination" />
            </div>
        </n-card>
    </n-modal>
    <n-modal v-model:show="modalPrint">
        <n-card class="w-[33cm]">
            <div ref="printRef" class="m-[0.5cm]">
                <div class="flex text-[10px] gap-4 border-b ">
                    <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                        <small class="text-reg">No LKP</small>
                        <n-text strong class="text-md">{{ bodyModalDetail.no_lkp }}</n-text>
                    </div>
                    <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                        <small class="text-reg">Petugas</small>
                        <n-text strong class="text-md">{{ bodyModalDetail.petugas }}</n-text>
                    </div>
                    <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                        <small class="text-reg">Tanggal</small>
                        <n-ellipsis class="text-md font-semibold">{{ bodyModalDetail.tanggal }}</n-ellipsis>
                    </div>
                    <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                        <small class="text-reg">Jumlah Surat Tagih</small>
                        <n-text strong class="text-md">{{ bodyModalDetail.jml_surat_tgh }}</n-text>
                    </div>
                </div>
                <table class="text-[10px]" width="100%">
                    <thead>
                        <tr>
                            <th v-for="h in columnBebanTagih" :key="h.key" class="border-b">
                                {{ h.title }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(b, index) in bodyModalDetail.details" :key="index">
                            <td v-for="col in columnBebanTagih" :key="col.key" class="border-b">
                                {{ b[col.key] }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </n-card>
    </n-modal>
    <n-modal v-model:show="modalHistorySurat">
        <div class="w-2/3">
            <n-card :class="`shadow-lg`" title="Hasil Kunjungan" :segmented="true" size="small">
                <!-- <n-timeline>

                            <n-timeline-item content="Surat Ditugaskan ke  *nama petugas*" time="2018-04-03 20:46" />
                            <n-timeline-item type="info" title="Laporan Kunjungan" content="nasabah tidak ada dirumah"
                                time="2018-04-03 20:46" line-type="dashed" />
                            <n-timeline-item type="warning" content="Mencoba ulang kunjungan oleh *nama marketing*"
                                time="2018-04-03 20:46" />
                            <n-timeline-item type="success" content="Tagihan masuk dan dibayarkan nasabah"
                                time="2018-04-03 20:46" />
                        </n-timeline> -->
                <!-- <n-result status="warning" title="Kunjungan Kosong" description="Tidak Histori Kunjungan">

                        </n-result> -->
                <n-scrollbar style="max-height: 400px">
                    <!-- <n-timeline>
                        <n-timeline-item type="warning" v-for="i in bodyHistorySurat" :key="i" :content="i.description"
                            :time="timeAgo(i.create_date)" />
                    </n-timeline> -->
                    <n-collapse :default-expanded-names="[1]">
                        <n-collapse-item :title="moment(i.tgl_buat).format('DD-MM-YYYY HH:mm')"
                            v-for="i in bodyHistorySurat">
                            <div class="grid grid-flow-col">
                                <div class="flex flex-col flex-1 ">
                                    <small class="text-reg">NO LKP</small>
                                    <n-text strong class="text-md">{{ i.no_lkp }}</n-text>
                                </div>
                                <div class="flex flex-col flex-1 ">
                                    <small class="text-reg">NO SURAT</small>
                                    <n-text strong class="text-md">{{ i.no_surat }}</n-text>
                                </div>
                                <div class="flex flex-col flex-1 ">
                                    <small class="text-reg">PETUGAS</small>
                                    <n-text strong class="text-md">{{ i.oleh }}</n-text>
                                </div>
                                <div class="flex flex-col flex-1 ">
                                    <small class="text-reg">JB</small>
                                    <n-text strong class="text-md">{{ i.tgl_jb }}</n-text>
                                </div>
                                <div class="flex flex-col flex-1 ">
                                    <small class="text-reg">KETERANGAN</small>
                                    <n-text strong class="text-md">{{ i.ket }}</n-text>
                                </div>
                            </div>
                            <div class="flex flex-col p-2 border rounded-lg">
                                <small class="text-reg">DOK KUNJUNGAN</small>
                                <n-image :src="f" v-for="f in i.file" width="60" />
                            </div>
                        </n-collapse-item>
                    </n-collapse>
                </n-scrollbar>
            </n-card>
        </div>
    </n-modal>
</template>
