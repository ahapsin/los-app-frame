<template>
    <div>
        <n-space vertical>
            <n-card :title="`Laporan Dokumen Pelanggan`" :segmented="true" size="small">

                <n-space vertical :size="12" class="pt-4">
                    <div class="flex flex-col md:flex-row gap-2 pt-4 pr-4 ps-4 bg-sc-50">
                        <n-form-item label="Nomor Kontrak" class="w-full">
                            <n-input v-model:value="dynamicSearch.loan_number" placeholder="Nomor Kontrak                " />
                        </n-form-item>
                        <n-form-item label="Atas Nama" class="w-full">
                            <n-input v-model:value="dynamicSearch.atas_nama" placeholder="Atas Nama" clearable />
                        </n-form-item>
                        <n-form-item class="flex gap-2" as="div">
                            <n-button type="primary" @click="handleSearch" class="px-4"> Cari</n-button>
                        </n-form-item>
                    </div>
                    <n-data-table :loading="loadTable" size="small" :columns="columns" :data="lapDok"
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
const dataTable = ref([]);
const searchBox = ref();
const dynamicSearch = reactive({
    cabang: '',
    hari: '',
});

const handleSearch = () => {
    console.log(dynamicSearch);
    getData();
}


const loadTable = ref(false);
const getData = async () => {
    loadTable.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "POST",
        data: dynamicSearch,
        api: `credit_jtempo`,
        token: userToken,
    });
    if (!response.ok) {
        console.log(reponse.error);
    } else {
        dataTable.value = response.data;
        loadTable.value = false;
    }
};

const lapDok = [
    {
        no_kontrak: '123456789',
        atas_nama: 'nama debitur',
        ktp: 'https://i.pinimg.com/474x/e7/ac/62/e7ac62da918dc5d72062953570bac97f.jpg',
        kk: 'https://i.pinimg.com/474x/e7/ac/62/e7ac62da918dc5d72062953570bac97f.jpg',
        ktp_pasangan: 'https://i.pinimg.com/474x/e7/ac/62/e7ac62da918dc5d72062953570bac97f.jpg',
        no_rangka: 'https://i.pinimg.com/474x/e7/ac/62/e7ac62da918dc5d72062953570bac97f.jpg',
        no_mesin: 'https://i.pinimg.com/474x/e7/ac/62/e7ac62da918dc5d72062953570bac97f.jpg',
        stnk: 'https://i.pinimg.com/474x/e7/ac/62/e7ac62da918dc5d72062953570bac97f.jpg',
        depan: 'https://i.pinimg.com/474x/e7/ac/62/e7ac62da918dc5d72062953570bac97f.jpg',
        belakang: 'https://i.pinimg.com/474x/e7/ac/62/e7ac62da918dc5d72062953570bac97f.jpg',
        kanan: 'https://i.pinimg.com/474x/e7/ac/62/e7ac62da918dc5d72062953570bac97f.jpg',
        kiri: 'https://i.pinimg.com/474x/e7/ac/62/e7ac62da918dc5d72062953570bac97f.jpg',
        dok_pendukung: 'https://i.pinimg.com/474x/e7/ac/62/e7ac62da918dc5d72062953570bac97f.jpg',
    }, {
        no_kontrak: '123456789',
        atas_nama: 'nama debitur',
        ktp: 'https://i.pinimg.com/474x/e7/ac/62/e7ac62da918dc5d72062953570bac97f.jpg',
        kk: 'https://i.pinimg.com/474x/e7/ac/62/e7ac62da918dc5d72062953570bac97f.jpg',
        ktp_pasangan: 'https://i.pinimg.com/474x/e7/ac/62/e7ac62da918dc5d72062953570bac97f.jpg',
        no_rangka: 'https://i.pinimg.com/474x/e7/ac/62/e7ac62da918dc5d72062953570bac97f.jpg',
        no_mesin: 'https://i.pinimg.com/474x/e7/ac/62/e7ac62da918dc5d72062953570bac97f.jpg',
        stnk: 'https://i.pinimg.com/474x/e7/ac/62/e7ac62da918dc5d72062953570bac97f.jpg',
        depan: 'https://i.pinimg.com/474x/e7/ac/62/e7ac62da918dc5d72062953570bac97f.jpg',
        belakang: 'https://i.pinimg.com/474x/e7/ac/62/e7ac62da918dc5d72062953570bac97f.jpg',
        kanan: 'https://i.pinimg.com/474x/e7/ac/62/e7ac62da918dc5d72062953570bac97f.jpg',
        kiri: 'https://i.pinimg.com/474x/e7/ac/62/e7ac62da918dc5d72062953570bac97f.jpg',
        dok_pendukung: 'https://i.pinimg.com/474x/e7/ac/62/e7ac62da918dc5d72062953570bac97f.jpg',
    },
];

const columns = [
    {
        title: "No Kontrak",
        key: "no_kontrak",
        sorter: "default",
        width: 100
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
                src: row.ktp,
                width: 30,
            })
        }
    },
    {
        title: "KK",
        key: "kk",
        render(row) {
            return h(NImage, {
                src: row.kk,
                width: 30,
            })
        }
    },
    {
        title: "KTP PASANGAN",
        key: "ktp_pasangan",

        render(row) {
            return h(NImage, {
                src: row.ktp_pasangan,
                width: 30,
            })
        }
    },
    {
        title: "RANGKA",
        key: "no_rangka",
        render(row) {
            return h(NImage, {
                src: row.no_rangka,
                width: 30,
            })
        }
    },
    {
        title: "MESIN",
        key: "no_mesin",
        render(row) {
            return h(NImage, {
                src: row.no_mesin,
                width: 30,
            })
        }
    },
    {
        title: "STNK",
        key: "stnk",
        render(row) {
            return h(NImage, {
                src: row.stnk,
                width: 30,
            })
        }
    },
    {
        title: "DEPAN",
        key: "depan",
        render(row) {
            return h(NImage, {
                src: row.depan,
                width: 30,
            })
        }
    },
    {
        title: "BELAKANG",
        key: "belakang",
        render(row) {
            return h(NImage, {
                src: row.belakang,
                width: 30,
            })
        }
    },
    {
        title: "KANAN",
        key: "kanan",
        render(row) {
            return h(NImage, {
                src: row.kanan,
                width: 30,
            })
        }
    },
    {
        title: "KIRI",
        key: "kiri",
        render(row) {
            return h(NImage, {
                src: row.kiri,
                width: 30,
            })
        }
    },
    {
        title: "PENDUKUNG",
        key: "dok_pendukung",
        render(row) {
            return h(NImage, {
                src: row.dok_pendukung,
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
});
const showData = computed(() => {
    return useSearch(dataTable.value, searchBox.value);
});
</script>
