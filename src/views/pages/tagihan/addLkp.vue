<template>
    <n-card title="Buat LKP Baru" :segmented="true" size="small">
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
                <n-space vertical>
                    <n-form-item label="petugas">
                        <n-select v-model:value="assignTo" placeholder="pilih petugas"
                            :options="_.filter(dataUser, { cabang_nama: me.me.cabang_nama })" value-field="username"
                            label-field="nama" filterable :render-tag="renderSingleSelectTag"
                            :render-label="renderLabel" @update:value="handleChangePetugas" />
                    </n-form-item>
                </n-space>
                <div>
                    <n-data-table :columns="columnBebanTagih" :data="filteredDataList" :filter-value="filterValue"
                        @update:filters="onFilterChange" :checked-row-keys="checkedRowKeys" :row-key="(row) => row"
                        @update:checked-row-keys="handleCheck" :loading="isLoading" size="small"
                        :pagination="{ pageSize: 10 }"  :scroll-x="1800"/>
                </div>
            </n-space>
        </div>
        <template #footer>
            <n-alert type="info" v-if="checkedRowKeys.length === 0">Pilih data tagihan</n-alert>
            <n-alert type="info" v-else-if="assignTo === null">Pilih petugas</n-alert>
            <n-space v-else>
                <n-button type="primary" @click="assignTagihan" :disabled="checkedRowKeys.length === 0">
                    <template #icon>
                        <v-icon name="bi-plus-lg" />
                    </template>
                    simpan
                </n-button>
                <n-button type="secondary" @click="$emit('cancel', true)">Batal</n-button>
            </n-space>
        </template>
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
        key: "no_kontrak",
        width: 150,
        sorter: "default",
    },
    {
        title: "NAMA KOMSUMEN",
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
        width: 150,
    },
    {
        title: "ANGSURAN KE",
        key: "angsuran_ke",
        sorter: "default",
        width: 150,
    },
    {
        title: "ANGSURAN ",
        key: "angsuran",
        sorter: "default",
        width: 150,
    },
    {
        title: "BAYAR ",
        key: "bayar",
        sorter: "default",
        width: 150,
    },
    {
        title: "HASIL KUNJUNGAN ",
        key: "hasil_kunjungan",
        sorter: "default",
        width: 150,
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

const handleChangePetugas = async () => {
    isLoading.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "GET",
        api: `cl_deploy_by_pic/${assignTo.value}`,
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
        setFilterOptions("nbot");
        setFilterOptions("kec");
        setFilterOptions("desa");
    }
};
const emit = defineEmits();
const assignTagihan = async () => {
    const bodyPost = {
        user_id: assignTo.value,
        list_lkp: checkedRowKeys.value,
    };
    isLoading.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "POST",
        api: "cl_lkp_add",
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
onMounted(() => {
    loadingBar.finish();
    getData();
});
</script>
