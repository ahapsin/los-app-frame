<template>
    <div>
        <n-space vertical>
            <n-card :class="`shadow`":title="`Laporan Dokumen Pelanggan`" :segmented="true" size="small">
                <n-space vertical :size="12" class="pt-4">
                    <div class="flex gap-2">
                        <n-form-item label="Nomor Kontrak" class="w-full">
                            <n-input v-model:value="dynamicSearch.loan_number" placeholder="Nomor Kontrak" clearable/>
                        </n-form-item>
                        <n-form-item label="Atas Nama" class="w-full">
                            <n-input v-model:value="dynamicSearch.atas_nama" placeholder="Atas Nama" clearable />
                        </n-form-item>
                        <n-form-item label="POS" class="w-full">
                            <n-select :loading="loadingBranch" filterable placeholder="Pilih POS" label-field="nama"
                                value-field="kode" :default-value="defBranch" :options="dataBranch"
                                v-model:value="dynamicSearch.cabang" />
                        </n-form-item>
                        <n-form-item class="flex gap-2" as="div">
                            <n-button type="primary" @click="handleSearch" class="px-4"> Cari</n-button>
                        </n-form-item>
                    </div>
                    <n-data-table :loading="loadTable" size="small" :columns="columns" :data="dataTable"
                        :pagination="pagination" />
                </n-space>
            </n-card>
        </n-space>
    </div>
</template>
<script setup>
import { ref, onMounted, computed, reactive } from "vue";
import { useApi } from "../../../helpers/axios";
import { useSearch } from "../../../helpers/searchObject";
import {
    useMessage,
    NButton,
    NImage,
} from "naive-ui";
import { useMeStore } from "../../../stores/me";
const dataTable = ref([]);
const searchBox = ref();


const handleSearch = async () => {
     loadTable.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "GET",
        api: `check_order_document?loan_number=${dynamicSearch.loan_number}&atas_nama=${dynamicSearch.atas_nama}&cabang=${dynamicSearch.cabang}`,
        token: userToken,
    });
    if (!response.ok) {
        console.log(reponse.error);
    } else {
        dataTable.value = response.data;
        loadTable.value = false;
    }
}
const me = useMeStore();
const dataBranch = ref([]);
const loadTable = ref(false);
const selectBranch = ref();
const loadingBranch = ref(false);
const dynamicSearch = reactive({
});
const getBranch = async () => {
    loadingBranch.value = true;
    const response = await useApi({
        method: "GET",
        api: "cabang",
        token: localStorage.getItem('token'),
    });
    if (!response.ok) {
        message.error("ERROR API");
    } else {
        loadingBranch.value = false;

        if (me.me?.cabang_nama != "Head Office") {
            selectBranch.value = me.me.cabang_id;
        } else {
            selectBranch.value = "SEMUA CABANG";
            dataBranch.value = response.data.response;
            dataBranch.value.unshift({
                id: "",
                nama: "SEMUA CABANG"
            });
        }
    }
}
const getData = async () => {
    loadTable.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "GET",
        api: `check_order_document`,
        token: userToken,
    });
    if (!response.ok) {
        console.log(reponse.error);
    } else {
        dataTable.value = response.data;
        loadTable.value = false;
    }
};

const noImage = 'https://res.cloudinary.com/dfjruncxv/image/upload/v1754368196/10275344_meozgk.png';
const columns = [
    {
        title: "Pos",
        key: "nama_cabang",
        sorter: "default",
    },
    {
        title: "No Kontrak",
        key: "no_kontrak",
        sorter: "default",
    },
    {
        title: "Atas Nama",
        key: "atas_nama",
        sorter: "default",
        width: 150
    },
    {
        title: "KTP",
        key: "ktp",
        render(row) {
            return h(NImage, {
                src: row.ktp ? row.ktp : noImage,
                width: 30,
            })
        }
    },
    {
        title: "KK",
        key: "kk",
        render(row) {
            return h(NImage, {
                src: row.kk ? row.kk : noImage,
                width: 30,
            })
        }
    },
    {
        title: "KTP PASANGAN",
        key: "ktp_pasangan",

        render(row) {
            return h(NImage, {
                src: row.ktp_pasangan ? row.ktp_pasangan : noImage,
                width: 30,
            })
        }
    },
    {
        title: "RANGKA",
        key: "no_rangka",
        render(row) {
            return h(NImage, {
                src: row.no_rangka ? row.no_rangka : noImage,
                width: 30,
            })
        }
    },
    {
        title: "MESIN",
        key: "no_mesin",
        render(row) {
            return h(NImage, {
                src: row.no_mesin ? row.no_mesin : noImage,
                width: 30,
            })
        }
    },
    {
        title: "STNK",
        key: "stnk",
        render(row) {
            return h(NImage, {
                src: row.stnk ? row.stnk : noImage,
                width: 30,
            })
        }
    },
    {
        title: "DEPAN",
        key: "depan",
        render(row) {
            return h(NImage, {
                src: row.depan ? row.depan : noImage,
                width: 30,
            })
        }
    },
    {
        title: "BELAKANG",
        key: "belakang",
        render(row) {
            return h(NImage, {
                src: row.belakang ? row.belakang : noImage,
                width: 30,
            })
        }
    },
    {
        title: "KANAN",
        key: "kanan",
        render(row) {
            return h(NImage, {
                src: row.kanan ? row.kanan : noImage,
                width: 30,
            })
        }
    },
    {
        title: "KIRI",
        key: "kiri",
        render(row) {
            return h(NImage, {
                src: row.kiri ? row.kiri : noImage,
                width: 30,
            })
        }
    },
]

const convertObjectToArray = (obj) => {
    if (!Array.isArray(obj) || obj.length === 0) {
        return [];
    }
    const keys = Object.keys(obj[0]);
    return keys.map(key => ({ title: key, key: key }));
}
const pagination = {
    pageSize: 10,
};
onMounted(() => {
    getData();
    getBranch();
});
const showData = computed(() => {
    return useSearch(dataTable.value, searchBox.value);
});
</script>
