<template>
    <n-card :segmented="{
        content: true,
        footer: 'soft',
    }" :title="`Form ${$route.name}`">
        <n-form ref="formRef" :model="dynamicForm" :rules="rules" :label-placement="width <= 920 ? 'top' : 'top'"
            require-mark-placement="right-hanging" :size="size" label-width="auto">
            <n-alert v-show="errorAPI" title="Peringatan" type="warning" closable class="my-4">
                {{ errorAPI }}
            </n-alert>
            <n-form-item label="Jenis">
                <n-select :options="optJenis" v-model:value="dynamicForm.jenis" />
            </n-form-item>
            <n-form-item label="Merk">
                <n-input placeholder="ex. HONDA / YAMAHA / SUZUKI, dll" v-model:value="dynamicForm.merk" />
            </n-form-item>
            <n-form-item label="Tipe">
                <n-input placeholder="ex. PS5E549202 MT / SUPRA X 125 TLD" v-model:value="dynamicForm.tipe" />
            </n-form-item>
            <n-form-item label="Keterangan">
                <n-input type="textarea" v-model:value="dynamicForm.keterangan"
                    placeholder="ex. Vario Tecno / Supra X 125 / Satria FU, dll " />
            </n-form-item>
            <div class="flex gap-2">
                <n-form-item label="Dari" path="tahun_kendaraan" :rule="rules.tahun_jaminan">
                    <n-date-picker value-format="yyyy" v-model:formatted-value="dari" type="year"
                        placeholder="Tahun jaminan" clearable />
                </n-form-item>
                <n-form-item label="Sampai" path="tahun_kendaraan" :rule="rules.tahun_jaminan">
                    <n-date-picker value-format="yyyy" v-model:formatted-value="sampai" type="year"
                        placeholder="Tahun jaminan" clearable :on-blur="maxYear" />
                </n-form-item>
            </div>
            <n-data-table :columns="columns" :data="_.sortBy(price, 'name')" :pagination="pagination" />
        </n-form>
        <template #action>
            <n-space>
                <n-button :loading="loading" type="primary" @click="handleSave">
                    <span v-if="!param">Simpan</span>
                    <span v-else>Ubah</span>
                </n-button>
                <n-button type="error" @click="handleCancel"> Batal </n-button>
            </n-space>
        </template>
    </n-card>
</template>
<script setup>
import { useWindowSize } from "@vueuse/core";
import _ from "lodash";
import { NInput, NInputNumber, useMessage } from "naive-ui";
import { computed, h, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { useApi } from "../../../helpers/axios";
import router from "../../../router";
const { width } = useWindowSize();
const loading = ref(false);
const action = ref("POST");
const url = ref();
const formRef = ref(null);
const errorAPI = ref(null);
const message = useMessage();
const PageData = ref([]);
const baseRoute = useRoute();
const param = baseRoute.params.idtaksasi;
const userToken = localStorage.getItem("token");

const rules = {
    CODE: {
        required: true,
        trigger: ["blur", "input"],
        message: "nama wajib diisi",
    },
    NAME: {
        required: true,
        trigger: ["blur"],
        message: "nama wajib diisi",
    },
};
const dari = ref(null);
const sampai = ref(null);
const handleCancel = () => router.push("/master/taksasi");
const price = ref([]);

const dynamicForm = reactive({
    jenis: null,
    merk: null,
    tipe: null,
    keterangan: null,
    price: price.value,
    min_year: null,
    max_year: null,
    diff_year: computed(() => dynamicForm.max_year - dynamicForm.min_year + 1),
});
const response = () =>
    useApi({
        method: "get",
        api: `taksasi/${param}`,
        token: userToken,
    }).then((res) => {
        if (res.ok) {
            message.loading("memuat taksasi");
            PageData.value = res.data;
            price.value = _.sortBy(res.data.harga, "tahun");
            Object.assign(dynamicForm, res.data);
            dari.value = res.data.dari.toString();
            sampai.value = res.data.sampai.toString();
        }
    });

const handleSave = async () => {

    formRef.value?.validate(() => {
        return null;
    });
    loading.value = true;
    const putBody = ref({
        jenis: dynamicForm.jenis,
        merk: dynamicForm.merk,
        tipe: dynamicForm.tipe,
        keterangan: dynamicForm.keterangan,
        price: price.value
    });
    if (param) {
        action.value = "PUT";
        url.value = `taksasi/${param}`;
    } else {
        url.value = `taksasi`;
        action.value = "POST";
    }
    const response = await useApi({
        method: action.value,
        api: url.value,
        data: putBody.value,
        token: userToken,
    });

    if (!response.ok) {
        message.error("data gagal disimpan");
        loading.value = false;
        errorAPI.value = response.error.data.message;
    } else {
        message.success("data berhasil disimpan");
        loading.value = false;
        router.push({ name: "taksasi" });
    }
};
onMounted(() => {
    if (param) {
        response();
    }
});
const createColumns = () => [
    {
        title: "TAHUN",
        key: "year",
        render(row, index) {
            return h(NInput, {
                value: row.tahun,
                disabled: true,
                onUpdateValue(v) {
                    price.value[index].tahun = v;
                },
            });
        },
    },
    {
        title: "HARGA",
        key: "value",
        render(row, index) {
            return h(NInputNumber, {
                value: row.harga ? row.harga : 0,
                parse: parse,
                showButton: false,
                format: format,
                onUpdateValue(v) {
                    price.value[index].harga = v;
                },
            });
        },
    },
];
const columns = ref(createColumns());
const maxYear = () => {
    price.value = [];

    for (let i = dari.value; i <= sampai.value; i++) {
        const item = _.find(PageData.value.harga, (o) => o.tahun === i.toString());
        price.value.push({
            tahun: i,
            harga: item ? item.harga : 0,
        });
    }
};
const parse = (input) => {
    const nums = input.replace(/,/g, "").trim();
    if (/^\d+(\.(\d+)?)?$/.test(nums)) return Number(nums);
    return nums === "" ? null : Number.NaN;
};
const format = (value) => {
    if (value === null) return "";
    return value.toLocaleString("en-US");
};
const optJenis =  [
  { label: "MOBIL PENUMPANG", value: "MOBIL PENUMPANG" },
  { label: "SEPEDA MOTOR", value: "SEPEDA MOTOR" },
  { label: "MOBIL BUS", value: "MOBIL BUS" },
  { label: "MOBIL BARANG", value: "MOBIL BARANG" },
  { label: "KENDARAAN KHUSUS", value: "KENDARAAN KHUSUS" },
  { label: "KERETA API", value: "KERETA API" },
  { label: "KENDARAAN BERBASIS ENERGI TERBARUKAN", value: "KENDARAAN BERBASIS ENERGI TERBARUKAN" }
];
</script>
