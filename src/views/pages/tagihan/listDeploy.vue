<template>
    <n-card  title="Deploy Tagihan" :segmented="true" size="small">
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
                    <n-select v-model:value="assignTo" placeholder="pilih petugas"
                        :options="_.filter(dataUser, { cabang_nama: me.me.cabang_nama })" value-field="username"
                        label-field="nama" filterable :render-tag="renderSingleSelectTag" :render-label="renderLabel" />
                </n-form-item>
                <n-data-table :columns="columnBebanTagih" :data="filteredDataList" :filter-value="filterValue"
                    @update:filters="onFilterChange" :checked-row-keys="checkedRowKeys" :row-key="(row) => row"
                    @update:checked-row-keys="handleCheck" :loading="isLoading" size="small"
                    :pagination="{ pageSize: 10 }" />
                <n-space vertical>

                    <n-alert type="info" v-if="checkedRowKeys.length === 0">Pilih data tagihan</n-alert>
                    <n-alert type="info" v-else-if="assignTo === null">Pilih petugas</n-alert>
                    <n-space v-else>
                        <n-button type="primary" @click="assignTagihan" :disabled="checkedRowKeys.length === 0">
                            <v-icon name="bi-plus-lg" />
                            {{ checkedRowKeys.length }}
                        </n-button>
                        <n-button type="secondary" @click="$emit('cancel', true)">Batal</n-button>
                    </n-space>
                </n-space>
            </n-space>
        </div>
    </n-card>
</template>

<script setup>
import { NAvatar, NTag, NText } from 'naive-ui';
import { ref, reactive, computed, onMounted } from "vue";
import { useLoadingBar, useMessage } from "naive-ui";
import { useApi } from "../../../helpers/axios.js";
import { useMeStore } from "../../../stores/me";
import _ from "lodash";

const me = useMeStore();
const message = useMessage();
const loadingBar = useLoadingBar();

const modalAssign = ref(false);
const assignTo = ref(null);

const dataUser = ref([]);
const dataList = ref([]);
const isLoading = ref(false);
const checkedRowKeys = ref([]);
const boxSearch = ref("");

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
        filter: true,
        filterMultiple: true,
        filterOptions: [],
        width: 110,
    },
    {
        title: "DESA",
        key: "KELURAHAN",
        sorter: "default",
        width: 150,
        filter: true,
        filterMultiple: true,
        filterOptions: [],
    },
    {
        title: "KEC",
        key: "KECAMATAN",
        sorter: "default",
        filter: true,
        filterMultiple: true,
        filterOptions: [],
        width: 150,
    },
    {
        title: "MCF",
        key: "SURVEYOR",
        sorter: "default",
        filter: true,
        filterMultiple: true,
        filterOptions: [],
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
        setFilterOptions("NBOT");
        setFilterOptions("CYCLE AWAL");
        setFilterOptions("KECAMATAN");
        setFilterOptions("KELURAHAN");
        setFilterOptions("SURVEYOR");
        setFilterOptions("SURVEYOR STATUS");
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

// Tambahkan computed property untuk data yang difilter
const filteredDataList = computed(() => {
    let filteredData = dataList.value;

    // Terapkan filter untuk setiap kolom
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

// Check if there are any active filters to show
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
    getData();
    getList();
});
</script>
