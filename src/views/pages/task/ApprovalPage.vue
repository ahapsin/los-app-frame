<template>
    <div>
        <n-space vertical>
            <n-card :title="`Tabel ${$route.name}`" class="bg-white" :segmented="true">
                <template #header-extra>
                    <n-space class="!gap-1">
                        <div class="me-1">
                            <n-popover trigger="click" placement="bottom-end">
                                <template #trigger>
                                    <n-button>
                                        <n-icon>
                                            <search-icon />
                                        </n-icon>
                                        <span v-if="width >= 520">Cari</span>
                                    </n-button>
                                </template>
                                <n-input autofocus="true" clearable placeholder="cari disini.."
                                    v-model:value="searchBox" />
                            </n-popover>
                        </div>
                        <div class="flex gap-2" v-if="unReadBadge() > 0">
                            <n-badge :value="unReadBadge()" :max="15">
                                <n-button @click="handleUnRead">
                                    Belum diperiksa
                                </n-button>
                            </n-badge>
                            <n-button @click="handleAll" v-if="cekUnread">
                                Semua
                            </n-button>
                        </div>
                    </n-space>
                </template>
                <n-space vertical :size="12">
                    <n-data-table :loading="loadData" size="small" :columns="columns" :data="showData"
                        :pagination="pagination" ellipsis :scroll-x="800"/>
                </n-space>
            </n-card>
        </n-space>
    </div>
</template>
<script setup>
import { ref, onMounted, h, computed } from "vue";
import { useApi } from "../../../helpers/axios";
import { useSearch } from "../../../helpers/searchObject";
import router from "../../../router";
import { useMessage, NIcon, NTag, NButton } from "naive-ui";
import {
    SearchOutlined as SearchIcon,
} from "@vicons/material";
import { useLoadingBar } from "naive-ui";
import { useWindowSize } from "@vueuse/core";
import _ from "lodash";
const loadingBar = useLoadingBar();
const { width } = useWindowSize();

const message = useMessage();
const dataTable = ref([]);
const searchBox = ref();
const columns = [
    {
        title: "Cabang",
        key: "cabang",
        sorter: "default",
        width: 100,
    },
    {
        title: "MCF",
        key: "nama_ao",
        sorter: "default",
        width: 100,
    },
    {
        title: "Nama Debitur",
        key: "nama_debitur",
        sorter: "default",
        width: 300,
    },
    {
        title: "Plafond",
        key: "plafond",
        width: 100,
        render(row) {
            return h("div", format(row.plafond));
        },
    },
    {
        title: "Tenor",
        key: "tenor",
        sorter: "default",
        width: 100,
    },
    {
        title: "Jenis Angsuran",
        key: "jenis_angsuran",
        sorter: "default",
        width: 100,
    },
    {
        title: "Status",
        key: "status",
        sorter: "default",
        width: 100,
        render(row) {
            return h(
                NTag,
                {
                    bordered: false,
                    type: statusTag(row.status_code),
                    size: "small",
                },
                { default: () => row.status.toUpperCase() }
            );
        },
    },
    {
        title: "",
        align: "right",
        key: "more",
        width: 100,
        render(row) {
            return h(
                NButton,
                {
                    size: "small",
                    type: statusTag(row.status_code),
                    onClick: () => {
                        handelAction(row);
                    },
                },
                { default: () => statusHandle(row.status_code) }
            );
        },
    },
];
const format = (e) => {
    const toNum = parseInt(e);
    return toNum.toLocaleString("en-US");
};
const statusTag = (e) => {
    if (e == "WAKPS") {
        return "warning";
    }
    if (e == "APKPS") {
        return "success";
    }
    if (e == "APHO") {
        return "success";
    }
};
const statusHandle = (e) => {
    if (e == "WAKPS") {
        return "Periksa Order";
    } else {
        return "Lihat Order";
    }
};
const loadData = ref(false);
const getData = async () => {
    loadData.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "GET",
        api: "fpk_kapos",
        token: userToken,
    });
    if (!response.ok) {
      console.log(response.error);
    } else {
        loadingBar.finish();
        loadData.value = false;
        dataTable.value = response.data.response;
    }
};
const handelAction = (e) => {
    if (e.status_code === 'WAKPS') {
        router.push({
            name: "Konfirmasi Pengajuan Kredit",
            params: { idapplication: e.id, action: "view" },
        });
    } else {
        router.push({
            name: "Detail Pengajuan Kredit",
            params: { idapplication: e.id },
        });
    }
};
const pagination = {
    pageSize: 10,
};
onMounted(() => getData());
const cekUnread = ref(false);
const handleUnRead = () => {
    cekUnread.value = true;
    searchBox.value = "menunggu";
}
const handleAll = () => {
    cekUnread.value = false;
    searchBox.value = "";
}
const unReadBadge = () => {
    let count = _.filter(dataTable.value, { 'status_code': 'WAKPS' });
    return count.length;
}
const showData = computed(() => {

    return useSearch(dataTable.value, searchBox.value);
});
</script>
