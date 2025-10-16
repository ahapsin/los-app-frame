<template>

    <n-card  title="Daftar Tagihan" :segmented="true" size="small" v-if="width > 412">
        <template #header-extra>
            <n-space>
                <n-input clearable v-model:value="boxSearch" placeholder="cari">
                    <template #suffix>
                        <v-icon name="bi-search"></v-icon>
                    </template>
                </n-input>
                <n-button type="success" secondary @click="exportToExcel(filteredDataList)">
                    <template #icon>
                        <v-icon name="bi-download"></v-icon>
                    </template>
                    Export Excel
                </n-button>
                <n-button quaternary circle @click="getData">
                    <template #icon>
                        <v-icon name="bi-arrow-clockwise"></v-icon>
                    </template>
                </n-button>
            </n-space>
        </template>
        <div>
            <n-space vertical :size="12">
                <n-input type="text" placeholder="nyari apa ?" v-model:value="boxSearch" v-if="!ctrDownload"
                    @blur="searchData" />
                <n-data-table :columns="columnBebanTagih" :data="filteredDataList" :filter-value="filterValue"
                    :loading="isLoading" size="small" :pagination="{ pageSize: 10 }" :scroll-x="1300" />
            </n-space>
        </div>
    </n-card>
    <div v-else class="m-2">
        <n-input type="text" placeholder="nyari apa ?" v-model:value="boxSearch" @blur="searchData" />
        <n-infinite-scroll style="height: 80dvh" :distance="10" class="mt-2">
            <div class="flex flex-col gap-2">
                <div class="flex justify-between p-6 border rounded-2xl focus:bg-red-500 bg-white" v-for="i in dataList"
                    @click="handleDetail(i)">
                    <div class="flex flex-col">
                        <p>Surat #:<n-text class="font-bold text-pr">{{ i.no_surat }}</n-text></p>
                        <n-text class="font-bold text-neutral">{{ i.nama_customer }}</n-text>
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
        <n-card  class="w-full md:w-5/6" title="DETAIL TAGIHAN" :segmented="true" size="small">
            <template #header-extra>
                <n-space align="center">
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
            <n-card  class="mb-2" size="small" embedded>
                <div class="flex flex-wrap gap-4">
                    <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                        <small class="text-reg">No Surat</small>
                        <n-text strong class="text-md">{{ bodyDetail.no_surat }}</n-text>
                    </div>

                    <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]" v-if="bodyDetail?.no_lkp">
                        <small class="text-reg">No LKP</small>
                        <n-text type="warning">
                            {{ bodyDetail.no_lkp }}
                        </n-text>
                    </div>
                    <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                        <small class="text-reg">No Kontrak</small>
                        <n-text strong class="text-md">{{ bodyDetail.no_kontrak }}</n-text>
                    </div>
                    <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                        <small class="text-reg">Customer</small>
                        <n-text strong class="text-md">{{ bodyDetail.nama_customer }}</n-text>
                    </div>
                    <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                        <small class="text-reg">Tgl Jatuh Tempo</small>
                        <n-ellipsis class="text-md font-semibold">{{ bodyDetail.tgl_jatuh_tempo }}</n-ellipsis>
                    </div>
                    <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                        <small class="text-reg">Cycle</small>
                        <n-ellipsis class="text-md font-semibold">{{ bodyDetail.cycle_awal }}</n-ellipsis>
                    </div>
                    <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                        <small class="text-reg">Angsuran ke</small>
                        <n-ellipsis class="text-md font-semibold">{{ bodyDetail.angusran_ke }}</n-ellipsis>
                    </div>
                    <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                        <small class="text-reg">Angsuran ke</small>
                        <n-ellipsis class="text-md font-semibold">{{ bodyDetail.angsuran?.toLocaleString()
                        }}</n-ellipsis>
                    </div>
                    <div class="flex flex-col w-full">
                        <small class="text-reg">Alamat</small>
                        <n-text strong class="text-md">{{ bodyDetail.alamat }}</n-text>
                    </div>
                </div>
            </n-card>
            <!-- <n-divider title-placement="left">Rincian Tagihan</n-divider> -->
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
                        format="dd-MM-yyyy" type="date" v-model:value="formDataKunjungan.tgl_jb" />
                </n-form-item>
                <n-form-item label="Dokumen Kunjungan">
                    <file-upload :def_preview="true" :multi="true" title="dokumen kunjungan" endpoint="cl_survey_upload"
                        type="other" @fallback="handleFallback" />
                </n-form-item>
            </div>

            <template #footer>
                <div class="flex gap-2" v-if="bodyDetail?.no_lkp">
                    <n-button type="primary" @click="handleSubmitKunjungan">Simpan</n-button>
                    <n-button type="secondary" @click="modalDetail = false">Batal</n-button>
                </div>
            </template>
            <n-modal v-model:show="modalHistory">
                <div class="w-1/2">
                    <n-card  title="History Surat" :segmented="true" size="small">
                        <n-tabs type="segment" animated>
                            <n-tab-pane name="timeline" tab="TIMELINE">
                                <n-scrollbar style="max-height: 300px">
                                    <n-timeline>
                                        <n-timeline-item type="success" v-for="i in bodyHistory" :key="i"
                                            :content="i.description" :time="timeAgo(i.create_date)" />
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
                                            <div class="grid grid-flow-col">
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
                            </n-tab-pane>
                        </n-tabs>

                    </n-card>
                </div>
            </n-modal>
        </n-card>
    </n-modal>

</template>
<script setup>
import { useWindowSize } from "@vueuse/core";
import { NButton, useLoadingBar, useMessage } from "naive-ui";
import { onMounted, ref } from "vue";
import { useApi } from "../../../helpers/axios.js";
import { useMeStore } from "../../../stores/me";
import _ from "lodash";
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver';
import moment from 'moment';

const { width } = useWindowSize();
const me = useMeStore();
const message = useMessage();
const isLoading = ref(false);
const modalHistory = ref(false);


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
    path: []
})
const handleFallback = (e) => {
    formDataKunjungan.value.path.push(e);
}
const handleSubmitKunjungan = async () => {
    await postKunjungan(formDataKunjungan.value);
    modalDetail.value = false;
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
        console.log(response.error);
    } else {
        loadingBar.finish();
        // console.log(response.data.response)
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

const postForm = () => {

}



const columnBebanTagih = [
    {
        title: "No Surat",
        key: "no_surat",
        sorter: 'default',
        width: 120,
        fixed: "left",
    },
    {
        title: "Customer",
        key: "nama_customer",
        sorter: 'default',
        width: 120,
        fixed: "left",
    },
    {
        title: "No LKP",
        key: "no_lkp",
        sorter: 'default',
        width: 120,
    },
    {
        title: "No Kontrak",
        key: "no_kontrak",
        width: 150,
        sorter: 'default',
    },
    {
        title: "Tgl Jth Tempo",
        key: "tgl_jatuh_tempo",
        sorter: 'default',
        width: 150,
    },
    {
        title: "Angsuran ke",
        key: "angusran_ke",
        sorter: 'default',
        width: 120,
    },
    {
        title: "Angsuran",
        key: "angsuran",
        sorter: 'default',
        width: 120,
        render(row) {
            return h("div", row.angsuran.toLocaleString())
        }
    },

    {
        title: "Alamat",
        key: "alamat",
        sorter: 'default',
        width: 120,
        ellipsis: {
            tooltip: true,
        }
    },
    {
        title: "",
        align: "right",
        width: 120,
        render(row) {
            return h(NButton, {
                type: 'primary',
                size: "small",
                onClick: () => handleDetail(row),
            }, { default: () => 'Kunjungan' })
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
        console.log(reponse.error);
    } else {
        loadingBar.finish();
        // console.log(response.data.response)
        isLoading.value = false;
        dataList.value = response.data;
    }
};

const modalDetail = ref(false);
const bodyDetail = ref();
const handleDetail = (e) => {
    formDataKunjungan.value = {
        no_surat: null,
        keterangan: null,
        tgl_jb: null,
        path: []
    }
    bodyDetail.value = e;
    modalDetail.value = true;
    formDataKunjungan.value.no_surat = e.no_surat;
}

const checkedRowKeys = ref([]);
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
onMounted(() => {
    loadingBar.finish();
    getData();
}
)
    ;

</script>
