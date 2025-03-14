<template>
    <n-card title="Master Biaya Admin">
        <template #header-extra>
            <n-button type="primary" v-show="displayList" @click="() => { displayForm = true; displayList = false; }">
                Tambah Skema
            </n-button>
            <n-button type="warning" secondary v-show="displayForm" class="p-2 px-3"
                @click="() => { displayForm = false; displayList = true; }">
                <n-icon>
                    <close-icon />
                </n-icon>
            </n-button>
        </template>
        <n-space vertical v-show="displayList">
            <n-space vertical :size="12" class="pt-4">
                <h2>Angsuran bulanan</h2>
                <n-data-table size="small" triped :columns="mainColumns" :data="dataBulanan" :pagination="pagination" />
                <h2>Angsuran Musiman</h2>
                <n-data-table size="small" triped :columns="mainColumnsMusiman" :data="dataMusiman"
                    :pagination="pagination" />
            </n-space>
        </n-space>
        <n-space vertical v-show="displayForm">
            <n-space>
                <n-form-item path="range" label="Range Dari">
                    <n-input-number v-model:value="dynamicForm.start_value" size="small" min="0"
                        :max="dynamicForm.end_value" :show-button="false">
                        <template #suffix>
                            Juta
                        </template>
                    </n-input-number>
                </n-form-item>
                <n-form-item path="range" label="Range Sampai">
                    <n-input-number v-model:value="dynamicForm.end_value" size="small"
                        :min="dynamicForm.start_value + 0.1" max="999" :show-button="false">
                        <template #suffix>
                            Juta
                        </template>
                    </n-input-number>
                </n-form-item>
                <n-form-item path="tipe_pinjaman" label="Tipe Pinjaman">
                    <n-radio-group v-model:value="dynamicForm.kategory">
                        <n-radio value="bulanan" checked :key="tipe_pinjaman">
                            Bulanan
                        </n-radio>
                        <n-radio value="musiman" :key="tipe_pinjaman">
                            Musiman
                        </n-radio>
                    </n-radio-group>

                </n-form-item>
            </n-space>
            <n-data-table :columns="dynamicForm.kategory == 'bulanan' ? columnsBulanan : columnsMusiman" :data="data" />
            <n-space>
                <n-button type="primary" @click="handleSave">
                    Simpan Skema
                </n-button>
                <n-button type="warning" secondary v-show="displayForm" class="p-2 px-3"
                    @click="() => { displayForm = false; displayList = true; }">
                    <n-icon>
                        <close-icon />
                    </n-icon>
                    Batal
                </n-button>
            </n-space>
        </n-space>
    </n-card>
</template>

<script setup>
import {  onMounted, ref,h ,reactive} from "vue";
import { NInputNumber, NInput, NButton, useLoadingBar } from "naive-ui";
import { useApi } from "../../../helpers/axios";
import router from '../../../router';
import { useMessage } from "naive-ui";
import _ from "lodash";
import {
    CloseOutlined as CloseIcon
} from "@vicons/material";
const message = useMessage();
const rangeNum = ref([1, 2]);
const loading = ref(false);
const formatLocal = (e) => {
    const toNum = parseInt(e);
    return toNum.toLocaleString("en-US");
};
const createData = () => [
    {
        key: "eff_rate",
        name: "Eff Rate",
        tenor6: 0,
        tenor12: 0,
        tenor18: 0,
        tenor24: 0
    },
    {
        key: "cadangan_macet",
        name: "CADANGAN MACET",
        tenor6: 0,
        tenor12: 0,
        tenor18: 0,
        tenor24: 0
    },
    {
        key: "increase_umr",
        name: "INCREASE UMR",
        tenor6: 0,
        tenor12: 0,
        tenor18: 0,
        tenor24: 0
    },
    {
        key: "ict_mce",
        name: "ICT MCE",
        tenor6: 0,
        tenor12: 0,
        tenor18: 0,
        tenor24: 0
    },
    {
        key: "ict_kapos",
        name: "ICT KAPOS",
        tenor6: 0,
        tenor12: 0,
        tenor18: 0,
        tenor24: 0
    },
    {
        key: "ms_107",
        name: "MS 107",
        tenor6: 0,
        tenor12: 0,
        tenor18: 0,
        tenor24: 0
    },
    {
        key: "ms_108",
        name: "MS 108",
        tenor6: 0,
        tenor12: 0,
        tenor18: 0,
        tenor24: 0
    },
    {
        key: "biaya_promosi",
        name: "Biaya Promosi",
        tenor6: 0,
        tenor12: 0,
        tenor18: 0,
        tenor24: 0
    },
    {
        key: "admin_murni",
        name: "Admin Murni",
        tenor6: 0,
        tenor12: 0,
        tenor18: 0,
        tenor24: 0
    },
];

const createColumnsBulanan = () => [
    {
        title: "Name",
        key: "name",
        render(row, index) {
            return h(NInput, {
                disabled: true,
                value: row.name,
                readonly: true,
                parse: parse,
                format: format,
                onUpdateValue(v) {
                    data.value[index].name = v;
                }
            });
        }
    },
    {
        title: "6 bulan",
        key: "tenor",
        render(row, index) {
            return h(NInputNumber, {
                showButton: false,
                value: row.tenor6,
                parse: parse,
                format: format,
                onUpdateValue(v) {
                    data.value[index].tenor6 = v;
                }
            });
        }
    },
    {
        title: "12 bulan",
        key: "tenor",
        render(row, index) {
            return h(NInputNumber, {
                showButton: false,
                value: row.tenor12,
                parse: parse,
                format: format,
                onUpdateValue(v) {
                    data.value[index].tenor12 = v;
                }
            });
        }
    },
    {
        title: "18 bulan",
        key: "tenor",
        render(row, index) {
            return h(NInputNumber, {
                showButton: false,
                value: row.tenor18,
                parse: parse,
                format: format,
                onUpdateValue(v) {
                    data.value[index].tenor18 = v;
                }
            });
        }
    },
    {
        title: "24 bulan",
        key: "tenor",
        render(row, index) {
            return h(NInputNumber, {
                showButton: false,
                parse: parse,
                format: format,
                value: row.tenor24,
                onUpdateValue(v) {
                    data.value[index].tenor24 = v;
                }
            });
        }
    },

];

const createColumnsMusiman = () => [
    {
        title: "Name",
        key: "name",
        render(row, index) {
            return h(NInput, {
                disabled: true,
                value: row.name,
                readonly: true,
                parse: parse,
                format: format,
                onUpdateValue(v) {
                    data.value[index].name = v;
                }
            });
        }
    },
    {
        title: "1 x 3 Bulan",
        key: "tenor",
        render(row, index) {
            return h(NInputNumber, {
                showButton: false,
                value: row.tenor6,
                parse: parse,
                format: format,
                onUpdateValue(v) {
                    data.value[index].tenor6 = v;
                }
            });
        }
    },
    {
        title: "1 x 6 Bulan",
        key: "tenor",
        render(row, index) {
            return h(NInputNumber, {
                showButton: false,
                value: row.tenor12,
                parse: parse,
                format: format,
                onUpdateValue(v) {
                    data.value[index].tenor12 = v;
                }
            });
        }
    },
    {
        title: "2 x 12 Bulan",
        key: "tenor",
        render(row, index) {
            return h(NInputNumber, {
                showButton: false,
                value: row.tenor18,
                parse: parse,
                format: format,
                onUpdateValue(v) {
                    data.value[index].tenor18 = v;
                }
            });
        }
    },
    {
        title: "3 x 18 bulan",
        key: "tenor",
        render(row, index) {
            return h(NInputNumber, {
                showButton: false,
                parse: parse,
                format: format,
                value: row.tenor24,
                onUpdateValue(v) {
                    data.value[index].tenor24 = v;
                }
            });
        }
    },

];


const createMainColumns = () => [
    // {
    //     title: "Tipe",
    //     key: "plafond",
    //     render(row, index) {
    //         //console.log(row);
    //         return row.id;

    //     }
    // },
    {
        title: "Plafon",
        key: "plafond",
        render(row) {
            // return `${row.range_start} -${row.range_end}`;
            return `${formatLocal(row.range_start * 1000000)} - ${formatLocal(row.range_end * 1000000)}`;
        }
    },
    {
        title: "6 Bulan",
        key: "6",
        render(row) {
            //console.log(row.tenor_6);
            return formatLocal(row.tenor_6.total);
        }
    },
    {
        title: "12 Bulan",
        key: "12",
        render(row) {
            //console.log(row.tenor_12);
            return formatLocal(row.tenor_12.total);
        }
    },
    {
        title: "18 Bulan",
        key: "18",
        render(row) {
            //console.log(row.tenor_18);
            return formatLocal(row.tenor_18.total);
        }
    },
    {
        title: "24 Bulan",
        key: "24",
        render(row) {
            //console.log(row.tenor_24);
            return formatLocal(row.tenor_24.total);
        }
    },
    {
        title: "Action",
        key: "18",
        render() {
            return h(
                NButton,
                {
                    type: "primary",
                    size: "tiny",
                    onClick: () => {
                        
                    },
                },
                {
                    default: () => 'edit'
                }
            );
        }
    },

];
const createMainColumnsMusiman = () => [
    // {
    //     title: "Tipe",
    //     key: "plafond",
    //     render(row, index) {
    //         //console.log(row);
    //         return row.tipe;

    //     }
    // }, 
    {
        title: "Plafon",
        key: "plafond",
        render(row, ) {
            // return `${row.range_start} -${row.range_end}`;
            return `${formatLocal(row.range_start * 1000000)} - ${formatLocal(row.range_end * 1000000)}`;
        }
    },
    {
        title: "1 x 3 Bulan",
        key: "6",
        render(row ) {
            //console.log(row.tenor_6);
            return formatLocal(row.tenor_6.total);
        }
    },
    {
        title: "1 x 6 Bulan",
        key: "12",
        render(row) {
            //console.log(row.tenor_12);
            return formatLocal(row.tenor_12.total);
        }
    },
    {
        title: "2 x 12 Bulan",
        key: "18",
        render(row) {
            //console.log(row.tenor_18);
            return formatLocal(row.tenor_18.total);
        }
    },
    {
        title: "3 x 18 Bulan",
        key: "24",
        render(row) {
            //console.log(row.tenor_24);
            return formatLocal(row.tenor_24.total);
        }
    },
    {
        title: "Action",
        key: "18",
        render() {
            return h(
                NButton,
                {
                    type: "primary",
                    size: "tiny",
                    onClick: () => {
                        
                    },
                },
                {
                    default: () => 'edit'
                }
            );
        }
    },

];




const data = ref(createData());
const columnsBulanan = ref(createColumnsBulanan());
const columnsMusiman = ref(createColumnsMusiman());
const mainColumns = ref(createMainColumns());
const mainColumnsMusiman = ref(createMainColumnsMusiman());
const tipe_pinjaman = ref("bulanan");
const pagination = {
    pageSize: 10
}
const displayList = ref(true);
const displayForm = ref(false);
const dynamicForm = reactive({
    kategory: tipe_pinjaman.value,
    start_value: rangeNum.value[0],
    end_value: rangeNum.value[1],
    struktur: data.value
});

const dataTable = ref([]);
const dataBulanan = ref([]);
const dataMusiman = ref([]);
const userToken = localStorage.getItem("token");
const getData = async () => {
    const response = await useApi({
        method: 'GET',
        api: 'admin_fee',
        token: userToken
    });
    if (!response.ok) {
      console.log(reponse.error);
    } else {
        loadingBar.finish();
        dataTable.value = response.data;
        let filterDataBulanan = _.filter(dataTable.value, ['tipe', 'bulanan']);
        let filterDataMusiman = _.filter(dataTable.value, ['tipe', 'musiman']);
        dataBulanan.value = _.sortBy(filterDataBulanan, 'range_start');
        dataMusiman.value = _.sortBy(filterDataMusiman, 'range_start');
    }
}

const loadingBar = useLoadingBar();
const handleSave = async (e) => {
    loading.value = true;
    displayForm.value = false;
    displayList.value = true;
    const response = await useApi({
        method: 'POST',
        api: `admin_fee`,
        data: dynamicForm,
        token: userToken
    });
    if (!response.ok) {
        message.error("data gagal disimpan");
        loading.value = false;
    } else {
      
        message.success("data berhasil disimpan");
        loading.value = false;
        getData();
    }
}
onMounted(getData);

const parse = (input) => {
    const nums = input.replace(/,/g, "").trim();
    if (/^\d+(\.(\d+)?)?$/.test(nums))
        return Number(nums);
    return nums === "" ? null : Number.NaN;
}
const format = (value) => {
    if (value === null)
        return "";
    return value.toLocaleString("en-US");
}
</script>