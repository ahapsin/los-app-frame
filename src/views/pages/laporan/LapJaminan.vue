<template>
    <div>
        <n-space vertical>
            <n-card :title="`Laporan data Jaminan`" :segmented="true" size="small">
                <template #header-extra>
                    <json-excel v-if="showData.length > 0" :data="showData"
                        :name="`laporan_jaminan_${dynamicSearch.pos}`" :fields="json_fields" :stringifyLongNum="true">
                        <n-button type="primary">Download Xls</n-button>
                    </json-excel>
                </template>
                <n-space vertical :size="12" class="pt-4">
                    <div class="flex flex-col md:flex-row gap-2 pt-4 pr-4 ps-4">
                        <n-form-item label="POS" class="w-full">
                            <n-select :loading="loadingBranch" filterable placeholder="Pilih Cabang" label-field="nama"
                                value-field="nama" :default-value="defBranch" :options="dataBranch"
                                v-model:value="dynamicSearch.pos" />
                        </n-form-item>
                        <n-form-item label="NO KONTRAK" class="w-full">
                            <n-input v-model:value="dynamicSearch.loan_number" type="text" placeholder="NO KONTRAK"
                                clearable />
                        </n-form-item>
                        <n-form-item label="NAMA DEBITUR" class="w-full">
                            <n-input v-model:value="dynamicSearch.nama" type="text" placeholder="NAMA DEBITUR"
                                clearable />
                        </n-form-item>
                        <n-form-item label="NO POL" class="w-full">
                            <n-input v-model:value="dynamicSearch.nopol" type="text" placeholder="NO POLISI"
                                clearable />
                        </n-form-item>
                        <n-form-item label="STATUS JAMINAN" class="w-full">
                            <n-select filterable placeholder="Status Jaminan" counter :options="optStatusJaminan"
                                v-model:value="dynamicSearch.status" />
                        </n-form-item>

                        <n-form-item class="flex gap-2" as="div">
                            <n-button type="primary" @click="handleSearch" class="px-4"> Cari</n-button>

                        </n-form-item>
                    </div>
                    <n-data-table :loading="loadTable" size="small" :columns="columns" :data="showData"
                        :pagination="pagination" />
                </n-space>
            </n-card>
        </n-space>
        <n-modal v-model:show="showDetailModal" title="Modal">
            <n-card class="w-2/3" title="Detail Jaminan" size="small">
                <template #header-extra>
                    <n-button type="info" @click="showSuratPengantar = true" v-if="bodyModal.status != 'RILIS'">Surat
                        Pengantar</n-button>
                </template>
                <n-table :bordered="false" :single-line="false" size="small">
                    <thead>
                        <tr>
                            <th>Nama Debitur</th>
                            <th>Order Number</th>
                            <th>No Jaminan</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ bodyModal.nama_debitur }}</td>
                            <td>{{ bodyModal.no_kontrak }}</td>
                            <td>{{ bodyModal.posisi_berkas }}</td>
                            <td>{{ bodyModal.status }}</td>
                        </tr>
                    </tbody>
                </n-table>
                <n-table :bordered="false" :single-line="false" size="small">
                    <tbody>
                        <tr>
                            <th>BPKB NO</th>
                            <td>{{ bodyModal.no_bpkb }}</td>
                        </tr>
                        <tr>
                            <th>BPKB Atas Nama</th>
                            <td>{{ bodyModal.atas_nama }}</td>
                        </tr>
                        <tr>
                            <th>Merk/Tipe/Tahun</th>
                            <td>{{ bodyModal.merk }} / {{ bodyModal.tipe }} / {{ bodyModal.tahun }}</td>
                        </tr>
                        <tr>
                            <th>Warna/No Polisi</th>
                            <td>{{ bodyModal.warna }} /{{ bodyModal.no_polisi }}</td>
                        </tr>
                        <tr>
                            <th>No Rangka/No Mesin</th>
                            <td>{{ bodyModal.no_rangka }}/ {{ bodyModal.no_mesin }}</td>
                        </tr>
                        <tr>
                            <th>No Faktur</th>
                            <td>{{ bodyModal.no_faktur }}</td>
                        </tr>
                        <tr>
                            <th>Dokumen</th>
                            <td>
                                <n-image v-for="doc in bodyModal.document" width="64" height="64" :src="doc.PATH"
                                    :key="doc" />
                            </td>
                        </tr>
                        <tr>
                            <th>Dokumen Rilis</th>
                            <td>
                                <n-image v-for="doc in bodyModal.document_rilis" width="64" height="64" :src="doc.PATH"
                                    :key="doc" />
                            </td>
                        </tr>
                    </tbody>
                </n-table>
            </n-card>
        </n-modal>
        <n-modal v-model:show="showSuratPengantar">
            <n-card class="w-fit" title="Surat Pengantar" size="small" :segmented="true">
                <template #header-extra>
                    <n-button size="small" type="primary" secondary @click="handlePrint">Cetak</n-button>
                </template>
                <div ref="printArea" class="p-4">

                    <kop-header :alamat_cabang="bodyModal.alamat_cabang" :cabang="bodyModal.nama_cabang" />
                    <div class="p-8">
                        <div>
                            Kepada/Yth,<br />
                            Kaditlantas/Kasatlantas<br />
                            Up.Kasubag STNK<br>
                            <b>Di Samsat Resort Indramayu</b>
                        </div>
                        <div class="py-2">
                            <b><i>Perihal : Surat Keterangan Pengurusan STNK</i></b>
                        </div>
                        <div class="py-2">
                            Dengan hormat,
                        </div>
                        <div class="py-2">
                            Yang bertanda tangan di bawah ini :<br />
                            Kantor <b>{{ bodyModal.nama_cabang }}</b> Yang beralamat di Jl.jendral sudirman No.50 (
                            depan
                            joyland park
                            haurgeulis)<br />
                            Ds.Mekarjati Kec.Haurgeulis Kab.Indramayu. <br />Dengan ini menerangkan bahwa Asli Buku
                            Pemilik
                            Kendaraan Bermotor ( BPKB ) atas kendaraan :
                        </div>
                        <div class="p-4">
                            <table>
                                <tr>
                                    <td>NO POLISI</td>
                                    <td>:</td>
                                    <td>{{ bodyModal.no_polisi }}</td>
                                </tr>
                                <tr>
                                    <td>MERK /TYPE /TAHUN</td>
                                    <td>:</td>
                                    <td>{{ bodyModal.merk }} / {{ bodyModal.tipe }} / {{ bodyModal.tahun }}</td>
                                </tr>
                                <tr>
                                    <td>WARNA</td>
                                    <td>:</td>
                                    <td>{{ bodyModal.warna }}</td>
                                </tr>
                                <tr>
                                    <td>NO RANGKA /NO MESIN</td>
                                    <td>:</td>
                                    <td>{{ bodyModal.no_rangka }} / {{ bodyModal.no_mesin }}</td>
                                </tr>
                                <tr>
                                    <td>NAMA BPKB</td>
                                    <td>:</td>
                                    <td>{{ bodyModal.atas_nama }}</td>
                                </tr>
                                <tr>
                                    <td>ALAMAT</td>
                                    <td>:</td>
                                    <td>{{ bodyModal.alamat_bpkb }}</td>
                                </tr>
                            </table>
                        </div>
                        <div><i>Sampai saat ini masih disimpan di <b>KSP DJAYA {{ bodyModal.nama_cabang?.toUpperCase()
                        }}</b>
                                sehubungan Hutang
                                Pinjaman
                                Konsumen
                                tersebut.
                            </i>
                        </div>
                        <div class="py-2">
                            Surat Keterangan ini dibuat untuk keperluan Pengurusan Surat Tanda Nomor Kendaraan ( STNK )
                            dan
                            hanya untuk
                            satu kali penggunaan.
                        </div>
                        <div>
                            <b>{{ bodyModal.nama_cabang }}, {{ thisday }}</b><br />
                            Hormat Kami
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <div>
                                <u><b>{{ bodyModal.kapos }}</b></u><br />
                                KSP DJAYA
                            </div>
                        </div>
                    </div>
                </div>
            </n-card>
        </n-modal>
    </div>
</template>
<script setup>
import {
    NButton, NInput,
    useMessage,
} from "naive-ui";
import { computed, h, onMounted, reactive, ref } from "vue";
import JsonExcel from "vue-json-excel3";
import { useVueToPrint } from "vue-to-print";
import { useApi } from "../../../helpers/axios";
import { useSearch } from "../../../helpers/searchObject";
import { useMeStore } from "../../../stores/me";

const message = useMessage();
const dataTable = ref([]);
const searchBox = ref();
const dynamicSearch = reactive({
    pos: '',
    loan_number: '',
    nama: '',
    nopol: '',
    status: '',
});

const optStatusJaminan = [
    {
        label: 'NORMAL',
        value: 'NORMAL',
    },
    {
        label: 'TITIP',
        value: 'TITIP',
    },
    {
        label: 'SITA',
        value: 'SITA',
    },
    {
        label: 'JUAL',
        value: 'JUAL',
    },
];

const me = useMeStore();
const loadingBranch = ref(false);
const dataBranch = ref();
const defBranch = ref();
const getBranch = async () => {
    let userToken = localStorage.getItem("token");
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
            dynamicSearch.pos = me.me.cabang_nama;
        } else {
            dynamicSearch.pos = "SEMUA POS";
            dataBranch.value = response.data.response;
            dataBranch.value.unshift({
                id: "",
                nama: "SEMUA POS"
            });
        }
    }
}
const handleSearch = () => {
    getData();
}
var dt = new Date();
let year = dt.getFullYear();
let day = dt.getDate().toString().padStart(2, "0");

let thisMonths = (dt.getMonth() + 1).toString().padStart(2, "0");

const thisday = `${day}-${thisMonths}-${year}`;

const loadTable = ref(false);
const getData = async () => {
    loadTable.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "GET",
        api:
            `collateral_report?pos=${dynamicSearch.pos}&loan_number=${dynamicSearch.loan_number}&nama=${dynamicSearch.nama}&nopol=${dynamicSearch.nopol}&status=${dynamicSearch.status}`,
        token: userToken,
    });
    if (!response.ok) {
        message.info(response.error);
    } else {
        dataTable.value = response.data;
        loadTable.value = false;
    }
};

const printArea = ref();
const { handlePrint } = useVueToPrint({
    content: printArea,
    documentTitle: "Surat Pengantar",
});

const pagination = {
    pageSize: 10,
};
const columns = [
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
        title: "No Kontrak",
        key: "no_kontrak",
        sorter: "default",
    },
    {
        title: "Nama Debitur",
        key: "atas_nama",
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

const bodyModal = ref();
const showDetailModal = ref(false);
const showSuratPengantar = ref(false);
const handleAction = (e) => {
    showDetailModal.value = true;
    bodyModal.value = e;
}

onMounted(() => {
    getBranch();
});
const showData = computed(() => {
    return useSearch(dataTable.value, searchBox.value);
});
</script>
