<template>
  <n-scrollbar style="max-height: 400px">
    <div>
      <n-alert type="error" v-if="statusDataJaminan === 'error'">minimal memiliki 1 jaminan</n-alert>
      <n-card embedded :segmented="true">
        <div class="flex gap-2 items-center justify-around">
          <n-statistic label="Jumlah Jaminan">
            {{ jaminanStore.listJaminan.length }}
          </n-statistic>
          <n-statistic label="Total Nilai Jaminan">
            {{ sumJaminan.toLocaleString('US') }}
          </n-statistic>
          <div class=" flex w-60 gap-2">
            <n-select v-model:value="jenisJaminan" :options="optJaminan" placeholder="jenis jaminan"/>
            <n-button circle type="primary" @click="addJaminan">
              <n-icon>
                <add-icon/>
              </n-icon>
            </n-button>
          </div>
        </div>
        <n-card :segmented="true" class="my-2 bg-white rounded-xl border hover:shadow"
                v-for="(coll) in orderJaminan" :key="coll" :title="coll.type">
          <template #header-extra>
            <div class="flex gap-2">
              <n-button type="warning" @click="viewModal(coll)" secondary>
                <n-icon>
                  <edit-icon/>
                </n-icon>
                ubah
              </n-button>
              <n-popconfirm @positive-click="removeJaminan(coll.id)"
                            @negative-click="handleNegativeClick" positive-text="ya" negative-text="tidak">
                <template #trigger>
                  <n-button type="error" secondary>
                    <n-icon>
                      <delete-icon/>
                    </n-icon>
                    hapus
                  </n-button>
                </template>
                Apakah yakin ingin menghapus ?
              </n-popconfirm>

            </div>
          </template>
          <div>
            <div>
              <div class="pt-2">
                <n-descriptions v-if="coll.type === 'kendaraan'"
                                :label-placement="width < 720 ? 'left' : 'top'" bordered
                                :column="width < 720 ? 1 : 8">
                  <n-descriptions-item v-for="item in modelKendaraan" :key="item"
                                       :label="item.toUpperCase()">
                    <b>{{
                        item === 'nilai' ? coll.atr[item].toLocaleString('US') :
                            coll.atr[item] ? coll.atr[item] : '--'
                      }}</b>
                  </n-descriptions-item>
                </n-descriptions>
                <n-descriptions v-if="coll.type === 'sertifikat'"
                                :label-placement="width < 720 ? 'left' : 'top'" bordered
                                :column="width < 720 ? 1 : 8">
                  <n-descriptions-item v-for="item in modelSertifikat" :key="item"
                                       :label="item.toUpperCase()">
                    <b>{{
                        item === 'nilai' ? coll.atr[item].toLocaleString('US') :
                            coll.atr[item] ? coll.atr[item] : '--'
                      }}</b>
                  </n-descriptions-item>
                </n-descriptions>
              </div>
              <div>
                <div v-if="coll.type == 'kendaraan'">
                  <n-divider title-placement="left"> UPLOAD DOKUMEN JAMINAN</n-divider>
                  <div class="flex flex-col md:flex-row gap-2">

                    <file-upload :reff="coll.counter_id" title="No Rangka"
                                 endpoint="image_upload_prospect" :type="`no_rangka`"
                                 :idapp="dynamicForm.id"
                                 :def_value="findDocByType(coll.atr.document, 'no_rangka')"/>
                    <file-upload :reff="coll.counter_id" title="No Mesin"
                                 :def_value="findDocByType(coll.atr.document, 'no_mesin')"
                                 endpoint="image_upload_prospect" :type="`no_mesin`"
                                 :idapp="dynamicForm.id"/>
                    <file-upload :reff="coll.counter_id" title="STNK"
                                 :def_value="findDocByType(coll.atr.document, 'stnk')"
                                 endpoint="image_upload_prospect" :type="`stnk`"
                                 :idapp="dynamicForm.id"/>
                  </div>
                </div>
                <n-divider title-placement="left" class="uppercase"> Upload Dokumen {{ coll.type }}
                </n-divider>
                <div v-if="coll.type == 'kendaraan'" class="flex flex-col md:flex-row gap-2">
                  <file-upload title="Depan" endpoint="image_upload_prospect" :type="`depan`"
                               :idapp="dynamicForm.id" :reff="coll.counter_id"
                               :def_value="findDocByType(coll.atr.document, 'depan')"/>
                  <file-upload title="Belakang" :reff="coll.counter_id"
                               :def_value="findDocByType(coll.atr.document, 'belakang')"
                               endpoint="image_upload_prospect" :type="`belakang`"
                               :idapp="dynamicForm.id"/>
                  <file-upload title="Kanan" :reff="coll.counter_id"
                               endpoint="image_upload_prospect"
                               :def_value="findDocByType(coll.atr.document, 'kanan')" :type="`kanan`"
                               :idapp="dynamicForm.id"/>
                  <file-upload title="Kiri" :reff="coll.counter_id"
                               endpoint="image_upload_prospect" :type="`kiri`"
                               :def_value="findDocByType(coll.atr.document, 'kiri')"
                               :idapp="dynamicForm.id"/>
                </div>
                <div v-else class="flex flex-col w-full">
                  <file-upload :title="`dokumen`" :def_preview="true" :multi="true"
                               :data_multi="coll.atr.document" endpoint="image_upload_prospect"
                               :type="`sertifikat`" :reff="coll.counter_id" :idapp="dynamicForm.id"/>
                </div>
              </div>
            </div>

          </div>
        </n-card>
      </n-card>
    </div>
    <n-modal v-model:show="showModal">
      <n-card class="md:w-1/2" closable @close="showModal = false" :segmented="true"
              :title="`form ${jenisJaminan}`">
        <component :is="JaminanKendaraan" v-if="jenisJaminan.toLowerCase() == 'kendaraan'"
                   @childData="handleChildData" :def_data="dataProp"/>
        <component :is="JaminanSertifikat" v-if="jenisJaminan.toLowerCase() == 'sertifikat'"
                   @childData="handleChildData" :def_data="dataProp"/>
        <component :is="JaminanBillyet" v-if="jenisJaminan.toLowerCase() == 'deposito'"
                   @childData="handleChildData" :def_data="dataProp"/>
        <component :is="JaminanBillyet" v-if="jenisJaminan == 'billyet'" @childData="handleChildData"/>
        <component :is="JaminanEmas" v-if="jenisJaminan == 'emas'" @childData="handleChildData"/>
        <template #footer>
          <n-space>

            <n-button type="primary" @click="ubahJaminan(jenisJaminan)" v-if="dataProp">ubah</n-button>
            <n-button type="primary" @click="pushJaminan(jenisJaminan)" v-else
                      :disabled="!receivedData?.nilai">tambah
            </n-button>
            <n-button type="warning" @click="showModal = false">batal</n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>
  </n-scrollbar>
</template>
<script setup>
import {ref, reactive, onMounted} from "vue";
import {v4 as uuidv4} from "uuid";
import {
  ArrowBackOutlined as ArrowBack,
  AddFilled as AddIcon,
  EditOutlined as EditIcon,
  DeleteOutlineFilled as DeleteIcon,
  ArrowForwardOutlined as ArrowForward,

} from "@vicons/material";
import {useMessage} from "naive-ui";
import {useWindowSize} from "@vueuse/core";

import _ from "lodash";
import {computed} from "vue";
import {useJaminanStore} from "../../../../stores/jaminan";
import {useApi} from "../../../../helpers/axios";
import JaminanKendaraan from "../analisa/jaminan/JaminanKendaraan.vue";
import JaminanSertifikat from "../analisa/jaminan/JaminanSertifikat.vue";
import JaminanBillyet from "../analisa/jaminan/JaminanBillyet.vue";
import JaminanEmas from "../analisa/jaminan/JaminanEmas.vue";

const {width} = useWindowSize();
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

const jaminanStore = useJaminanStore();
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
const sumJaminan = computed(() => {
  return jaminanStore.listJaminan.reduce((sum, item) => sum + parseInt(item.atr?.nilai, 10), 0);
});
const orderJaminan = computed(() => _.orderBy(jaminanStore.listJaminan, 'counter_id', 'desc'));
const jenisJaminan = ref('kendaraan');
const viewModal = (e) => {
  let findData = _.findIndex(jaminanStore.listJaminan, {'counter_id': e.counter_id});
  let selectedData = jaminanStore.listJaminan[findData];
  jenisJaminan.value = e.type;
  dataProp.value = selectedData;
  showModal.value = !showModal.value;
}
const removeJaminan = (e) => {
  let index = _.findIndex(anyJaminan.value, {'id': e});
  anyJaminan.value.splice(index, 1);
  jaminanStore.removeJaminan(e);
}
const addJaminan = () => {
  dataProp.value = null;
  showModal.value = true;
}
const pushJaminan = (e) => {
  const randNumbTime = new Date().getTime();
  const newJaminan = {
    counter_id: randNumbTime,
    type: e,
    atr: receivedData.value,
  }
  jaminanStore.storeJaminan(newJaminan);
  showModal.value = false;
  message.success(`jaminan ${e} ditambahkan`);
}
const ubahJaminan = () => {
  showModal.value = false;
  message.success(`jaminan diubah`);
}

// const currentComponent = ref('JaminanKendaraan');
// const next = () => {
//   current.value += 1;
//   if (current.value === 1) {
//     formOrder.value?.validate((errors) => {
//       if (errors) {
//         message.error("periksa kembali isian anda");
//       } else {
//         current.value += 1;
//       }
//     });
//   } else if (current.value === 2) {
//     formPelanggan.value?.validate((errors) => {
//       if (errors) {
//         message.error("periksa kembali isian anda");
//       } else {

//         current.value += 1;
//       }
//     });
//   } else if (current.value === 3) {
//     current.value += 1;
//     // formJaminan.value?.validate((errors) => {
//     //   if (errors) {
//     //     message.error("periksa kembali isian anda");
//     //   } else {
//     // }
//     // });
//   }
// };
const statusInformasiOrder = ref(null);
const statusDataPelanggan = ref(null);
const statusDataJaminan = ref(null);
const statusDataSurvey = ref(null);
const next = () => {
  // if (current.value === 1) {
  //     formOrder.value?.validate((errors) => {
  //         if (errors) {
  //             message.error("periksa kembali isian anda");
  //             statusInformasiOrder.value = "error";
  //         } else {
  //             statusInformasiOrder.value = "finish";
  //         }
  //     });
  // } else if (current.value === 2) {
  //     formPelanggan.value?.validate((errors) => {
  //         if (errors) {
  //             message.error("periksa kembali isian anda");
  //             statusDataPelanggan.value = "error";
  //         }
  //         else {
  //             statusDataPelanggan.value = "finish";
  //         }
  //     });
  // }
  // else if (current.value === 3) {
  //     if (jaminanStore.listJaminan.length < 1) {
  //         message.error("minimal memiliki satu jaminan");
  //         statusDataJaminan.value = "error";
  //     } else {
  //         statusDataJaminan.value = "finish";
  //     }
  // }
  current.value += 1;
};
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
const pelanggan = reactive({...initPelanggan});
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
  jaminan: computed(() => jaminanStore.listJaminan),
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
const handleKtp = async (e) => {
  loadingKTP.value = true;
  const bodyForm = {
    no_ktp: e,
  };
  bl_pesan.value = await useBlacklist(e);
  const response = await useApi({
    method: "POST",
    api: "check_ro",
    data: bodyForm,
    token: userToken,
  });
  if (!response.ok) {
    loadingKTP.value = false;
  } else {
    dataRo.value = response.data;
    let data = response.data;
    if (data.length > 0) {
      console.log(data);
      jaminanStore.filledJaminan(data[0].jaminan);
      order.value.category = "RO";
      Object.assign(pelanggan, data[0]);
    } else {
      order.value.category = "Baru";
      loadingKTP.value = false;
      // Object.assign(pelanggan, initPelanggan);
    }
    loadingKTP.value = false;
  }
};

const findDocByType = (c, e) => {
  const docPath = ref(_.find(c, {TYPE: e}));
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

  if (jaminanStore.listJaminan.length < 1) {
    console.log(jenisJaminan);
    if (jenisJaminan.value === "kta") {
      statusDataJaminan.value = "finish";
      validCheck.value = false;
    } else {
      message.error("minimal memiliki satu jaminan");
      statusDataJaminan.value = "error";
      validCheck.value = true;
    }
  } else {
    statusDataJaminan.value = "finish";
    validCheck.value = false;

  }

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
    router.push({name: 'survey'});
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
onMounted(() => {
  jaminanStore.initJaminan();
});
</script>
