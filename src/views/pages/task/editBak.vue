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
    <n-space vertical>
      <pre>{{ pageData }}</pre>
      <n-form
        ref="formRef"
        :model="model"
        :rules="rules"
        :label-placement="width <= 920 ? 'top' : 'top'"
        require-mark-placement="right-hanging"
        :size="size"
        label-width="auto"
        :disabled="actionPage == 'view' ? true : false"
      >
        <n-card
          v-show="current == 1"
          title="Informasi Kredit"
          :segmented="{
            content: true,
            footer: 'soft',
          }"
        >
          <n-form-item label="Plafond" path="plafond">
            <n-input-number
              :parse="parse"
              :format="format"
              :placeholder="order.plafond"
              :show-button="false"
              class="flex !w-full"
              @update:value="handlePlafond"
              :loading="loading"
              v-model:value="order.plafond"
            />
          </n-form-item>
          <n-form-item label="Jenis Angsuran" path="jenis">
            <n-select
              filterable
              placeholder="Jenis Angsuran"
              :options="jenisAngsuran"
              v-model:value="order.jenis_angsuran"
              @update:value="handleTipe"
            />
          </n-form-item>
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
                                      ${skemaAngsuran.tenor_6.angsuran.toLocaleString(
                                        "US"
                                      )}`
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
                                      ${skemaAngsuran.tenor_12.angsuran.toLocaleString(
                                        "US"
                                      )}`
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
                                      ${skemaAngsuran.tenor_18.angsuran.toLocaleString(
                                        "US"
                                      )}`
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
                                      ${skemaAngsuran.tenor_24.angsuran.toLocaleString(
                                        "US"
                                      )}`
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
                                      ${skemaAngsuran.tenor_6.angsuran.toLocaleString(
                                        "US"
                                      )}`
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
                                      ${skemaAngsuran.tenor_12.angsuran.toLocaleString(
                                        "US"
                                      )}`
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
                                      ${skemaAngsuran.tenor_18.angsuran.toLocaleString(
                                        "US"
                                      )}`
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
                                      ${skemaAngsuran.tenor_24.angsuran.toLocaleString(
                                        "US"
                                      )}`
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
        </n-card>
        <n-card
          v-show="current == 2"
          title="Data Pelanggan"
          :segmented="{
            content: true,
            footer: 'soft',
          }"
        >
          <n-space>
            <n-form-item label="No KTP" path="no_ktp">
              <n-input
                placeholder="NO KTP"
                v-model:value="pelanggan.no_ktp"
                :loading="loadingKTP"
                @change="handleKtp"
              />
            </n-form-item>
            <n-form-item label="Kategori Kredit" path="no_ktp">
              <n-select
                filterable
                placeholder="Kategori Kredit"
                :options="optKategori"
                default-value="Baru"
                v-model:value="order.category"
                disabled
              />
            </n-form-item>
          </n-space>
          <n-form-item label="No KK" path="nokk">
            <n-input
              placeholder="No Kartu Keluarga"
              v-model:value="pelanggan.no_kk"
            />
          </n-form-item>
          <n-form-item label="Nama" path="nama">
            <n-input placeholder="Nama" v-model:value="pelanggan.nama" />
          </n-form-item>
          <n-form-item label="Tanggal lahir" path="tgl_lahir">
            <n-space vertical>
              <n-alert
                title="Informasi"
                type="warning"
                :bordered="bordered"
                v-if="notifUsia"
              >
                {{ noteUsia }}</n-alert
              >
              <n-date-picker
                placeholder="Tanggal Lahir"
                v-model:formatted-value="pelanggan.tgl_lahir"
                value-format="yyyy-MM-dd"
                format="dd-MM-yyyy"
                type="date"
                @update:value="handleTanggalLahir"
              />
            </n-space>
          </n-form-item>
          <n-form-item label="Alamat" path="alamat">
            <n-input-group>
              <n-input placeholder="Alamat" v-model:value="pelanggan.alamat" />
              <n-input placeholder="RT" v-model:value="pelanggan.rt" />
              <n-input placeholder="RW" v-model:value="pelanggan.rw" />
            </n-input-group>
          </n-form-item>
          <n-form-item label="No Handphone" path="HP">
            <n-input placeholder="No Handphone" v-model:value="pelanggan.no_hp" />
          </n-form-item>
          <n-divider title-placement="left"> Dokumen Identitas </n-divider>
          <n-space vertical>
            <n-space v-show="actionPage != 'view'">
              <n-space>
                <file-upload
                  title="KTP"
                  endpoint="image_upload_prospect"
                  type="ktp"
                  :def_value="findDocByType(dok_identitas,'ktp')"
                  :idapp="pageData.id"
                />
                <file-upload
                  title="KK"
                  endpoint="image_upload_prospect"
                  type="kk"
                 :def_value="findDocByType(dok_identitas,'kk')"
                  :idapp="pageData.id"
                />
                <file-upload
                  title="KTP Pasangan"
                  endpoint="image_upload_prospect"
                  type="ktp_pasangan"
                  :def_value="findDocByType(dok_identitas,'ktp_pasangan')"
                  :idapp="pageData.id"
                />
              </n-space>
            </n-space>
          </n-space>
        </n-card>
        <n-card
          v-show="current == 3"
          v-for="jaminan in jaminan"
          title="Data Jaminan"
          :segmented="{
            content: true,
            footer: 'soft',
          }" :key="jaminan.id"
        >
          <div
            v-show="jaminan.nilai != '' && order.plafond > jaminan.nilai"
            class="pb-4"
          >
            <n-alert title="Info" type="info"> Plafon > Harga Pasar </n-alert>
          </div>
          <taksasi-select-state
            v-model:brand="jaminan.merk"
            v-model:tipe="jaminan.tipe"
            v-model:tahun="jaminan.tahun"
            v-model:pasar="jaminan.nilai"
          />
          <n-form-item label="" path="no_polisi">
            <n-input placeholder="No Polisi" v-model:value="jaminan.no_polisi" />
          </n-form-item>
          <n-form-item label="Warna" path="warna">
            <n-input placeholder="warna" v-model:value="jaminan.warna" />
          </n-form-item>
          <n-divider title-placement="left"> Dokumen Jaminan </n-divider>
          <n-divider />
          <n-space v-show="actionPage != 'view'">
            <file-upload
              title="No Rangka"
              :def_value="findDocByType(dok_jaminan,'no_rangka')"
              endpoint="image_upload_prospect"
              type="no_rangka"
              :idapp="pageData.id"
            />
            <file-upload
              title="No Mesin"
              endpoint="image_upload_prospect"
              type="no_mesin"
               :def_value="findDocByType(dok_jaminan,'no_mesin')"
              :idapp="pageData.id"
            />
            <file-upload
              title="STNK"
              endpoint="image_upload_prospect"
               :def_value="findDocByType(dok_jaminan,'stnk')"
              type="stnk"
              :idapp="pageData.id"
            />
          </n-space>
          <n-divider v-show="actionPage != 'view'" />
          <n-space v-show="actionPage != 'view'">
            <file-upload
              title="Depan"
              endpoint="image_upload_prospect"
              type="depan"
               :def_value="findDocByType(dok_jaminan,'depan')"
              :idapp="pageData.id"
            />
            <file-upload
              title="Belakang"
              endpoint="image_upload_prospect"
              type="belakang"
               :def_value="findDocByType(dok_jaminan,'belakang')"
              :idapp="pageData.id"
            />
            <file-upload
              title="Kanan"
              endpoint="image_upload_prospect"
               :def_value="findDocByType(dok_jaminan,'kanan')"
              type="kanan"
              :idapp="pageData.id"
            />
            <file-upload
              title="Kiri"
               :def_value="findDocByType(dok_jaminan,'kiri')"
              endpoint="image_upload_prospect"
              type="kiri"
              :idapp="pageData.id"
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
          <n-form-item label="Tanggal survey" path="tgl_survey">
            <n-date-picker
              v-model:formatted-value="survey.tgl_survey"
              placeholder="Tanggal Survey"
              value-format="yyyy-MM-dd"
              format="dd-MM-yyyy"
              type="date"
              clearable
              disabled
            />
          </n-form-item>
          <n-form-item label="Lama Bekerja" path="lama_berkerja">
            <n-input
              placeholder="lama bekerja"
              v-model:value="survey.lama_bekerja"
            >
              <template #suffix> bulan </template>
            </n-input>
          </n-form-item>
          <div class="flex gap-2 flex-col md:flex-row">
            <n-form-item label="Pendapatan " path="pendapatan">
              <n-input-number
                class="flex w-full"
                :parse="parse"
                :format="format"
                v-model:value="survey.penghasilan_pribadi"
                placeholder="pendapatan pelanggan"
                :show-button="false"
              >
                <template #suffix> perbulan </template>
              </n-input-number>
            </n-form-item>
            <n-form-item label="pendapatan pasangan" path="pendapatan">
              <n-input-number
                class="flex w-full"
                :parse="parse"
                :format="format"
                v-model:value="survey.penghasilan_pasangan"
                placeholder="pendapatan pasangan"
                :show-button="false"
              >
                <template #suffix> perbulan </template>
              </n-input-number>
            </n-form-item>
            <n-form-item label="pendapatan lainnya" path="pendapatan">
              <n-input-number
                class="flex w-full"
                :parse="parse"
                :format="format"
                v-model:value="survey.penghasilan_lainnya"
                placeholder="pendapatan lain-lain"
                :show-button="false"
              >
                <template #suffix> perbulan </template>
              </n-input-number>
            </n-form-item>
            <n-form-item label="Pengeluaran" path="pengeluaran">
              <n-input-number
                class="flex w-full"
                :parse="parse"
                :format="format"
                v-model:value="survey.pengeluaran"
                placeholder="pengeluaran"
                :show-button="false"
              >
                <template #suffix> perbulan </template>
              </n-input-number>
            </n-form-item>
          </div>
          <n-form-item label="Sektor" path="sektor">
            <n-select
              filterable
              placeholder="sektor"
              :options="optSektor"
              v-model:value="survey.sektor"
            />
          </n-form-item>
          <n-form-item label="Catatan Survey" path="cat_survey">
            <n-input
              v-model:value="survey.catatan_survey"
              type="textarea"
              autosize
              placeholder="catatan survey"
            />
          </n-form-item>
          <n-divider title-placement="left"> Dokumen Pendukung </n-divider>
          <n-space>
            <div v-for="file_id in dok_pendukung" class="flex items-center gap-2">
              <n-image
                :src="file_id.PATH"
                class="!w-10 border !h-10 rounded-md"
              />
              <span class="uppercase text-pr">{{ file_id.TYPE }}</span>
            </div>
          </n-space>
          <n-divider v-show="actionPage != 'view'" />
          <file-upload
            title="upload dokumen"
            endpoint="image_upload_prospect"
            type="other"
            :idapp="pageData.id"
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
          v-show="actionPage != 'view'"
          :loading="loading"
          icon-placement="left"
          type="primary"
          @click="handleSave"
        >
          Ubah
        </n-button>
      </n-flex>
    </n-space>
  </template>
  <script setup>
  import { ref, reactive, onMounted, toRef } from "vue";
  import { v4 as uuidv4 } from "uuid";
  import _ from "lodash";
  import {
    ArrowBackOutlined as ArrowBack,
    ArrowForwardOutlined as ArrowForward,
  } from "@vicons/material";
  import { useMessage } from "naive-ui";
  import router from "../../../router";
  import { useRoute } from "vue-router";
  import { useWindowSize } from "@vueuse/core";
  import { useApi } from "../../../helpers/axios";
  import { lyla } from "@lylajs/web";
  const { width } = useWindowSize();
  const message = useMessage();
  const pageData = ref({});
  const suspense = ref({});
  const baseRoute = useRoute();
  const paramPage = baseRoute.params.idsurvey;
  const actionPage = baseRoute.params.action;
  const current = ref(1);
  const loading = ref(false);
  const userToken = localStorage.getItem("token");
  const skemaAngsuran = ref([]);
  const tipeAngsuran = ref();
  const loadingKTP = ref(false);
  const handleKtp = async (e) => {
    loadingKTP.value = true;
    const bodyForm = {
      no_ktp: e,
    };
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
    order.jenis_angsuran = e;
    const body = {
      plafond: order.plafond,
      jenis_angsuran: e,
    };
    refAdmin(body);
  };
  const tenor6 = ref([]);
  const tenor12 = ref([]);
  const tenor18 = ref([]);
  const tenor24 = ref([]);
  const handlePlafond = (e) => {
    const body = {
      plafond: e,
      jenis_angsuran: order.jenis_angsuran,
    };
    refAdmin(body);
  };
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
      console.log(response.error);
    } else {
      loading.value = false;
      skemaAngsuran.value = response.data;
      tenor6.value = response.data.tenor_6;
      tenor12.value = response.data.tenor_12;
      tenor18.value = response.data.tenor_18;
      tenor24.value = response.data.tenor_24;
    }
  };
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
  const optKategori = [
    "BUKAN KARYAWAN",
    "KARYAWAN",
    "KARYAWAN PERUSAHAAN AFILIASI",
  ].map((v) => ({
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
  const order = reactive({});
  const pelanggan = reactive({});

  const dok_jaminan = ref({});
  const dok_identitas = ref({});
  const dok_pendukung = ref({});
  const jaminan = ref({});
  const survey = reactive({});
  const dynamicForm = reactive({
    order: order,
    data_nasabah: pelanggan,
    data_survey: survey,
    jaminan_kendaraan: jaminan.value,
  });
  const idApp = baseRoute.params.idsurvey;
  const getData = () =>
    useApi({
      method: "get",
      api: `kunjungan/${idApp}`,
      token: userToken,
    }).then((res) => {
      if (!res.ok) {
        message.error("halam tidak ditemukan !");
        suspense.value = true;
      } else {
        message.loading("memuat data kunjungan");
        suspense.value = false;
        pageData.value = res.data.response;
        Object.assign(survey, res.data.response.data_survey);
        Object.assign(dok_jaminan.value, res.data.response.dokumen_jaminan);
        Object.assign(pelanggan, res.data.response.data_nasabah);
        Object.assign(order, res.data.response.data_order);
        Object.assign(jaminan.value, res.data.response.jaminan_kendaraan);
        Object.assign(dok_identitas.value, res.data.response.dokumen_indentitas);
        Object.assign(dok_pendukung.value, res.data.response.dokumen_pendukung);
        let tgllahir = toRef(pelanggan.tgl_lahir);
        var myDate = tgllahir.value;
        myDate = myDate.split("-");
        var newDate = new Date(myDate[0], myDate[1] - 1, myDate[2]);
        console.log(newDate.getTime());
        handleTanggalLahir(newDate.getTime());
        getPlafond();
      }
    });
  const getPlafond = async () => {
    tipeAngsuran.value = order.jenis_angsuran;
    const body = {
      plafond: order.plafond,
      jenis_angsuran: order.jenis_angsuran,
    };
    refAdmin(body);
  };
  const handleSave = async (e) => {
    e.preventDefault(e);
    loading.value = true;
    const response = await useApi({
      method: "PUT",
      api: `kunjungan/${idApp}`,
      data: dynamicForm,
      token: userToken,
    });
    if (!response.ok) {
      message.error("data gagal diubah");
      loading.value = false;
    } else {
      message.success("data berhasil diubah");
      loading.value = false;
      router.push("/task/survey");
    }
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
  };
  const handleImagePost = ({ file, data, onError, onFinish, onProgress }) => {
    const form = new FormData();
    form.append("image", file.file);
    form.append("type", data.type);
    form.append("cr_prospect_id", paramPage);
    const headers = {
      Authorization: `Bearer ${userToken}`,
    };
    lyla
      .post("https://api.kspdjaya.id/image_upload_prospect", {
        headers,
        body: form,
        onUploadProgress: ({ percent }) => {
          onProgress({ percent: Math.ceil(percent) });
        },
      })
      .then(() => {
        message.success("upload gambar berhasil");
        onFinish();
      })
      .catch(() => {
        message.success("upload gambar gagal");
        onError();
      });
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

  const findDocByType = (c,e) => {
    const docPath = ref(_.find(c, { TYPE: e }));
    if (docPath.value) return docPath.value.PATH;
  };

  onMounted(() => {
    getData();
  });
  </script>
