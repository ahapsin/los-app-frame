<template>
    <n-card :class="`shadow-lg`" title="Edit PIC Tagihan" :segmented="true" size="small">

        <template #header-extra>

            <n-popconfirm @positive-click="handlePositiveDelete(props.data)" @negative-click="handleNegativeClick"
                positive-text="Ya" negative-text="batal">
                <template #trigger>
                    <n-button type="error">
                        <template #icon>
                            <v-icon name="bi-trash"></v-icon>
                        </template>
                        Hapus
                    </n-button>
                </template>
                Yakin ingin menghapus data ?
            </n-popconfirm>
        </template>
        <div>
            <n-card :class="`shadow-lg`" class="mb-2" size="small" embedded>
                <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                        <small class="text-reg">NO SURAT</small>
                        <n-text strong class="text-md">{{ props.data?.no_surat }}</n-text>
                    </div>

                    <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]" v-if="props.data
                        ?.no_lkp">
                        <small class="text-reg">NO LKP</small>
                        <n-text type="error">
                            <strong>{{ props.data
                            }}</strong>
                        </n-text>
                    </div>
                    <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                        <small class="text-reg">No Kontrak</small>
                        <n-text strong class="text-md">
                            <pre>{{ props.data.no_kontrak }}</pre>
                        </n-text>
                    </div>
                    <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                        <small class="text-reg">Customer</small>
                        <n-text strong class="text-md">{{ props.data.nama_customer
                        }}</n-text>
                    </div>
                    <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                        <small class="text-reg">Tgl Jatuh Tempo</small>
                        <n-ellipsis class="text-md font-semibold">{{ props.data.tgl_jatuh_tempo
                        }}</n-ellipsis>
                    </div>
                    <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                        <small class="text-reg">Cycle</small>
                        <n-ellipsis class="text-md font-semibold">{{ props.data.cycle_awal
                        }}</n-ellipsis>
                    </div>
                    <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                        <small class="text-reg">Angsuran ke</small>
                        <n-ellipsis class="text-md font-semibold">{{ props.data.angusran_ke
                        }}</n-ellipsis>
                    </div>
                    <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                        <small class="text-reg">Angsuran</small>
                        <n-ellipsis class="text-md font-semibold">{{ props.data.angsuran

                            }}</n-ellipsis>
                    </div>
                    <div class="flex flex-col w-full">
                        <small class="text-reg">Alamat</small>
                        <n-text strong class="text-md">{{ props.data.alamat }}</n-text>
                    </div>
                    <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                        <small class="text-reg">DENDA</small>
                        <n-ellipsis class="text-md font-semibold">~kosong</n-ellipsis>
                    </div>
                    <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                        <small class="text-reg">TENOR</small>
                        <n-ellipsis class="text-md font-semibold">~kosong</n-ellipsis>
                    </div>
                    <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                        <small class="text-reg">MCF</small>
                        <n-ellipsis class="text-md font-semibold">~kosong</n-ellipsis>
                    </div>
                    <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                        <small class="text-reg">CATATAN SURVEYOR</small>
                        <n-ellipsis class="text-md font-semibold">~kosong</n-ellipsis>
                    </div>
                    <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                        <small class="text-reg">UNIT</small>
                        <n-ellipsis class="text-md font-semibold">~kosong</n-ellipsis>
                    </div>
                    <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                        <small class="text-reg">NO POLISI</small>
                        <n-ellipsis class="text-md font-semibold">~kosong</n-ellipsis>
                    </div>
                    <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                        <small class="text-reg">TAHUN MOTOR</small>
                        <n-ellipsis class="text-md font-semibold">~kosong</n-ellipsis>
                    </div>
                    <div class="flex flex-col flex-1 min-w-[250px] md:max-w-[25%]">
                        <small class="text-reg">NO HP</small>
                        <n-ellipsis class="text-md font-semibold">~kosong</n-ellipsis>
                    </div>
                </div>
            </n-card :class="`shadow-lg`">
            <n-space vertical>
                <n-form-item label="Petugas asal">

                    <n-input v-model:value="props.data.nama_pic" disabled />
                </n-form-item>
                <n-form-item label="Ganti Petugas Ke">
                    <n-select v-model:value="assignTo" placeholder="pilih petugas"
                        :options="_.filter(dataUser, { cabang_nama: me.me.cabang_nama })" value-field="username"
                        label-field="nama" filterable :render-tag="renderSingleSelectTag" :render-label="renderLabel" />
                </n-form-item>
            </n-space>
        </div>
        <template #footer>
            <n-space vertical>
                <n-alert type="info" v-if="assignTo === null">Pilih petugas</n-alert>
                <n-space v-else>
                    <n-button type="primary" @click="assignTagihan">
                        <v-icon name="bi-plus-lg" />
                        Simpan
                    </n-button>
                    <n-button type="secondary" @click="$emit('cancel', true)">Batal</n-button>
                </n-space>
            </n-space>
        </template>
    </n-card :class="`shadow-lg`">
</template>

<script setup>
import { NAvatar, NText } from 'naive-ui';
import { ref, reactive, onMounted } from "vue";
import { useLoadingBar, useMessage } from "naive-ui";
import { useApi } from "../../../helpers/axios.js";
import { useMeStore } from "../../../stores/me";
import _, { each } from "lodash";

const me = useMeStore();
const message = useMessage();
const loadingBar = useLoadingBar();

const modalAssign = ref(false);
const assignTo = ref(null);

const dataUser = ref([]);
const dataList = ref([]);
const isLoading = ref(false);
const checkedRowKeys = ref([]);

const props = defineProps({
    data: Object,
    default: {}
})

const columnBebanTagih = reactive([
    { type: "selection" },
    {
        title: "CABANG",
        key: "NAMA CABANG",
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
        title: "CYCLE AWAL",
        key: "CYCLE AWAL",
        sorter: "default",
        width: 150,
        filter: true,
        filterMultiple: true,
        filterOptions: [],
    },
    {
        title: "NBOT",
        key: "NBOT",
        sorter: "default",
        filter: true,
        filterMultiple: true,
        filterOptions: [],
        width: 110,
    },
    {
        title: "DESA",
        key: "KELURAHAN",
        sorter: "default",
        width: 150,
        filter: true,
        filterMultiple: true,
        filterOptions: [],
    },
    {
        title: "KEC",
        key: "KECAMATAN",
        sorter: "default",
        filter: true,
        filterMultiple: true,
        filterOptions: [],
        width: 150,
    },
    {
        title: "MCF",
        key: "SURVEYOR",
        sorter: "default",
        filter: true,
        filterMultiple: true,
        filterOptions: [],
        width: 150,
    }, {
        title: "ANGSURAN KE",
        key: "ANGS KE",
        sorter: "default",
        width: 150,
    },
    {
        title: "ANGSURAN ",
        key: "ANGSURAN",
        sorter: "default",
        width: 150,
        render(row) {
            return h("div", row.ANGSURAN?.toLocaleString())
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
        setFilterOptions("CYCLE AWAL");
        setFilterOptions("KECAMATAN");
        setFilterOptions("KELURAHAN");
        setFilterOptions("SURVEYOR");
        setFilterOptions("SURVEYOR STATUS");
    }
};

const emit = defineEmits();

const assignTagihan = async () => {
    const bodyPost = {
        user_id: assignTo.value,
        list_tagihan: checkedRowKeys.value,
    };
    isLoading.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "POST",
        api: `cl_deploy_update/${props.data.id}`,
        data: bodyPost,
        token: userToken,
    });
    if (!response.ok) {
        console.error(response);
    } else {
        isLoading.value = false;
        message.success("Berhasil mengubah petugas");
        assignTo.value = null;
        emit('success', true);
    }
};

const handlePositiveDelete = async (e) => {
    const bodyPost = {
        user_id: assignTo.value,
        list_tagihan: checkedRowKeys.value,
    };
    isLoading.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "POST",
        api: `cl_deploy_delete/${e.id}`,
        data: bodyPost,
        token: userToken,
    });
    if (!response.ok) {
        console.error(response);
    } else {
        isLoading.value = false;
        message.success("Berhasil menghapus deploy");
        assignTo.value = null;
        emit('success', true);
    }
}

onMounted(() => {
    getData();
});
</script>
