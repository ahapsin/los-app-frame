<template>
    <n-card title="Beban Tagih" :segmented="true" size="small">
        <div>
            <n-space vertical :size="12" class="pt-4">
                <n-input type="text" placeholder="nyari apa ?" v-model:value="boxSearch" v-if="!ctrDownload"
                    @blur="searchData" />
                <n-data-table :columns="columnBebanTagih" :data="dataList" :pagination="pagination"
                    :row-key="(row) => row" @update:checked-row-keys="handleCheck" :max-height="350" />
            </n-space>
        </div>
    </n-card>
    <n-float-button :right="40" :bottom="40" type="primary" v-if="checkedRowKeys.length > 0"
        @click="modalAssign = true">
        <n-badge :value="checkedRowKeys.length" :offset="[6, -8]">
            <v-icon name="bi-plus-lg" />
        </n-badge>

    </n-float-button>
    <n-modal v-model:show="modalAssign" :mask-closable="false">
        <n-card class="w-1/4">
            <n-tag class="mb-2" round type="info">{{ checkedRowKeys.length }} data terpilih</n-tag>

            <n-space vertical>
                <n-form-item label="petugas">
                    <n-select v-model:value="assignTo" placeholder="pilih petugas"
                        :options="_.filter(dataUser, { 'cabang_nama': me.me.cabang_nama })" value-field="username"
                        label-field="nama" filterable />
                </n-form-item>
                <n-space>
                    <n-button type="primary">OK</n-button>
                    <n-button type="secondary" @click="modalAssign = false">Batal</n-button>
                </n-space>
            </n-space>
        </n-card>
    </n-modal>
</template>
<script setup>
import moment from "moment";
import { useLoadingBar, useMessage } from "naive-ui";
import { computed, onMounted, ref } from "vue";
import { useApi } from "../../../helpers/axios.js";
import { useMeStore } from "../../../stores/me";
import * as XLSX from "xlsx";
import _ from "lodash";
import { useSearch } from "../../../helpers/searchObject";

const tableRef = ref();
const me = useMeStore();
const message = useMessage();
const dataBranch = ref([]);
const selectBranch = ref();
const modalAssign = ref(false);


const selectedBranch = ref();
const handleUpdateBranch = (value, option) => {
    selectedBranch.value = option;
}


const dummyData = [{
    "KODE CABANG": "003-ANJ",
    "NAMA CABANG": "Anjatan",
    "NO KONTRAK": 11101190000187,
    "NAMA PELANGGAN": "DADI BIN SAYAM",
    "TGL BOOKING": "02/13/2019",
    "UB": "",
    "PLATFORM": "",
    "ALAMAT TAGIH": "BLOK BULU RT 01 RW 01 DS LIMPAS KEC PATROL RT/01 RW/01 KAB. INDRAMAYU JAWA BARAT",
    "KECAMATAN": "KEC. PATROL",
    "KELURAHAN": "LIMPAS",
    "NO TELP": "081220534179",
    "NO HP1": "",
    "NO HP2": "",
    "PEKERJAAN": "WIRASWASTA",
    "SUPPLIER": "",
    "SURVEYOR": "NURFAUZI",
    "CATT SURVEY": "PK ADALAH SEORANG TUKANG OJEK ISTRI PK IRT",
    "PKK HUTANG": 1500000,
    "JML ANGS": 12,
    "JRK ANGS": 1,
    "PERIOD": 12,
    "OUT PKK AWAL": 153821,
    "OUT BNG AWAL": 6179,
    "OVERDUE AWAL": 1966,
    "AMBC PKK AWAL": 153821,
    "AMBC BNG AWAL": 6179,
    "AMBC TOTAL AWAL": 160000,
    "CYCLE AWAL": "CX",
    "STS KONTRAK": "AC",
    "STS BEBAN": "AC",
    "POLA BYR AWAL": "",
    "OUTS PKK AKHIR": 153821,
    "OUTS BNG AKHIR": 6179,
    "OVERDUE AKHIR": 1997,
    "ANGSURAN": 160000,
    "ANGS KE": 12,
    "TIPE ANGSURAN": "bulanan",
    "JTH TEMPO AWAL": "12/2/2020",
    "JTH TEMPO AKHIR": "12/2/2020",
    "TGL BAYAR": "",
    "KOLEKTOR": "unknown",
    "CARA BYR": null,
    "AMBC PKK_AKHIR": 153821,
    "AMBC BNG_AKHIR": 6179,
    "AMBC TOTAL_AKHIR": 160000,
    "AC PKK": 0,
    "AC BNG MRG": 0,
    "AC TOTAL": 0,
    "CYCLE AKHIR": "CX",
    "POLA BYR AKHIR": "",
    "NAMA BRG": null,
    "TIPE BRG": "HONDA NF 100 L SUPRA FIT TROMOL",
    "NO POL": "E4319RH",
    "NO MESIN": "HB31E1107525",
    "NO RANGKA": "MH1HB31125KK109961",
    "TAHUN": "2005",
    "NILAI PINJAMAN": 1000000,
    "ADMIN": 500000,
    "CUST_ID": 1110119000553
}, {
    "KODE CABANG": "003-ANJ",
    "NAMA CABANG": "Anjatan",
    "NO KONTRAK": 11101190000195,
    "NAMA PELANGGAN": "WAHYUDIN",
    "TGL BOOKING": "2/17/2019",
    "UB": "",
    "PLATFORM": "",
    "ALAMAT TAGIH": "DUSUN LUNGMALANG RT 12 RW 03 DS BUGIS KEC ANJATAN RT/12 RW/03 KAB. INDRAMAYU JAWA BARAT",
    "KECAMATAN": "KEC. ANJATAN",
    "KELURAHAN": "BUGIS",
    "NO TELP": "082316695353",
    "NO HP1": "",
    "NO HP2": "",
    "PEKERJAAN": "MENGURUS RUMAH TANGGA",
    "SUPPLIER": "",
    "SURVEYOR": "CASDIKIN",
    "CATT SURVEY": "PK ADALAH SEORANG PEDAGANG SAYUR KELILING ISTRI PK IRT",
    "PKK HUTANG": 4650000,
    "JML ANGS": 24,
    "JRK ANGS": 1,
    "PERIOD": 24,
    "OUT PKK AWAL": 4650000,
    "OUT BNG AWAL": 2310000,
    "OVERDUE AWAL": 2301,
    "AMBC PKK AWAL": 4650000,
    "AMBC BNG AWAL": 2310000,
    "AMBC TOTAL AWAL": 6960000,
    "CYCLE AWAL": "CX",
    "STS KONTRAK": "AC",
    "STS BEBAN": "AC",
    "POLA BYR AWAL": "",
    "OUTS PKK AKHIR": 4650000,
    "OUTS BNG AKHIR": 2310000,
    "OVERDUE AKHIR": 2332,
    "ANGSURAN": 290000,
    "ANGS KE": 1,
    "TIPE ANGSURAN": "bulanan",
    "JTH TEMPO AWAL": "14/3/2019",
    "JTH TEMPO AKHIR": "14/3/2019",
    "TGL BAYAR": "",
    "KOLEKTOR": "unknown",
    "CARA BYR": null,
    "AMBC PKK_AKHIR": 4650000,
    "AMBC BNG_AKHIR": 2310000,
    "AMBC TOTAL_AKHIR": 6960000,
    "AC PKK": 0,
    "AC BNG MRG": 0,
    "AC TOTAL": 0,
    "CYCLE AKHIR": "CX",
    "POLA BYR AKHIR": "",
    "NAMA BRG": null,
    "TIPE BRG": "SUZUKI CARRY CARRY",
    "NO POL": "D1012EG",
    "NO MESIN": "F10AA1D184275",
    "NO RANGKA": "SL410285379",
    "TAHUN": "1988",
    "NILAI PINJAMAN": 4000000,
    "ADMIN": 650000,
    "CUST_ID": 1110119000560
}, {
    "KODE CABANG": "003-ANJ",
    "NAMA CABANG": "Anjatan",
    "NO KONTRAK": 11101190000195,
    "NAMA PELANGGAN": "WAHYUDIN",
    "TGL BOOKING": "2/17/2019",
    "UB": "",
    "PLATFORM": "",
    "ALAMAT TAGIH": "DUSUN LUNGMALANG RT 12 RW 03 DS BUGIS KEC ANJATAN RT/12 RW/03 KAB. INDRAMAYU JAWA BARAT",
    "KECAMATAN": "KEC. ANJATAN",
    "KELURAHAN": "BUGIS",
    "NO TELP": "082316695353",
    "NO HP1": "",
    "NO HP2": "",
    "PEKERJAAN": "MENGURUS RUMAH TANGGA",
    "SUPPLIER": "",
    "SURVEYOR": "CASDIKIN",
    "CATT SURVEY": "PK ADALAH SEORANG PEDAGANG SAYUR KELILING ISTRI PK IRT",
    "PKK HUTANG": 4650000,
    "JML ANGS": 24,
    "JRK ANGS": 1,
    "PERIOD": 24,
    "OUT PKK AWAL": 4650000,
    "OUT BNG AWAL": 2310000,
    "OVERDUE AWAL": 2301,
    "AMBC PKK AWAL": 4650000,
    "AMBC BNG AWAL": 2310000,
    "AMBC TOTAL AWAL": 6960000,
    "CYCLE AWAL": "CX",
    "STS KONTRAK": "AC",
    "STS BEBAN": "AC",
    "POLA BYR AWAL": "",
    "OUTS PKK AKHIR": 4650000,
    "OUTS BNG AKHIR": 2310000,
    "OVERDUE AKHIR": 2332,
    "ANGSURAN": 290000,
    "ANGS KE": 1,
    "TIPE ANGSURAN": "bulanan",
    "JTH TEMPO AWAL": "14/3/2019",
    "JTH TEMPO AKHIR": "14/3/2019",
    "TGL BAYAR": "",
    "KOLEKTOR": "unknown",
    "CARA BYR": null,
    "AMBC PKK_AKHIR": 4650000,
    "AMBC BNG_AKHIR": 2310000,
    "AMBC TOTAL_AKHIR": 6960000,
    "AC PKK": 0,
    "AC BNG MRG": 0,
    "AC TOTAL": 0,
    "CYCLE AKHIR": "CX",
    "POLA BYR AKHIR": "",
    "NAMA BRG": null,
    "TIPE BRG": "SUZUKI CARRY CARRY",
    "NO POL": "D1012EG",
    "NO MESIN": "F10AA1D184275",
    "NO RANGKA": "SL410285379",
    "TAHUN": "1988",
    "NILAI PINJAMAN": 4000000,
    "ADMIN": 650000,
    "CUST_ID": 1110119000560
}, {
    "KODE CABANG": "003-ANJ",
    "NAMA CABANG": "Anjatan",
    "NO KONTRAK": 11101190000195,
    "NAMA PELANGGAN": "WAHYUDIN",
    "TGL BOOKING": "2/17/2019",
    "UB": "",
    "PLATFORM": "",
    "ALAMAT TAGIH": "DUSUN LUNGMALANG RT 12 RW 03 DS BUGIS KEC ANJATAN RT/12 RW/03 KAB. INDRAMAYU JAWA BARAT",
    "KECAMATAN": "KEC. ANJATAN",
    "KELURAHAN": "BUGIS",
    "NO TELP": "082316695353",
    "NO HP1": "",
    "NO HP2": "",
    "PEKERJAAN": "MENGURUS RUMAH TANGGA",
    "SUPPLIER": "",
    "SURVEYOR": "CASDIKIN",
    "CATT SURVEY": "PK ADALAH SEORANG PEDAGANG SAYUR KELILING ISTRI PK IRT",
    "PKK HUTANG": 4650000,
    "JML ANGS": 24,
    "JRK ANGS": 1,
    "PERIOD": 24,
    "OUT PKK AWAL": 4650000,
    "OUT BNG AWAL": 2310000,
    "OVERDUE AWAL": 2301,
    "AMBC PKK AWAL": 4650000,
    "AMBC BNG AWAL": 2310000,
    "AMBC TOTAL AWAL": 6960000,
    "CYCLE AWAL": "CX",
    "STS KONTRAK": "AC",
    "STS BEBAN": "AC",
    "POLA BYR AWAL": "",
    "OUTS PKK AKHIR": 4650000,
    "OUTS BNG AKHIR": 2310000,
    "OVERDUE AKHIR": 2332,
    "ANGSURAN": 290000,
    "ANGS KE": 1,
    "TIPE ANGSURAN": "bulanan",
    "JTH TEMPO AWAL": "14/3/2019",
    "JTH TEMPO AKHIR": "14/3/2019",
    "TGL BAYAR": "",
    "KOLEKTOR": "unknown",
    "CARA BYR": null,
    "AMBC PKK_AKHIR": 4650000,
    "AMBC BNG_AKHIR": 2310000,
    "AMBC TOTAL_AKHIR": 6960000,
    "AC PKK": 0,
    "AC BNG MRG": 0,
    "AC TOTAL": 0,
    "CYCLE AKHIR": "CX",
    "POLA BYR AKHIR": "",
    "NAMA BRG": null,
    "TIPE BRG": "SUZUKI CARRY CARRY",
    "NO POL": "D1012EG",
    "NO MESIN": "F10AA1D184275",
    "NO RANGKA": "SL410285379",
    "TAHUN": "1988",
    "NILAI PINJAMAN": 4000000,
    "ADMIN": 650000,
    "CUST_ID": 1110119000560
}, {
    "KODE CABANG": "003-ANJ",
    "NAMA CABANG": "Anjatan",
    "NO KONTRAK": 11101190000195,
    "NAMA PELANGGAN": "WAHYUDIN",
    "TGL BOOKING": "2/17/2019",
    "UB": "",
    "PLATFORM": "",
    "ALAMAT TAGIH": "DUSUN LUNGMALANG RT 12 RW 03 DS BUGIS KEC ANJATAN RT/12 RW/03 KAB. INDRAMAYU JAWA BARAT",
    "KECAMATAN": "KEC. ANJATAN",
    "KELURAHAN": "BUGIS",
    "NO TELP": "082316695353",
    "NO HP1": "",
    "NO HP2": "",
    "PEKERJAAN": "MENGURUS RUMAH TANGGA",
    "SUPPLIER": "",
    "SURVEYOR": "CASDIKIN",
    "CATT SURVEY": "PK ADALAH SEORANG PEDAGANG SAYUR KELILING ISTRI PK IRT",
    "PKK HUTANG": 4650000,
    "JML ANGS": 24,
    "JRK ANGS": 1,
    "PERIOD": 24,
    "OUT PKK AWAL": 4650000,
    "OUT BNG AWAL": 2310000,
    "OVERDUE AWAL": 2301,
    "AMBC PKK AWAL": 4650000,
    "AMBC BNG AWAL": 2310000,
    "AMBC TOTAL AWAL": 6960000,
    "CYCLE AWAL": "CX",
    "STS KONTRAK": "AC",
    "STS BEBAN": "AC",
    "POLA BYR AWAL": "",
    "OUTS PKK AKHIR": 4650000,
    "OUTS BNG AKHIR": 2310000,
    "OVERDUE AKHIR": 2332,
    "ANGSURAN": 290000,
    "ANGS KE": 1,
    "TIPE ANGSURAN": "bulanan",
    "JTH TEMPO AWAL": "14/3/2019",
    "JTH TEMPO AKHIR": "14/3/2019",
    "TGL BAYAR": "",
    "KOLEKTOR": "unknown",
    "CARA BYR": null,
    "AMBC PKK_AKHIR": 4650000,
    "AMBC BNG_AKHIR": 2310000,
    "AMBC TOTAL_AKHIR": 6960000,
    "AC PKK": 0,
    "AC BNG MRG": 0,
    "AC TOTAL": 0,
    "CYCLE AKHIR": "CX",
    "POLA BYR AKHIR": "",
    "NAMA BRG": null,
    "TIPE BRG": "SUZUKI CARRY CARRY",
    "NO POL": "D1012EG",
    "NO MESIN": "F10AA1D184275",
    "NO RANGKA": "SL410285379",
    "TAHUN": "1988",
    "NILAI PINJAMAN": 4000000,
    "ADMIN": 650000,
    "CUST_ID": 1110119000560
}, {
    "KODE CABANG": "003-ANJ",
    "NAMA CABANG": "Anjatan",
    "NO KONTRAK": 11101190000195,
    "NAMA PELANGGAN": "WAHYUDIN",
    "TGL BOOKING": "2/17/2019",
    "UB": "",
    "PLATFORM": "",
    "ALAMAT TAGIH": "DUSUN LUNGMALANG RT 12 RW 03 DS BUGIS KEC ANJATAN RT/12 RW/03 KAB. INDRAMAYU JAWA BARAT",
    "KECAMATAN": "KEC. ANJATAN",
    "KELURAHAN": "BUGIS",
    "NO TELP": "082316695353",
    "NO HP1": "",
    "NO HP2": "",
    "PEKERJAAN": "MENGURUS RUMAH TANGGA",
    "SUPPLIER": "",
    "SURVEYOR": "CASDIKIN",
    "CATT SURVEY": "PK ADALAH SEORANG PEDAGANG SAYUR KELILING ISTRI PK IRT",
    "PKK HUTANG": 4650000,
    "JML ANGS": 24,
    "JRK ANGS": 1,
    "PERIOD": 24,
    "OUT PKK AWAL": 4650000,
    "OUT BNG AWAL": 2310000,
    "OVERDUE AWAL": 2301,
    "AMBC PKK AWAL": 4650000,
    "AMBC BNG AWAL": 2310000,
    "AMBC TOTAL AWAL": 6960000,
    "CYCLE AWAL": "CX",
    "STS KONTRAK": "AC",
    "STS BEBAN": "AC",
    "POLA BYR AWAL": "",
    "OUTS PKK AKHIR": 4650000,
    "OUTS BNG AKHIR": 2310000,
    "OVERDUE AKHIR": 2332,
    "ANGSURAN": 290000,
    "ANGS KE": 1,
    "TIPE ANGSURAN": "bulanan",
    "JTH TEMPO AWAL": "14/3/2019",
    "JTH TEMPO AKHIR": "14/3/2019",
    "TGL BAYAR": "",
    "KOLEKTOR": "unknown",
    "CARA BYR": null,
    "AMBC PKK_AKHIR": 4650000,
    "AMBC BNG_AKHIR": 2310000,
    "AMBC TOTAL_AKHIR": 6960000,
    "AC PKK": 0,
    "AC BNG MRG": 0,
    "AC TOTAL": 0,
    "CYCLE AKHIR": "CX",
    "POLA BYR AKHIR": "",
    "NAMA BRG": null,
    "TIPE BRG": "SUZUKI CARRY CARRY",
    "NO POL": "D1012EG",
    "NO MESIN": "F10AA1D184275",
    "NO RANGKA": "SL410285379",
    "TAHUN": "1988",
    "NILAI PINJAMAN": 4000000,
    "ADMIN": 650000,
    "CUST_ID": 1110119000560
}, {
    "KODE CABANG": "003-ANJ",
    "NAMA CABANG": "Anjatan",
    "NO KONTRAK": 11101190000195,
    "NAMA PELANGGAN": "WAHYUDIN",
    "TGL BOOKING": "2/17/2019",
    "UB": "",
    "PLATFORM": "",
    "ALAMAT TAGIH": "DUSUN LUNGMALANG RT 12 RW 03 DS BUGIS KEC ANJATAN RT/12 RW/03 KAB. INDRAMAYU JAWA BARAT",
    "KECAMATAN": "KEC. ANJATAN",
    "KELURAHAN": "BUGIS",
    "NO TELP": "082316695353",
    "NO HP1": "",
    "NO HP2": "",
    "PEKERJAAN": "MENGURUS RUMAH TANGGA",
    "SUPPLIER": "",
    "SURVEYOR": "CASDIKIN",
    "CATT SURVEY": "PK ADALAH SEORANG PEDAGANG SAYUR KELILING ISTRI PK IRT",
    "PKK HUTANG": 4650000,
    "JML ANGS": 24,
    "JRK ANGS": 1,
    "PERIOD": 24,
    "OUT PKK AWAL": 4650000,
    "OUT BNG AWAL": 2310000,
    "OVERDUE AWAL": 2301,
    "AMBC PKK AWAL": 4650000,
    "AMBC BNG AWAL": 2310000,
    "AMBC TOTAL AWAL": 6960000,
    "CYCLE AWAL": "CX",
    "STS KONTRAK": "AC",
    "STS BEBAN": "AC",
    "POLA BYR AWAL": "",
    "OUTS PKK AKHIR": 4650000,
    "OUTS BNG AKHIR": 2310000,
    "OVERDUE AKHIR": 2332,
    "ANGSURAN": 290000,
    "ANGS KE": 1,
    "TIPE ANGSURAN": "bulanan",
    "JTH TEMPO AWAL": "14/3/2019",
    "JTH TEMPO AKHIR": "14/3/2019",
    "TGL BAYAR": "",
    "KOLEKTOR": "unknown",
    "CARA BYR": null,
    "AMBC PKK_AKHIR": 4650000,
    "AMBC BNG_AKHIR": 2310000,
    "AMBC TOTAL_AKHIR": 6960000,
    "AC PKK": 0,
    "AC BNG MRG": 0,
    "AC TOTAL": 0,
    "CYCLE AKHIR": "CX",
    "POLA BYR AKHIR": "",
    "NAMA BRG": null,
    "TIPE BRG": "SUZUKI CARRY CARRY",
    "NO POL": "D1012EG",
    "NO MESIN": "F10AA1D184275",
    "NO RANGKA": "SL410285379",
    "TAHUN": "1988",
    "NILAI PINJAMAN": 4000000,
    "ADMIN": 650000,
    "CUST_ID": 1110119000560
}, {
    "KODE CABANG": "003-ANJ",
    "NAMA CABANG": "Anjatan",
    "NO KONTRAK": 11101190000195,
    "NAMA PELANGGAN": "WAHYUDIN",
    "TGL BOOKING": "2/17/2019",
    "UB": "",
    "PLATFORM": "",
    "ALAMAT TAGIH": "DUSUN LUNGMALANG RT 12 RW 03 DS BUGIS KEC ANJATAN RT/12 RW/03 KAB. INDRAMAYU JAWA BARAT",
    "KECAMATAN": "KEC. ANJATAN",
    "KELURAHAN": "BUGIS",
    "NO TELP": "082316695353",
    "NO HP1": "",
    "NO HP2": "",
    "PEKERJAAN": "MENGURUS RUMAH TANGGA",
    "SUPPLIER": "",
    "SURVEYOR": "CASDIKIN",
    "CATT SURVEY": "PK ADALAH SEORANG PEDAGANG SAYUR KELILING ISTRI PK IRT",
    "PKK HUTANG": 4650000,
    "JML ANGS": 24,
    "JRK ANGS": 1,
    "PERIOD": 24,
    "OUT PKK AWAL": 4650000,
    "OUT BNG AWAL": 2310000,
    "OVERDUE AWAL": 2301,
    "AMBC PKK AWAL": 4650000,
    "AMBC BNG AWAL": 2310000,
    "AMBC TOTAL AWAL": 6960000,
    "CYCLE AWAL": "CX",
    "STS KONTRAK": "AC",
    "STS BEBAN": "AC",
    "POLA BYR AWAL": "",
    "OUTS PKK AKHIR": 4650000,
    "OUTS BNG AKHIR": 2310000,
    "OVERDUE AKHIR": 2332,
    "ANGSURAN": 290000,
    "ANGS KE": 1,
    "TIPE ANGSURAN": "bulanan",
    "JTH TEMPO AWAL": "14/3/2019",
    "JTH TEMPO AKHIR": "14/3/2019",
    "TGL BAYAR": "",
    "KOLEKTOR": "unknown",
    "CARA BYR": null,
    "AMBC PKK_AKHIR": 4650000,
    "AMBC BNG_AKHIR": 2310000,
    "AMBC TOTAL_AKHIR": 6960000,
    "AC PKK": 0,
    "AC BNG MRG": 0,
    "AC TOTAL": 0,
    "CYCLE AKHIR": "CX",
    "POLA BYR AKHIR": "",
    "NAMA BRG": null,
    "TIPE BRG": "SUZUKI CARRY CARRY",
    "NO POL": "D1012EG",
    "NO MESIN": "F10AA1D184275",
    "NO RANGKA": "SL410285379",
    "TAHUN": "1988",
    "NILAI PINJAMAN": 4000000,
    "ADMIN": 650000,
    "CUST_ID": 1110119000560
}, {
    "KODE CABANG": "003-ANJ",
    "NAMA CABANG": "Anjatan",
    "NO KONTRAK": 11101190000195,
    "NAMA PELANGGAN": "WAHYUDIN",
    "TGL BOOKING": "2/17/2019",
    "UB": "",
    "PLATFORM": "",
    "ALAMAT TAGIH": "DUSUN LUNGMALANG RT 12 RW 03 DS BUGIS KEC ANJATAN RT/12 RW/03 KAB. INDRAMAYU JAWA BARAT",
    "KECAMATAN": "KEC. ANJATAN",
    "KELURAHAN": "BUGIS",
    "NO TELP": "082316695353",
    "NO HP1": "",
    "NO HP2": "",
    "PEKERJAAN": "MENGURUS RUMAH TANGGA",
    "SUPPLIER": "",
    "SURVEYOR": "CASDIKIN",
    "CATT SURVEY": "PK ADALAH SEORANG PEDAGANG SAYUR KELILING ISTRI PK IRT",
    "PKK HUTANG": 4650000,
    "JML ANGS": 24,
    "JRK ANGS": 1,
    "PERIOD": 24,
    "OUT PKK AWAL": 4650000,
    "OUT BNG AWAL": 2310000,
    "OVERDUE AWAL": 2301,
    "AMBC PKK AWAL": 4650000,
    "AMBC BNG AWAL": 2310000,
    "AMBC TOTAL AWAL": 6960000,
    "CYCLE AWAL": "CX",
    "STS KONTRAK": "AC",
    "STS BEBAN": "AC",
    "POLA BYR AWAL": "",
    "OUTS PKK AKHIR": 4650000,
    "OUTS BNG AKHIR": 2310000,
    "OVERDUE AKHIR": 2332,
    "ANGSURAN": 290000,
    "ANGS KE": 1,
    "TIPE ANGSURAN": "bulanan",
    "JTH TEMPO AWAL": "14/3/2019",
    "JTH TEMPO AKHIR": "14/3/2019",
    "TGL BAYAR": "",
    "KOLEKTOR": "unknown",
    "CARA BYR": null,
    "AMBC PKK_AKHIR": 4650000,
    "AMBC BNG_AKHIR": 2310000,
    "AMBC TOTAL_AKHIR": 6960000,
    "AC PKK": 0,
    "AC BNG MRG": 0,
    "AC TOTAL": 0,
    "CYCLE AKHIR": "CX",
    "POLA BYR AKHIR": "",
    "NAMA BRG": null,
    "TIPE BRG": "SUZUKI CARRY CARRY",
    "NO POL": "D1012EG",
    "NO MESIN": "F10AA1D184275",
    "NO RANGKA": "SL410285379",
    "TAHUN": "1988",
    "NILAI PINJAMAN": 4000000,
    "ADMIN": 650000,
    "CUST_ID": 1110119000560
}, {
    "KODE CABANG": "003-ANJ",
    "NAMA CABANG": "Anjatan",
    "NO KONTRAK": 11101190000195,
    "NAMA PELANGGAN": "WAHYUDIN",
    "TGL BOOKING": "2/17/2019",
    "UB": "",
    "PLATFORM": "",
    "ALAMAT TAGIH": "DUSUN LUNGMALANG RT 12 RW 03 DS BUGIS KEC ANJATAN RT/12 RW/03 KAB. INDRAMAYU JAWA BARAT",
    "KECAMATAN": "KEC. ANJATAN",
    "KELURAHAN": "BUGIS",
    "NO TELP": "082316695353",
    "NO HP1": "",
    "NO HP2": "",
    "PEKERJAAN": "MENGURUS RUMAH TANGGA",
    "SUPPLIER": "",
    "SURVEYOR": "CASDIKIN",
    "CATT SURVEY": "PK ADALAH SEORANG PEDAGANG SAYUR KELILING ISTRI PK IRT",
    "PKK HUTANG": 4650000,
    "JML ANGS": 24,
    "JRK ANGS": 1,
    "PERIOD": 24,
    "OUT PKK AWAL": 4650000,
    "OUT BNG AWAL": 2310000,
    "OVERDUE AWAL": 2301,
    "AMBC PKK AWAL": 4650000,
    "AMBC BNG AWAL": 2310000,
    "AMBC TOTAL AWAL": 6960000,
    "CYCLE AWAL": "CX",
    "STS KONTRAK": "AC",
    "STS BEBAN": "AC",
    "POLA BYR AWAL": "",
    "OUTS PKK AKHIR": 4650000,
    "OUTS BNG AKHIR": 2310000,
    "OVERDUE AKHIR": 2332,
    "ANGSURAN": 290000,
    "ANGS KE": 1,
    "TIPE ANGSURAN": "bulanan",
    "JTH TEMPO AWAL": "14/3/2019",
    "JTH TEMPO AKHIR": "14/3/2019",
    "TGL BAYAR": "",
    "KOLEKTOR": "unknown",
    "CARA BYR": null,
    "AMBC PKK_AKHIR": 4650000,
    "AMBC BNG_AKHIR": 2310000,
    "AMBC TOTAL_AKHIR": 6960000,
    "AC PKK": 0,
    "AC BNG MRG": 0,
    "AC TOTAL": 0,
    "CYCLE AKHIR": "CX",
    "POLA BYR AKHIR": "",
    "NAMA BRG": null,
    "TIPE BRG": "SUZUKI CARRY CARRY",
    "NO POL": "D1012EG",
    "NO MESIN": "F10AA1D184275",
    "NO RANGKA": "SL410285379",
    "TAHUN": "1988",
    "NILAI PINJAMAN": 4000000,
    "ADMIN": 650000,
    "CUST_ID": 1110119000560
}, {
    "KODE CABANG": "003-ANJ",
    "NAMA CABANG": "Anjatan",
    "NO KONTRAK": 11101190000195,
    "NAMA PELANGGAN": "WAHYUDIN",
    "TGL BOOKING": "2/17/2019",
    "UB": "",
    "PLATFORM": "",
    "ALAMAT TAGIH": "DUSUN LUNGMALANG RT 12 RW 03 DS BUGIS KEC ANJATAN RT/12 RW/03 KAB. INDRAMAYU JAWA BARAT",
    "KECAMATAN": "KEC. ANJATAN",
    "KELURAHAN": "BUGIS",
    "NO TELP": "082316695353",
    "NO HP1": "",
    "NO HP2": "",
    "PEKERJAAN": "MENGURUS RUMAH TANGGA",
    "SUPPLIER": "",
    "SURVEYOR": "CASDIKIN",
    "CATT SURVEY": "PK ADALAH SEORANG PEDAGANG SAYUR KELILING ISTRI PK IRT",
    "PKK HUTANG": 4650000,
    "JML ANGS": 24,
    "JRK ANGS": 1,
    "PERIOD": 24,
    "OUT PKK AWAL": 4650000,
    "OUT BNG AWAL": 2310000,
    "OVERDUE AWAL": 2301,
    "AMBC PKK AWAL": 4650000,
    "AMBC BNG AWAL": 2310000,
    "AMBC TOTAL AWAL": 6960000,
    "CYCLE AWAL": "CX",
    "STS KONTRAK": "AC",
    "STS BEBAN": "AC",
    "POLA BYR AWAL": "",
    "OUTS PKK AKHIR": 4650000,
    "OUTS BNG AKHIR": 2310000,
    "OVERDUE AKHIR": 2332,
    "ANGSURAN": 290000,
    "ANGS KE": 1,
    "TIPE ANGSURAN": "bulanan",
    "JTH TEMPO AWAL": "14/3/2019",
    "JTH TEMPO AKHIR": "14/3/2019",
    "TGL BAYAR": "",
    "KOLEKTOR": "unknown",
    "CARA BYR": null,
    "AMBC PKK_AKHIR": 4650000,
    "AMBC BNG_AKHIR": 2310000,
    "AMBC TOTAL_AKHIR": 6960000,
    "AC PKK": 0,
    "AC BNG MRG": 0,
    "AC TOTAL": 0,
    "CYCLE AKHIR": "CX",
    "POLA BYR AKHIR": "",
    "NAMA BRG": null,
    "TIPE BRG": "SUZUKI CARRY CARRY",
    "NO POL": "D1012EG",
    "NO MESIN": "F10AA1D184275",
    "NO RANGKA": "SL410285379",
    "TAHUN": "1988",
    "NILAI PINJAMAN": 4000000,
    "ADMIN": 650000,
    "CUST_ID": 1110119000560
}, {
    "KODE CABANG": "003-ANJ",
    "NAMA CABANG": "Anjatan",
    "NO KONTRAK": 11101190000195,
    "NAMA PELANGGAN": "WAHYUDIN",
    "TGL BOOKING": "2/17/2019",
    "UB": "",
    "PLATFORM": "",
    "ALAMAT TAGIH": "DUSUN LUNGMALANG RT 12 RW 03 DS BUGIS KEC ANJATAN RT/12 RW/03 KAB. INDRAMAYU JAWA BARAT",
    "KECAMATAN": "KEC. ANJATAN",
    "KELURAHAN": "BUGIS",
    "NO TELP": "082316695353",
    "NO HP1": "",
    "NO HP2": "",
    "PEKERJAAN": "MENGURUS RUMAH TANGGA",
    "SUPPLIER": "",
    "SURVEYOR": "CASDIKIN",
    "CATT SURVEY": "PK ADALAH SEORANG PEDAGANG SAYUR KELILING ISTRI PK IRT",
    "PKK HUTANG": 4650000,
    "JML ANGS": 24,
    "JRK ANGS": 1,
    "PERIOD": 24,
    "OUT PKK AWAL": 4650000,
    "OUT BNG AWAL": 2310000,
    "OVERDUE AWAL": 2301,
    "AMBC PKK AWAL": 4650000,
    "AMBC BNG AWAL": 2310000,
    "AMBC TOTAL AWAL": 6960000,
    "CYCLE AWAL": "CX",
    "STS KONTRAK": "AC",
    "STS BEBAN": "AC",
    "POLA BYR AWAL": "",
    "OUTS PKK AKHIR": 4650000,
    "OUTS BNG AKHIR": 2310000,
    "OVERDUE AKHIR": 2332,
    "ANGSURAN": 290000,
    "ANGS KE": 1,
    "TIPE ANGSURAN": "bulanan",
    "JTH TEMPO AWAL": "14/3/2019",
    "JTH TEMPO AKHIR": "14/3/2019",
    "TGL BAYAR": "",
    "KOLEKTOR": "unknown",
    "CARA BYR": null,
    "AMBC PKK_AKHIR": 4650000,
    "AMBC BNG_AKHIR": 2310000,
    "AMBC TOTAL_AKHIR": 6960000,
    "AC PKK": 0,
    "AC BNG MRG": 0,
    "AC TOTAL": 0,
    "CYCLE AKHIR": "CX",
    "POLA BYR AKHIR": "",
    "NAMA BRG": null,
    "TIPE BRG": "SUZUKI CARRY CARRY",
    "NO POL": "D1012EG",
    "NO MESIN": "F10AA1D184275",
    "NO RANGKA": "SL410285379",
    "TAHUN": "1988",
    "NILAI PINJAMAN": 4000000,
    "ADMIN": 650000,
    "CUST_ID": 1110119000560
}, {
    "KODE CABANG": "003-ANJ",
    "NAMA CABANG": "Anjatan",
    "NO KONTRAK": 11101190000195,
    "NAMA PELANGGAN": "WAHYUDIN",
    "TGL BOOKING": "2/17/2019",
    "UB": "",
    "PLATFORM": "",
    "ALAMAT TAGIH": "DUSUN LUNGMALANG RT 12 RW 03 DS BUGIS KEC ANJATAN RT/12 RW/03 KAB. INDRAMAYU JAWA BARAT",
    "KECAMATAN": "KEC. ANJATAN",
    "KELURAHAN": "BUGIS",
    "NO TELP": "082316695353",
    "NO HP1": "",
    "NO HP2": "",
    "PEKERJAAN": "MENGURUS RUMAH TANGGA",
    "SUPPLIER": "",
    "SURVEYOR": "CASDIKIN",
    "CATT SURVEY": "PK ADALAH SEORANG PEDAGANG SAYUR KELILING ISTRI PK IRT",
    "PKK HUTANG": 4650000,
    "JML ANGS": 24,
    "JRK ANGS": 1,
    "PERIOD": 24,
    "OUT PKK AWAL": 4650000,
    "OUT BNG AWAL": 2310000,
    "OVERDUE AWAL": 2301,
    "AMBC PKK AWAL": 4650000,
    "AMBC BNG AWAL": 2310000,
    "AMBC TOTAL AWAL": 6960000,
    "CYCLE AWAL": "CX",
    "STS KONTRAK": "AC",
    "STS BEBAN": "AC",
    "POLA BYR AWAL": "",
    "OUTS PKK AKHIR": 4650000,
    "OUTS BNG AKHIR": 2310000,
    "OVERDUE AKHIR": 2332,
    "ANGSURAN": 290000,
    "ANGS KE": 1,
    "TIPE ANGSURAN": "bulanan",
    "JTH TEMPO AWAL": "14/3/2019",
    "JTH TEMPO AKHIR": "14/3/2019",
    "TGL BAYAR": "",
    "KOLEKTOR": "unknown",
    "CARA BYR": null,
    "AMBC PKK_AKHIR": 4650000,
    "AMBC BNG_AKHIR": 2310000,
    "AMBC TOTAL_AKHIR": 6960000,
    "AC PKK": 0,
    "AC BNG MRG": 0,
    "AC TOTAL": 0,
    "CYCLE AKHIR": "CX",
    "POLA BYR AKHIR": "",
    "NAMA BRG": null,
    "TIPE BRG": "SUZUKI CARRY CARRY",
    "NO POL": "D1012EG",
    "NO MESIN": "F10AA1D184275",
    "NO RANGKA": "SL410285379",
    "TAHUN": "1988",
    "NILAI PINJAMAN": 4000000,
    "ADMIN": 650000,
    "CUST_ID": 1110119000560
},
]
const periodeTarikan = computed(() => {
    const range = moment(rangeDate.value, 'MMYYYY').format('YYYYMM');
    const rangeMonth = moment(rangeDate.value, 'MMYYYY').format('MM');
    const current = moment().format('MM');
    if (rangeMonth === current) {
        return moment().format('DD-MM-YYYY');
    } else {
        return moment(range).endOf('month').format('DD-MM-YYYY')
    }
}
);
const userToken = localStorage.getItem("token");
const loadingBranch = ref(false);
const getBranch = async () => {
    loadingBranch.value = true;
    const response = await useApi({
        method: "GET",
        api: "cabang",
        token: userToken,
    });
    if (!response.ok) {
        message.error("ERROR API");
    } else {
        loadingBranch.value = false;

        if (me.me?.cabang_nama != "Head Office") {
            selectBranch.value = me.me.cabang_id;
        } else {
            selectBranch.value = "SEMUA CABANG";
            dataBranch.value = response.data.response;
            dataBranch.value.unshift({
                id: "",
                nama: "SEMUA CABANG"
            });
        }
    }
}
const rangeDate = ref();
let messageReactive = null;
const loadingBar = useLoadingBar();
const handleSubmit = () => {
    let a = {
        dari: rangeDate.value,
        cabang_id: selectedBranch.value?.id ? selectedBranch.value.id : me.me.cabang_id,
    }
    messageReactive = message.loading('memuat data listing beban', { duration: 0 });
    grabListBan(a);
}
const dataListBan = ref([]);
const loadingData = ref(false);
const timer = ref(60);
const disbaledButton = ref(false);
const ctrDownload = ref(true);
const grabListBan = async (e) => {

    loadingData.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "POST",
        api: "listBanTest",
        data: e,
        token: userToken,
    });
    if (!response.ok) {
        messageReactive.destroy();
        disbaledButton.value = true;
        var interval;
        interval = setInterval(() => {
            if (timer.value > 0) {
                timer.value--
            } else {
                clearInterval(interval);
                timer.value = 60;
                handleSubmit();
            }
        }, 1000);
        messageReactive = message.loading(() => (`data listban sedang sibuk mencoba ulang dalam ${timer.value} s`), { duration: 60000 });
    } else {
        messageReactive.destroy();
        messageReactive = null;
        disbaledButton.value = false;
        dataListBan.value = response.data;
        loadingData.value = false;
        ctrDownload.value = false;
    }

}

const columnBebanTagih = [
    {
        type: "selection",
    },
    {
        title: "NO KONTRAK",
        key: "NO KONTRAK",
        width: '150'
    },
    {
        title: "NAMA KOMSUMEN",
        key: "NAMA PELANGGAN",
        width: '200'
    },
    {
        title: "NAMA PIC",
        key: "name",
        width: '200',
    },
    {
        title: "CYCLE AWAL",
        key: "CYCLE AWAL",
    },
    {
        title: "NBOT",
        key: "name"
    },
    {
        title: "DESA",
        key: "KELURAHAN"
    },
    {
        title: "KEC",
        key: "KECAMATAN"
    },
    {
        title: "MCF",
        key: "SURVEYOR"
    },
];
const dataUser = ref([]);
const getData = async () => {
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "GET",
        api: "users",
        token: userToken,
    });
    if (!response.ok) {
        console.log(reponse.error);
    } else {
        loadingBar.finish();
        // console.log(response.data.response)
        dataUser.value = response.data.response;
    }
};
const dataList = ref([]);
const getList = async () => {
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "GET",
        api: "tagihan",
        token: userToken,
    });
    if (!response.ok) {
        console.log(reponse.error);
    } else {
        loadingBar.finish();
        // console.log(response.data.response)
        dataList.value = response.data;
    }
};

const rowKey = (row) => row['NO KONTRAK'];
const checkedRowKeys = ref([]);
function handleCheck(rowKeys) {
    checkedRowKeys.value = rowKeys;
}

const boxSearch = ref();

onMounted(() => {
    loadingBar.finish();
    getData();
    getList();
}
)
    ;

</script>
