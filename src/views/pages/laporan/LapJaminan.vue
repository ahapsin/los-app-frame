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
            <n-card class="w-2/3">
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
    </div>
</template>
<script setup>
import { ref, onMounted, computed, reactive, h } from "vue";
import { useApi } from "../../../helpers/axios";
import { useSearch } from "../../../helpers/searchObject";
import { useMeStore } from "../../../stores/me";
import {
    useMessage,
    NButton, NInput,
} from "naive-ui";
import JsonExcel from "vue-json-excel3";

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
const loadTable = ref(false);
const getData = async () => {
    loadTable.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "GET",
        api: `collateral_report?pos=${dynamicSearch.pos}&loan_number=${dynamicSearch.loan_number}&nama=${dynamicSearch.nama}&nopol=${dynamicSearch.nopol}&status=${dynamicSearch.status}`,
        token: userToken,
    });
    if (!response.ok) {
        message.info(response.error);
    } else {
        dataTable.value = response.data;
        loadTable.value = false;
    }
};
const convertObjectToArray = (obj) => {
    if (!Array.isArray(obj) || obj.length === 0) {
        return [];
    }
    const keys = Object.keys(obj[0]);
    return keys.map(key => ({ title: key, key: key }));
}
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
