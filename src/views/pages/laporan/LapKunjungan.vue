<template>
    <n-card :class="`shadow-lg`" content-style="padding: 0;" :segmented="{
        content: true,
        footer: 'soft',
    }" size="small">
        <template #header>Laporan Kunjungan
        </template>
        <div>
            <div class="flex gap-2 p-4 bg-sc-50/50 border-b">
                <n-form-item label="POS" class="w-full" v-if="me.me.cabang_nama === 'Head Office'">
                    <n-select :loading="loadingBranch" filterable placeholder="Pilih POS" label-field="nama"
                        value-field="id" :default-value="defBranch" :options="dataBranch"
                        v-model:value="selectBranch" />
                </n-form-item>
                <n-form-item label="No Kontrak" class="w-full">
                    <n-input v-model:value="no_kontrak" placeholder="No Kontrak" />
                </n-form-item>
                <n-form-item label="Nasabah" class="w-full">
                    <n-input v-model:value="nasabah" placeholder="Nasabah" />
                </n-form-item>
                <n-form-item label="TANGGAL" class="w-full">
                    <n-date-picker v-model:formatted-value="rangeDate" :default-calendar-start-time="Date.now()"
                        clearable start-placeholder="dari" type="daterange" end-placeholder="sampai"
                        format="yyyy-MM-dd" />
                </n-form-item>
                <n-form-item class="w-full">
                    <n-space>
                        <n-button type="primary" @click="filterData" class="px-4"> Cari</n-button>
                        <n-button type="primary" secondary
                            @click="exportToExcel(listData.map(item => _.omit(item, ['PathFile'])))">Download</n-button>
                    </n-space>
                </n-form-item>
            </div>
            <div class="p-2 bg-white rounded-b-xl">
                <n-data-table :columns="columnsKunjungan" :data="listData" :pagination="{ pageSize: 10 }" striped
                    :loading="loadData" :scroll-x="2600" />
            </div>
        </div>
    </n-card>


</template>
<script setup>
import { saveAs } from 'file-saver';
import _ from "lodash";
import { NImage, NSpace, useMessage } from "naive-ui";
import * as XLSX from 'xlsx';
import { useApi } from "../../../helpers/axios.js";
import { useMeStore } from "../../../stores/me.js";
const dataBranch = ref([]);
const selectBranch = ref();
const defBranch = ref();
const userToken = localStorage.getItem("token");
const loadingBranch = ref(false);
const message = useMessage();
const rangeDate = ref();
const dynamicSearch = reactive({
    cabang_id: computed(() => selectBranch.value),
    no_transaksi: '',
    atas_nama: '',
    no_kontrak: '',
    dari: null,
});

const columnsKunjungan = [
    {
        title: "Tanggal",
        key: "TglVisit",
        sorter: "default",
        width: 120, ellipsis: {
            tooltip: true,
        },
    },
    {
        title: "No Kontrak",
        key: "NoKontrak",
        sorter: "default",
        width: 150
    },
    {
        title: "Cabang",
        key: "Cabang",
        sorter: "default",
        width: 120
    },
    {
        title: "Petugas",
        key: "NamaMcf",
        sorter: "default",
        width: 200
    },
    {
        title: "Nasabah",
        key: "NamaNasabah",
        sorter: "default",
        width: 200
    },
    {
        title: "Alamat",
        key: "AlamatNasabah",
        sorter: "default",
        width: 120,
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: "No HP",
        key: "TeleponNasabah",
        sorter: "default",
        width: 120
    },
    {
        title: "Kategori",
        key: "StatusNasabah",
        sorter: "default",
        width: 120

    },
    {
        title: "Ref / Sumber",
        key: "SumberOrder",
        sorter: "default",
        width: 200
    },
    {
        title: "Tanggal Bayar",
        key: "TanggalBayar",
        sorter: "default",
        width: 200
    },
    {
        title: "AMBC Total",
        key: "AmbcTotal",
        sorter: "default",
        width: 200,
        render(row) {
            return h("div", row.AmbcTotal?.toLocaleString())
        }
    },
    {
        title: "Pembayaran",
        key: "Pembayaran",
        sorter: "default",
        width: 200,
        render(row) {
            return h("div", row.Pembayaran?.toLocaleString())
        }
    },
    {
        title: "Cycle Awal",
        key: "CycleAwal",
        sorter: "default",
        width: 200
    },
    {
        title: "Cycle Akhir",
        key: "CycleAkhir",
        sorter: "default",
        width: 200
    },

    {
        title: "Keterangan",
        key: "Keterangan",
        sorter: "default",
        width: 200,
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: "#",
        key: "PathFile",
        render(row) {
            let images = row.PathFile

            // normalize ke array
            if (!Array.isArray(images)) {
                if (!images) return "-"
                images = [images]
            }

            return h(
                NSpace,
                { size: 4 },
                () =>
                    images.map((url) =>
                        h(NImage, {
                            src: url,
                            width: 50,
                            height: 50,
                            objectFit: "cover",
                            style: "border-radius: 6px; height:20px;"
                        })
                    )
            )
        }
    }
]


const getBranch = async () => {
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
            selectBranch.value = me.me.cabang_id;
        } else {
            selectBranch.value = "SEMUA CABANG";
            dataBranch.value = response.data.response;
            dataBranch.value.unshift({
                id: "",
                nama: "SEMUA CABANG"
            });
        }
    }
}


const listData = ref([]);
const loadData = ref(false);

const getData = async () => {
    loadData.value = true;
    const response = await useApi({
        method: "POST",
        api: "VisitReports",
        token: userToken,
    });
    if (!response.ok) {
        message.error("ERROR API");
    } else {
        loadData.value = false;
        listData.value = response.data;
    }
}
const no_kontrak = ref();
const nasabah = ref();
const filterData = async () => {
    let a = {
        dari: rangeDate.value?.[0] ?? null,
        sampai: rangeDate.value?.[1] ?? null,
        no_kontrak: no_kontrak.value,
        nama: nasabah.value,
        cabang_id: selectBranch.value ?? null
    }
    loadData.value = true;
    const response = await useApi({
        method: "POST",
        data: a,
        api: "VisitReports",
        token: userToken,
    });
    if (!response.ok) {
        message.error("ERROR API");
    } else {
        loadData.value = false;
        listData.value = response.data;
    }
}

const exportToExcel = (data) => {
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'data.xlsx')
}
const me = useMeStore();
onMounted(() => {
    getBranch();
    getData();
    me;
});
</script>
