<template>
    <n-card  title="Daftar Deploy" :segmented="true" size="small">
        <template #header-extra>
            <n-space>
                <n-input clearable v-model:value="boxSearch" placeholder="cari">
                    <template #suffix>
                        <v-icon name="bi-search"></v-icon>
                    </template>
                </n-input>
                <n-button type="success" secondary @click="exportToExcel(filteredDataList)">
                    <template #icon>
                        <v-icon name="bi-download"></v-icon>
                    </template>
                    Export Excel
                </n-button>
                <n-button type="primary" secondary link @click="addDeploy">
                    <template #icon>
                        <v-icon name="bi-plus-lg"></v-icon>
                    </template>
                    Buat Depoly
                </n-button>


                <n-button quaternary circle @click="getList">
                    <template #icon>
                        <v-icon name="bi-arrow-clockwise"></v-icon>
                    </template>
                </n-button>
            </n-space>
        </template>
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
                <div>
                    <n-data-table :columns="columnBebanTagih" :data="filteredDataList" :filter-value="filterValue"
                        @update:filters="onFilterChange" :checked-row-keys="checkedRowKeys" :row-key="(row) => row"
                        @update:checked-row-keys="handleCheck" :loading="isLoading" size="small"
                        :pagination="{ pageSize: 10 }" :scroll-x="1900" />
                </div>
            </n-space>
        </div>
    </n-card>
    <n-modal v-model:show="modalAdd">
        <div class="w-5/6">
            <ListDeploy @cancel="handleCancel" />
        </div>
    </n-modal>
</template>

<script setup>
import { NAvatar, NTag, NText } from 'naive-ui';
import { ref, reactive, computed, onMounted } from "vue";
import { useLoadingBar, useMessage } from "naive-ui";
import { useApi } from "../../../helpers/axios.js";
import { useMeStore } from "../../../stores/me";
import _ from "lodash";
import ListDeploy from './listDeploy.vue';
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver';

const me = useMeStore();
const message = useMessage();
const loadingBar = useLoadingBar();
const modalAdd = ref(false);
const addDeploy = () => {
    modalAdd.value = true;
}
const modalAssign = ref(false);
const assignTo = ref(null);

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
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'DAFTAR DEPLOY.xlsx')
}

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
    {
        title: "NO SURAT",
        key: "no_surat",
        width: 150,
        sorter: "default",
    },
    {
        title: "PIC",
        key: "nama_pic",
        filter: true,
        filterMultiple: true,
        filterOptions: [],
        width: 150,
        sorter: "default",
    }, {
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
        render(row){
            return h("div",row.tgl_jatuh_tempo)
        }
    },
    {
        title: "CYCLE",
        key: "cycle_awal",
        sorter: "default",
        width: 150,
        filter: true,
        filterMultiple: true,
        filterOptions: [],
    },
    {
        title: "ANGSURAN KE",
        key: "angusran_ke",
        sorter: "default",
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
        api: `cl_deploy_list`,
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
        setFilterOptions("nama_pic");
        setFilterOptions("cycle_awal");
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
    getList();
});
</script>
