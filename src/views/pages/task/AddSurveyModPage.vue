<template>
    <n-card :bordered="true" :title="`${current}. ${steps[current - 1]}`" :segmented="{
        content: true,
    }">
        <n-scrollbar x-scrollable class="py-4">
            <n-space class="bg-sc-50 border rounded-xl p-4 mb-2">
                <n-steps :current="current" v-model:current="current" :status="currentStatus">
                    <n-step title="Informasi Order" :status="statusInformasiOrder" />
                    <n-step title="Data Pelanggan" :status="statusDataPelanggan" />
                    <n-step title="Data Jaminan" :status="statusDataJaminan" />
                    <n-step title="Data Survey" :status="statusDataSurvey" />
                </n-steps>
            </n-space>
        </n-scrollbar>
        <!-- card -->
        <n-alert type="warning" v-if="sumJaminan != 0 && order.plafond > sumJaminan / 2">Nilai Plafon <b>{{
            order.plafond.toLocaleString() }}</b> > Nilai Jaminan {{ (sumJaminan / 2).toLocaleString() }}
            (50%)</n-alert>

        <!-- container 1 -->
        <div v-show="current == 1">
            <n-form ref="formOrder" :model="order" :rules="rulesOrder" require-mark-placement="right-hanging">
                <div class="md:flex gap-2">
                    <n-form-item label="Plafond" path="plafond" class="w-full">
                        <n-input-number :parse="parse" :format="format" :min="999999" v-model:value="order.plafond"
                            placeholder="plafond" :loading="loading" :show-button="false" class="flex !w-full" clearable
                            :on-update:value="handlePlafond" />
                    </n-form-item>
                    <n-form-item label="Jenis Angsuran" path="jenis_angsuran" class="w-full">
                        <n-select filterable placeholder="Jenis Angsuran" :options="jenisAngsuran"
                            v-model:value="order.jenis_angsuran" :on-update:value="handleTipe"
                            :disabled="order.plafond != 0 ? false : true" />
                    </n-form-item>
                </div>
                <div class="md:flex gap-2">

                    <n-form-item label="Tenor / Angsuran" path="tenor" class="w-full">
                        <div class="flex flex-col md:flex-row" v-show="tipeAngsuran == 'bulanan'">
                            <n-radio-group v-model:value="order.tenor" name="radiogroup">
                                <n-radio name="tenor" value="6">
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
                                <n-radio name="tenor" value="12">
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
                                <n-radio name="tenor" value="18">
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
                                <n-radio name="tenor" value="24">
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
                        <div class="flex flex-col md:flex-row" v-show="tipeAngsuran == 'musiman'">
                            <n-radio-group v-model:value="order.tenor" name="radiogroup">
                                <n-radio name="tenor" value="3">
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
                                <n-radio name="tenor" value="6">
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
                                <n-radio name="tenor" value="12">
                                    2 x 6 bulan<n-text code>
                                        {{
                                            skemaAngsuran.length == null
                                                ? ` /
                                        ${skemaAngsuran.tenor_18.angsuran.toLocaleString("US")}`
                                                : ""
                                        }}
                                    </n-text>
                                </n-radio>
                                <n-divider vertical />
                                <n-radio name="tenor" value="18">
                                    3 x 6 bulan<n-text code>
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
                    <n-form-item label="Tujuan Kredit" path="tujuan_kredit" class="w-full">
                        <n-select filterable placeholder="Tujuan Kredit" :options="tujuanKredit"
                            v-model:value="order.tujuan_kredit" />
                    </n-form-item>
                </div>
            </n-form>
        </div>
        <div v-show="current === 2">
            <n-form ref="formPelanggan" :model="pelanggan" :rules="rulesPelanggan"
                require-mark-placement="right-hanging">
                <div class="md:flex gap-2">
                    <n-form-item label="No KTP" path="no_ktp" class="w-full">
                        <n-input :show-button="false" :allow-input="onlyAllowNumber" placeholder="NO KTP"
                            v-model:value="pelanggan.no_ktp" :loading="loadingKTP" @change="handleKtp" class="w-full"
                            maxlength="16" clearable />
                    </n-form-item>
                    <n-form-item label="Kategori Kredit" path="kategori_kredit" class="w-full">
                        <n-select filterable placeholder="Kategori Kredit" :options="optKategori" default-value="Baru"
                            v-model:value="order.category" disabled />
                    </n-form-item>
                    <n-form-item label="No KK" path="no_kk" class="w-full">
                        <n-input :allow-input="onlyAllowNumber" placeholder="No Kartu Keluarga"
                            v-model:value="pelanggan.no_kk" maxlength="16" />
                    </n-form-item>
                </div>
                <div class="md:flex gap-2">
                    <n-form-item label="Nama" path="nama" class="w-full">
                        <n-input placeholder="Nama" v-model:value="pelanggan.nama"
                            @input="$event => (pelanggan.nama = $event.toUpperCase())" />
                    </n-form-item>
                    <n-form-item label="Tanggal lahir" path="tgl_lahir" class="w-full">
                        <div class="w-full">

                            <n-date-picker placeholder="Tanggal Lahir" class="w-full"
                                v-model:formatted-value="pelanggan.tgl_lahir" value-format="yyyy-MM-dd"
                                format="dd-MM-yyyy" type="date" @update:value="handleTanggalLahir" />
                            <span class="absolute text-xs text-orange-500 bg-orange-50 w-full p-0.5 mt-2 animate-pulse"
                                v-show="notifUsia">{{ noteUsia }}</span>
                        </div>
                    </n-form-item>
                    <n-form-item label="No Handphone" path="no_hp" class="w-full">
                        <n-input placeholder="No Handphone" :allow-input="onlyAllowNumber"
                            v-model:value="pelanggan.no_hp" maxlength="13" />
                    </n-form-item>
                </div>
                <div class="flex flex-col md:flex-row gap-2 gap-x-2">
                    <n-form-item label="Alamat" path="alamat" class="w-full">
                        <n-input placeholder="Alamat" v-model:value="pelanggan.alamat"
                            @input="$event => (pelanggan.alamat = $event.toUpperCase())" class="w-full" />
                    </n-form-item>

                    <n-form-item path="rt">
                        <n-input-group>
                            <n-input placeholder="RT" v-model:value="pelanggan.rt" :allow-input="onlyAllowNumber"
                                maxlength="3" />
                            <n-input placeholder="RW" v-model:value="pelanggan.rw" :allow-input="onlyAllowNumber"
                                maxlength="3" />
                        </n-input-group>
                    </n-form-item>

                </div>
                <div>
                    <select-state-region v-model:provinsi="pelanggan.provinsi" v-model:kota="pelanggan.kota"
                        v-model:kecamatan="pelanggan.kecamatan" v-model:desa="pelanggan.kelurahan"
                        v-model:kodepos="pelanggan.kode_pos" />
                </div>
                <n-divider title-placement="left"> UPLOAD DOKUMEN IDENTITAS</n-divider>

                <div class="flex flex-col md:flex-row gap-2">
                    <file-upload title="KTP" :def_value="findDocByType(pelanggan.dokumen_indentitas, 'ktp')"
                        endpoint="image_upload_prospect" type="ktp" :idapp="dynamicForm.id" />
                    <file-upload title="KK" :def_value="findDocByType(pelanggan.dokumen_indentitas, 'kk')"
                        endpoint="image_upload_prospect" type="kk" :idapp="dynamicForm.id" />
                    <file-upload title="KTP Pasangan" endpoint="image_upload_prospect" type="ktp_pasangan"
                        :def_value="findDocByType(pelanggan.dokumen_indentitas, 'ktp_pasangan')"
                        :idapp="dynamicForm.id" />
                </div>
            </n-form>
        </div>
        <div v-show="current === 3">
            <n-alert type="error" v-if="statusDataJaminan === 'error'">minimal memiliki 1 jaminan</n-alert>
            <n-card embedded :segmented="true"
                :title="`Jumlah Jaminan : ${jaminanStore.listJaminan.length}, Total Nilai : ${sumJaminan.toLocaleString('US')}`">
                <div class=" flex w-60 gap-2">
                    <n-select v-model:value="jenisJaminan" :options="optJaminan" placeholder="jenis jaminan" />
                    <n-button circle type="primary" @click="addJaminan">
                        <n-icon>
                            <add-icon />
                        </n-icon>
                    </n-button>
                </div>
                <n-card :segmented="true" class="my-2 bg-white rounded-xl border hover:shadow"
                    v-for="(coll) in orderJaminan" :key="coll" :title="coll.type">
                    <template #header-extra>
                        <div class="flex gap-2">
                            <n-button type="warning" @click="viewModal(coll)" secondary>
                                <n-icon>
                                    <edit-icon />
                                </n-icon>
                                ubah </n-button>
                            <n-popconfirm @positive-click="removeJaminan(coll.id)" @negative-click="handleNegativeClick"
                                positive-text="ya" negative-text="tidak">
                                <template #trigger>
                                    <n-button type="error" secondary>
                                        <n-icon>
                                            <delete-icon />
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
                                        <b>{{ item === 'nilai' ? coll.atr[item].toLocaleString('US') :
                                            coll.atr[item] ? coll.atr[item] : '--' }}</b>
                                    </n-descriptions-item>
                                </n-descriptions>
                                <n-descriptions v-if="coll.type === 'sertifikat'"
                                    :label-placement="width < 720 ? 'left' : 'top'" bordered
                                    :column="width < 720 ? 1 : 8">
                                    <n-descriptions-item v-for="item in modelSertifikat" :key="item"
                                        :label="item.toUpperCase()">
                                        <b>{{ item === 'nilai' ? coll.atr[item].toLocaleString('US') :
                                            coll.atr[item] ? coll.atr[item] : '--' }}</b>
                                    </n-descriptions-item>
                                </n-descriptions>
                            </div>
                            <div>
                                <div v-if="coll.type == 'kendaraan'">
                                    <n-divider title-placement="left"> UPLOAD DOKUMEN JAMINAN </n-divider>
                                    <div class="flex flex-col md:flex-row gap-2">

                                        <file-upload :reff="coll.counter_id" title="No Rangka"
                                            endpoint="image_upload_prospect" :type="`no_rangka`" :idapp="dynamicForm.id"
                                            :def_value="findDocByType(coll.atr.document, 'no_rangka')" />
                                        <file-upload :reff="coll.counter_id" title="No Mesin"
                                            :def_value="findDocByType(coll.atr.document, 'no_mesin')"
                                            endpoint="image_upload_prospect" :type="`no_mesin`"
                                            :idapp="dynamicForm.id" />
                                        <file-upload :reff="coll.counter_id" title="STNK"
                                            :def_value="findDocByType(coll.atr.document, 'stnk')"
                                            endpoint="image_upload_prospect" :type="`stnk`" :idapp="dynamicForm.id" />
                                    </div>
                                </div>
                                <n-divider title-placement="left" class="uppercase"> Upload Dokumen {{ coll.type }}
                                </n-divider>
                                <div v-if="coll.type == 'kendaraan'" class="flex flex-col md:flex-row gap-2">
                                    <file-upload title="Depan" endpoint="image_upload_prospect" :type="`depan`"
                                        :idapp="dynamicForm.id" :reff="coll.counter_id"
                                        :def_value="findDocByType(coll.atr.document, 'depan')" />
                                    <file-upload title="Belakang" :reff="coll.counter_id"
                                        :def_value="findDocByType(coll.atr.document, 'belakang')"
                                        endpoint="image_upload_prospect" :type="`belakang`" :idapp="dynamicForm.id" />
                                    <file-upload title="Kanan" :reff="coll.counter_id" endpoint="image_upload_prospect"
                                        :def_value="findDocByType(coll.atr.document, 'kanan')" :type="`kanan`"
                                        :idapp="dynamicForm.id" />
                                    <file-upload title="Kiri" :reff="coll.counter_id" endpoint="image_upload_prospect"
                                        :type="`kiri`" :def_value="findDocByType(coll.atr.document, 'kiri')"
                                        :idapp="dynamicForm.id" />
                                </div>
                                <div v-else class="flex flex-col w-full">
                                    <file-upload :title="`dokumen`" :def_preview="true" :multi="true"
                                        :data_multi="coll.atr.document" endpoint="image_upload_prospect"
                                        :type="`sertifikat`" :reff="coll.counter_id" :idapp="dynamicForm.id" />
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
                    @childData="handleChildData" :def_data="dataProp" />
                <component :is="JaminanSertifikat" v-if="jenisJaminan.toLowerCase() == 'sertifikat'"
                    @childData="handleChildData" :def_data="dataProp" />
                <component :is="JaminanBillyet" v-if="jenisJaminan.toLowerCase() == 'deposito'"
                    @childData="handleChildData" :def_data="dataProp" />
                <!-- <component :is="JaminanBillyet" v-if="jenisJaminan == 'billyet'" @childData="handleChildData" />
        <component :is="JaminanEmas" v-if="jenisJaminan == 'emas'" @childData="handleChildData" /> -->
                <template #footer>
                    <n-space>

                        <n-button type="primary" @click="ubahJaminan(jenisJaminan)" v-if="dataProp">ubah</n-button>
                        <n-button type="primary" @click="pushJaminan(jenisJaminan)" v-else
                            :disabled="!receivedData.nilai">tambah</n-button>
                        <n-button type="warning" @click="showModal = false">batal</n-button>
                    </n-space>
                </template>
            </n-card>
        </n-modal>
        <div v-show="current === 4">
            <n-form ref="formSurvey" :model="survey" :rules="rulesSurvey" require-mark-placement="right-hanging">
                <div class="flex gap-4">
                    <n-form-item label="Tanggal survey" path="tgl_survey" class="w-full">
                        <n-date-picker placeholder="Tanggal Survey" class="w-full"
                            v-model:formatted-value="survey.tgl_survey" disabled value-format="yyyy-MM-dd"
                            format="dd-MM-yyyy" type="date" />
                    </n-form-item>
                    <n-form-item label="Lama Bekerja" path="lama_bekerja" class="w-full">
                        <n-input :allow-input="onlyAllowNumber" placeholder="lama bekerja"
                            v-model:value="survey.lama_bekerja" class="w-full">
                            <template #suffix> bulan </template>
                        </n-input>
                    </n-form-item>
                </div>
                <div class="md:flex gap-4">
                    <n-form-item label="Pendapatan pelanggan " path="pendapatan_pribadi" class="w-full">
                        <n-input-number v-bind:dir="isRtl ? 'rtl' : 'ltr'" class="flex w-full" :parse="parse"
                            :format="format" v-model:value="survey.pendapatan_pribadi"
                            placeholder="pendapatan pelanggan" :show-button="false">
                            <template #suffix> perbulan </template>
                        </n-input-number>
                    </n-form-item>
                    <n-form-item label="Pendapatan Pasangan" path="penghasilan_pasangan" class="w-full">
                        <n-input-number v-bind:dir="isRtl ? 'rtl' : 'ltr'" class="flex w-full" :parse="parse"
                            :format="format" v-model:value="survey.pendapatan_pasangan"
                            placeholder="pendapatan pasangan" :show-button="false">
                            <template #suffix> perbulan </template>
                        </n-input-number>
                    </n-form-item>
                    <n-form-item label="Pendapatan Lainnya" path="penghasilan_pasangan" class="w-full">
                        <n-input-number v-bind:dir="isRtl ? 'rtl' : 'ltr'" class="flex w-full" :parse="parse"
                            :format="format" v-model:value="survey.pendapatan_lainnya"
                            placeholder="pendapatan lain-lain" :show-button="false">
                            <template #suffix> perbulan </template>
                        </n-input-number>
                    </n-form-item>
                    <n-form-item label="Pengeluaran" path="pengeluaran" class="w-full">
                        <n-input-number v-bind:dir="isRtl ? 'rtl' : 'ltr'" :parse="parse" :format="format"
                            class="w-full" v-model:value="survey.pengeluaran" placeholder="pengeluaran"
                            :show-button="false">
                            <template #suffix> perbulan </template>
                        </n-input-number>
                    </n-form-item>
                </div>
                <div class="flex gap-4">
                    <n-form-item label="Pekerjaan" path="pekerjaan" class="w-full">
                        <n-select filterable placeholder="pekerjaan" counter :options="optSektor"
                            v-model:value="survey.sektor" />
                    </n-form-item>
                </div>
                <n-form-item label="Catatan Survey" path="catatan_survey">
                    <n-input @blur="endForm" v-model:value="survey.catatan_survey"
                        @input="$event => (survey.catatan_survey = $event.toUpperCase())" :autosize="{
                            minRows: 3,
                            maxRows: 5,
                        }" type="textarea" placeholder="catatan survey" />
                </n-form-item>
                <n-divider title-placement="left"> Dokumen Pendukung </n-divider>
                <file-upload :def_preview="true" title="dokumen pendukung" endpoint="image_upload_prospect" type="other"
                    :idapp="dynamicForm.id" />
            </n-form>
        </div>
        <template #action>
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
                <n-button :loading="loading" icon-placement="left" type="primary" @click="handleValid('send')" v-else>
                    kirim ke admin
                </n-button>
                <n-button type="info" @click="handleSave()">
                    simpan
                </n-button>
            </n-flex>
        </template>
    </n-card>
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
import router from "../../../router";
import { useWindowSize } from "@vueuse/core";
import { useApi } from "../../../helpers/axios";
import { useBlacklist } from "../../../helpers/blacklist";
import JaminanKendaraan from "./survey/JaminanKendaraan.vue";
import _ from "lodash";
import { computed } from "vue";
import JaminanSertifikat from "./survey/JaminanSertifikat.vue";
// import JaminanBillyet from "./survey/JaminanBillyet.vue";
// import JaminanEmas from "./survey/JaminanEmas.vue";
import { useJaminanStore } from "../../../stores/jaminan";
import JaminanBillyet from "./survey/JaminanBillyet.vue";
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
    return jaminanStore.listJaminan.reduce((sum, item) => sum + parseInt(item.atr.nilai, 10), 0);
});
const orderJaminan = computed(() => _.orderBy(jaminanStore.listJaminan, 'counter_id', 'desc'));
const jenisJaminan = ref('kendaraan');
const viewModal = (e) => {
    let findData = _.findIndex(jaminanStore.listJaminan, { 'counter_id': e.counter_id });
    let selectedData = jaminanStore.listJaminan[findData];
    jenisJaminan.value = e.type;
    dataProp.value = selectedData;
    showModal.value = !showModal.value;
}
const removeJaminan = (e) => {
    let index = _.findIndex(anyJaminan.value, { 'id': e });
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
const optJaminan = ["KENDARAAN", "SERTIFIKAT"].map((v) => ({
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
    order.value.plafond = e;
    const body = {
        plafond: e,
        jenis_angsuran: order.value.jenis_angsuran,
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
    tenor: {
        trigger: "blur",
        required: true,
        message: "tenor / angsuran harus dipilih",
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
const isRtl = true;
const onlyAllowNumber = (value) => !value || /^\d+$/.test(value);
onMounted(() => {
    jaminanStore.initJaminan();
});
</script>
