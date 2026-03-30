<template>
    <n-card :class="`shadow-lg`" title="Beban Tagih" :segmented="true" size="small">
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
                <n-data-table :columns="columnBebanTagih" :data="filteredDataList" :filter-value="filterValue"
                    @update:filters="onFilterChange" :checked-row-keys="checkedRowKeys" :row-key="(row) => row"
                    @update:checked-row-keys="handleCheck" :loading="isLoading" size="small"
                    :pagination="{ pageSize: 10 }" />
            </n-space>
        </div>
    </n-card>

    <n-float-button :right="40" :bottom="40" type="primary" v-if="checkedRowKeys.length > 0"
        @click="modalAssign = true">
        <n-badge :value="checkedRowKeys.length" :offset="[6, -8]">
            <v-icon name="bi-plus-lg" />
        </n-badge>
    </n-float-button>

    <n-modal v-model:show="modalAssign" :mask-closable="false">
        <n-card :class="`shadow-lg`" class="w-1/4">
            <n-space>
                <n-button class="mb-2" round type="info" secondary @click="detailSelectedModal = true">{{
                    checkedRowKeys.length
                }} data dipilih</n-button>
            </n-space>

            <n-space vertical>
                <n-form-item label="petugas">
                    <n-select v-model:value="assignTo" placeholder="pilih petugas"
                        :options="_.filter(dataUser, { cabang_nama: me.me.cabang_nama })" value-field="username"
                        label-field="nama" filterable />
                </n-form-item>
                <n-space>
                    <n-button type="primary" @click="assignTagihan" :loading="isLoading"
                        :disabled="!assignTo">OK</n-button>
                    <n-button type="secondary" @click="modalAssign = false">Batal</n-button>
                </n-space>
            </n-space>
        </n-card>
    </n-modal>

    <n-modal v-model:show="detailSelectedModal">
        <n-card :class="`shadow-lg`">
            <n-data-table :columns="selectBebanTagih" :data="checkedRowKeys" :pagination="pagination" :row-key="rowKey"
                @update:checked-row-keys="handleCheck" :max-height="350" :loading="isLoading" />
        </n-card>
    </n-modal>
</template>

<script setup>
import _ from "lodash";
import { NTag, useLoadingBar, useMessage } from 'naive-ui';
import { computed, onMounted, reactive, ref } from "vue";
import { useApi } from "../../../helpers/axios.js";
import { useMeStore } from "../../../stores/me";

const me = useMeStore();
const message = useMessage();
const loadingBar = useLoadingBar();

const modalAssign = ref(false);
const assignTo = ref(null);
const detailSelectedModal = ref(false);

const dataUser = ref([]);
const dataList = ref([]);
const isLoading = ref(false);
const checkedRowKeys = ref([]);
const boxSearch = ref("");
const ctrDownload = ref(true);

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
        title: "NO SURAT",
        key: "NO SURAT",
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
        title: "NAMA PIC",
        key: "PIC",
        width: 200,
        sorter: "default",
    },
    {
        title: "CYCLE AWAL",
        key: "CYCLE AWAL",
        sorter: "default",
    },
    {
        title: "NBOT",
        key: "NBOT",
        sorter: "default",
        filter: true,
        filterMultiple: true,
        filterOptions: [],
    },
    {
        title: "DESA",
        key: "KELURAHAN",
        sorter: "default",
    },
    {
        title: "KEC",
        key: "KECAMATAN",
        sorter: "default",
        filter: true,
        filterMultiple: true,
        filterOptions: [],
    },
    {
        title: "MCF",
        key: "SURVEYOR",
        sorter: "default",
        filter: true,
        filterMultiple: true,
        filterOptions: [],
    },
    {
        title: "KET",
        key: "SURVEYOR STATUS",
        sorter: "default",
        filter: true,
        filterMultiple: true,
        filterOptions: [],
    },
]);

// Fungsi untuk menangani pencarian, ini akan memfilter dataList berdasarkan boxSearch
const searchData = () => {
    if (boxSearch.value) {
        const searchTerm = boxSearch.value.toLowerCase();
        dataList.value = dataList.value.filter((row) => {
            // Ubah semua nilai di setiap baris menjadi string, lalu cek apakah mengandung searchTerm
            return Object.values(row).some((val) =>
                String(val).toLowerCase().includes(searchTerm)
            );
        });
    } else {
        // Jika boxSearch kosong, muat ulang data untuk mengembalikan data asli
        getList();
    }
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
        setFilterOptions("KECAMATAN");
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
    loadingBar.finish();
    getData();
    getList();
});
</script>
