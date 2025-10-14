<template>
    <n-card :class="`shadow`" title="Daftar Tagihan" :segmented="true" size="small">
        <div>
            <n-space vertical :size="12">
                <n-input type="text" placeholder="nyari apa ?" v-model:value="boxSearch" v-if="!ctrDownload"
                    @blur="searchData" />
                <n-data-table :columns="columnBebanTagih" :data="dataList" :filter-value="filterValue"
                    :loading="isLoading" size="small" :pagination="{ pageSize: 10 }" :scroll-x="1300" />
            </n-space>
        </div>
    </n-card>
    <n-modal v-model:show="modalDetail" :mask-closable="false">
        <n-card :class="`shadow`" class="w-full md:w-5/6" title="DETAIL TAGIHAN" :segmented="true" size="small">
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
            <n-card :class="`shadow`" class="mb-2" size="small" embedded>
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
                <div class="w-1/3">
                    <n-card :class="`shadow`" title="History Surat" :segmented="true" size="small">
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
                        <n-timeline>
                            <n-timeline-item type="warning" v-for="i in bodyHistory" :key="i" :content="i.description"
                                :time="timeAgo(i.create_date)" />
                        </n-timeline>
                    </n-card>
                </div>
            </n-modal>
        </n-card>
    </n-modal>

</template>
<script setup>
import { NButton, useLoadingBar, useMessage } from "naive-ui";
import { onMounted, ref } from "vue";
import { useApi } from "../../../helpers/axios.js";
import { useMeStore } from "../../../stores/me";
import _ from "lodash";

const me = useMeStore();
const message = useMessage();
const isLoading = ref(false);
const modalHistory = ref(false);



const selectedBranch = ref();
const bodyHistory = ref([]);
const handleHistory = (e) => {
    modalHistory.value = true;
    getHistory(e);
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
        console.log(reponse.error);
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
        console.log(reponse.error);
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
    bodyDetail.value = e;
    modalDetail.value = true;
    formDataKunjungan.value.no_surat = e.no_surat;
}

const checkedRowKeys = ref([]);

const boxSearch = ref();

onMounted(() => {
    loadingBar.finish();
    getData();
}
)
    ;

</script>
