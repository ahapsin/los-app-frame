<template>
  <n-card title="Form Prospek" size="small" :segmented="{
    content: true,
    footer: 'soft',
  }">
    <n-tabs type="bar" placement="left">
      <n-tab-pane name="kunjungan" tab="Kunjungan">
        <template #tab>
          <div class="flex gap-2">
            <v-icon name="bi-geo-alt" />
            Kunjungan
          </div>
        </template>
        <n-scrollbar class="border p-2 rounded-xl">
          <form>
            <div class="grid md:grid-cols-3 gap-2">
              <n-form-item label="Tanggal Kunjungan">
                <n-date-picker class="w-full" format="dd-MM-yyyy" :default-value="Date.now()"
                  v-model:formatted-value="initVisit.tgl_kunjungan" />
              </n-form-item>
              <n-form-item label="Nama Nasabah">
                <n-input class="w-full" v-model:value="initVisit.nama_nasabah" />
              </n-form-item>
              <n-form-item label="No Handphone">
                <n-input class="w-full" v-model:value="initVisit.no_handphone" />
              </n-form-item>
            </div>
            <SelectStateRegion v-model:provinsi="initVisit.provinsi" v-model:kota="initVisit.kota"
              v-model:kecamatan="initVisit.kecamatan" @v-model:desa="initVisit.desa"
              v-model:kodepos="initVisit.kodepos" />
            <n-form-item label="Alamat Detail">
              <n-input type="textarea" v-model:value="initVisit.alamat_detail" />
            </n-form-item>
            <!-- <n-form-item label="Pin Poin">

              <div class="w-full h-[300px] z-0 rounded-md overflow-clip">
                <Maps_point></Maps_point>
              </div>
            </n-form-item> -->
            <n-form-item label="Lampiran Kunjungan">
              <file-upload :def_preview="true" title="dokumen pendukung" endpoint="image_upload_prospect"
                type="other" />
            </n-form-item>
            <n-alert :show-icon="false" type="warning">
              <div class="flex items-center justify-between">
                <n-text>Ajukan Slik</n-text>
                <n-switch v-model:value="initVisit.slik_request" />
              </div>
            </n-alert>
            <div class="grid md:grid-cols-3 gap-2 p-2" v-if="initVisit.slik_request">
              <n-form-item label="No KTP">
                <n-input class="w-full" v-model:value="initVisit.no_ktp" />
              </n-form-item>
              <n-form-item label="No KK">
                <n-input class="w-full" v-model:value="initVisit.no_kk" />
              </n-form-item>
              <n-form-item label="Keterangan">
                <n-input class="w-full" v-model:value="initVisit.keterangan" />
              </n-form-item>
              <div class="flex flex-col md:flex-row gap-2">
                <file-upload title="KTP" :def_value="findDocByType(initVisit.dokumen_indentitas, 'ktp')"
                  endpoint="image_upload_prospect" type="ktp" :idapp="initVisit.id" />
                <file-upload title="KK" :def_value="findDocByType(initVisit.dokumen_indentitas, 'kk')"
                  endpoint="image_upload_prospect" type="kk" :idapp="initVisit.id" />
                <file-upload title="KTP Pasangan" endpoint="image_upload_prospect" type="ktp_pasangan"
                  :def_value="findDocByType(initVisit.dokumen_indentitas, 'ktp_pasangan')" :idapp="initVisit.id" />
                <file-upload title="Buku Nikah" endpoint="image_upload_prospect" type="ktp_pasangan"
                  :def_value="findDocByType(initVisit.dokumen_indentitas, 'buku_nikah')" :idapp="initVisit.id" />
              </div>
            </div>
          </form>
        </n-scrollbar>
      </n-tab-pane>
      <n-tab-pane name="credit" tab="Credit" :disabled="!initVisit.slik_request">
        <template #tab>
          <div class="flex gap-2">
            <v-icon name="bi-coin" />
            Kredit
          </div>
        </template>
        <CreditTab />
      </n-tab-pane>
      <n-tab-pane name="debitur" tab="Debitur" :disabled="!initVisit.slik_request">
        <template #tab>
          <div class="flex gap-2">
            <v-icon name="bi-person" />
            Debitur
          </div>
        </template>
        <DebiturTab />
      </n-tab-pane>
      <n-tab-pane name="penjamin" tab="Penjamin" :disabled="!initVisit.slik_request">
        <template #tab>
          <div class="flex gap-2">
            <v-icon name="bi-shield-check" />
            Penjamin
          </div>
        </template>
        <PenjaminTab />
      </n-tab-pane>
      <n-tab-pane name="jaminan" tab="Jaminan" :disabled="!initVisit.slik_request">
        <template #tab>
          <div class="flex gap-2">
            <v-icon name="bi-bookmark" />
            Jaminan
          </div>
        </template>
        <JaminanTab />
      </n-tab-pane>
      <n-tab-pane name="analisa" tab="Analisa" :disabled="!initVisit.slik_request">
        <template #tab>
          <div class="flex gap-2">
            <v-icon name="bi-clipboard-check" />
            Analisa
          </div>
        </template>
        <AnalisaForm />
      </n-tab-pane>
    </n-tabs>

    <template #action>
      <n-space>
        <n-button type="primary" @click="handleSave">
          Simpan
        </n-button>
        <n-button type="error" secondary @click="handleReset">
          Reset
        </n-button>
      </n-space>
    </template>
  </n-card>
</template>

<script setup>
import _ from "lodash";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import FileUpload from "../../../../components/atoms/FileUpload.vue";
import { useVisitStore } from "../../../../stores/visit";
import AnalisaForm from "../analisa/AnalisaForm.vue";
import CreditTab from "./CreditTab.vue";
import DebiturTab from "./DebiturTab.vue";
import JaminanTab from "./JaminanTab.vue";

const visitStore = useVisitStore();
const { initVisit } = storeToRefs(visitStore);

const handleSave = () => {
  visitStore.storeVisit(initVisit.value);
}
const findDocByType = (c, e) => {
  const docPath = ref(_.find(c, { TYPE: e }));
  if (docPath.value) return docPath.value.PATH;
};
</script>
