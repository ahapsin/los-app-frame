<template>
    <n-card :class="`shadow-lg`" title="Deploy Tagihan" :segmented="true" size="small">
        <div>
            <n-alert v-if="hasActiveFilters" type="warning" :show-icon="false" class="mb-4 filter-status"
                title="Filter Aktif">
                <div class="filter-status-list flex flex-col gap-y-2">
                    <div v-for="(values, key) in activeFilters" :key="key" class="filter-group">
                        <span class="filter-key">{{ key }}:</span>
                        <n-tag v-for="value in values" :key="value" closable round size="small"
                            :on-close="() => removeFilter(key, value)" class="filter-tag">
                            {{ value }}
                        </n-tag>
                    </div>
                </div>
            </n-alert>
            <n-space vertical :size="12">
                <n-form-item label="petugas">
                    <n-select v-model:value="assignTo" placeholder="pilih petugas" :options="me.me.cabang_nama === 'Head Office'
                        ? dataUser
                        : _.filter(dataUser, { cabang_nama: me.me.cabang_nama })" value-field="username"
                        label-field="nama" filterable :render-tag="renderSingleSelectTag" :render-label="renderLabel" />
                </n-form-item>
                <n-card :class="`shadow-lg`" embedded title="Daftar Tagihan" size="small" :segmented="true">
                    <template #header-extra>
                        <div class="flex gap-2 pb-4">
                            <n-input clearable v-model:value="boxSearch" placeholder="cari" class="max-w-sm"
                                v-if="!filterAddition">
                                <template #suffix>
                                    <v-icon name="bi-search"></v-icon>
                                </template>
                            </n-input>
                            <n-button circle secondary @click="filterAddition = !filterAddition"><v-icon
                                    name="bi-filter"></v-icon></n-button>
                            <n-button type="success" secondary @click="exportToExcel(filteredDataList)"
                                :disabled="isLoading">
                                <template #icon>
                                    <v-icon name="bi-download"></v-icon>
                                </template>
                                Export Excel
                            </n-button>
                        </div>
                    </template>
                    <div v-if="filterAddition" class="flex gap-2 pb-2">
                        <n-input v-model:value="additionalFilter.cabang" placeholder="Cabang" clearable />
                        <n-input v-model:value="additionalFilter.noKontrak" placeholder="No Kontrak" clearable />
                        <n-input v-model:value="additionalFilter.cycleAwal" placeholder="Cycle Awal" clearable />
                        <n-input v-model:value="additionalFilter.nBot" placeholder="NBOT" clearable />
                        <n-input v-model:value="additionalFilter.kecamatan" placeholder="Kecamatan" clearable />
                        <n-input v-model:value="additionalFilter.desa" placeholder="Desa" clearable />
                        <n-input v-model:value="additionalFilter.mcf" placeholder="MCF" clearable />

                        <n-button secondary @click="resetAdditionalFilter" type="error">Reset</n-button>
                    </div>
                    <n-alert type="info" v-if="checkedRowKeys.length >0" class="mb-2" >{{ checkedRowKeys.length }} data dipilih</n-alert>
                    <n-data-table :columns="columnBebanTagih" :data="filteredDataList" :filter-value="filterValue"
                        @update:filters="onFilterChange" :checked-row-keys="checkedRowKeys" :row-key="(row) => row"
                        @update:checked-row-keys="handleCheck" :loading="isLoading" size="small"
                        :pagination="pagination" />
                </n-card :class="`shadow-lg`">
            </n-space>
        </div>
        <template #footer>
            <n-space vertical>
                <n-alert type="info" v-if="assignTo === null">Pilih petugas</n-alert>
                <n-alert type="info" v-else-if="checkedRowKeys.length === 0">Pilih data tagihan</n-alert>
                <n-space v-else>
                    <n-button type="primary" @click="assignTagihan" :disabled="checkedRowKeys.length === 0">
                        <v-icon name="bi-plus-lg" />
                        Simpan
                    </n-button>
                    <n-button type="secondary" @click="$emit('cancel', true)">Batal</n-button>
                </n-space>
            </n-space>
        </template>
    </n-card :class="`shadow-lg`">
</template>

<script setup>
import { NAvatar, NTag, NText } from 'naive-ui';
import { ref, reactive, computed, onMounted } from "vue";
import { useLoadingBar, useMessage } from "naive-ui";
import { useApi } from "../../../helpers/axios.js";
import { useMeStore } from "../../../stores/me";
import _ from "lodash";
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver';

const me = useMeStore();
const message = useMessage();
const loadingBar = useLoadingBar();
const filterAddition = ref(false);
const additionalFilter = reactive({
    cabang: "",
    noKontrak: "",
    cycleAwal: "",
    desa: "",
    kecamatan: "",
    mcf: ""
});
const modalAssign = ref(false);
const assignTo = ref(null);
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
const dataUser = ref([]);
const dataList = ref([]);
const isLoading = ref(false);
const checkedRowKeys = ref([]);
const boxSearch = ref("");
const exportToExcel = (data) => {
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'DAFTAR TAGIHAN.xlsx')
}

const rowKey = (row) => row["NO KONTRAK"];

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

const columnBebanTagih = reactive([
    { type: "selection" },
    {
        title: "CABANG",
        key: "NAMA CABANG",
        width: 150,
        sorter: "default",
    },
    {
        title: "NO KONTRAK",
        key: "NO KONTRAK",
        width: 150,
        sorter: "default",
    },
    {
        title: "NAMA KOMSUMEN",
        key: "NAMA PELANGGAN",
        width: 200,
        sorter: "default",
    },
    {
        title: "CYCLE AWAL",
        key: "CYCLE AWAL",
        sorter: "default",
        width: 150,
        filter: true,
        filterMultiple: true,
        filterOptions: [],
    },
    {
        title: "NBOT",
        key: "NBOT",
        sorter: "default",
        width: 110,
    }, {
        title: "KEC",
        key: "KECAMATAN",
        sorter: "default",
        width: 150,
    },
    {
        title: "DESA",
        key: "KELURAHAN",
        sorter: "default",
        width: 150,
    },

    {
        title: "MCF",
        key: "SURVEYOR",
        sorter: "default",
        width: 150,
    }, {
        title: "ANGSURAN KE",
        key: "ANGS KE",
        sorter: "default",
        width: 150,
    },
    {
        title: "ANGSURAN ",
        key: "ANGSURAN",
        sorter: "default",
        width: 150,
        render(row) {
            return h("div", row.ANGSURAN?.toLocaleString())
        }
    }
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

const getList = async () => {
    isLoading.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "GET",
        api: "tagihan",
        token: userToken,
    });

    if (!response.ok) {
        isLoading.value = false;
        console.error(response.error);
    } else {
        isLoading.value = false;
        loadingBar.finish();
        dataList.value = response.data;

        const uniqueValues = (key) => {
            return [...new Set(response.data.map((item) => item[key]).filter(Boolean))];
        };

        const setFilterOptions = (key) => {
            const col = columnBebanTagih.find((c) => c.key === key);
            if (col) {
                col.filterOptions = uniqueValues(key).map((val) => ({
                    label: val,
                    value: val,
                }));
            }
        };
        setFilterOptions("NAMA CABANG");
        setFilterOptions("CYCLE AWAL");
    }
};

const assignTagihan = async () => {
    const bodyPost = {
        user_id: assignTo.value,
        list_tagihan: checkedRowKeys.value,
    };
    isLoading.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "POST",
        api: "tagihan",
        data: bodyPost,
        token: userToken,
    });
    if (!response.ok) {
        console.error(response);
    } else {
        isLoading.value = false;
        message.success("Berhasil mengirimkan tagihan");
        modalAssign.value = false;
        assignTo.value = null;
        checkedRowKeys.value = [];
        getList();
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
    if (additionalFilter.cabang) {
        filteredData = filteredData.filter(row =>
            String(row["NAMA CABANG"] || "")
                .toLowerCase()
                .includes(additionalFilter.cabang.toLowerCase())
        );
    }

    if (additionalFilter.noKontrak) {
        filteredData = filteredData.filter(row =>
            String(row["NO KONTRAK"] || "")
                .toLowerCase()
                .includes(additionalFilter.noKontrak.toLowerCase())
        );
    }

    if (additionalFilter.cycleAwal) {
        filteredData = filteredData.filter(row =>
            String(row["CYCLE AWAL"] || "")
                .toLowerCase()
                .includes(additionalFilter.cycleAwal.toLowerCase())
        );
    }

    if (additionalFilter.nBot) {
        filteredData = filteredData.filter(row =>
            String(row["NBOT"] || "")
                .toLowerCase()
                .includes(additionalFilter.nBot.toLowerCase())
        );
    }

    if (additionalFilter.desa) {
        filteredData = filteredData.filter(row =>
            String(row["KELURAHAN"] || "")
                .toLowerCase()
                .includes(additionalFilter.desa.toLowerCase())
        );
    }

    if (additionalFilter.kecamatan) {
        filteredData = filteredData.filter(row =>
            String(row["KECAMATAN"] || "")
                .toLowerCase()
                .includes(additionalFilter.kecamatan.toLowerCase())
        );
    }

    if (additionalFilter.mcf) {
        filteredData = filteredData.filter(row =>
            String(row["SURVEYOR"] || "")
                .toLowerCase()
                .includes(additionalFilter.mcf.toLowerCase())
        );
    }
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

watch(filteredDataList, (newData) => {
    const uniqueValues = (key) => {
        return [...new Set(newData.map(item => item[key]).filter(Boolean))];
    };

    const setFilterOptions = (key) => {
        const col = columnBebanTagih.find(c => c.key === key);
        if (col) {
            col.filterOptions = uniqueValues(key).map(val => ({
                label: val,
                value: val
            }));
        }
    };

    setFilterOptions("NAMA CABANG");
    setFilterOptions("CYCLE AWAL");
});
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
const removeFilter = (key, valueToRemove) => {
    const values = filterValue[key];
    if (values) {
        const index = values.indexOf(valueToRemove);
        if (index > -1) {
            values.splice(index, 1);
        }
    }
};

const applyAdditionalFilter = () => {
    pagination.page = 1; // reset ke page 1
};

const resetAdditionalFilter = () => {
    additionalFilter.cabang = "";
    additionalFilter.noKontrak = "";
    additionalFilter.cycleAwal = "";
    additionalFilter.desa = "";
    additionalFilter.kecamatan = "";
    additionalFilter.mcf = "";
};
onMounted(() => {
    getData();
    getList();
});
</script>
