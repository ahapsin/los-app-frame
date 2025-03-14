<template>
  <n-scrollbar style="max-height: 400px">
  <div>
        <n-form ref="formOrder" :model="order" :rules="rulesOrder" require-mark-placement="right-hanging">
          <div class="md:flex gap-2">
            <n-form-item label="Plafond" path="plafond" class="w-full">
              <n-input-number :parse="parse" :format="format" :min="999999" v-model:value="order.plafond"
                              placeholder="plafond" :loading="loading" :show-button="false" class="flex !w-full"
                              clearable :on-update:value="handlePlafond" />
            </n-form-item>
            <n-form-item label="Jenis Angsuran" path="jenis_angsuran" class="w-full">
              <n-select filterable placeholder="Jenis Angsuran" :options="jenisAngsuran"
                        v-model:value="order.jenis_angsuran" :on-update:value="handleTipe"
                        :disabled="order.plafond != 0 ? false : true" />
            </n-form-item>
          </div>
          <div class="md:flex gap-2">
            <n-form-item label="Tenor " path="tenor" class="w-full">
              <n-select :options="tenor" label-field="label" value-field="value"
                        v-model:value="order.tenor" />
            </n-form-item>
            <n-form-item label="Bunga " path="bunga" class="w-full">
              <div class="flex gap-2">
                <n-input-number :show-button="false" v-model:value="order.bunga" :min="0" :max="100">
                  <template #suffix>% /bulan</template>
                </n-input-number>
                <n-input pacleholder="tahunan" v-model:value="order.bunga_tahunan" :min="1" :max="100"
                         readonly>
                  <template #suffix>% / tahun</template>
                </n-input>
              </div>
            </n-form-item>
            <n-form-item label="Angsuran " path="angsuran" class="w-full">
              <n-input-number class="w-full" readonly :parse="parse" :format="format"
                              v-model:value="order.angsuran" placeholder="angsuran" :show-button="false" />
            </n-form-item>
            <n-form-item label="Tujuan Kredit" path="tujuan_kredit" class="w-full">
              <n-select filterable placeholder="Tujuan Kredit" :options="tujuanKredit"
                        v-model:value="order.tujuan_kredit" />
            </n-form-item>
          </div>
        </n-form>
      </div>
  </n-scrollbar>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import { v4 as uuidv4 } from "uuid";
import {
  ArrowBackOutlined as ArrowBack,
  AddFilled as AddIcon,
  EditOutlined as EditIcon,
  DeleteOutlineFilled as DeleteIcon,
  ArrowForwardOutlined as ArrowForward,

} from "@vicons/material";
import { useMessage } from "naive-ui";
import { useWindowSize } from "@vueuse/core";

import _ from "lodash";
import { computed } from "vue";
// import JaminanBillyet from "./survey/JaminanBillyet.vue";
// import JaminanEmas from "./survey/JaminanEmas.vue";
const { width } = useWindowSize();
const message = useMessage();
const uuid = uuidv4();
const current = ref(1);
const loading = ref(false);
const tipeAngsuran = ref("bulanan");
const skemaAngsuran = ref([]);
const tenor6 = ref([]);
const tenor12 = ref([]);
const tenor18 = ref([]);
const tenor24 = ref([]);
const refAdmin = async (body) => {
  loading.value = true;
  const response = await useApi({
    method: "post",
    api: "fee_survey",
    data: body,
    token: userToken,
  });
  if (!response.ok) {
    console.log(reponse.error);
  } else {
    loading.value = false;
    skemaAngsuran.value = response.data;
    tenor6.value = response.data.tenor_6;
    tenor12.value = response.data.tenor_12;
    tenor18.value = response.data.tenor_18;
    tenor24.value = response.data.tenor_24;
  }
};

const userToken = localStorage.getItem("token");
const formOrder = ref(null);
const formPelanggan = ref(null);


const showModal = ref(false);


const anyJaminan = ref([]);
const receivedData = ref(null);

const dataProp = ref({});

const handleChildData = (data) => {
  receivedData.value = data;

};

const addJaminan = () => {
  dataProp.value = null;
  showModal.value = true;
}

const ubahJaminan = () => {
  showModal.value = false;
  message.success(`jaminan diubah`);
}

const statusInformasiOrder = ref(null);
const statusDataPelanggan = ref(null);
const statusDataJaminan = ref(null);
const statusDataSurvey = ref(null);

const prev = () => (current.value -= 1);
const tujuanKredit = ["KONSUMSI", "INVESTASI"].map((v) => ({
  label: v,
  value: v,
}));
const jenisAngsuran = ["BULANAN", "MUSIMAN"].map((v) => ({
  label: v,
  value: v.toLowerCase(),
}));
const optKategori = ["BARU", "RO"].map((v) => ({
  label: v,
  value: v,
}));
const optJaminan = ["KENDARAAN", "SERTIFIKAT", "DEPOSITO", "KTA"].map((v) => ({
  label: v,
  value: v.toLowerCase(),
}));
const optSektor = [
  "BURUH HARIAN LEPAS",
  "BURUH PABRIK",
  "GURU",
  "MENGURUS RUMAH TANGGA",
  "NELAYAN",
  "PEDAGANG",
  "PEDAGANG KELONTONG",
  "PEDAGANG MAKANAN",
  "PEGAWAI SWASTA",
  "PELAJAR",
  "PETANI / PEKEBUN",
  "PNS",
  "SOPIR",
  "WIRASWASTA",
].map((v) => ({
  label: v,
  value: v,
}));
const order = reactive({
  tujuan_kredit: null,
  plafond: null,
  tenor: 6,
  bunga: 0,
  bunga_tahunan: computed(() => (order.bunga * 12).toFixed(2)),
  angsuran: computed(() => (Math.round((order.plafond * order.bunga / 100) * order.tenor + order.plafond) / order.tenor)),
  category: null,
  jenis_angsuran: "bulanan",
});
const initPelanggan = {
  no_kk: "",
  nama: "",
  no_hp: "",
  tgl_lahir: null,
  name: "",
  alamat: "",
  rt: "",
  rw: "",
  provinsi: "",
  kota: "",
  kecamatan: "",
  kelurahan: "",
};
const pelanggan = reactive({ ...initPelanggan });
var dt = new Date();
let year = dt.getFullYear();
let month = (dt.getMonth() + 1).toString().padStart(2, "0");
let day = dt.getDate().toString().padStart(2, "0");
const survey = reactive({
  lama_bekerja: "",
  penghasilan_pribadi: null,
  penghasilan_pasangan: null,
  penghasilan_lainnya: null,
  pengeluaran: null,
  usaha: "",
  sektor: "",
  catatan_survey: "",
  tgl_survey: `${year}-${month}-${day}`,
});
const dynamicForm = reactive({
  id: uuid,
  flag: false,
  order: order.value,
  data_nasabah: pelanggan,
  data_survey: survey,

});
const handlePlafond = (e) => {
  order.plafond = e;
  const body = {
    plafond: e,
    jenis_angsuran: order.jenis_angsuran,
  };
  refAdmin(body);
};
const steps = [
  "Informasi Order",
  "Data Pelanggan",
  "Data Jaminan",
  "Data Survey",
];
const currentStatus = ref("process");
const loadingKTP = ref(false);
const bl_pesan = ref();

const dataRo = ref();
const jaminan = ref();

const findDocByType = (c, e) => {
  const docPath = ref(_.find(c, { TYPE: e }));
  if (docPath.value) return docPath.value.PATH;
};
const handleTipe = (e) => {
  tipeAngsuran.value = e;
  order.value.jenis_angsuran = e;
  const body = {
    plafond: order.value.plafond,
    jenis_angsuran: e,
  };
  refAdmin(body);
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
const notifUsia = ref(false);
const noteUsia = ref();
const handleTanggalLahir = (e) => {
  notifUsia.value = true;
  var month_diff = new Date().getTime() - e;
  var currentAge = month_diff / 31557600000;
  let flor = Math.floor(currentAge);
  if (flor > 19 && flor < 60) {
    notifUsia.value = false;
    noteUsia.value = flor;
  } else {
    if (flor < 19) {
      notifUsia.value = true;
      noteUsia.value = `usia ${flor} tahun, usia < dari 19 Tahun`;
    } else {
      notifUsia.value = true;
      noteUsia.value = `usia ${flor} tahun, usia > dari 60 Tahun`;
    }
  }
};
const formSurvey = ref(null);
const handleSendButton = ref(true);
const validCheck = ref(true);
const handleValid = async (type) => {

  await formOrder.value?.validate((errors) => {
    if (errors) {
      validCheck.value = true;
      message.error("periksa kembali isian informasi order");
      statusInformasiOrder.value = "error";
    } else {
      validCheck.value = false;
      statusInformasiOrder.value = "finish";
    }
  });

  await formPelanggan.value?.validate((errors) => {
    if (errors) {
      message.error("periksa kembali isian data pelanggan");
      statusDataPelanggan.value = "error";
      validCheck.value = true;
    } else {
      statusDataPelanggan.value = "finish";
      validCheck.value = false;
    }
  });


  await formSurvey.value?.validate((errors) => {
    if (errors) {
      message.error("periksa kembali isian data survey");
      statusDataSurvey.value = "error";
      validCheck.value = true;
    } else {
      statusDataSurvey.value = "finish";
      validCheck.value = false;

    }
  });
  handleSave(type);

}
const endForm = () => {
  formSurvey.value?.validate((errors) => {
    if (errors) {
      message.error("periksa kembali isian anda");
      statusDataSurvey.value = "error";
    } else {
      handleSendButton.value = false;
    }
  });
}
const handleSave = async (type) => {
  if (type === 'send') {
    dynamicForm.flag = true
  }
  loading.value = true;
  const response = await useApi({
    method: "POST",
    api: "kunjungan",
    data: dynamicForm,
    token: userToken,
  });
  if (!response.ok) {
    message.error("data gagal diubah");
    loading.value = false;
  } else {
    message.success("data berhasil disimpan");
    loading.value = false;
    router.push({ name: 'survey' });
  }
};
const plafondValidator = (rule, value) => {
  return value >= 1000000;
};
const numberValidator = (rule, value) => {
  return value > 0;
};
const rulesOrder = {
  plafond: {
    trigger: "blur",
    validator: plafondValidator,
    message: "plafond minimal lebih dari 1.000.000",
  },
  jenis_angsuran: {
    trigger: "blur",
    required: true,
    message: "jenis angsuran harus dipilih",
  },

  bunga: {
    trigger: "blur",
    required: true,
    message: "bunga wajib diisi",
  },
  tujuan_kredit: {
    trigger: "blur",
    required: true,
    message: "tujuan kredit harus dipilih",
  },
};
const rulesPelanggan = {
  no_ktp: {
    trigger: "blur",
    required: true,
    min: 16,
    message: "No identitas minimal 16 karakter",
  },
  no_kk: {
    trigger: "blur",
    required: true,
    min: 16,
    message: "No Kartu Keluarga minimal 16 karakter",
  },
  nama: {
    trigger: "blur",
    required: true,
    message: "Nama harus diisi",
  },
  tgl_lahir: {
    trigger: "blur",
    required: true,
    message: "Tanggal lahir harus diisi",
  },
  no_hp: {
    trigger: "blur",
    required: true,
    message: "No HP harus diisi",
  },
  alamat: {
    trigger: "blur",
    required: true,
    message: "Alamat harus diisi",
  },
};
const modelKendaraan = ['merk', 'tipe', 'tahun', 'no_polisi', 'nilai', 'warna', 'tgl_stnk'];
const modelSertifikat = ['no_sertifikat', 'imb', 'kepemilikan', 'luas_tanah', 'luas_bangunan', 'nilai', 'atas_nama'];

const rulesSurvey = {
  catatan_survey: {
    trigger: "blur",
    required: true,
    message: " harus diisi",
  },
  lama_bekerja: {
    trigger: "blur",
    required: true,
    message: "harus diisi",
  },
  pendapatan_pribadi: {
    trigger: "blur",
    required: true,
    validator: numberValidator,
    message: "harus diisi",
  },
  pengeluaran: {
    trigger: "blur",
    required: true,
    validator: numberValidator,
    message: "harus diisi",
  },

};
const tenor = [6, 12, 18, 24, 36, 48, 60].map((i) => ({
  value: i,
  label: `${i} Bulan`
}))
const isRtl = true;
const onlyAllowNumber = (value) => !value || /^\d+$/.test(value);
</script>
