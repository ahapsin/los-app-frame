<template>
    <n-card title="Daftar Tagihan" :segmented="true" size="small">
        <div>
            <n-space vertical :size="12">
                <n-input type="text" placeholder="nyari apa ?" v-model:value="boxSearch" v-if="!ctrDownload"
                    @blur="searchData" />
                <n-data-table :columns="columnBebanTagih" :data="dummyData" :filter-value="filterValue"
                    :loading="isLoading" size="small" :pagination="{ pageSize: 10 }" />
            </n-space>
        </div>
    </n-card>
    <n-modal v-model:show="modalDetail" :mask-closable="false">
        <n-card class="w-5/6 md:w-2/4" title="DETAIL TAGIHAN" :segmented="true" size="small">
            <template #header-extra>
                <n-space>
                    <n-button size="small" quaternary type="info" @click="modalHistory = !modalHistory">
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
            <n-card class="mb-2" size="small" embedded>
                <div class="flex flex-wrap gap-4">
                    <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                        <small class="text-reg">No Surat</small>
                        <n-text strong class="text-md">{{ bodyDetail.no_surat }}</n-text>
                    </div>

                    <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                        <small class="text-reg">No Kontrak</small>
                        <n-text strong class="text-md">{{ bodyDetail.loan_number }}</n-text>
                    </div>

                    <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                        <small class="text-reg">Tgl Jatuh Tempo</small>
                        <n-ellipsis class="text-md font-semibold">{{ bodyDetail.tgl_jth_tempo }}</n-ellipsis>
                    </div>

                    <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                        <small class="text-reg">Customer</small>
                        <n-text strong class="text-md">{{ bodyDetail.nama_customer }}</n-text>
                    </div>

                    <div class="flex flex-col w-full">
                        <small class="text-reg">Alamat</small>
                        <n-text strong class="text-md">{{ bodyDetail.alamat }}</n-text>
                    </div>
                </div>
            </n-card>
            <n-divider title-placement="left">Rincian Tagihan</n-divider>
            <n-table size="small">
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
            </n-table>

            <div v-if="bodyDetail?.no_lkp">
                <n-divider title-placement="left">Hasil Kunjungan</n-divider>
                <n-form-item label="Hasil Kunjungan">
                    <n-input type="textarea"></n-input>
                </n-form-item>
                <n-form-item label="Tanggal JB/FU">
                    <n-date-picker placeholder="Tanggal JB/FU" class="w-full" value-format="yyyy-MM-dd"
                        format="dd-MM-yyyy" type="date" />
                </n-form-item>
                <n-form-item label="Dokumen Kunjungan">
                    <file-upload :def_preview="true" :multi="true" title="dokumen kunjungan"
                        endpoint="image_upload_prospect" type="other" />
                </n-form-item>
            </div>

            <template #footer>
                <div class="flex gap-2" v-if="bodyDetail?.no_lkp">
                    <n-button type="primary">Simpan</n-button>
                    <n-button type="secondary" @click="modalDetail = false">Batal</n-button>
                </div>
            </template>
            <n-modal v-model:show="modalHistory">
                <div class="w-1/3">
                    <n-card title="History Surat" :segmented="true" size="small">
                        <!-- <n-timeline>
                            <n-timeline-item content="Surat Ditugaskan ke  *nama petugas*" time="2018-04-03 20:46" />
                            <n-timeline-item type="info" title="Laporan Kunjungan" content="nasabah tidak ada dirumah"
                                time="2018-04-03 20:46" line-type="dashed" />
                            <n-timeline-item type="warning" content="Mencoba ulang kunjungan oleh *nama marketing*"
                                time="2018-04-03 20:46" />
                            <n-timeline-item type="success" content="Tagihan masuk dan dibayarkan nasabah"
                                time="2018-04-03 20:46" />
                        </n-timeline> -->
                        <n-result status="warning" title="Kunjungan Kosong" description="Tidak Histori Kunjungan">

                        </n-result>
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

const modalHistory = ref(false);


const selectedBranch = ref();




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
const dummyData = [
    {
        no_surat: "SR-2025-001",
        loan_number: "CT-001-2025",
        no_lkp: "LKP-001",
        tgl_jth_tempo: "2025-10-15",
        nama_customer: "Andi Saputra",
        alamat: "Jl. Melati No. 123, Jakarta Selatan",
        SURVEYOR: "MCF-01",
        status: "Belum Dikunjungi",
        detail: [
            {
                angs_ke: 1,
                tgl_jth_tempo: "2025-10-15",
                jumlah: 1500000
            },
            {
                angs_ke: 2,
                tgl_jth_tempo: "2025-11-15",
                jumlah: 1500000
            },
            {
                angs_ke: 3,
                tgl_jth_tempo: "2025-12-15",
                jumlah: 1500000
            }
        ]
    },
    {
        no_surat: "SR-2025-002",
        no_lkp: "LKP-002",
        loan_number: "CT-002-2025",
        tgl_jth_tempo: "2025-10-20",
        nama_customer: "Sari Dewi",
        alamat: "Jl. Mawar No. 45, Bekasi",
        SURVEYOR: "MCF-02",
        status: "Sudah Dikunjungi",
        detail: [
            {
                angs_ke: 1,
                tgl_jth_tempo: "2025-10-20",
                jumlah: 2000000
            },
            {
                angs_ke: 2,
                tgl_jth_tempo: "2025-11-20",
                jumlah: 2000000
            },
            {
                angs_ke: 3,
                tgl_jth_tempo: "2025-12-20",
                jumlah: 2000000
            }
        ]
    },
    {
        no_surat: "SR-2025-003",
        no_lkp: "",
        loan_number: "CT-003-2025",
        tgl_jth_tempo: "2025-10-25",
        nama_customer: "Budi Hartono",
        alamat: "Jl. Kenanga No. 77, Depok",
        SURVEYOR: "MCF-03",
        status: "Tertunda",
        detail: [
            {
                angs_ke: 1,
                tgl_jth_tempo: "2025-10-25",
                jumlah: 1750000
            },
            {
                angs_ke: 2,
                tgl_jth_tempo: "2025-11-25",
                jumlah: 1750000
            },
            {
                angs_ke: 3,
                tgl_jth_tempo: "2025-12-25",
                jumlah: 1750000
            }
        ]
    }
];



const columnBebanTagih = [
    {
        title: "No Surat",
        key: "no_surat",
        width: '150',
        sorter: 'default',
    },
    {
        title: "No LKP",
        key: "no_lkp",
        width: '150',
        sorter: 'default',
    },
    {
        title: "No Kontrak",
        key: "loan_number",
        width: '200',
        sorter: 'default',
    },
    {
        title: "Tgl Jth Tempo",
        key: "tgl_jth_tempo",
        sorter: 'default',
    },
    {
        title: "Customer",
        key: "nama_customer",
        sorter: 'default',
    },
    {
        title: "Alamat",
        key: "alamat",
        sorter: 'default',
        ellipsis: {
            tooltip: true,
        }
    },
    {
        title: "",
        align: "right",
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
        dataList.value = response.data;
    }
};

const modalDetail = ref(false);
const bodyDetail = ref();
const handleDetail = (e) => {
    bodyDetail.value = e;
    modalDetail.value = true;
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
