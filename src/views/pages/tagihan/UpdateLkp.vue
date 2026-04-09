<template>
    <n-card :class="`shadow-lg`" title="Update LKP" :segmented="true" size="small">
        <div>
            <n-alert v-if="hasActiveFilters" type="warning" :show-icon="false" class="mb-4 filter-status"
                title="Filter Aktif">
                <div class="filter-status-list flex flex-col gap-y-2">
                    <div v-for="(values, key) in activeFilters" :key="key" class="filter-group">
                        <span class="filter-key">{{ key }}:</span>
                        <n-tag v-for="value in values" :key="value" closable round size="small"
                            :on-close="() => removeFilter(key, value)" class="filter-tag">
                            {{ value }}
                            ==
                        </n-tag>
                    </div>
                </div>
            </n-alert>
            <n-space vertical :size="12">
                <n-space vertical>
                    <n-form-item label="petugas">
                        <n-input v-model:value="props.data.petugas" disabled />
                    </n-form-item>
                </n-space>
                <div>
                    <n-card :class="`shadow-lg`" embedded title="Daftar Tagihan" size="small" :segmented="true">
                        <template #header-extra>
                            <div class="flex gap-2 pb-4">
                                <n-input clearable v-model:value="boxSearch" placeholder="cari" class="max-w-sm">
                                    <template #suffix>
                                        <v-icon name="bi-search"></v-icon>
                                    </template>
                                </n-input>
                                <n-button type="success" secondary @click="exportToExcel(filteredDataList)"
                                    :disabled="isLoading">
                                    <template #icon>
                                        <v-icon name="bi-download"></v-icon>
                                    </template>
                                    Export Excel
                                </n-button>
                            </div>
                        </template>
                        <n-alert type="info" v-if="checkedRowKeys.length > 0" class="mb-2">{{ checkedRowKeys.length }}
                            data dipilih</n-alert>
                        <n-alert type="error" v-if="dataResponse?.AddLkp === false" class="mb-2">Tidak bisa submit LKP !
                            maksimal
                            3
                            LKP aktif</n-alert>
                        <n-data-table :columns="columnBebanTagih" :data="filteredDataList" :filter-value="filterValue"
                            @update:filters="onFilterChange" :checked-row-keys="checkedRowKeys"
                            :row-key="(row) => row.no_surat" @update:checked-row-keys="handleCheck"
                            :loading="dataLoading" size="small" :pagination="pagination"
                            :row-class-name="getRowClassName" />
                    </n-card>

                </div>
            </n-space>
        </div>
        <template #footer>
            <n-alert type="info" v-if="checkedRowKeys.length === 0">Pilih data tagihan</n-alert>
            <n-space v-else>
                <n-button type="primary" secondary @click="assignTagihan(true)" :disabled="checkedRowKeys.length === 0"
                    :loading="isLoading">
                    <template #icon>
                        <v-icon name="bi-plus-lg" />
                    </template>
                    Simpan
                </n-button>
                <n-button type="primary" @click="assignTagihan(false)"
                    :disabled="checkedRowKeys.length === 0 || !dataResponse?.AddLkp" :loading="isLoading">
                    <template #icon>
                        <v-icon name="bi-send" />
                    </template>
                    Submit
                </n-button>
                <!-- <n-button type="secondary" @click="$emit('cancel', true)">Batal</n-button> -->
            </n-space>
        </template>
    </n-card>
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

<script setup>
import { saveAs } from 'file-saver';
import moment from 'moment';
import { NAvatar, NButton, NTag, NText, useLoadingBar, useMessage } from 'naive-ui';
import { computed, onMounted, reactive, ref } from "vue";
import * as XLSX from 'xlsx';
import { useApi } from "../../../helpers/axios.js";
import { useMeStore } from "../../../stores/me";

const me = useMeStore();
const message = useMessage();
const loadingBar = useLoadingBar();

const modalAssign = ref(false);
const assignTo = ref(null);
function getRowClassName(row) {
    if (row.bayar >= row.angsuran) {
        return 'too-old';
    }
    return '';
}
const dataUser = ref([]);
const dataList = ref([]);
const isLoading = ref(false);
const checkedRowKeys = ref([]);
const boxSearch = ref("");
const bodyModalDetail = ref();
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
        checkedRowKeys.value = bodyModalDetail.value.details
            .map(item => item.no_surat);

    }
};
const filterValue = reactive({
    NBOT: [],
    KECAMATAN: [],
    SURVEYOR: [],
    "SURVEYOR STATUS": [],
});

function onFilterChange(newFilter) {
    Object.keys(newFilter).forEach((key) => {
        filterValue[key] = newFilter[key] || [];
    });
}


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

const columnBebanTagih = reactive([
    {
        type: "selection",
        sorter: "default",
        disabled(row) {
            return row.bayar >= row.total_angsuran
        }
    },
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
    }, {
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
        title: "DESA",
        key: "desa",
        sorter: "default",
        filter: true,
        filterMultiple: true,
        filterOptions: [],
        width: 150,
    },
    {
        title: "KEC",
        key: "kec",
        sorter: "default",
        filter: true,
        filterMultiple: true,
        filterOptions: [],
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
        filter: true,
        filterMultiple: true,
        filterOptions: [],
        width: 150,
    },
    {
        title: "ANGSURAN KE",
        key: "angsuran_ke",
        sorter: "default",
        filter: true,
        filterMultiple: true,
        filterOptions: [],
        width: 150,
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
        width: 150,
    },
    {
        title: "JANJI BAYAR ",
        key: "tgl_jb",
        sorter: "default",
        width: 150,
    }, {
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

const renderLabel = (option) => {
    return h(
        "div",
        {
            style: {
                display: "flex",
                alignItems: "center"
            }
        },
        [
            h(NAvatar, {
                round: true,
                size: "small"
            }, {
                default: () => option.nama.charAt(0)
            }),
            h(
                "div",
                {
                    style: {
                        marginLeft: "12px",
                        padding: "4px 0"
                    }
                },
                [
                    h("div", null, [option.nama]),
                    h(
                        NText,
                        { depth: 3, tag: "div" },
                        {
                            default: () => option.username
                        }
                    )
                ]
            )
        ]
    );
};
const renderSingleSelectTag = ({ option }) => {
    return h(
        "div",
        {
            style: {
                display: "flex",
                alignItems: "center"
            }
        },
        [
            h(NAvatar, {
                round: true,
                size: 24,
                style: {
                    marginRight: "12px"
                }
            }, {
                default: () => option.nama.charAt(0)
            }),
            option.nama
        ]
    );
};
const getData = async () => {
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "GET",
        api: "users",
        token: userToken,
    });
    if (!response.ok) {
        console.error(response.error);
    } else {
        loadingBar.finish();
        dataUser.value = response.data.response;
    }
};
const today = new Date();
const dataLoading = ref(false);
const dataResponse = ref();
const handleChangePetugas = async (e) => {
    dataLoading.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "GET",
        api: `cl_deploy_by_pic/${e}`,
        token: userToken,
    });

    if (!response.ok) {
        dataLoading.value = false;
        console.error(response.error);
    } else {
        dataLoading.value = false;
        dataResponse.value = response.data;
        dataList.value = response.data.list;

        // Filter untuk auto-check berdasarkan tgl_jatuh_tempo
        const today = new Date();

        // Set filter options
        const uniqueValues = (key) => {
            return [...new Set(dataList.value.map(item => item[key]).filter(Boolean))];
        };

        const setFilterOptions = (key, sortNumeric = false) => {
            const col = columnBebanTagih.find((c) => c.key === key);
            if (col) {
                let values = uniqueValues(key);
                if (sortNumeric) {
                    values = values.sort((a, b) => Number(a) - Number(b));
                }
                col.filterOptions = values.map((val) => ({
                    label: val,
                    value: val,
                }));
            }
        };

        setFilterOptions("nbot");
        setFilterOptions("kec");
        setFilterOptions("desa");
        setFilterOptions("cycle_awal");
        setFilterOptions("angsuran_ke", true);
    }
};

const emit = defineEmits();
const props = defineProps({
    data: Object
})
const assignTagihan = async (e) => {
    if (isLoading.value) return;
    const set = new Set(checkedRowKeys.value);
    const bodyPost = {
        user_id: props.data.petugas,
        IsDraf: e,
        LkpId: props.data.id,
        list_lkp: dataList.value.filter(item => set.has(item.no_surat)),
    };
    isLoading.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "POST",
        api: "cl_lkp_edit",
        data: bodyPost,
        token: userToken,
    });
    if (!response.ok) {
        console.error(response);
    } else {
        isLoading.value = false;
        message.success("Berhasil mengirimkan tagihan");
        emit('saved', true);
        modalAssign.value = false;
        assignTo.value = null;
        checkedRowKeys.value = [];
    }
};

function handleCheck(rowKeys) {
    checkedRowKeys.value = rowKeys;
}

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

const exportToExcel = (data) => {
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'DAFTAR TAGIHAN.xlsx')
}

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
onMounted(async () => {
    loadingBar.finish();
    await getData();
    await getDetail(props.data?.no_lkp);
    await handleChangePetugas(props.data.id_petugas);

});
</script>
