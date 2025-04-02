<template>
  <HScaffold>
    <HAppBar class="sticky sticky-top top-0 z-50 bg-sfc shadow" title="Survey Baru">
      <template #suffix>
        <n-button type="warning">Simpan</n-button>
      </template>
      <template #progress>
        <div class="p-2 bg-pr text-white">{{ step }} Data Order</div>
      </template>
    </HAppBar>

    <div v-if="step === 1" class="bg-white p-4">
      <n-form ref="refFormOrder" :model="modelOrder" :rules="surveyStore.orderRules">
        <n-form-item clearable label="Plafond" path="plafond">
          <n-input-number v-model:value="modelOrder.plafond" :format :parse :show-button="false"
                          class="w-full"/>
        </n-form-item>
        <n-form-item label="Jenis Angsuran" path="jenis">
          <n-select v-model:value="modelOrder.jenis" :options="optJenisAngsuran" @update:value="handleUpdateJenis"/>
        </n-form-item>
        <n-form-item label="Tenor" path="tenor">
          <n-select v-model:value="modelOrder.tenor"
                    :options="modelOrder.jenis === 'BULANAN' ? optTenor:optTenorMusiman"/>
        </n-form-item>
        <n-form-item label="Angsuran" path="angsuran">
          <n-input v-model:value="modelOrder.angsuran" :show-button="false"
                   class="w-full"/>
        </n-form-item>
        <n-form-item label="Tujuan Kredit" path="tujuan_kredit">
          <n-input v-model:value="modelOrder.tujuan_kredit" :show-button="false"
                   class="w-full"/>
        </n-form-item>
      </n-form>
    </div>

    <div v-if="step === 2" class="bg-white p-4">
      <n-form ref="refFormPelanggan" :model="modelPelanggan" :rules="surveyStore.pelangganRules">
        <n-form-item label="No KTP" path="no_ktp">
          <n-input v-model:value="modelPelanggan.no_ktp" :allow-input="justNumber" class="w-full" maxlength="16"
                   show-count/>
        </n-form-item>
        <n-form-item label="Kategori Kredit" path="kategori">
          <n-input v-model:value="modelPelanggan.kategori"
                   class="w-full"/>
        </n-form-item>
        <n-form-item label="No KK" path="no_kk">
          <n-input v-model:value="modelPelanggan.no_kk" :allow-input="justNumber" class="w-full" maxlength="16"
                   show-count/>
        </n-form-item>
        <n-form-item label="Nama Pelanggan" path="nama_pelanggan">
          <n-input v-model:value="modelPelanggan.nama" class="w-full"/>
        </n-form-item>
        <n-form-item label="Tanggal Lahir" path="tgl_lahir">
          <n-date-picker v-model:formatted-value="modelPelanggan.tgl_lahir" class="w-full"
                         format="dd-MM-yyyy" placeholder="Tanggal Lahir"
                         type="date" value-format="yyyy-MM-dd" @update:value="handleTanggalLahir"/>
        </n-form-item>
        <n-form-item label="No Handphone" path="no_hp">
          <n-input v-model:value="modelPelanggan.no_hp" class="w-full"/>
        </n-form-item>
        <n-form-item label="Alamat" path="alamat">
          <n-input v-model:value="modelPelanggan.alamat" class="w-full"/>
        </n-form-item>
        <n-form-item label="RT" path="rt">
          <n-input v-model:value="modelPelanggan.rt" class="w-full"/>
        </n-form-item>
        <n-form-item label="RW" path="rw">
          <n-input v-model:value="modelPelanggan.rw" class="w-full"/>
        </n-form-item>
        <select-state-region v-model:desa="modelPelanggan.kelurahan" v-model:kecamatan="modelPelanggan.kecamatan"
                             v-model:kodepos="modelPelanggan.kode_pos" v-model:kota="modelPelanggan.kota"
                             v-model:provinsi="modelPelanggan.provinsi"/>
        <n-divider dashed>DOKUMEN IDENTITAS PELANGGAN</n-divider>
        <div class="flex flex-col md:flex-row gap-2">
          <file-upload :def_value="findDocByType(dok_identitas, 'ktp')" :idapp="dynamicForm.id"
                       :view-mode="false" endpoint="image_upload_prospect" title="KTP"
                       type="ktp"/>
          <file-upload :def_value="findDocByType(dok_identitas, 'kk')" :idapp="dynamicForm.id"
                       :view-mode="false" endpoint="image_upload_prospect" title="KK"
                       type="kk"/>
          <file-upload :def_value="findDocByType(dok_identitas, 'ktp_pasangan')" :idapp="dynamicForm.id"
                       :view-mode="false"
                       endpoint="image_upload_prospect" title="KTP Pasangan"
                       type="ktp_pasangan"/>
        </div>
      </n-form>
    </div>

    <div v-if="step === 3" class="bg-white p-4">
      Jaminan
    </div>


    <div class="p-4">
      <n-space>
        <n-button class="w-full" type="secondary" @click="handleBack">Kembali</n-button>
        <n-button class="w-full" type="primary" @click="handleNext">Selanjutnya</n-button>
      </n-space>
    </div>

  </HScaffold>
</template>
<script setup>
import {ref} from "vue";
import {format, parse} from "../../utils/parse.js";
import {v4 as uuidv4} from "uuid";
import {findDocByType} from "../../utils/helpers.js";
import {useSurveyStore} from "../../stores/survey.js";
import {justNumber} from "../../utils/validator.js";
import HScaffold from "../../components/molecules/HScaffold.vue";
import HAppBar from "../../components/molecules/HAppBar.vue";

const refFormOrder = ref();
const refFormPelanggan = ref();

const surveyStore = useSurveyStore();

const step = ref(2);

const handleNext = () => step.value++;
const handleBack = () => step.value--;

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

const handleUpdateJenis = () => {
  modelOrder.value.tenor = null;
  modelOrder.value.angsuran = null;
}
</script>