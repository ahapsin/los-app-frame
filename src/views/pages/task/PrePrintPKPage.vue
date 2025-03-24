<template>
    <n-card :segmented="{
        content: true,
        footer: 'soft',
    }">
        <div class="flex flex-col md:flex-row w-full gap-2">
            <n-form ref="formRef" inline :disabled="pageData.flag == 1 ? true : false">
                <n-form-item label="Order Number" path="nama">
                    <n-input placeholder="nama" v-model:value="idApp" disabled />
                </n-form-item>
                <n-form-item label="Tanggal Awal Angsuran" path="order">
                    <n-date-picker placeholder="tanggal awal angsuran" v-model:formatted-value="pkData.tgl_awal_pk"
                        value-format="yyyy-MM-dd" format="dd-MM-yyyy" type="date" :disabled="pkData.flag == 1"
                        @update:formatted-value="getPrePK" :is-date-disabled="dateAvailable" />
                </n-form-item>
                <n-form-item label="Halaman" path="nama_panggilan">
                    <!-- <n-checkbox label="Semua Halaman" v-model:checked="optAllPage" checked /> -->
                    <n-grid cols="2 6" class="bg-slate-100 p-2 rounded">
                        <n-grid-item>
                            <n-checkbox value="pk" label="Perjanjian Kredit" checked disabled />
                        </n-grid-item>
                        <n-grid-item>
                            <n-checkbox value="skala" label="Skala Kredit" v-model:checked="optPrint.skalaPage" />
                        </n-grid-item>

                        <n-grid-item>
                            <n-checkbox value="" label="Pasangan" v-model:checked="optPrint.pasanganPage" />
                        </n-grid-item>
                        <n-grid-item>
                            <n-checkbox value="" label="Penjamin" v-model:checked="optPrint.penjaminPage" />
                        </n-grid-item>
                        <n-grid-item>
                            <n-checkbox value="" label="Tanda Terima" v-model:checked="optPrint.tandaTerima" />
                        </n-grid-item>
                        <n-grid-item>
                            <n-checkbox value="ktpa" label="Asuransi" v-model:checked="optPrint.ktpaPage" />
                        </n-grid-item>
                    </n-grid>
                </n-form-item>
            </n-form>
            <!-- <n-form-item class="w-full">
        <n-button type="primary" @click="handleProses">Proses</n-button>
    </n-form-item> -->
        </div>
        <!-- <div
title="PK"
v-show="prosesPK"
class="flex gap-2 border-t p-4 justify-end"
></div> -->

        <div class="sticky b bg-white z-50 flex gap-2 top-0 w-full justify-end p-2" v-if="prosesPK">
            <div class="sticky  flex bottom-0 w-full" v-if="pkData.no_perjanjian === ''">
                <CollateralCheck :coll_data="payloadCheck()" @coll_val="handleCollCheck" />
            </div>
            <div v-else>
                <n-button :type="pkData.flag == 1 ? 'warning' : 'primary'" class="gap-2"
                    @click="handlePrintAction(pkData.flag)">
                    <n-icon>
                        <print-icon />
                    </n-icon>
                    {{ pkData.flag == 1 ? "Cetak Ulang Order" : "Cetak Order" }}
                </n-button>
                <n-button v-if="pkData.flag === 1 && tgl_cetaks == pkData.tgl_awal_pk" type="error" class="gap-2"
                    @click="confModal = true">
                    <n-icon>
                        <cancel-icon />
                    </n-icon>
                    Batal Order
                </n-button>
                <n-button v-else-if="pkData.flag !== 1" type="info" class="gap-2" @click="confModalRevisi = true">
                    <n-icon>
                        <edit-icon />
                    </n-icon>
                    Revisi Order
                </n-button>
            </div>
        </div>
        <div class="flex bg-slate-100 justify-center overflow-auto p-2" v-show="prosesPK">
            <div class="flex flex-col min-w-[900px] p-10" ref="pk">

                <div ref="areaPrintRef">
                    <n-watermark :content="apptitle" cross selectable :font-size="16" :line-height="16" :width="192"
                        :height="128" :x-offset="12" :y-offset="28" :rotate="-15">
                        <div ref="pkPageRef" class="bg-white max-w-[210mm] min-h-[295mm] p-8 text-[12px]"
                            v-show="optPrint.pkPage">
                            <kop-header :alamat_cabang="`${pkData.alamat_kantor} ${pkData.kota}`"
                                :cabang="pkData.cabang" />
                            <table border="1" class="mb-10 text-justify">
                                <tr>
                                    <td align="center"><b>PERJANJIAN PEMBERIAN PINJAMAN</b></td>
                                </tr>
                                <tr v-if="pkData.no_perjanjian">
                                    <td align="center">
                                        NO.PERJANJIAN : {{ pkData.no_perjanjian }}
                                    </td>
                                </tr>
                                <tr>
                                    <td heigth="20">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td>Yang bertanda tangan dibawah ini :</td>
                                </tr>
                                <tr>
                                    <td>
                                        <br />
                                        <table>
                                            <tr>
                                                <td rowspan="3" valign="top" width="20">I.</td>
                                                <td width="150">Nama</td>
                                                <td width="25">:</td>
                                                <td>{{ pihak1.nama }}</td>
                                            </tr>
                                            <tr>
                                                <td>Jabatan</td>
                                                <td width="25">:</td>
                                                <td>BRANCH MANAGER</td>
                                            </tr>
                                            <tr>
                                                <td valign="top">Alamat Kantor</td>
                                                <td valign="top">:</td>
                                                <td>
                                                    <span class="capitalize">{{ pkData.alamat_kantor }}</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="10"></td>
                                </tr>
                                <tr>
                                    <td>
                                        <table>
                                            <tr>
                                                <td rowspan="4" valign="top" width="20">II.</td>
                                                <td width="150">Nama</td>
                                                <td width="25">:</td>
                                                <td>{{ pihak2.nama }}</td>
                                            </tr>
                                            <tr>
                                                <td>No. KTP/SIM</td>
                                                <td width="25">:</td>
                                                <td>{{ pihak2.no_identitas }}</td>
                                            </tr>
                                            <tr>
                                                <td>Alamat</td>
                                                <td width="25">:</td>
                                                <td>{{ pihak2.alamat }}</td>
                                            </tr>
                                            <tr>
                                                <td colspan=" 3">
                                                    Dalam hal ini bertindak untuk dirinya sendiri, selanjutnya
                                                    disebut Pihak Kedua
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Dengan ini menerangkan bahwa para pihak sepakat menandatangani
                                        Perjanjian Pemberian Pinjaman, dengan isi, syarat dan ketentuan
                                        sebagai berikut :
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        Pasal 1
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Pihak pertama memberikan pinjaman pada pihak kedua meliputi
                                        pokok hutang dan margin atas pinjaman menjadi sebesar
                                        {{ pkData.pokok_margin }}
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">Pasal 2</td>
                                </tr>
                                <tr>
                                    <td>
                                        Pengembalian pinjaman tersebut akan dibayarkan untuk jangka
                                        {{ pkData.tenor }} BULAN lamanya, dimulai tanggal
                                        {{ formatDate(pkData.tgl_awal_pk) }} berakhir pada tanggal
                                        {{ formatDate(pkData.tgl_akhir_pk) }} dengan jumlah angsuran sebesar
                                        {{ pkData.angsuran }}
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">

                                        Pasal 3
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Guna menjamin pembayaran pinjaman tersebut diatas maka Pihak
                                        Kedua dengan ini menyerahkan jaminan barang miliknya sendiri
                                        berupa KENDARAAN / SERTIFIKAT, dengan dibuktikan diserahkannya Bukti
                                        Kepemilikan dengan spesifikasi sebagai berikut
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="text-justify pt-2" v-for="jaminan in dataJaminan" :key="jaminan">
                                            Jenis Dokumen: <b> {{ jaminan.type.toUpperCase() }}</b>
                                            <table v-if="jaminan.type.toLowerCase() == 'kendaraan'">
                                                <tr>
                                                    <td>BPKB No</td>
                                                    <td width="25">:</td>
                                                    <td>{{ jaminan.atr.no_bpkb }}</td>
                                                </tr>
                                                <tr>
                                                    <td>BPKB atas nama</td>
                                                    <td width="25">:</td>
                                                    <td>{{ jaminan.atr.atas_nama }}</td>
                                                </tr>
                                                <tr>
                                                    <td>Merk/Type/Tahun</td>
                                                    <td width="25">:</td>
                                                    <td>{{
                                                        `${jaminan.atr.merk}/${jaminan.atr.tipe}/${jaminan.atr.tahun}`
                                                    }}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Warna/No.Polisi</td>
                                                    <td width="25">:</td>
                                                    <td>{{ `${jaminan.atr.warna}/${jaminan.atr.no_polisi}` }}</td>
                                                </tr>
                                                <tr>
                                                    <td>No. Rangka/Mesin</td>
                                                    <td width="25">:</td>
                                                    <td>{{ `${jaminan.atr.no_rangka}/${jaminan.atr.no_mesin}` }}</td>
                                                </tr>
                                                <tr>
                                                    <td>No. Faktur</td>
                                                    <td width="25">:</td>
                                                    <td>{{ `${jaminan.atr.no_faktur}` }}</td>
                                                </tr>
                                            </table>
                                            <table v-else>
                                                <tr>
                                                    <td>No Sertifikat</td>
                                                    <td width="25">:</td>
                                                    <td>{{ jaminan.atr.no_sertifikat }}</td>
                                                </tr>
                                                <tr>
                                                    <td>Atas Nama</td>
                                                    <td width="25">:</td>
                                                    <td>{{ jaminan.atr.atas_nama }}</td>
                                                </tr>
                                                <tr>
                                                    <td>Status Kepemilikan</td>
                                                    <td width="25">:</td>
                                                    <td>{{ jaminan.atr.status_kepemilikan }}</td>
                                                </tr>
                                                <tr>
                                                    <td>IMB / Luas Tanah / Luas Bangunan</td>
                                                    <td width="25">:</td>
                                                    <td>{{
                                                        `${jaminan.atr.imb} / ${jaminan.atr.luas_tanah} m2 /
                                                        ${jaminan.atr.luas_bangunan} m2`
                                                    }}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Lokasi</td>
                                                    <td width="25">:</td>
                                                    <td>{{ `${jaminan.atr.lokasi}` }}</td>
                                                </tr>
                                            </table>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <br />
                                        Apabila pihak kedua tidak bisa memenuhi kewajiban pembayaran
                                        angsuran selama 3 bulan, maka pihak kedua bersedia menyerahkan
                                        jaminan kendaraan sesuai dengan pasal 3 di atas kepada pihak
                                        pertama. Jika Perjanjian Pemberi Pinjaman telah selesai, BPKB
                                        wajib diambil maksimum 90 hari kalender terhitung dari pelunasan
                                        angsuran dan denda terakhir. {{ apptitle }} tidak bertanggung jawab
                                        atas kerusakan atau kehilangan BPKB / SERTIFIKAT.
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <br />
                                        Demikian Perjanjian Pemberian Pinjaman ini dibuat dan
                                        ditandatangani, tanpa adanya unsur paksaan.<br />
                                        {{ pkData.kota }}, {{ dayFull.full_date_only }}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <br />
                                        <table width="100%">
                                            <tr>
                                                <td>
                                                    Pihak Pertama<br /><br /><br /><br /><br /><br/>
                                                    ( {{ pihak1.nama }} )
                                                </td>
                                                <td>
                                                    Pihak Kedua<br /><br /><br /><br /><br /><br/>
                                                    ( {{ pihak2.nama }} )
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div class="mt-2" v-show="optPrint.tandaTerima">
                            <div class="bg-white max-w-[210mm] max-h-[297mm] min-h-[297mm] p-8 text-xs">
                                <kop-header :alamat_cabang="`${pkData.alamat_kantor} ${pkData.kota}`"
                                    :cabang="pkData.cabang" />
                                <div class="mb-4 text-center text-base">
                                    <b>SURAT TANDA TERIMA DOKUMEN</b>
                                </div>
                                <div class="mb-4">yang bertanda tangan di bawah ini:</div>
                                <div class="mb-4">
                                    <table>
                                        <tr>
                                            <td width="100px">Nama</td>
                                            <td width="25">:</td>
                                            <td>
                                                <b class="uppercase">{{ pihak1.nama }}</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Jabatan</td>
                                            <td width="25">:</td>
                                            <td>
                                                <b class="uppercase">BRANCH MANAGER</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Alamat</td>
                                            <td width="25">:</td>
                                            <td>
                                                <b class="uppercase">{{ pkData.alamat_kantor }}</b>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                <div class="mb-4 text-justify text-sm">
                                    Pada hari ini <b>{{ dayFull.day }}</b> tanggal
                                    <b>{{ dayFull.date }}</b> bulan <b>{{ dayFull.month }}</b> tahun
                                    <b>{{ dayFull.year }}</b>,Dengan ini telah menerima bukti kepemilikan kendaraan / sertifikat
                                    dalam keadaan baik dengan rincian sebagai berikut :
                                </div>
                                <div class="text-justify pt-2" v-for="jaminan in dataJaminan" :key="jaminan">
                                    Jenis Dokumen: <b> {{ jaminan.type.toUpperCase() }}</b>
                                    <table v-if="jaminan.type.toLowerCase() == 'kendaraan'">
                                        <tr>
                                            <td>BPKB No</td>
                                            <td width="25">:</td>
                                            <td>{{ jaminan.atr.no_bpkb }}</td>
                                        </tr>
                                        <tr>
                                            <td>BPKB atas nama</td>
                                            <td width="25">:</td>
                                            <td>{{ jaminan.atr.atas_nama }}</td>
                                        </tr>
                                        <tr>
                                            <td>Merk/Type/Tahun</td>
                                            <td width="25">:</td>
                                            <td>{{ `${jaminan.atr.merk}/${jaminan.atr.tipe}/${jaminan.atr.tahun}` }}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Warna/No.Polisi</td>
                                            <td width="25">:</td>
                                            <td>{{ `${jaminan.atr.warna}/${jaminan.atr.no_polisi}` }}</td>
                                        </tr>
                                        <tr>
                                            <td>No. Rangka/Mesin</td>
                                            <td width="25">:</td>
                                            <td>{{ `${jaminan.atr.no_rangka}/${jaminan.atr.no_mesin}` }}</td>
                                        </tr>
                                        <tr>
                                            <td>No. Faktur</td>
                                            <td width="25">:</td>
                                            <td>{{ `${jaminan.atr.no_faktur}` }}</td>
                                        </tr>
                                    </table>
                                    <table v-else>
                                        <tr>
                                            <td>No Sertifikat</td>
                                            <td width="25">:</td>
                                            <td>{{ jaminan.atr.no_sertifikat }}</td>
                                        </tr>
                                        <tr>
                                            <td>Atas Nama</td>
                                            <td width="25">:</td>
                                            <td>{{ jaminan.atr.atas_nama }}</td>
                                        </tr>
                                        <tr>
                                            <td>Status Kepemilikan</td>
                                            <td width="25">:</td>
                                            <td>{{ jaminan.atr.status_kepemilikan }}</td>
                                        </tr>
                                        <tr>
                                            <td>IMB / Luas Tanah / Luas Bangunan</td>
                                            <td width="25">:</td>
                                            <td>{{
                                                `${jaminan.atr.imb} / ${jaminan.atr.luas_tanah} m2 /
                                                ${jaminan.atr.luas_bangunan} m2`
                                            }}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Lokasi</td>
                                            <td width="25">:</td>
                                            <td>{{ `${jaminan.atr.lokasi}` }}</td>
                                        </tr>
                                    </table>
                                </div>

                                <div class="mb-4">
                                    <!-- Selanjutnya disebut Penjamin<br /> -->
                                    Dokumen tersebut telah diterima dalam keadaan baik untuk
                                    ditindaklanjuti sebagaimana mestinya
                                </div>
                                <div>
                                    <table class="!text-sm w-full">
                                        <tr>
                                            <td class="py-4 pr-4">
                                                Pemberi,
                                                <br /><br /><br /><br/>
                                                <u class="uppercase">{{ pihak2.nama }}</u>
                                            </td>
                                            <td class="py-4 pr-4">
                                                Penerima,
                                                <br /><br /><br /><br/>
                                                <u class="uppercase">{{ pihak1.nama }}</u>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="mt-2" v-show="optPrint.ktpaPage">
                            <div class="bg-white max-w-[210mm] max-h-[297mm] min-h-[297mm] p-8 ">
                                <kop-header :alamat_cabang="`${pkData.alamat_kantor} ${pkData.kota}`"
                                    :cabang="pkData.cabang" />
                                <div class="mb-4 text-center text-base">
                                    <b>SYARAT DAN KETENTUTAN KHUSUS PROGRAM
                                        <br />
                                        <b>" KREDIT TANPA PERLINDUNGAN ASURANSI "</b></b>
                                </div>
                                <div class="mb-4 text-justify text-sm">
                                    Pada hari ini <b>{{ dayFull.day }}</b> tanggal
                                    <b>{{ dayFull.date }}</b> bulan <b>{{ dayFull.month }}</b> tahun
                                    <b>{{ dayFull.year }}</b>, yang bertanda tangan dibawah ini :
                                </div>
                                <div class="mb-4 text-justify text-sm ps-8">
                                    I. <b>{{ dataPelanggan.nama }}</b> pekerjaan/jabatan
                                    <b> {{ dataPelanggan.pekerjaan }}</b> Bertempat tinggal di
                                    <b>{{ pihak2.alamat }} </b> Pemegang kartu identitas (<b>{{
                                        dataPelanggan.tipe_identitas
                                    }}</b>) nomor <b>{{ dataPelanggan.no_identitas }}</b> Dalam hal ini
                                    bertindak untuk dan atas nama <b>{{ pihak2.nama }}</b> Selanjutnya
                                    disebut <b>Penerima Pinjaman.</b>
                                </div>
                                <div class="mb-4 text-justify text-sm ps-8">
                                    II. <b>{{ pihak1.nama }}</b> pekerjaan/jabatan
                                    <b> BRANCH MANAGER</b> Bertempat tinggal di
                                    <b>KOTA CIREBON </b> Pemegang kartu identitas (<b>KTP</b>)
                                    nomor <b>{{ pihak1.no_ktp }}</b> Dalam hal ini bertindak untuk dan
                                    atas nama <b>{{ pihak1.nama }}</b> Selanjutnya disebut
                                    <b>Pemberi Pinjaman.</b>
                                </div>
                                <div class="mb-4 text-justify text-sm">
                                    Yang bersama-sama dengan <b>{{ apptitle }}</b>, telah, sepakat dan
                                    mengikatkan diri dan karenanya menjadi para pihak dalam Perjanjian
                                    PINJAMAN Konsumen
                                    <b> No.{{ pkData.no_perjanjian }}</b> berikut kelengkapan dan
                                    perubahannya ( selanjutnya disebut
                                    <b> Perjanjian PINJAMAN Konsumen </b> yang merupakan satu kesatuan
                                    tak terpisahkan dengan syarat dan ketentuan Program
                                    <b>"Kredit Tanpa Perlindungan Asuransi"</b> ini (syarat dan
                                    ketentuan)
                                </div>
                                <div class="mb-4 text-justify text-sm">
                                    Penerima Pinjaman dan pemberi jaminan dengan ini mengikuti program
                                    yang ditawarkan (<b>{{ apptitle }}</b>) selanjutnya disebut Penerima
                                    Pinjaman / Penerima Jaminan ) yaitu "Kredit Tanpa Perlindungan
                                    Asuransi " dengan menyetujui setiap dan seluruh syarat dan
                                    ketentuannya, berikut di bawah ini yang merupakan syarat dan
                                    ketentuan khusus dan manakala terdapat perbedaan dengan perjanjian
                                    PINJAMAN konsumen, maka syarat dan ketentuan inilah yang akan
                                    berlaku, yaitu sebagai berikut:
                                </div>
                                <div class="mb-4 text-justify text-sm ps-8">
                                    1. Dengan Menandatangani syarat dan ketentuan ini, penerima
                                    Pinjaman / Pemberi Jaminan sepakat untuk mengikuti program
                                    <b>"Kredit Tanpa Perlindungan Asuransi "</b> yang ditawarkan
                                    pemberi Pinjaman / penerima jaminan karenanya menyetujui setiap
                                    dan seluruh syarat dan ketentuan yang mengaturnya dan
                                    mengesampingkan syarat dan ketentuan mengenai asuransi pada
                                    PINJAMAN Konsumen.
                                </div>
                                <div class="mb-4 text-justify text-sm ps-8">
                                    2. Dengan mengikuti program
                                    <b>"Kredit Tanpa Perlindungan Asuransi "</b> ini, sesuai penawaran
                                    yang diberikan (<b>{{ apptitle }}</b>) maka segala resiko rusak, hilang
                                    atau musnahnya barang karena sebab apapun juga sepenuhnya menjadi
                                    tanggung jawab dan beban penerima Pinjaman / pemberi Jaminan,
                                    sehingga dengan rusak, hilang atau musnahnya barang tidak
                                    meniadakan, mengurangi atau menunda pemenuhan kewajiban penerima
                                    Pinjaman pemberi jaminan sebagaimana ditentukan dalam perjanjian
                                    PINJAMAN konsumen.
                                </div>
                                <div class="mb-4 text-justify text-sm ps-8">
                                    3. Dalam hal terjadi resiko rusak, hilang atau musnahnya barang,
                                    maka penerima Pinjaman/pemberi jaminan tidak dapat melakukan klaim
                                    asuransi dan karenanya tetap berkewajiban untuk melakukan
                                    pembayaran angsuran sebagaimana disepakati dalam perjanjian
                                    PINJAMAN konsumen hingga setiap dan seluruhnya terlunasi.
                                </div>
                                <div class="mb-4 text-justify text-sm">
                                    Penerima Pinjaman/Pemberi Jaminan telah membaca, mengerti dan
                                    menyetujui setiap dan seluruh syarat dan ketentuan ini.
                                </div>
                                <div class="mb-4 text-justify">
                                    <table class="!text-sm w-full">
                                        <tr>
                                            <td class="py-4 pr-4">
                                                Penerima Pinjaman,
                                                <br /><br /><br />
                                                <u class="uppercase">{{ pihak2.nama }}</u>
                                            </td>
                                            <td class="py-4 pr-4">
                                                Pemberi Jaminan,
                                                <br /><br /><br />
                                                <u class="uppercase">{{ pihak1.nama }}</u>
                                            </td>
                                            <td>
                                                Pemberi Pinjaman / Penerima Jaminan,
                                                <br /><br /><br />
                                                <u class="uppercase">{{ pihak1.nama }} / {{ pihak2.nama }}</u>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="mt-2" v-show="optPrint.pasanganPage">
                            <div class="bg-white max-w-[210mm] max-h-[297mm] min-h-[297mm] p-8">
                                <kop-header :alamat_cabang="`${pkData.alamat_kantor} ${pkData.kota}`"
                                    :cabang="pkData.cabang" />
                                <div class="mb-4 text-center text-base">
                                    <b>SURAT PERSETUJUAN SUAMI ISTRI</b>
                                </div>
                                <div class="mb-4">yang bertanda tangan di bawah ini:</div>
                                <div class="mb-4 ps-8">
                                    <table>
                                        <tr>
                                            <td width="100px">Nama</td>
                                            <td width="25">:</td>
                                            <td>
                                                <b class="uppercase">{{
                                                    upCase(dataPasangan.nama_pasangan)
                                                }}</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Pekerjaan</td>
                                            <td width="25">:</td>
                                            <td>
                                                <b class="uppercase">{{
                                                    upCase(dataPasangan.pekerjaan_pasangan)
                                                }}</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Alamat</td>
                                            <td width="25">:</td>
                                            <td>
                                                <b class="uppercase">{{
                                                    upCase(dataPasangan.alamat_pasangan)
                                                }}</b>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                <div class="mb-4">
                                    Sebagai suami/isteri *) dengan ini memberikan persetujuan kepada
                                    suami/isteri *) saya:
                                </div>
                                <div class="mb-4 ps-8">
                                    <table>
                                        <tr>
                                            <td width="100px">Nama</td>
                                            <td width="25">:</td>
                                            <td>
                                                <b class="uppercase">{{ pihak2.nama }}</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Pekerjaan</td>
                                            <td width="25">:</td>
                                            <td>
                                                <b class="uppercase">( {{ dataPelanggan.pekerjaan_id }} )
                                                    {{ dataPelanggan.pekerjaan }}</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Alamat</td>
                                            <td width="25">:</td>
                                            <td>
                                                <b class="uppercase">{{ pihak2.alamat }}</b>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                <div class="mb-4">
                                    Untuk melakukan tindakan-tindakan sebagaimana disebutkan di bawah
                                    ini :
                                </div>
                                <div class="mb-4 text-justify">
                                    1. Mengajukan mendapatkan Pinjaman Konsumen sebagaimana dimaksud
                                    dalam Perjanjian PINJAMAN Konsumen
                                    <b>No. {{ dynamicForm.order_number }}</b> tertanggal
                                    {{ dayFull.full_date_only }} berikut dengan seluruh
                                    perubahan-perubahan dan lampiran-lampirannya
                                    <b>("Perjanjian Pinjaman *)</b> dari pemberi Pinjaman, baik
                                    bertindak untuk dan atas nama dirinya sendiri dan atau selaku
                                    kuasa.
                                </div>
                                <div class="mb-4 text-justify">
                                    2. Menjaminkan Barang guna menjamin / sebagai jaminan pelunasan
                                    seluruh kewajiban hutang Suami/Isteri *) saya berdasarkan
                                    Perjanjian PINJAMAN.
                                </div>
                                <div class="mb-4 text-justify">
                                    3. Untuk keperluan tersebut membuat dan menandatangani Perjanjian
                                    Pembiayaan berikut dokumen-dokumen lainnya serta tindakan-tindakan
                                    lainnya yang diperlukan sehubungan dengan yang diuraikan pada
                                    butir 1 dan 2 di atas.
                                </div>
                                <div class="mb-4 text-justify">
                                    Demikian Surat Persetujuan ini dibuat dengan sebenarnya dan tidak
                                    akan berakhir karena sebab apapun juga kecuali seluruh kewajiban
                                    suami/isteri *) saya berdasarkan Perjanjian PINJAMAN tersebut
                                    telah lunas seluruhnya.
                                </div>
                                <div class="mb-4">
                                    {{ dayFull.full_date_only }},<br />
                                    Yang memberi persetujuan,<br /><br /><br />
                                    <u class="uppercase">{{ upCase(dataPasangan.nama_pasangan) }}</u>
                                </div>
                            </div>
                        </div>
                        <div class="mt-2" v-show="optPrint.penjaminPage">
                            <div class="bg-white max-w-[210mm] max-h-[297mm] min-h-[297mm] p-8 ">
                                <kop-header :alamat_cabang="`${pkData.alamat_kantor} ${pkData.kota}`"
                                    :cabang="pkData.cabang" />
                                <div class="mb-4 text-center text-base">
                                    <b>PERNYATAAN PENJAMIN</b>
                                </div>
                                <div class="mb-4">yang bertanda tangan di bawah ini:</div>
                                <div class="grid grid-flow-col">
                                    <table>
                                        <tr>
                                            <td width="100px">Nama</td>
                                            <td width="25">:</td>
                                            <td>
                                                <!-- <b class="uppercase">{{ pihak2.nama }}</b> -->
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Pekerjaan</td>
                                            <td width="25">:</td>
                                            <td>
                                                <!-- <b class="uppercase">({{ dataPelanggan.pekerjaan_id }})
                                                    {{ dataPelanggan.pekerjaan }}</b> -->
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Alamat</td>
                                            <td width="25">:</td>
                                            <td>
                                                <!-- <b class="uppercase">{{ pihak2.alamat }}</b> -->
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Nomor KTP</td>
                                            <td width="25">:</td>
                                            <td>
                                                <!-- <b class="uppercase">{{ pihak2.no_identitas }}</b> -->
                                            </td>
                                        </tr>
                                    </table>
                                    <div class="mb-4" v-for="(penjamin, i) in dataPenjamin" :key="penjamin">
                                        <!-- <table>
                                            <tr>
                                                <td width="100px">Nama</td>
                                                <td width="25">:</td>
                                                <td>
                                                    <b class="uppercase">{{ penjamin.nama }}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Pekerjaan</td>
                                                <td width="25">:</td>
                                                <td>
                                                    <b class="uppercase">{{ penjamin.pekerjaan }}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Alamat</td>
                                                <td width="25">:</td>
                                                <td>
                                                    <b class="uppercase">{{ penjamin.alamat }}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Nomor KTP</td>
                                                <td width="25">:</td>
                                                <td>
                                                    <b class="uppercase">{{ penjamin.no_identitas }}</b>
                                                </td>
                                            </tr>
                                        </table> -->
                                        Selanjutnya disebut <b>Penjamin {{ i + 1 }}</b>
                                    </div>
                                </div>

                                <div class="mb-4">
                                    <!-- Selanjutnya disebut Penjamin<br /> -->
                                    Dengan ini menyatakan dan menegaskan bahwa :
                                </div>
                                <div class="mb-4 text-justify">
                                    1. Penjamin benar-benar mengetahui timbulnya hutang piutang secara
                                    sah berdasarkan Perjanjian pembiayaan Konsumen Nomor
                                    <b>{{ dynamicForm.order_number }}</b> tanggal
                                    <b> {{ dayFull.full_date_only }} </b><br />
                                    beserta seluruh lampiran, penambahan dan / atau pengurangannya (
                                    selanjutnya disebut Perjanjian ) oleh dan antara
                                    <b>{{ apptitle }}</b> berkedudukan di Haurgeulis
                                    <br />
                                    ( selanjutnya secara sendiri-sendiri atau bersama disebut<b>
                                        Pemberi Pinjaman</b>
                                    dengan :
                                    <br />
                                    <br />
                                    <table>
                                        <tr>
                                            <td width="100px">Nama</td>
                                            <td width="25">:</td>
                                            <td>
                                                <b class="uppercase">{{ pihak2.nama }}</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Pekerjaan</td>
                                            <td width="25">:</td>
                                            <td>
                                                <b class="uppercase">({{ dataPelanggan.pekerjaan_id }})
                                                    {{ dataPelanggan.pekerjaan }}</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Alamat</td>
                                            <td width="25">:</td>
                                            <td>
                                                <b class="uppercase">{{ pihak2.alamat }}</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Nomor KTP</td>
                                            <td width="25">:</td>
                                            <td>
                                                <b class="uppercase">{{ pihak2.no_identitas }}</b>
                                            </td>
                                        </tr>
                                    </table>
                                    Selanjutnya disebut<b> Penerima Pinjaman</b>
                                </div>
                                <div class="mb-4 text-justify">
                                    2. Penjamin menyatakan sanggup dan mengikatkan diri untuk menjamin
                                    seluruh HUTANG PEMBIAYAAN Penerima Pinjaman yang timbul dari
                                    perjanjian tersebut sebesar <b>{{ pkData.pokok_margin }}</b>
                                    ( dan bersedia untuk membayar seluruh kewajiban pembayaran hutang
                                    tersebut kepada Pemberi Pinjaman apabila Penerima Pinjaman tidak
                                    memenuhi kewajibannya sebagaimana ditentukan dalam perjanjian
                                </div>
                                <div class="mb-4 text-justify">
                                    3. Penjamin dengan tegas melepaskan semua hak istimewa maupun
                                    pengecualian-pengecualian yang diberikan oleh peraturan
                                    perundangan kepada Penjamin, khusus tetapi tidak terbatas pada
                                    pasal 1832 Undang-Undang Hukum Perdata.
                                </div>

                                <div class="mb-4 justify-end">
                                    {{ dayFull.full_date_only }}<br />
                                    <div class="w-fit gap-10 grid grid-flow-col text-center bg-white">
                                        <div v-for="(penjamin, i) in dataPenjamin" :key="penjamin">
                                            Penjamin {{ i + 1 }},<br /><br /><br />
                                            (<u class="uppercase">{{ upCase(penjamin.nama) }}</u>)
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mt-2" v-show="optPrint.skalaPage">
                            <div class="bg-white max-w-[210mm] min-h-[297mm] p-8 ">
                                <kop-header :alamat_cabang="`${pkData.alamat_kantor} ${pkData.kota}`"
                                    :cabang="pkData.cabang" />
                                <div class="mb-4 bg-white">Tabel Skala Angsuran</div>
                                <div vertical class="bg-white flex w-full">
                                    <table class="tblprint">
                                        <tr :style="`background-color: ${app_base}; color:#ffffff;`">
                                            <th>Angsuran ke</th>
                                            <th align="left">Tanggal</th>
                                            <th align="left">POKOK</th>
                                            <th align="left">BUNGA</th>
                                            <th align="left">ANGSURAN</th>
                                            <th align="left">BAKI DEBET</th>
                                        </tr>
                                        <tr v-for="skala in pkData.struktur" v-bind:key="skala.id">
                                            <td>{{ skala.angsuran_ke }}</td>
                                            <td>{{ skala.tgl_angsuran }}</td>
                                            <td align="right">{{ formatter.format(skala.pokok) }}</td>
                                            <td align="right">{{ formatter.format(skala.bunga) }}</td>
                                            <td align="right">{{ formatter.format(skala.total_angsuran) }}</td>
                                            <td align="right">{{ formatter.format(skala.baki_debet) }}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </n-watermark>
                </div>

            </div>
        </div>
    </n-card>
    <n-modal v-model:show="confModal" preset="dialog" draggable title="Konfirmasi" positive-text="Ajukan Batal Order"
        negative-text="Tidak" @positive-click="handleCancel" @negative-click="cancelCallback">
        <div>Masukan alasan batal order</div>
        <n-input type="textarea" placeholder="alasan batal order" v-model:value="bodyCancel.descr" />
    </n-modal>
    <n-modal v-model:show="confModalRevisi" preset="dialog" draggable title="Konfirmasi" positive-text="Ya"
        negative-text="Tidak" @positive-click="handleCancel('revisi')" @negative-click="cancelCallback">
        <div>Apakah yakin revisi order ?</div>
        <!--    <n-input type="textarea" placeholder="alasan revisi order" v-model:value="bodyCancel.descr"/>-->
    </n-modal>
</template>
<style scoped>
table.tblprint>tr>th {
    padding: 2px 0px 2px 4px;
    border: 1px solid;
}

table.tblprint {
    font-size: 10px;
}

table.tblprint>tr>td {
    padding: 2px 2px 2px 4px;
    border: 1px solid;
}

.tblprint {
    width: 100%;
}
</style>
<script setup>
import { LocalPrintshopRound as PrintIcon, CancelFilled as CancelIcon, EditOutlined as EditIcon } from "@vicons/material";
import { NButton, NIcon, useMessage } from "naive-ui";
import { toRef, useDateFormat, useElementSize, useNow } from '@vueuse/core'
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { useApi } from "../../../helpers/axios";
import router from "../../../router";
import { useVueToPrint } from "vue-to-print";
// import CollateralCheck from "../../../components/atoms/CollateralCheck.vue";
const prosesPK = ref(false);
const pageData = ref([]);
const pk = ref();
const pkData = ref([]);
const struktur = ref([]);
const pihak1 = ref([]);
const pihak2 = ref([]);
const app_base = import.meta.env.VITE_APP_ACCENT_COLOR;
// page controller
const optPrint = reactive({
    pkPage: true,
    skalaPage: true,
    pasanganPage: true,
    ktpaPage: true,
    penjaminPage: true,
    tandaTerima: true,
});
const confModal = ref(false);
const confModalRevisi = ref(false);
const baseRoute = useRoute();
const idApp = baseRoute.params.idapplication;
const userToken = localStorage.getItem("token");
const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
];
const daysName = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jum'at",
    "Sabtu",
];

const zeroPad = (num, places) => String(num).padStart(places, "0");

var dt = new Date();
let year = dt.getFullYear();
let day = dt.getDate().toString().padStart(2, "0");

let thisMonths = (dt.getMonth() + 1).toString().padStart(2, "0");

const thisday = `${year}-${thisMonths}-${day}`;

const dataPelanggan = ref([]);
const dataJaminan = ref([]);

const nowDate = ref('YYYY-MM-DD')
const lang = ref('en-US')
const formatted = toRef(useDateFormat(useNow(), nowDate, { locales: lang }));

const tgl_cetaks = ref(formatted.value);
const tgl_cetak = ref("2023-10-10");
const dynamicForm = reactive({
    awal: null,
    order_number: null,
});

const dataPasangan = ref([]);
const dataPenjamin = ref([]);
const message = useMessage();
const noPerjanjian = ref();

const apptitle = import.meta.env.VITE_APP_TITLE;

const getPrePK = async () => {
    prosesPK.value = false;
    const bodySend = {
        order_number: idApp,
        tgl_awal: tgl_cetaks.value,
    };
    const response = await useApi({
        method: "POST",
        data: bodySend,
        api: `pk`,
        token: userToken,
    });
    if (!response.ok) {
        prosesPK.value = false;
        console.log(response.error);
    } else {
        prosesPK.value = true;
        pkData.value = response.data;

        if (response.data.no_perjanjian != null) {
            noPerjanjian.value = response.data.no_perjanjian;
        }

        if (response.data.tgl_cetak) {
            tgl_cetak.value = response.data.tgl_cetak;
        } else {
            tgl_cetak.value = thisday;
        }

        dataPasangan.value = response.data.pasangan;
        dataPenjamin.value = response.data.penjamin;
        dataJaminan.value = response.data.jaminan;
        pihak1.value = response.data.pihak_1;
        pihak2.value = response.data.pihak_2;
        struktur.value = [];
        struktur.value.push([
            "Angsuran ke",
            "Jatuh Tempo",
            "Pokok",
            "Bunga",
            "Angsuran",
            "Baki Debet",
        ]);
        pkData.value.struktur.forEach((v) => {
            struktur.value.push([
                v.angsuran_ke,
                v.tgl_angsuran,
                v.pokok,
                v.bunga,
                v.total_angsuran,
                v.baki_debet,
            ]);
        });
    }
};


const dayFull = reactive({
    print_date: computed(() => {
        return tgl_cetak.value ? tgl_cetak.value : thisday;
    }),
    day: computed(() => daysName[new Date(dayFull.print_date).getDay()]),
    date: computed(() => new Date(dayFull.print_date).getDate()),
    month: computed(() => monthNames[new Date(dayFull.print_date).getMonth()]),
    year: computed(() => new Date(dayFull.print_date).getFullYear()),
    full_date_only: computed(
        () => `${dayFull.date} ${dayFull.month} ${dayFull.year}`
    ),
    full_date: computed(
        () => `${dayFull.day}, ${dayFull.date} ${dayFull.month} ${dayFull.year}`
    ),
});


const areaPrintRef = ref();
const { handlePrint } = useVueToPrint({
    content: areaPrintRef,
    documentTitle: "Perjanjian Kredit",
});
const formatDate = (dateStr) => {
    // Create a Date object from the input string
    let dateObj = new Date(dateStr);

    // Get day, month, and year
    let day = String(dateObj.getDate()).padStart(2, '0');  // Adds leading zero if needed
    let month = String(dateObj.getMonth() + 1).padStart(2, '0');  // Month is 0-indexed, so add 1
    let year = dateObj.getFullYear();

    // Format the date in 'DD-MM-YYYY' format
    return `${day}-${month}-${year}`;
}
const handlePrintAction = async (e) => {
    const bodySend = {
        tgl_awal: tgl_cetaks.value,
        order_number: idApp,
        angsuran: dynamicForm.angsuran,
        flag: e == 0 ? 'yes' : 'no',
    };
    const userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "post",
        api: "pk",
        data: bodySend,
        token: userToken,
    });
    if (!response.ok) {
        console.log(response.error);
    } else {
        router.push({ name: "Order" });
        handlePrint();
    }

};

const upCase = (e) => {
    return e;
};
const colCheck = ref(true);
const handleCollCheck = (data) => {
    colCheck.value = data;
}

const payloadCheck = () => dataJaminan.value.map(item => {
    if (item.type === 'kendaraan') {
        return {
            type: item.type,
            number: item.atr.no_mesin
        };
    } else if (item.type === 'sertifikat') {
        return {
            type: item.type,
            number: item.atr.no_sertifikat
        };
    }
});
const dateAvailable = (ts) => {
    const date = new Date(ts).getDate();
    if (date > 10) {
        return date < 15 + 6;
    }
}
const options = [];

for (var x = 1; x <= 25; x++) {
    options[x] = {
        label: zeroPad(x, 2),
        value: zeroPad(x, 2),
    };
}

const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});
const bodyCancel = reactive({
    order_number: computed(() => idApp),
    descr: null,
    req_flag: "cancel",
})
const handleCancel = async (e) => {
    bodyCancel.req_flag = e;
    const userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "post",
        api: "pk_cancel",
        data: bodyCancel,
        token: userToken,
    });
    if (!response.ok) {
        console.log(response.error);
        router.push({ name: 'Pengajuan Kredit' })
    } else {
        message.success("pengajuan batal order berhasil....");
    }
}

const pkPageRef = ref();
const size = useElementSize(pkPageRef);

onMounted(() => {
    getPrePK();
});
</script>
