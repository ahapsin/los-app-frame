<script setup>
import { h, ref } from "vue";
import { NDataTable, NPagination, NInput, NButton } from "naive-ui";
import { useApi } from "../../../helpers/axios";

// Table columns
const columnsWithSelection = [
    {
        type: "selection",
        disabled(row) {
            return (
                row.STATUS === "SENDING"
            );
        },
    },
    {
        title: "No Kontrak",
        key: "no_kontrak",
        sorter: "default",
        // render(row) {
        //     return h("div", row.no_polisi);
        // }
    },
    {
        title: "Nama Debitur",
        key: "debitur",
        sorter: "default",
    },
    {
        title: "No BPKB",
        key: "BPKB_NUMBER",
        sorter: "default",
    }, {
        title: "Atas Nama",
        key: "ON_BEHALF",
        sorter: "default",
    },
    {
        title: "Lokasi Jaminan",
        key: "posisi_berkas",
        sorter: "default",
    },
    {
        title: "Status",
        key: "STATUS",
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
                        detailTrx(row);
                    },
                },
                {
                    default: () => "detail",
                }
            );
        },
    },
]
const columns = [

    {
        title: "No Kontrak",
        key: "no_kontrak",
        width: 100,
        sorter: "default",
        // render(row) {
        //     return h("div", row.no_polisi);
        // }
    },
    {
        title: "Nama Debitur",
        key: "debitur",
        width: 100,
        sorter: "default",
    },
    {
        width: 200,
        title: "No BPKB",
        key: "BPKB_NUMBER",
        sorter: "default",
    },
    {
        title: "Status",
        key: "STATUS",
        sorter: "default",
        width: 100,
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
                        detailTrx(row);
                    },
                },
                {
                    default: () => "detail",
                }
            );
        },
    },
]

// Reactive state
const users = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const pageSizes = [{
    label: '10 per halaman',
    value: 10
},
{
    label: '20 per halaman',
    value: 20
},
{
    label: '50 per halaman',
    value: 50
},
{
    label: '100 per halaman',
    value: 100
}];
const totalItems = ref(0);
const searchQuery = ref(""); // Search input
const sortBy = ref("name");
const order = ref("asc");
const props = defineProps({
    type: null,
    selection: {
        type: Boolean,
        default: false
    }
})
const loadData = ref(false);
// Fetch users with query parameters
const fetchData = async () => {
    try {
        loadData.value = true;
        const params = {
            type: props.type,
            page: currentPage.value,
            page_size: pageSize.value,
            search: searchQuery.value,
            sort_by: sortBy.value,
            order: order.value
        }
        const response = await useApi({
            method: "GET",
            api: "jaminan",
            params: params,
            token: localStorage.getItem('token'),
        });
        if (response.ok) {
            loadData.value = false;
            users.value = response.data.data;
            totalItems.value = response.data.total;
        }
    } catch (error) {
        console.error("Error fetching users:", error);
    }
};
const findData = () => {
    currentPage.value = 1;
    fetchData();
}
// Watch for changes & fetch new data
// watchEffect(() => {
//   fetchUsers();
// });
const emit = defineEmits();
const jamainanSelected = ref();
const handleChecked = (e) => {
    emit('check', e);
}
const modalTrx = ref(false);
const bodyModalTrx = ref();

const detailTrx = (e) => {
    bodyModalTrx.value = e;
    modalTrx.value = true;
}
onMounted(() => {
    fetchData()
});
</script>

<template>
    <div class="flex flex-col gap-y-2">

        <!-- Search and Filter -->
        <div class="flex gap-2">
            <n-input v-model:value="searchQuery" placeholder="cari disini..." />
            <n-button @click="findData" type="primary">Cari</n-button>
        </div>
        <!-- Data Table -->
        <div id="drawer-target">
            <n-data-table size="small" :max-height="300" :columns="props.selection ? columns : columnsWithSelection"
                :data="users" :bordered="true" :row-key="(row) => row" :on-update:checked-row-keys="handleChecked" :loading="loadData"/>
        </div>
        <!-- Pagination -->
        <n-pagination v-model:page="currentPage" :page-size="pageSize" :page-sizes="pageSizes" :item-count="totalItems"
            @update:page="fetchData" v-model:page-size="pageSize" show-size-picker>
            <template #prefix>
                Jumlah Jaminan: {{ totalItems }}
            </template>
        </n-pagination>
    </div>
    <n-drawer v-model:show="modalTrx" :height="400" placement="bottom" to="#drawer-target">
        <n-drawer-content title="Detail Jaminan">
            <n-table :bordered="false" :single-line="false" size="small">
                <thead>
                    <tr>
                        <th>Nama Debitur</th>
                        <th>No Kontrak</th>
                        <th>No BPKB</th>
                        <th>Lokasi</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ bodyModalTrx.debitur }}</td>
                        <td>{{ bodyModalTrx.no_kontrak }}</td>
                        <td>{{ bodyModalTrx.BPKB_NUMBER }}</td>
                        <td>{{ bodyModalTrx.lokasi }}</td>
                        <td>{{ bodyModalTrx.STATUS }}</td>
                    </tr>
                </tbody>
            </n-table>
            <n-table :bordered="false" :single-line="false" size="small">
                <tbody>
                    <tr>
                        <th>BPKB Atas Nama</th>
                        <td>{{ bodyModalTrx.ON_BEHALF }}</td>
                    </tr>
                    <tr>
                        <th>Merk/Tipe/Tahun</th>
                        <td>{{ bodyModalTrx.BRAND }} / {{ bodyModalTrx.TYPE }} / {{ bodyModalTrx.PRODUCTION_YEAR }}</td>
                    </tr>
                    <tr>
                        <th>Warna/No Polisi</th>
                        <td>{{ bodyModalTrx.COLOR }} /{{ bodyModalTrx.POLICE_NUMBER }}</td>
                    </tr>
                    <tr>
                        <th>No Rangka/No Mesin</th>
                        <td>{{ bodyModalTrx.CHASIS_NUMBER }}/ {{ bodyModalTrx.ENGINE_NUMBER }}</td>
                    </tr>
                    <tr>
                        <th>No Faktur</th>
                        <td>{{ bodyModalTrx.INVOICE_NUMBER }}</td>
                    </tr>
                </tbody>
            </n-table>
        </n-drawer-content>
    </n-drawer>
</template>
