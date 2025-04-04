<template>
  <HScaffold>
    <HAppBar title="Survey Baru" class="shadow bg-white sticky top-0 z-50">
      <template #suffix>
        <div class="flex gap-2">
          <n-button type="warning" secondary>Simpan</n-button>
          <n-button type="primary">Kirim</n-button>
        </div>
      </template>
    </HAppBar>
    <div class="p-4 sticky top-0 z-50" v-if="notice">
      <n-alert title="notice" closable type="warning" class="shadow">
        asdasd
      </n-alert>
    </div>
    <div class="p-2 bg-pr text-white">1. Data Order</div>
    <!-- form data order -->
    <div class="bg-white p-4">
      <n-form ref="refFormOrder" :model="modelOrder" :rules="surveyStore.orderRules">
        <n-form-item clearable label="Plafond" path="plafond">
          <n-input-number v-model:value="modelOrder.plafond" :format :parse :show-button="false" class="w-full" />
        </n-form-item>
        <n-form-item label="Jenis Angsuran" path="jenis">
          <n-select v-model:value="modelOrder.jenis" :options="optJenisAngsuran" @update:value="handleUpdateJenis" />
        </n-form-item>
        <n-form-item label="Tenor" path="tenor">
          <n-select v-model:value="modelOrder.tenor"
            :options="modelOrder.jenis === 'BULANAN' ? optTenor : optTenorMusiman" />
        </n-form-item>
        <n-form-item label="Angsuran" path="angsuran">
          <n-input v-model:value="modelOrder.angsuran" :show-button="false" class="w-full" />
        </n-form-item>
        <n-form-item label="Tujuan Kredit" path="tujuan_kredit">
          <n-input v-model:value="modelOrder.tujuan_kredit" :show-button="false" class="w-full" />
        </n-form-item>
      </n-form>
    </div>
    <div class="p-2 bg-pr text-white">2. Data Pelanggan</div>
    <!-- form data pelanggan -->
    <div class="bg-white p-4">
      <n-form ref="refFormPelanggan" :model="modelPelanggan" :rules="surveyStore.pelangganRules">
        <n-form-item label="No KTP" path="no_ktp">
          <n-input v-model:value="modelPelanggan.no_ktp" :allow-input="justNumber" class="w-full" maxlength="16"
            show-count />
        </n-form-item>
        <n-form-item label="Kategori Kredit" path="kategori">
          <n-input v-model:value="modelPelanggan.kategori" class="w-full" />
        </n-form-item>
        <n-form-item label="No KK" path="no_kk">
          <n-input v-model:value="modelPelanggan.no_kk" :allow-input="justNumber" class="w-full" maxlength="16"
            show-count />
        </n-form-item>
        <n-form-item label="Nama Pelanggan" path="nama_pelanggan">
          <n-input v-model:value="modelPelanggan.nama" class="w-full" />
        </n-form-item>
        <n-form-item label="Tanggal Lahir" path="tgl_lahir">
          <n-date-picker v-model:formatted-value="modelPelanggan.tgl_lahir" class="w-full" format="dd-MM-yyyy"
            placeholder="Tanggal Lahir" type="date" value-format="yyyy-MM-dd" @update:value="handleTanggalLahir" />
        </n-form-item>
        <n-form-item label="No Handphone" path="no_hp">
          <n-input v-model:value="modelPelanggan.no_hp" class="w-full" />
        </n-form-item>
        <n-form-item label="Alamat" path="alamat">
          <n-input v-model:value="modelPelanggan.alamat" class="w-full" />
        </n-form-item>
        <n-form-item label="RT" path="rt">
          <n-input v-model:value="modelPelanggan.rt" class="w-full" />
        </n-form-item>
        <n-form-item label="RW" path="rw">
          <n-input v-model:value="modelPelanggan.rw" class="w-full" />
        </n-form-item>
        <select-state-region v-model:desa="modelPelanggan.kelurahan" v-model:kecamatan="modelPelanggan.kecamatan"
          v-model:kodepos="modelPelanggan.kode_pos" v-model:kota="modelPelanggan.kota"
          v-model:provinsi="modelPelanggan.provinsi" />
        <n-divider dashed>DOKUMEN IDENTITAS PELANGGAN</n-divider>
        <div class="flex flex-col md:flex-row gap-2">
          <file-upload :def_value="findDocByType(dok_identitas, 'ktp')" :idapp="dynamicForm.id" :view-mode="false"
            endpoint="image_upload_prospect" title="KTP" type="ktp" />
          <file-upload :def_value="findDocByType(dok_identitas, 'kk')" :idapp="dynamicForm.id" :view-mode="false"
            endpoint="image_upload_prospect" title="KK" type="kk" />
          <file-upload :def_value="findDocByType(dok_identitas, 'ktp_pasangan')" :idapp="dynamicForm.id"
            :view-mode="false" endpoint="image_upload_prospect" title="KTP Pasangan" type="ktp_pasangan" />
        </div>
      </n-form>
    </div>
    <div class="flex items-center justify-between p-2 bg-pr text-white">
      <div>3. Data Jaminan</div>
      <n-button size="small" type="warning" @click="tambahJaminan">tambah</n-button>
    </div>
    <!-- fotm data jaminan -->
    <div class="bg-white p-4">
      Tidak ada Data jaminan
    </div>
    <div class="p-2 bg-pr text-white">4. Data Survey</div>
    <!-- form data survey -->
    <div class="bg-white p-4">
      <n-form ref="refFormSurvey" :model="modelSurvey" :rules="surveyStore.surveyRules">
        <n-form-item label="Tanggal Survey" path="tgl_survey">
          <n-date-picker v-model:formatted-value="modelSurvey.tgl_survey" class="w-full" format="dd-MM-yyyy" type="date"
            :default-value="Date.now()" value-format="yyyy-MM-dd" @update:value="handleTanggalLahir" />
        </n-form-item>
        <n-form-item label="Pekerjaan" path="pekerjaan">
          <n-input v-model:value="modelSurvey.pekerjaan" :allow-input="justNumber" class="w-full" maxlength="16"
            show-count />
        </n-form-item>
        <n-form-item label="Lama Bekerja" path="lama_kerja">
          <n-input v-model:value="modelSurvey.lama_kerja" :allow-input="justNumber" class="w-full">
            <template #suffix>bulan</template>
          </n-input>
        </n-form-item>
        <n-form-item label="Pendapatan Pelanggan" path="pendapatan_pelanggan">
          <n-input-number :show-button="false" :parse :format v-model:value="modelSurvey.pendapatan_pelanggan"
            :allow-input="justNumber" class="w-full">
            <template #suffix>/ bulan</template>
          </n-input-number>
        </n-form-item>
        <n-form-item label="Pendapatan Pasangan" path="pendapatan_pasangan">
          <n-input-number :show-button="false" :parse :format v-model:value="modelSurvey.pendapatan_pasangan"
            :allow-input="justNumber" class="w-full">
            <template #suffix>/ bulan</template>
          </n-input-number>
        </n-form-item>
        <n-form-item label="Pendapatan Lainnya" path="pendapatan_lainnya">
          <n-input-number :show-button="false" :parse :format v-model:value="modelSurvey.pendaptan_lainnya"
            :allow-input="justNumber" class="w-full">
            <template #suffix>/ bulan</template>
          </n-input-number>
        </n-form-item>
        <n-form-item label="Pengeluaraan" path="pengeluaran">
          <n-input-number :show-button="false" :parse :format v-model:value="modelSurvey.pengeluaran"
            :allow-input="justNumber" class="w-full">
            <template #suffix>/ bulan</template></n-input-number>
        </n-form-item>
        <n-form-item label="Catatan Survey" path="catatan_survey">
          <n-input type="textarea" v-model:value="modelSurvey.catatan_survey" :allow-input="justNumber" class="w-full"
            maxlength="1000" show-count />
        </n-form-item>
      </n-form>
    </div>

    <!-- drawer -->
    <n-drawer v-model:show="showDrawer" placement="bottom" resizable :default-height="500">
      <n-drawer-content title="Tambah Jaminan" closable>
        <!-- form data order -->
        <n-form ref="refFormOrder" :model="modelJaminan" :rules="rulesJaminan">
          <n-form-item label="Jenis Jaminan" path="jenis_jaminan">
            <n-select v-model:value="modelJaminan.jenis_jaminan" :options="optJaminan" />
          </n-form-item>
          <div v-if="modelJaminan.jenis_jaminan === 'kendaraan'">
            <taksasi-select-state v-model:brand="modelJaminan.merk" v-model:tipe="modelJaminan.tipe"
              v-model:tahun="modelJaminan.tahun" v-model:pasar="modelJaminan.nilai" />
            <n-form-item label="Kondisi Jaminan" path="kondisi_jaminan">
              <n-radio-group v-model:value="modelJaminan.kondisi_jaminan" name="kondisi_jaminan">
                <n-radio value="ada">Ada</n-radio>
                <n-radio value="didealer">Masih didealer</n-radio>
              </n-radio-group>
            </n-form-item>
            <div v-if="modelJaminan.kondisi_jaminan === 'ada'">
              <n-form-item label="NO BPKB" path="no_bpkb">
                <n-input v-model:value="modelJaminan.no_bpkb" class="w-full" />
              </n-form-item>
              <n-form-item label="Alamat BPKB" path="alamat_bpkb">
                <n-input v-model:value="modelJaminan.alamat_bpkb" class="w-full" />
              </n-form-item>
              <n-form-item label="Atas Nama BPKB" path="atas_nama_bpkb">
                <n-input v-model:value="modelJaminan.atas_nama_bpkb" class="w-full" />
              </n-form-item>
            </div>
            <n-form-item label="No Polisi" path="no_polisi">
              <n-input v-model:value="modelJaminan.no_polisi" class="w-full" />
            </n-form-item>
            <n-form-item label="No Rangka" path="no_rangka">
              <n-input v-model:value="modelJaminan.no_rangka" class="w-full" />
            </n-form-item>
            <n-form-item label="No Mesin" path="no_mesin">
              <n-input v-model:value="modelJaminan.no_mesin" class="w-full" />
            </n-form-item>
            <n-form-item label="No Faktur" path="no_faktur">
              <n-input v-model:value="modelJaminan.no_faktur" class="w-full" />
            </n-form-item>
            <n-form-item label="Warna" path="warna">
              <n-input v-model:value="modelJaminan.no_faktur" class="w-full" />
            </n-form-item>
            <n-form-item label="Tanggal Berlaku STNK" path="tgl_stnk">
              <n-date-picker v-model:formatted-value="modelJaminan.tgl_stnk" class="w-full" format="dd-MM-yyyy"
                type="date" value-format="yyyy-MM-dd" />
            </n-form-item>
          </div>
        </n-form>
        <template #footer>
          <n-button class="w-full" type="primary">Tambah</n-button>
        </template>
      </n-drawer-content>
    </n-drawer>
  </HScaffold>
</template>
<script setup>
import { ref } from "vue";
import { format, parse } from "../../utils/parse.js";
import { v4 as uuidv4 } from "uuid";
import { findDocByType } from "../../utils/helpers.js";
import { useSurveyStore } from "../../stores/survey.js";
import { justNumber } from "../../utils/validator.js";
import HScaffold from "../../components/molecules/HScaffold.vue";
import HAppBar from "../../components/molecules/HAppBar.vue";

const refFormOrder = ref();
const refFormPelanggan = ref();
const refFormSurvey = ref();
const showDrawer = ref(false);

const surveyStore = useSurveyStore();

//model
const modelOrder = ref({
  plafond: null,
  jenis: "BULANAN",
  tenor: null,
  angsuran: null,
  tujuan_kredit: null,
});

const modelPelanggan = ref({
  no_ktp: null,
  kategori: null,
  no_kk: null,
  nama: null,
  tgl_lahir: null,
  no_hp: null,
  alamat: null,
  rt: null,
  rw: null,
  provinsi: null,
  kota: null,
  kecamatan: null,
  desa: null,
  kode_pos: null,
  doc_ktp: null,
  doc_kk: null,
  doc_ktp_pasangan: null,
});

const modelSurvey = ref({
  tgl_survey: null,
  pekerjaan: null,
  lama_kerja: null,
  pendapatan_pelanggan: null,
  pendapatan_pasangan: null,
  pendaptan_lainnya: null,
  pengeluaran: null,
  catatan_survey: null,
});

const modelJaminan = ref({
  jenis_jaminan: null,
  kondisi_jaminan: 'ada',
  merk: null,
  tipe: null,
  tahun: null,
  nilai: null,
  no_polisi: null,
  warna: null,
  tgl_stnk: null,
  no_bpkb: null,
  alamat_bpkb: null,
  atas_nama_bpkb: null,
  no_rangka: null,
  no_mesin: null,
  no_faktur: null
});

const uuid = uuidv4();

const dynamicForm = ref({
  id: uuid,
})

const optJenisAngsuran = ["BULANAN", "MUSIMAN"].map((v) => ({
  label: v,
  value: v,
}));

const optTenor = ['6', '12', '18', '24'].map((v) => ({
  label: v,
  value: v,
}));

const optTenorMusiman = [{
  label: "1 x 3 Bulan",
  value: 6,
}, {
  label: "1 x 6 Bulan",
  value: 12,
}, {
  label: "2 x 6 Bulan",
  value: 18,
}, {
  label: "3 x 6 Bulan",
  value: 24,
},];

const optJaminan = [{
  label: "Kendaraan",
  value: "kendaraan",
}, {
  label: "Sertifikat (SHM)",
  value: "sertifikat",
}];

// method
const tambahJaminan = () => {
  showDrawer.value = !showDrawer.value;
}

//rules
const rulesJaminan = {
  jenis_jaminan: {
    required: true,
    trigger: "blur",
    message: "jenis jaminan wajib diisi",
  },
  merk: {
    required: true,
    trigger: "blur",
    message: "Brand / Merk wajib diisi",
  },
  tipe: {
    required: true,
    trigger: "blur",
    message: "Tipe wajib diisi",
  },
  tahun: {
    required: true,
    trigger: "blur",
    message: "Tahun wajib diisi",
  },
  kondisi_jaminan: {
    required: true,
    trigger: "blur",
    message: "kondisi jaminan wajib diisi",
  },
  no_bpkb: {
    required: true,
    trigger: "blur",
    message: "kondisi jaminan wajib diisi",
  },
  alamat_bpkb: {
    required: true,
    trigger: "blur",
    message: "kondisi jaminan wajib diisi",
  },
  atas_nama_bpkb: {
    required: true,
    trigger: "blur",
    message: "kondisi jaminan wajib diisi",
  },
  no_rangka: {
    required: true,
    trigger: "blur",
    message: "kondisi jaminan wajib diisi",
  },
  no_mesin: {
    required: true,
    trigger: "blur",
    message: "kondisi jaminan wajib diisi",
  },
  no_faktur: {
    required: true,
    trigger: "blur",
    message: "kondisi jaminan wajib diisi",
  },
  no_polisi: {
    required: true,
    trigger: "blur",
    message: "kondisi jaminan wajib diisi",
  },
  warna: {
    required: true,
    trigger: "blur",
    message: "kondisi jaminan wajib diisi",
  },
  tgl_stnk: {
    required: true,
    trigger: "blur",
    message: "kondisi jaminan wajib diisi",
  },
};

const handleUpdateJenis = () => {
  modelOrder.value.tenor = null;
  modelOrder.value.angsuran = null;
}
</script>
