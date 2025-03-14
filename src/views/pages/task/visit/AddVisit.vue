<template>
  <n-card size="small" :segmented="{
        content: true,
        footer: 'soft',
    }">
    <n-tabs type="segment" animated>
      <n-tab-pane name="kunjungan" tab="Kunjungan">
        <n-scrollbar style="max-height: 400px">
          <form>
            <div class="grid md:grid-cols-3 gap-2">
              <n-form-item label="Tanggal Kunjungan">
                <n-date-picker class="w-full" foramat="dd-MM-yyyy" :default-value="Date.now()"/>
              </n-form-item>
              <n-form-item label="Nama Nasabah">
                <n-input class="w-full"/>
              </n-form-item>
              <n-form-item label="No Handphone">
                <n-input class="w-full"/>
              </n-form-item>
            </div>
            <SelectStateRegion/>
            <n-form-item label="Alamat Detail">
              <n-input type="textarea"/>
            </n-form-item>
            <n-form-item label="Pin Poin">

              <div class="w-full h-[300px] z-0 rounded-md overflow-clip">
                <Maps_point></Maps_point>
              </div>
            </n-form-item>
            <n-form-item label="Lampiran Kunjungan">
              <file-upload :def_preview="true" title="dokumen pendukung" endpoint="image_upload_prospect"
                           type="other"/>
            </n-form-item>
            <n-alert :show-icon="false">
              <div class="flex items-center justify-between">
                <n-text>Ajukan Slik</n-text>
                <n-switch v-model:value="kunjunganForm.apply_slik" @update:value="handleChange"/>
              </div>
            </n-alert>
          </form>
        </n-scrollbar>
      </n-tab-pane>
      <n-tab-pane name="credit" tab="Credit">
        <CreditTab/>
      </n-tab-pane>
      <n-tab-pane name="debitur" tab="Debitur">
        <DebiturTab/>
      </n-tab-pane>
      <n-tab-pane name="jaminan" tab="Jaminan">
       <JaminanTab/>
      </n-tab-pane>
      <n-tab-pane name="analisa" tab="Analisa">
        <AnalisaForm/>
      </n-tab-pane>
    </n-tabs>

    <template #action>
      <n-button type="primary">
        <span v-if="!kunjunganForm.apply_slik">Kirim</span>
        <span v-else>Selanjutnya</span>
      </n-button>
    </template>
  </n-card>
</template>

<script setup>
import {useLoadingBar} from "naive-ui";
import SelectStateRegion from "../../../../components/molecules/SelectStateRegion.vue";
import FileUpload from "../../../../components/atoms/FileUpload.vue";
import {reactive} from "vue";
import Maps_point from "../../../aftersand/maps_point.vue";
import AnalisaPage from "../analisa/AnalisaPage.vue";
import AnalisaForm from "../analisa/AnalisaForm.vue";
import CreditTab from "./CreditTab.vue";
import DebiturTab from "./DebiturTab.vue";
import JaminanTab from "./JaminanTab.vue";
import FormAnalisaPage from "../analisa/FormAnalisaPage.vue";


const progres = useLoadingBar();
progres.finish();

const kunjunganForm = reactive({
  visit_date: null,
  cust_name: null,
  phone_number: null,
  provinsi: null,
  kota: null,
  kecamatan: null,
  desa: null,
  alamat: null,
  doc_visit: [],
  apply_slik: false,
});

</script>
