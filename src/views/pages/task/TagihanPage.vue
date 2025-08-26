<template>
    <n-card title="Daftar Tagihan" :segmented="true" size="small">
        <div>
            <n-space vertical :size="12">
                <n-input type="text" placeholder="nyari apa ?" v-model:value="boxSearch" v-if="!ctrDownload"
                    @blur="searchData" />
                <n-data-table :columns="columnBebanTagih" :data="dataList" :pagination="pagination" :max-height="350"
                    virtual-scroll :scroll-x="1200" size="small"/>
            </n-space>
        </div>
    </n-card>
    <n-modal v-model:show="modalDetail" :mask-closable="false">
        <n-card class="w-5/6 md:w-2/4" title="DETAIL TAGIHAN" :segmented="true" size="small">
            <n-card class="mb-2" size="small" embedded>
                <div class="grid grid-cols-1 md:grid-cols-4">
                    <div class="flex flex-col">
                        <small class="text-reg">No Surat</small>
                        <n-text strong class="text-md border-b">{{ bodyDetail.no_surat }}</n-text>
                    </div>
                    <div class="flex flex-col">
                        <small class="text-reg">No Kontrak</small>
                        <n-text strong class="text-md border-b">{{ bodyDetail.loan_number }}</n-text>
                    </div>
                    <div class="flex flex-col">
                        <small class="text-reg">Tgl Jatuh Tempo</small>
                        <n-ellipsis class="text-md border-b font-semibold">{{ bodyDetail.tgl_jth_tempo }}</n-ellipsis>
                    </div>
                    <div class="flex flex-col">
                        <small class="text-reg">Customer</small>
                        <n-text strong class="text-md border-b"> {{  bodyDetail.nama_customer }}</n-text>
                    </div>
                    <div class="flex flex-col">
                        <small class="text-reg">Alamat</small>
                        <n-text strong class="text-md border-b">{{  bodyDetail.alamat }} </n-text>
                    </div>
                </div>
            </n-card>
            <n-divider title-placement="left">Rincian Tagihan</n-divider>
            <n-table size="small">
                <thead>
                    <tr>
                        <th>Angsuran Ke</th>
                        <th>Tgl Jatuh Tempo</th>
                        <th>Tunggakan</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>asdasd</td>
                        <td>asdasd</td>
                        <td>asdasd</td>
                    </tr>
                </tbody>
            </n-table>
             <n-divider title-placement="left">Hasil Kunjungan</n-divider>
            <n-form-item label="Hasil Kunjungan">
                <n-input type="textarea"></n-input>
            </n-form-item>
            <n-form-item label="Tanggal JB/FU">
                <n-date-picker placeholder="Tanggal JB/FU" class="w-full" value-format="yyyy-MM-dd" format="dd-MM-yyyy"
                    type="date" />
            </n-form-item>
            <n-form-item label="Dokumen Kunjungan">
                <file-upload :def_preview="true" :multi="true" title="dokumen kunjungan"
                    endpoint="image_upload_prospect" type="other" />
            </n-form-item>

            <div class="flex gap-2">
                <n-button type="primary">Simpan</n-button>
                <n-button type="secondary" @click="modalDetail = false">Batal</n-button>
            </div>

        </n-card>
    </n-modal>
</template>
<script setup>
import { NButton, useLoadingBar, useMessage } from "naive-ui";
import { onMounted, ref } from "vue";
import { useApi } from "../../../helpers/axios.js";
import { useMeStore } from "../../../stores/me";
import _ from "lodash";

const me = useMeStore();
const message = useMessage();

const modalAssign = ref(false);


const selectedBranch = ref();


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

const convertObjectToArray = (obj) => {
    if (!Array.isArray(obj) || obj.length === 0) {
        return [];
    }
    const keys = Object.keys(obj[0]);
    return keys.map(key => ({ title: key, key: key }));
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
        title: "No Surat",
        key: "no_surat",
        width: '150',
        sorter: 'default',
    },
    {
        title: "No Kontrak",
        key: "loan_number",
        width: '200',
        sorter: 'default',
    },
    {
        title: "Tgl Jth Tempo",
        key: "tgl_jth_tempo",
        sorter: 'default',
    },
    {
        title: "Customer",
        key: "nama_customer",
        sorter: 'default',
    },
    {
        title: "Alamat",
        key: "alamat",
        sorter: 'default',
        ellipsis: {
            tooltip: true,
        }
    },
    {
        title: "",
        key: "SURVEYOR",
        render(row) {
            return h(NButton, {
                type: 'primary',
                onClick: () => handleDetail(row),
            }, { default: () => 'Kunjungan' })
        }
    },
];
const dataList = ref([]);
const getData = async () => {
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "GET",
        api: "list_tagihan_collector",
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

const modalDetail = ref(false);
const bodyDetail = ref();
const handleDetail = (e) => {
    bodyDetail.value = e;
    modalDetail.value = true;
}

const checkedRowKeys = ref([]);

const boxSearch = ref();

onMounted(() => {
    loadingBar.finish();
    getData();
}
)
    ;

</script>
