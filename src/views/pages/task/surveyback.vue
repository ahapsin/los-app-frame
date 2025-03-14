<template>
    <blacklist-alert :pesan="bl_pesan" />
    <n-scrollbar x-scrollable>
      <n-space class="bg-white border rounded-xl p-4 mb-2">
        <n-steps
          :current="current"
          :status="currentStatus"
          v-model:current="current"
        >
          <n-step title="Informasi Order" />
          <n-step title="Data Pelanggan" />
          <n-step title="Data Jaminan" />
          <n-step title="Data Survey" />
        </n-steps>
      </n-space>
    </n-scrollbar>
    <n-space vertical class="">
      <n-form
        ref="formRef"
        :model="pelanggan"
        :rules="rules"
        :label-placement="width <= 920 ? 'top' : 'top'"
        require-mark-placement="right-hanging"
        :size="size"
        label-width="auto"
      >
        <n-card
          v-show="current == 1"
          title="Informasi Kredit"
          :segmented="{
            content: true,
            footer: 'soft',
          }"
        >
          <div
            v-show="jaminan.nilai != '' && order.plafond > jaminan.nilai * 0.5"
            class="pb-4"
          >
            <n-alert title="Info" type="info">
              Plafon > Harga Taksasi
              <b>{{ (jaminan.nilai * 0.5).toLocaleString("US") }}</b></n-alert
            >
          </div>
          <n-space>
            <n-form-item label="Plafond" path="plafond">
              <n-input-number
                :parse="parse"
                :format="format"
                v-model:value="order.plafond"
                placeholder="plafond"
                :show-button="false"
                class="flex !w-full"
                :on-update:value="handlePlafond"
                :loading="loading"
              />
            </n-form-item>
            <n-form-item label="Jenis Angsuran" path="jenis">
              <n-select
                filterable
                placeholder="Jenis Angsuran"
                :options="jenisAngsuran"
                v-model:value="order.jenis_angsuran"
                :on-update:value="handleTipe"
                :disabled="order.plafond != 0 ? false : true"
              />
            </n-form-item>
          </n-space>
          <n-space>
            <n-form-item label="Tenor / Angsuran" path="tenor">
              <div
                class="flex flex-col md:flex-row"
                v-show="tipeAngsuran == 'bulanan'"
              >
                <n-radio-group v-model:value="order.tenor" name="radiogroup">
                  <n-radio @change="handleChange" name="tenor" value="6">
                    6 bulan<n-text code>
                      {{
                        skemaAngsuran.length == null
                          ? ` /
                      ${skemaAngsuran.tenor_6.angsuran.toLocaleString("US")}`
                          : ""
                      }}
                    </n-text>
                  </n-radio>
                  <n-divider vertical />
                  <n-radio name="tenor" @change="handleChange" value="12">
                    12 bulan<n-text code>
                      {{
                        skemaAngsuran.length == null
                          ? ` /
                      ${skemaAngsuran.tenor_12.angsuran.toLocaleString("US")}`
                          : ""
                      }}
                    </n-text>
                  </n-radio>
                  <n-divider vertical />
                  <n-radio name="tenor" @change="handleChange" value="18">
                    18 bulan<n-text code>
                      {{
                        skemaAngsuran.length == null
                          ? ` /
                      ${skemaAngsuran.tenor_18.angsuran.toLocaleString("US")}`
                          : ""
                      }}
                    </n-text>
                  </n-radio>
                  <n-divider vertical />
                  <n-radio name="tenor" @change="handleChange" value="24">
                    24 bulan<n-text code>
                      {{
                        skemaAngsuran.length == null
                          ? ` /
                      ${skemaAngsuran.tenor_24.angsuran.toLocaleString("US")}`
                          : ""
                      }}
                    </n-text>
                  </n-radio>
                </n-radio-group>
              </div>
              <div
                class="flex flex-col md:flex-row"
                v-show="tipeAngsuran == 'musiman'"
              >
                <n-radio-group v-model:value="order.tenor" name="radiogroup">
                  <n-radio @change="handleChange" name="tenor" value="3">
                    1x 3 bulan<n-text code>
                      {{
                        skemaAngsuran.length == null
                          ? ` /
                      ${skemaAngsuran.tenor_6.angsuran.toLocaleString("US")}`
                          : ""
                      }}
                    </n-text>
                  </n-radio>
                  <n-divider vertical />
                  <n-radio name="tenor" @change="handleChange" value="6">
                    1 x 6 bulan<n-text code>
                      {{
                        skemaAngsuran.length == null
                          ? ` /
                      ${skemaAngsuran.tenor_12.angsuran.toLocaleString("US")}`
                          : ""
                      }}
                    </n-text>
                  </n-radio>
                  <n-divider vertical />
                  <n-radio name="tenor" @change="handleChange" value="12">
                    2 x 12 bulan<n-text code>
                      {{
                        skemaAngsuran.length == null
                          ? ` /
                      ${skemaAngsuran.tenor_18.angsuran.toLocaleString("US")}`
                          : ""
                      }}
                    </n-text>
                  </n-radio>
                  <n-divider vertical />
                  <n-radio name="tenor" @change="handleChange" value="18">
                    3 x 18 bulan<n-text code>
                      {{
                        skemaAngsuran.length == null
                          ? ` /
                      ${skemaAngsuran.tenor_24.angsuran.toLocaleString("US")}`
                          : ""
                      }}
                    </n-text>
                  </n-radio>
                </n-radio-group>
              </div>
            </n-form-item>
            <n-form-item label="Tujuan Kredit" path="tujuan_kredit">
              <n-select
                filterable
                placeholder="Tujuan Kredit"
                :options="tujuanKredit"
                v-model:value="order.tujuan_kredit"
              />
            </n-form-item>
          </n-space>
        </n-card>
        <n-card
          v-show="current == 2"
          title="Data Pelanggan"
          :segmented="{
            content: true,
            footer: 'soft',
          }"
        >
          <div class="md:flex gap-2">
            <n-form-item label="No KTP" path="no_ktp" class="w-full">
              <n-input
                :show-button="false"
                placeholder="NO KTP"
                v-model:value="pelanggan.no_ktp"
                :loading="loadingKTP"
                @change="handleKtp"
                class="w-full"
                maxlength="16"
                clearable
              />
            </n-form-item>
            <n-form-item label="Kategori Kredit" path="no_ktp" class="w-full">
              <n-select
                filterable
                placeholder="Kategori Kredit"
                :options="optKategori"
                default-value="Baru"
                v-model:value="order.category"
                disabled
              />
            </n-form-item>
            <n-form-item label="No KK" path="no_kk" class="w-full">
              <n-input
                placeholder="No Kartu Keluarga"
                v-model:value="pelanggan.no_kk"
                maxlength="16"
              />
            </n-form-item>
          </div>
          <div class="md:flex gap-2">
            <n-form-item label="Nama" path="nama" class="w-full">
              <n-input
                placeholder="Nama"
                v-model:value="pelanggan.nama"
                @input="upCase"
              />
            </n-form-item>
            <n-form-item label="Tanggal lahir" path="tgl_lahir" class="w-full">
              <div class="w-full">
                <n-alert
                  title="Informasi"
                  type="warning"
                  closable
                  :bordered="bordered"
                  v-if="notifUsia"
                >
                  {{ noteUsia }}</n-alert
                >
                <n-date-picker
                  placeholder="Tanggal Lahir"
                  class="w-full"
                  v-model:formatted-value="pelanggan.tgl_lahir"
                  value-format="yyyy-MM-dd"
                  format="dd-MM-yyyy"
                  type="date"
                  @update:value="handleTanggalLahir"
                />
              </div>
            </n-form-item>
            <n-form-item label="No Handphone" path="hp" class="w-full">
              <n-input
                placeholder="No Handphone"
                v-model:value="pelanggan.no_hp"
              />
            </n-form-item>
          </div>
          <div class="flex flex-col md:flex-row gap-2 gap-x-2">
            <n-form-item
              label="Alamat"
              path="alamat"
              class="w-full"
              @input="upCase"
            >
              <n-input
                placeholder="Alamat"
                v-model:value="pelanggan.alamat"
                class="w-full"
              />
            </n-form-item>
            <n-form-item path="alamat" class="w-full">
              <n-input-group>
                <n-input placeholder="RT" v-model:value="pelanggan.rt" />
                <n-input placeholder="RW" v-model:value="pelanggan.rw" />
              </n-input-group>
            </n-form-item>
          </div>
          <n-divider title-placement="left"> Upload Dokumen Identitas </n-divider>
  
          <div class="flex flex-col md:flex-row gap-2">
            <file-upload
              title="KTP"
              endpoint="image_upload_prospect"
              type="ktp"
              :idapp="dynamicForm.id"
            />
            <file-upload
              title="KK"
              endpoint="image_upload_prospect"
              type="kk"
              :idapp="dynamicForm.id"
            />
            <file-upload
              title="KTP Pasangan"
              endpoint="image_upload_prospect"
              type="ktp_pasangan"
              :idapp="dynamicForm.id"
            />
          </div>
        </n-card>
        <n-card
          v-show="current == 3"
          class="flex"
          title="Data Jaminan"
          :segmented="{
            content: true,
            footer: 'soft',
          }"
        >
          <div
            v-show="jaminan.nilai != '' && order.plafond > jaminan.nilai * 0.5"
            class="pb-4"
          >
            <n-alert title="Info" type="info">
              Plafon > Harga Taksasi
              <b>{{ (jaminan.nilai * 0.5).toLocaleString("US") }}</b></n-alert
            >
          </div>
          <div>
            <taksasi-select-state
              v-model:brand="jaminan.merk"
              v-model:tipe="jaminan.tipe"
              v-model:tahun="jaminan.tahun"
              v-model:pasar="jaminan.nilai"
            />
          </div>
          <div class="md:flex gap-2">
            <n-form-item label="NO Polisi" path="no_polisi" class="w-full">
              <n-input
                placeholder="No Polisi"
                v-model:value="jaminan.no_polisi"
              />
            </n-form-item>
            <n-form-item label="Warna" path="warna" class="w-full">
              <n-input placeholder="warna" v-model:value="jaminan.warna" />
            </n-form-item>
            <n-form-item label="Tanggal Berlaku STNK" path="order" class="w-full">
              <n-date-picker
                placeholder="Tanggal Berlaku STNK"
                v-model:formatted-value="jaminan.tgl_stnk"
                value-format="yyyy-MM-dd"
                format="dd-MM-yyyy"
                type="date"
                class="w-full"
              />
            </n-form-item>
          </div>
          <n-divider title-placement="left"> Upload Dokumen Jaminan </n-divider>
  
          <div class="flex flex-col md:flex-row gap-2">
            <file-upload
              title="No Rangka"
              endpoint="image_upload_prospect"
              type="no_rangka"
              :idapp="dynamicForm.id"
            />
            <file-upload
              title="No Mesin"
              endpoint="image_upload_prospect"
              type="no_mesin"
              :idapp="dynamicForm.id"
            />
            <file-upload
              title="STNK"
              endpoint="image_upload_prospect"
              type="stnk"
              :idapp="dynamicForm.id"
            />
          </div>
          <n-divider title-placement="left"> Upload Jaminan </n-divider>
          <n-space>
            <file-upload
              title="Depan"
              endpoint="image_upload_prospect"
              type="depan"
              :idapp="dynamicForm.id"
            />
            <file-upload
              title="Belakang"
              endpoint="image_upload_prospect"
              type="belakang"
              :idapp="dynamicForm.id"
            />
            <file-upload
              title="Kanan"
              endpoint="image_upload_prospect"
              type="kanan"
              :idapp="dynamicForm.id"
            />
            <file-upload
              title="Kiri"
              endpoint="image_upload_prospect"
              type="kiri"
              :idapp="dynamicForm.id"
            />
          </n-space>
        </n-card>
        <n-card
          v-show="current == 4"
          title="Data Survey"
          :segmented="{
            content: true,
            footer: 'soft',
          }"
        >
          <div class="flex gap-4">
            <n-form-item label="Tanggal survey" path="tgl_survey" class="w-full">
              <n-date-picker
                placeholder="Tanggal Survey"
                class="w-full"
                v-model:formatted-value="survey.tgl_survey"
                disabled
                value-format="yyyy-MM-dd"
                format="dd-MM-yyyy"
                type="date"
              />
            </n-form-item>
            <n-form-item label="Lama Bekerja" path="lama_berkerja" class="w-full">
              <n-input
                placeholder="lama bekerja"
                v-model:value="survey.lama_bekerja"
                class="w-full"
              >
                <template #suffix> bulan </template>
              </n-input>
            </n-form-item>
          </div>
          <div class="md:flex gap-4">
            <n-form-item
              label="Pendapatan pelanggan "
              path="pendapatan"
              class="w-full"
            >
              <n-input-number
                class="flex w-full"
                :parse="parse"
                :format="format"
                v-model:value="survey.penghasilan.pribadi"
                placeholder="pendapatan pelanggan"
                :show-button="false"
              >
                <template #suffix> perbulan </template>
              </n-input-number>
            </n-form-item>
            <n-form-item
              label="Pendapatan Pasangan"
              path="pendapatan"
              class="w-full"
            >
              <n-input-number
                class="flex w-full"
                :parse="parse"
                :format="format"
                v-model:value="survey.penghasilan.pasangan"
                placeholder="pendapatan pasangan"
                :show-button="false"
              >
                <template #suffix> perbulan </template>
              </n-input-number>
            </n-form-item>
            <n-form-item
              label="Pendapatan Lainnya"
              path="pendapatan"
              class="w-full"
            >
              <n-input-number
                class="flex w-full"
                :parse="parse"
                :format="format"
                v-model:value="survey.penghasilan.lainnya"
                placeholder="pendapatan lain-lain"
                :show-button="false"
              >
                <template #suffix> perbulan </template>
              </n-input-number>
            </n-form-item>
            <n-form-item label="Pengeluaran" path="pengeluaran" class="w-full">
              <n-input-number
                :parse="parse"
                :format="format"
                class="w-full"
                v-model:value="survey.pengeluaran"
                placeholder="pengeluaran"
                :show-button="false"
              >
                <template #suffix> perbulan </template>
              </n-input-number>
            </n-form-item>
          </div>
          <div class="flex gap-4">
            <n-form-item label="Pekerjaan" path="pekerjaan" class="w-full">
              <n-select
                filterable
                placeholder="pekerjaan"
                counter
                :options="optSektor"
                v-model:value="survey.sektor"
              />
            </n-form-item>
          </div>
          <n-form-item label="Catatan Survey" path="cat_survey">
            <n-input
              v-model:value="survey.catatan_survey"
              @input="upCase"
              type="textarea"
              placeholder="catatan survey"
              autosize
            />
          </n-form-item>
          <n-divider title-placement="left"> Dokumen Pendukung </n-divider>
          <file-upload
            :def_preview="true"
            title="dokumen pendukung"
            endpoint="image_upload_prospect"
            type="other"
            :idapp="dynamicForm.id"
          />
        </n-card>
      </n-form>
      <n-flex justify="between">
        <n-button @click="prev" type="secondary" v-if="current > 1">
          <template #icon>
            <n-icon>
              <arrow-back />
            </n-icon>
          </template>
          kembali
        </n-button>
        <n-button @click="next" type="primary" v-if="current < 4">
          <template #icon>
            <n-icon>
              <arrow-forward />
            </n-icon>
          </template>
          Selanjutnya
        </n-button>
        <n-button
          :loading="loading"
          icon-placement="left"
          type="primary"
          @click="handleSave"
          v-else
        >
          simpan
        </n-button>
      </n-flex>
    </n-space>
  </template>
  <script setup>
  import { ref, reactive } from "vue";
  import { v4 as uuidv4 } from "uuid";
  import {
    ArrowBackOutlined as ArrowBack,
    ArrowForwardOutlined as ArrowForward,
  } from "@vicons/material";
  import { useMessage } from "naive-ui";
  import router from "../../../router";
  import { useWindowSize } from "@vueuse/core";
  import { useApi } from "../../../helpers/axios";
  import { useBlacklist } from "../../../helpers/blacklist";
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
  const diffState = ref();
  const refAdmin = async (body) => {
    skemaAngsuran.value = [];
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
  const currentStatus = ref("process");
  const next = () => (current.value += 1);
  const prev = () => (current.value -= 1);
  const tujuanKredit = ["konsumsi", "investasi"].map((v) => ({
    label: v,
    value: v,
  }));
  const jenisAngsuran = ["Bulanan", "Musiman"].map((v) => ({
    label: v,
    value: v.toLowerCase(),
  }));
  const optKategori = ["Baru", "RO"].map((v) => ({
    label: v,
    value: v,
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
  const order = ref({
    tujuan_kredit: null,
    plafond: null,
    tenor: null,
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
  const jaminan = ref({
    tipe: null,
    tahun: null,
    merk: "",
    warna: "",
    atas_nama: "",
    no_polisi: "",
    no_rangka: "",
    no_mesin: "",
    no_bpkb: "",
    no_stnk: "",
    nilai: "",
  });
  var dt = new Date();
  let year = dt.getFullYear();
  let month = (dt.getMonth() + 1).toString().padStart(2, "0");
  let day = dt.getDate().toString().padStart(2, "0");
  const survey = reactive({
    lama_bekerja: "",
    penghasilan: {
      pribadi: "",
      pasangan: "",
      lainnya: "",
    },
    pengeluaran: "",
    usaha: "",
    sektor: "",
    catatan_survey: "",
    tgl_survey: `${year}-${month}-${day}`,
  });
  const dynamicForm = reactive({
    id: uuid,
    order: order.value,
    data_nasabah: pelanggan,
    data_survey: survey,
    jaminan_kendaraan: [jaminan.value],
  });
  const handlePlafond = (e) => {
    order.value.plafond = e;
    const body = {
      plafond: e,
      jenis_angsuran: order.value.jenis_angsuran,
    };
    refAdmin(body);
  };
  const loadingKTP = ref(false);
  const bl_pesan = ref();
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
      let data = response.data;
      if (data.length > 0) {
        order.value.category = "RO";
        Object.assign(pelanggan, data[0]);
      } else {
        order.value.category = "Baru";
        loadingKTP.value = false;
        Object.assign(pelanggan, initPelanggan);
      }
      loadingKTP.value = false;
    }
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
  const noteUsia = ref(false);
  const handleTanggalLahir = (e) => {
    var month_diff = Date.now() - e;
    var age_dt = new Date(month_diff);
    var year = age_dt.getUTCFullYear();
    var age = Math.abs(year - 1970);
    if (age > 19 && age < 60) {
      notifUsia.value = false;
    } else {
      if (age < 19) {
        notifUsia.value = true;
        noteUsia.value = `usia ${age} tahun, usia < dari 19 Tahun`;
      } else if (age > 60) {
        notifUsia.value = true;
        noteUsia.value = `usia ${age} tahun, usia > dari 60 Tahun`;
      }
    }
  };7
  const handleSave = async (e) => {
    e.preventDefault(e);
    loading.value = true;
    const response = await useApi({
      method: "POST",
      api: "kunjungan",
      data: dynamicForm,
      token: userToken,
    });
    if (!response.ok) {
      message.error("data gagal disimpan");
      loading.value = false;
    } else {
      message.success("data berhasil disimpan");
      loading.value = false;
      router.push("/task/survey");
    }
  };
  
  const tahunJaminanValidate = () => {
    let tahun = new Date().getFullYear();
    let diff = tahun - jaminan.value.tahun;
    diffState.value = 2;
    return diff <= 10;
  };
  const rules = {
    tahun_jaminan: {
      message: `jumlah tahun lebih dari 10 Tahun`,
      validator: tahunJaminanValidate,
      trigger: ["blur"],
    },
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
    plafond: {
      trigger: "blur",
      required: true,
      message: "plafond harus diisi",
    },
    tujuan_kredit: {
      trigger: "blur",
      required: true,
      min: 16,
      message: "No Kartu Keluarga minimal 16 karakter",
    },
    nama: {
      trigger: "blur",
      required: true,
      min: 16,
      message: "No Kartu Keluarga minimal 16 karakter",
    },
    tgl_lahir: {
      trigger: "blur",
      required: true,
      min: 16,
      message: "No Kartu Keluarga minimal 16 karakter",
    },
    hp: {
      trigger: "blur",
      required: true,
      min: 16,
      message: "No Kartu Keluarga minimal 16 karakter",
    },
  };
  
  const upCase = () => {
    pelanggan.nama = pelanggan.nama.toUpperCase();
    pelanggan.alamat = pelanggan.alamat.toUpperCase();
    survey.catatan_survey = survey.catatan_survey.toUpperCase();
  };
  </script>
  