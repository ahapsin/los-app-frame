<template>
    <n-card :class="`shadow-lg`" title="Laporan Nasabah Lunas" :segmented="true" size="small">
        <div>
            <n-space vertical :size="12" class="pt-4">
                <n-space>
                    <!-- <n-form-item label="TANGGAL AKHIR">
                        <n-date-picker v-model:formatted-value="rangeDate" format="MMyyyy" type="month" clearable />
                    </n-form-item> -->
                    <n-form-item label="POS" v-if="me.me.cabang_nama === 'Head Office'">
                        <n-select :loading="loadingBranch" filterable placeholder="Pilih POS" label-field="nama"
                            value-field="id" :default-value="defBranch" :options="dataBranch"
                            @update:value="handleUpdateBranch" />
                    </n-form-item>
                    <n-form-item>
                        <n-button @click="handleSubmit" type="primary" :loading="loadingData">
                            Cari
                        </n-button>
                    </n-form-item>
                    <n-form-item>
                        <n-button type="primary" secondary @click="exportToExcel(convertEmptyToNull(dataList))"
                            v-if="dataList.length != 0" :disabled="loadingData">Download</n-button>

                    </n-form-item>
                </n-space>
                <n-input v-model:value="stack" clearable v-if="dataList.length != 0" @blur="handleBlur"
                    placeholder="cari" />
                <div class="w-full overflow-auto max-h-screen">
                    <n-spin :show="loadingData">
                        <n-table striped bordered size="small">
                            <thead>
                                <tr>
                                    <th v-for="col in convertObjectToArray(dataList)" :key="col.key">
                                        {{ col.title }}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, index) in paginatedData" :key="index">
                                    <td v-for="col in convertObjectToArray(dataList)" :key="col.key"
                                        class="w-fit text-nowrap">
                                        {{ row[col.key] }}
                                    </td>
                                </tr>
                            </tbody>
                        </n-table>
                    </n-spin>

                </div>
                <n-pagination v-model:page="page" :page-size="pageSize" :item-count="total" v-if="dataList.length != 0"
                    :page-sizes="[10, 20, 50, 100]" />
            </n-space>
        </div>
    </n-card>
</template>
<script setup>
import moment from "moment";
import { useLoadingBar, useMessage } from "naive-ui";
import { computed, onMounted, ref } from "vue";
import * as XLSX from "xlsx";
import { useApi } from "../../../helpers/axios.js";
import { useSearch } from "../../../helpers/searchObject";
import { useMeStore } from "../../../stores/me";

const me = useMeStore();
const message = useMessage();
const dataBranch = ref([]);
const selectBranch = ref();
const page = ref(1)
const pageSize = ref(10)
const percentage = ref(0);

const selectedBranch = ref();
const handleUpdateBranch = (value, option) => {
    selectedBranch.value = option;
}


function convertEmptyToNull(data) {
    return data.map(item => {
        const newItem = {};
        for (const key in item) {
            // if value is an empty string, set to null
            newItem[key] = item[key] === "" ? null : item[key];
        }
        return newItem;
    });
}
const periodeTarikan = computed(() => {
    const range = moment(rangeDate.value, 'MMYYYY').format('YYYYMM');
    const rangeMonth = moment(rangeDate.value, 'MMYYYY').format('MM');
    const current = moment().format('MM');
    if (rangeMonth === current) {
        return moment().format('DD-MM-YYYY');
    } else {
        return moment(range).endOf('month').format('DD-MM-YYYY')
    }
}
);
const userToken = localStorage.getItem("token");
const loadingBranch = ref(false);
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

        if (me.me?.cabang_nama != "Head Office") {
            selectBranch.value = me.me.cabang_id;
        } else {

            dataBranch.value = response.data.response;

        }
    }
}
const rangeDate = ref();
let messageReactive = null;
const loadingBar = useLoadingBar();
const isLoading = ref(false);
const handleSubmit = async () => {
    getList();
}
const dataListBan = ref([]);
const loadingData = ref(false);
const timer = ref(60);
const ctrDownload = ref(true);
const callSp = async (e, uri) => {

    loadingData.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "POST",
        api: uri,
        data: e,
        token: userToken,
    });
    if (!response.ok) {
        messageReactive.destroy();
        var interval;
        interval = setInterval(() => {
            if (timer.value > 0) {
                timer.value--
            } else {
                clearInterval(interval);
                timer.value = 60;
                handleSubmit();
            }
        }, 1000);
        messageReactive = message.loading(() => (`data listban sedang sibuk mencoba ulang dalam ${timer.value} s`), { duration: 60000 });
    } else {
        percentage.value += 20;
    }

}

const convertObjectToArray = (obj) => {
    if (!Array.isArray(obj) || obj.length === 0) {
        return [];
    }
    const keys = Object.keys(obj[0]);
    return keys.map(key => ({ title: key, key: key, width: 120 }));
}

const exportToExcel = (data) => {
    // Validasi format tanggal MM/DD/YYYY dan eksistensinya
    const isValidDate = (str) => {
        const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const match = str.match(regex);
        if (!match) return false;

        const month = parseInt(match[1], 10);
        const day = parseInt(match[2], 10);
        const year = parseInt(match[3], 10);
        const date = new Date(Date.UTC(year, month - 1, day));

        return (
            date.getUTCFullYear() === year &&
            date.getUTCMonth() === month - 1 &&
            date.getUTCDate() === day
        );
    };

    // Deteksi kolom yang semua non-kosong isinya tanggal valid
    const dateCandidateCounts = {};
    const nonNullCounts = {};

    data.forEach(row => {
        Object.entries(row).forEach(([key, value]) => {
            const isEmpty = value === null || value === undefined || value === '';
            if (!isEmpty) {
                nonNullCounts[key] = (nonNullCounts[key] || 0) + 1;
                if ((typeof value === 'string' && isValidDate(value)) || value instanceof Date) {
                    dateCandidateCounts[key] = (dateCandidateCounts[key] || 0) + 1;
                }
            }
        });
    });

    const potentialDateColumns = Object.keys(dateCandidateCounts).filter(key => {
        return dateCandidateCounts[key] === nonNullCounts[key];
    });

    // Konversi string tanggal ke objek Date
    const formattedData = data.map(row => {
        const newRow = { ...row };
        potentialDateColumns.forEach(col => {
            const val = newRow[col];
            if (typeof val === 'string' && isValidDate(val)) {
                const [monthStr, dayStr, yearStr] = val.split('/');
                const month = parseInt(monthStr, 10);
                const day = parseInt(dayStr, 10);
                const year = parseInt(yearStr, 10);
                newRow[col] = new Date(Date.UTC(year, month - 1, day));
            }
        });
        return newRow;
    });

    // Buat worksheet dan workbook
    const ws = XLSX.utils.json_to_sheet(formattedData, { cellDates: true });

    // Format tanggal di worksheet ke 'dd/mm/yyyy'
    Object.keys(ws).forEach(cell => {
        if (cell[0] === '!') return;
        const val = ws[cell].v;
        if (val instanceof Date && !isNaN(val.getTime())) {
            ws[cell].t = 'd';
            ws[cell].z = 'dd/mm/yyyy';
        }
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Ambil nama cabang dan periode dari variabel global (opsional)
    const cabang = (typeof selectedBranch.value !== 'undefined' && selectedBranch?.value?.nama)
        || (typeof me !== 'undefined' && me?.me?.cabang_nama)
        || 'cabang';

    const tanggal = typeof rangeDate.value !== 'undefined' ? rangeDate?.value : 'tanggal';
    const periode = typeof periodeTarikan.value !== 'undefined' ? periodeTarikan?.value : 'periode';

    const filename = `laporan_nasabah_lunas_${cabang}.xlsx`.replace(/[^\w\d-_]+/g, '_');

    // Download file langsung tanpa saveAs
    const blob = new Blob([wbout], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};



const boxSearch = ref();
const stack = ref()

const handleBlur = () => {
    stack.value = stack.value.trim().toLowerCase()
}

const showData = computed(() => {
    return useSearch(dataList.value, stack.value)
})

const total = computed(() => showData.value.length)

const paginatedData = computed(() => {
    const start = (page.value - 1) * pageSize.value
    const end = start + pageSize.value
    return showData.value.slice(start, end)
})
const dataList = ref([])
const getList = async () => {
    loadingData.value = true;
    const response = await useApi({
        method: "POST",
        api: 'FasilitasLunasReport',
        data: { cabang: selectedBranch.value?.id },
        token: userToken,
    });
    if (!response.ok) {
        loadingData.value = false;
        message.error("error api")
    } else {
        loadingData.value = false;
        dataList.value = response.data;
    }
}
const searchData = () => {
    stack.value = boxSearch.value;
}

onMounted(() => {
    loadingBar.finish();
    getBranch();
}
)
    ;

</script>
