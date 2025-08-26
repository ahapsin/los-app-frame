<template>
    <n-card title="Beban Tagih" :segmented="true" size="small">
        <div>
            <n-space vertical :size="12">
                <n-input type="text" placeholder="nyari apa ?" v-model:value="boxSearch" v-if="!ctrDownload"
                    @blur="searchData" />
                <n-data-table :columns="columnBebanTagih" :data="dataList" 
                    :row-key="(row) => row" @update:checked-row-keys="handleCheck" :max-height="350"
                    :loading="isLoading" size="small"  :pagination="{pageSize:10}"/>
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
        <n-card class="w-1/4">
            <n-space>
                <n-button class="mb-2" round type="info" secondary @click="detailSelectedModal = true">{{
                    checkedRowKeys.length }} data dipilih</n-button>
            </n-space>

            <n-space vertical>
                <n-form-item label="petugas">
                    <n-select v-model:value="assignTo" placeholder="pilih petugas"
                        :options="_.filter(dataUser, { 'cabang_nama': me.me.cabang_nama })" value-field="username"
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
        <n-card>
            <n-data-table :columns="selectBebanTagih" :data="checkedRowKeys" :pagination="pagination"
                :row-key="(row) => row" @update:checked-row-keys="handleCheck" :max-height="350" :loading="isLoading" />
        </n-card>
    </n-modal>
</template>
<script setup>
import { useLoadingBar, useMessage } from "naive-ui";
import { onMounted, ref } from "vue";
import { useApi } from "../../../helpers/axios.js";
import { useMeStore } from "../../../stores/me";
import _ from "lodash";


const me = useMeStore();
const message = useMessage();

const modalAssign = ref(false);
const assignTo = ref();
const detailSelectedModal = ref(false);


const selectedBranch = ref();

const rangeDate = ref();
let messageReactive = null;
const loadingBar = useLoadingBar();
const handleSubmit = () => {
    let a = {
        dari: rangeDate.value,
        cabang_id: selectedBranch.value?.id ? selectedBranch.value.id : me.me.cabang_id,
    }
    messageReactive = message.loading('memuat data listing beban', { duration: 0 });
    grabListBan(a);
}
const dataListBan = ref([]);
const loadingData = ref(false);
const timer = ref(60);
const disbaledButton = ref(false);
const ctrDownload = ref(true);
const grabListBan = async (e) => {

    loadingData.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "POST",
        api: "listBanTest",
        data: e,
        token: userToken,
    });
    if (!response.ok) {
        messageReactive.destroy();
        disbaledButton.value = true;
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
        messageReactive.destroy();
        messageReactive = null;
        disbaledButton.value = false;
        dataListBan.value = response.data;
        loadingData.value = false;
        ctrDownload.value = false;
    }

}

const columnBebanTagih = [
    {
        type: "selection",
    },
    {
        title: "NO KONTRAK",
        key: "NO KONTRAK",
        width: '150',
        sorter: 'default'
    },
    {
        title: "NAMA KOMSUMEN",
        key: "NAMA PELANGGAN",
        width: '200',
        sorter: 'default'
    },
    {
        title: "NAMA PIC",
        key: "PIC",
        width: '200',
        sorter: 'default'
    },
    {
        title: "CYCLE AWAL",
        key: "CYCLE AWAL",
        sorter: 'default'
    },
    {
        title: "NBOT",
        key: "name",
        sorter: 'default'
    },
    {
        title: "DESA",
        key: "KELURAHAN",
        sorter: 'default'
    },
    {
        title: "KEC",
        key: "KECAMATAN",
        sorter: 'default'
    },
    {
        title: "MCF",
        key: "SURVEYOR",
        sorter: 'default'
    },
];
const selectBebanTagih = [

    {
        title: "NO KONTRAK",
        key: "NO KONTRAK",
        width: '150'
    },
    {
        title: "NAMA KOMSUMEN",
        key: "NAMA PELANGGAN",
        width: '200'
    },
    {
        title: "NAMA PIC",
        key: "name",
        width: '200',
    },
    {
        title: "CYCLE AWAL",
        key: "CYCLE AWAL",
    },
    {
        title: "NBOT",
        key: "name"
    },
    {
        title: "DESA",
        key: "KELURAHAN"
    },
    {
        title: "KEC",
        key: "KECAMATAN"
    },
    {
        title: "MCF",
        key: "SURVEYOR"
    },
];

const dataUser = ref([]);
const getData = async () => {
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "GET",
        api: "users",
        token: userToken,
    });
    if (!response.ok) {
        console.log(reponse.error);
    } else {
        loadingBar.finish();
        // console.log(response.data.response)
        dataUser.value = response.data.response;
    }
};
const dataList = ref([]);
const isLoading = ref(false);
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
        console.log(reponse.error);
    } else {
        isLoading.value = false;
        loadingBar.finish();
        // console.log(response.data.response)
        dataList.value = response.data;
    }
};

const checkedRowKeys = ref([]);
const assignTagihan = async () => {
    const bodyPost = {
        user_id: assignTo.value,
        list_tagihan: checkedRowKeys.value
    }
    isLoading.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "POST",
        api: "tagihan",
        data: bodyPost,
        token: userToken,
    });
    if (!response.ok) {
        console.log(response);
    } else {
        isLoading.value = false;
        message.success('Berhasil mengirimkan tagihan')
        modalAssign.value = false;
        assignTo.value = null;
        checkedRowKeys.value = [];
        getList();
    }
};


function handleCheck(rowKeys) {
    checkedRowKeys.value = rowKeys;
}

const boxSearch = ref();

onMounted(() => {
    loadingBar.finish();
    getData();
    getList();
}
)
    ;

</script>
