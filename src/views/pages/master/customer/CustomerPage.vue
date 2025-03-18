<template>
    <n-space vertical>
        <n-card :title="`Tabel ${$route.name}`">

            <template #header-extra>
                <n-space class="!gap-1">
                    <div class="me-1">
                        <n-space>
                            <n-input :autofocus="true" clearable placeholder="cari disini.."
                                v-model:value="searchBox" />
                            <n-button type="primary" @click="handleSearch">cari</n-button>
                        </n-space>
                    </div>
                    <!-- <div class="hidden md:flex">
                            <n-button>
                                <template #icon>
                                    <n-icon>
                                        <download-icon />
                                    </n-icon>
                                </template>
<strong class="hidden md:!block">download</strong>
</n-button>
</div> -->
                    <div class="md:hidden">
                        <n-button>
                            <template #icon>
                                <n-icon>
                                    <download-icon />
                                </n-icon>
                            </template>
                        </n-button>
                    </div>
                    <!-- <div class="hidden md:flex">
                            <n-button type="primary" @click="handleAdd">
                                <template #icon>
                                    <n-icon>
                                        <add-icon />
                                    </n-icon>
                                </template>
                                <strong>tambah</strong>
                            </n-button>
                        </div> -->
                    <div class="md:hidden">
                        <n-button type="primary" @click="handleAdd">
                            <template #icon>
                                <n-icon>
                                    <add-icon />
                                </n-icon>
                            </template>
                        </n-button>
                    </div>
                </n-space>
            </template>
            <n-space vertical :size="12" class="pt-4">
                <n-data-table remote :loading="loadingPage" size="small" :columns="columns" :data="dataTable" />
                <n-pagination @update:page="handlePageChange" v-model:page="pageLocation" :page-count="countItem" />
            </n-space>
        </n-card>
    </n-space>
    <n-modal v-model:show="modalDetailCustomer">

        <n-card class="w-4/6 max-h-[500px] overflow-x-auto ">

            <n-spin :show="spinPelanggan">
                <n-tabs type="line" animated @before-leave="handleBeforeLeave">
                    <n-tab-pane name="customer" tab="Info Customer">
                        <n-scrollbar trigger="none">
                            <n-form ref="formPelanggan" :model="dataPelanggan" :rules="rulesPelanggan"
                                :label-placement="width <= 920 ? 'top' : 'top'" require-mark-placement="right-hanging"
                                :disabled="formDisable" label-width="auto">
                                <div class="flex w-full gap-2">
                                    <n-form-item label="Nama" path="nama" class="w-full">
                                        <n-input placeholder="nama" v-model:value="dataPelanggan.nama" />
                                    </n-form-item>
                                    <n-form-item label="Nama Panggilan" path="nama_panggilan" class="w-full">
                                        <n-input placeholder="nama panggilan"
                                            v-model:value="dataPelanggan.nama_panggilan"/>
                                    </n-form-item>
                                </div>
                                <div class="flex w-full gap-2">
                                    <n-form-item label="Jenis kelamin" path="jenis_kelamin" class="w-full">
                                        <n-select filterable placeholder="Jenis Kelamin" :options="optJenisKelamin"
                                            v-model:value="dataPelanggan.jenis_kelamin" readonly />
                                    </n-form-item>
                                    <n-form-item label="Tempat Lahir" path="tempat_lahir" class="w-full">
                                        <n-input placeholder="tempat lahir" v-model:value="dataPelanggan.tempat_lahir"
                                            @input="$event => (dataPelanggan.tempat_lahir = $event.toUpperCase())"
                                            readonly />
                                    </n-form-item>
                                    <n-form-item label="Tanggal lahir" path="tgl_lahir" class="w-full">
                                        <n-date-picker placeholder="Tanggal Lahir"
                                            v-model:formatted-value="dataPelanggan.tgl_lahir" value-format="yyyy-MM-dd"
                                            format="dd-MM-yyyy" type="date" @update:value="handleTanggalLahir"
                                            class="w-full" readonly />
                                        <span
                                            class="absolute text-xs text-orange-500 top-6 bg-orange-50 w-full p-0.5 mt-2 animate-pulse"
                                            v-show="notifUsia">{{ noteUsia }}</span>
                                    </n-form-item>
                                    <n-form-item label="Status Kawin" path="status_kawin" class="w-full">
                                        <n-input-group>
                                            <n-select filterable placeholder="Status Kawin" :options="optStatusKawin"
                                                v-model:value="dataPelanggan.status_kawin" readonly />
                                        </n-input-group>
                                    </n-form-item>
                                </div>
                                <div class="flex w-full gap-2">
                                    <n-form-item label="Tipe Identitas" path="tipe_identitas" class="w-full">
                                        <n-select filterable placeholder="Jenis Identitas" :options="optJenisIdentitas"
                                            v-model:value="dataPelanggan.tipe_identitas" readonly />
                                    </n-form-item>
                                    <n-form-item label="No Identitas" path="no_identitas" class="w-full">
                                        <n-input :allow-input="onlyAllowNumber" class="w-full"
                                            placeholder="No Identitas" show-count :maxlength="16"
                                            v-model:value="dataPelanggan.no_identitas" readonly>
                                        </n-input>
                                    </n-form-item>
                                    <n-form-item label="No KK" path="no_kk" class="w-full">
                                        <n-input :allow-input="onlyAllowNumber" placeholder="No Kartu Keluarga"
                                            v-model:value="dataPelanggan.no_kk" show-count :maxlength="16" readonly />
                                    </n-form-item>
                                </div>
                            </n-form>
                            <n-form ref="formPelangganPekerjaan" :model="dataPekerjaan" :rules="rulesPekerjaan"
                                :disabled="formDisable" :label-placement="width <= 920 ? 'top' : 'top'"
                                require-mark-placement="right-hanging" label-width="auto">
                                <div class="flex gap-4">
                                    <n-form-item label="Sektor" path="pekerjaan_id" class="w-full">
                                        <n-select filterable placeholder="pekerjaan" :options="optPekerjaan"
                                            v-model:value="dataPekerjaan.pekerjaan_id" readonly />
                                    </n-form-item>
                                    <n-form-item label="Pendidikan" path="pendidikan" class="w-full">
                                        <n-select filterable placeholder="pendidikan" :options="optPendidikan"
                                            v-model:value="dataPekerjaan.pendidikan" readonly />
                                    </n-form-item>
                                </div>
                                <div class="flex gap-2">
                                </div>
                                <!-- <n-divider title-placement="left">
              <n-space>Informasi Alamat Identitas
              </n-space>
            </n-divider> -->
                            </n-form>
                            <!-- <n-dynamic-input
              :min="1"
              v-model:value="alamat_identitas">
            <template #default="{ alamat_identitas }">
              <div class="flex w-full gap-2">
                <div class="flex gap-2">
                  <n-form-item label="Alamat" class="w-full" path="alamat">
                    <n-input placeholder="Alamat" v-model:value="alamatIdentitas.alamat"
                             @input="$event => (alamatIdentitas.alamat = $event.toUpperCase())"/>
                  </n-form-item>
                  <n-form-item label="RT" path="rt">
                    <n-input placeholder="RT" v-model:value="alamatIdentitas.rt" :allow-input="onlyAllowNumber"
                             :maxlength="3" @input="$event => (alamatIdentitas.rt = $event.toUpperCase())">
                    </n-input>
                  </n-form-item>
                  <n-form-item label="RW" path="rw">
                    <n-input placeholder="RW" v-model:value="alamatIdentitas.rw" :allow-input="onlyAllowNumber"
                             :maxlength="3" @input="$event => (alamatIdentitas.rw = $event.toUpperCase())">
                    </n-input>
                  </n-form-item>
                </div>
                <select-state-region v-model:provinsi="alamatIdentitas.provinsi" v-model:kota="alamatIdentitas.kota"
                                     v-model:kecamatan="alamatIdentitas.kecamatan"
                                     v-model:desa="alamatIdentitas.kelurahan"
                                     v-model:kodepos="alamatIdentitas.kode_pos"/>
              </div>
            </template>
          </n-dynamic-input> -->

                            <!-- <n-divider title-placement="left">
            Informasi Alamat Tagih
          </n-divider>
          <n-dynamic-input
              :min="1"
              v-model:value="alamat_tagih">
            <template #default="{ alamat_tagih }">
              <div class="flex w-full gap-2">
                <div class="flex gap-2">
                  <n-form-item label="Alamat" class="w-full" path="alamat">
                    <n-input placeholder="Alamat" v-model:value="alamatTagih.alamat"
                             @input="$event => (alamatTagih.alamat = $event.toUpperCase())"/>
                  </n-form-item>
                  <n-form-item label="RT" path="rt">
                    <n-input placeholder="RT" v-model:value="alamatTagih.rt" :allow-input="onlyAllowNumber"
                             :maxlength="3" @input="$event => (alamatTagih.rt = $event.toUpperCase())">
                    </n-input>
                  </n-form-item>
                  <n-form-item label="RW" path="rw">
                    <n-input placeholder="RW" v-model:value="alamatTagih.rw" :allow-input="onlyAllowNumber"
                             :maxlength="3" @input="$event => (alamatTagih.rw = $event.toUpperCase())">
                    </n-input>
                  </n-form-item>
                </div>
                <select-state-region v-model:provinsi="alamatTagih.provinsi" v-model:kota="alamatTagih.kota"
                                     v-model:kecamatan="alamatTagih.kecamatan"
                                     v-model:desa="alamatTagih.kelurahan"
                                     v-model:kodepos="alamatTagih.kode_pos"/>
              </div>
            </template>
          </n-dynamic-input> -->
                            <n-button @click="handleUpdateData(dataDetailPelanggan.id)" type="primary">
                                Ubah
                            </n-button>
                        </n-scrollbar>
                    </n-tab-pane>
                    <n-tab-pane name="phonebook" tab="Phonebook">
                        <div class="flex gap-2 ">
                            <n-form-item label="NO Handphone">
                                <n-input v-model:value="refNoHp" />
                            </n-form-item>
                            <n-form-item label="Alias">
                                <n-input v-model:value="refAlias" />
                            </n-form-item>
                            <n-form-item>
                                <n-button type="primary"
                                    @click="handleAddPhoneBook(dataDetailPelanggan.id)" :disabled="refNoHp ==''">tambah</n-button>
                            </n-form-item>
                        </div>
                        <n-data-table :columns="columnPhonebook" :data="dataPhonebook" :pagination="{ pageSize: 5 }" />
                    </n-tab-pane>
                </n-tabs>
            </n-spin>
        </n-card>
    </n-modal>
</template>
<script setup>
import { ref, onMounted, h, computed } from "vue";
import { useApi } from "../../../../helpers/axios";
import router from "../../../../router";
import {
    useDialog,
    useMessage,
    NDropdown,
    NIcon,

    NButton,
    useLoadingBar,
} from "naive-ui";
import {
    AddCircleOutlineRound as AddIcon,
    FileDownloadOutlined as DownloadIcon,
} from "@vicons/material";
import {
    ListAltOutlined as DetailIcon,
} from "@vicons/material";

const message = useMessage();
const dialog = useDialog();
const dataTable = ref([]);
const searchBox = ref();
const formDisable = ref(false);
const telpKonsumen = ref([]);

const handleBeforeLeave = async (t) => {
    switch (t) {
        case "phonebook":
            await getPhonebook();
            return true;
        default:
            return true;
    }
}
const dataPhonebook = ref();
const loadPhonebook = ref(false);
const getPhonebook = async (e) => {
    loadPhonebook.value = true;
    const response = await useApi({
        method: "GET",
        api: `phone_book/${dataDetailPelanggan.value.id}`,
        token: localStorage.getItem("token"),
    });
    if (!response.ok) {
        loadPhonebook.value = false;
        console.log('error')
    } else {
        loadPhonebook.value = false;
        dataPhonebook.value = response.data.phone;
    }
}

const refAlias = ref();
const refNoHp = ref();
const handleAddPhoneBook = async (e) => {
    const body = {
        customer_id: e,
        alias: refAlias.value,
        no_hp: refNoHp.value,
    }
    loadPhonebook.value = true;
    const response = await useApi({
        method: "POST",
        api: `phone_book`,
        data: body,
        token: localStorage.getItem("token"),
    });
    if (!response.ok) {
        loadPhonebook.value = false;
        console.log('error')
    } else {
        loadPhonebook.value = false;
        refAlias.value="",
        refNoHp.value="",
        message.success('berhasil tambah buku telepon');
        getPhonebook();
    }
}

const handleUpdateData = async (e) => {
    console.log(e)
    const body={
        id:e,
        nama:dataPelanggan.value.nama,
        nama_panggilan:dataPelanggan.value.nama_panggilan,
    }
    loadPhonebook.value = true;
    const response = await useApi({
        method: "PUT",
        api: `customer/${body.id}}`,
        data: body,
        token: localStorage.getItem("token"),
    });
    if (!response.ok) {
        console.log('error')
    } else {
        message.success('berhasil ubah data');
    }
}
const columnPhonebook = [
    {
        title: "NO TELEPON",
        key: "PHONE_NUMBER",
        sorter: "default",
    },
    {
        title: "ALIAS",
        key: "ALIAS",
        sorter: "default",
    },
    {
        title: "TANGGAL BUAT",
        key: "CREATED_AT",
        sorter: "default",
    },
    {
        title: "DIBUAT OLEH",
        key: "CREATED_BY",
        sorter: "default",
    },
];
const columns = [
    {
        title: "No Pelanggan",
        key: "CUST_CODE",
        sorter: "default",
    },
    {
        title: "Nama",
        key: "NAME",
        sorter: "default",
    },
    {
        title: "Tanggal Lahir",
        key: "BIRTHDATE",
        sorter: "default",
    },
    {
        title: "Nama Ibu Kandung",
        sorter: "default",
        key: "MOTHER_NAME",
    },
    {
        title: "",
        align: "right",
        key: "more",
        render(row, index) {
            return h(
                NDropdown,
                {
                    options: options,
                    size: "small",
                    onSelect: (e) => {
                        if (e === "hapus") {
                            handleConfirm(row, index);
                        }
                        if (e === "detail") {
                            handleDetail(row);
                        }
                        if (e === "edit") {
                            handleUpdate(row);
                        }
                    },
                },
                {
                    default: () => h(
                        NButton,
                        {
                            size: "small",
                        },
                        { default: () => "Action" }
                    ),
                }
            );
        },
    },
];
const handleConfirm = (row, index) => {
    dialog.warning({
        title: "Confirm",
        content: "Apakah anda yakin ingin menghapus data ?",
        positiveText: "Ya",
        negativeText: "Batal",
        onPositiveClick: async () => {
            let userToken = localStorage.getItem("token");
            const response = await useApi({
                method: "DELETE",
                api: `cabang/${row.id}`,
                token: userToken,
            });
            if (!response.ok) {
                message.error("api transaction error");
            } else {
                dataTable.value.splice(index, 1);
                message.success("Data berhasil dihapus");
            }
        },
        onNegativeClick: () => {
            message.error("Batal hapus data !");
        },
    });
};
const modalDetailCustomer = ref(false);
const dataDetailPelanggan = ref();
const dataPelanggan = ref([]);
const dataPekerjaan = ref([]);
const alamatIdentitas = ref([]);
const alamatTagih = ref([]);
const spinPelanggan = ref(false);
const handleDetail = async (e) => {
    modalDetailCustomer.value = true;
    spinPelanggan.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "GET",
        api: `customerReport/${e.ID}`,
        token: userToken,
    });
    if (!response.ok) {
        message.error("ERROR API");
    } else {
        Object.assign(dataPelanggan.value, response.data.pelanggan);
        Object.assign(dataPekerjaan.value, response.data.pekerjaan);
        Object.assign(alamatIdentitas.value, response.data.alamat_identitas);
        Object.assign(alamatTagih.value, response.data.alamat_tagih);
        dataDetailPelanggan.value = response.data;
        spinPelanggan.value = false;
        telpKonsumen.value.push(dataPekerjaan.value.telepon_selular);

    }
}
const handleUpdate = (evt) => {
    router.push(`/master/branch-action/${evt.id}`);
};
const handleAdd = () => {
    router.push("/master/branch-action");
};
const loadingBar = useLoadingBar();
const countItem = ref();
const pageLocation = ref(1);

const loadingPage = ref(false);
const getData = async (e) => {
    loadingPage.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "GET",
        api: e ? `customer?page=${e}&search=${searchBox.value ? searchBox.value : ''}` : `customer`,
        token: userToken,
    });
    if (!response.ok) {
        message.error("ERROR API TRANSACTION");
    } else {
        loadingBar.finish();
        loadingPage.value = false;
        dataTable.value = response.data.data;
        countItem.value = response.data.total;
        pageLocation.value = response.data.current_page;
    }
};

const renderIcon = (icon) => {
    return () => {
        return h(NIcon, null, {
            default: () => h(icon),
        });
    };
};
const options = [
    {
        label: "Detail",
        key: "detail",
        icon: renderIcon(DetailIcon),
    },
];
const paginationRef = reactive({
    pageSize: 10,
    itemCount: computed(() => countItem.value),
    showSizePicker: true,
    onChange: (page) => {
        paginationRef.page = page;
    },
    onUpdatePageSize: (pageSize) => {
        paginationRef.pageSize = pageSize;
        paginationRef.page = 1;
    }
});
const handleSearch = (page) => {
    getData(page);
}
const handlePageChange = (page) => {
    getData(page);
}
onMounted(() => getData());
// const showData = computed(() => {
//   return useSearch(dataTable.value, searchBox.value);
//   // return filterIt(dataTable.value, searchBox.value);
// });
</script>
