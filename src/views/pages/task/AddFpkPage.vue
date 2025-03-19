<template>
    <blacklist-alert :pesan="bl_pesan" />
    <div class="flex gap-2 mb-2" v-if="approval.kapos">
        <n-alert class="w-full shadow bg-white" title="MANOPS" v-if="approval.kapos">
            <template #icon>
                <n-icon>
                    <account-icon />
                </n-icon>
            </template>
            {{ approval.kapos }}
        </n-alert>
        <n-alert class="w-full shadow bg-white" title="Kepala Cabang" v-if="approval.ho">
            <template #icon>
                <n-icon>
                    <account-icon />
                </n-icon>
            </template>
            {{ approval.ho }}
        </n-alert>
    </div>
    <!-- <n-collapse>
      <n-collapse-item title="page data" name="5">
    <div>
      <pre>{{ pageData }}</pre>
    </div>
  </n-collapse-item>
  </n-collapse> -->
    <n-spin :show="suspense">
        <slot name="addition"></slot>
        <n-space vertical class="rounded-2xl p-4 sticky top-0 bg-white border z-50">
            <n-steps :current="current" v-model:current="current" :status="currentStatus">
                <n-step title="Pelanggan" :status="statusInformasiPelanggan" />
                <n-step title="Order" :status="statusInformasiOrder" />
                <n-step title="Tambahan" />
                <n-step title="Ekstra" :status="statusEkstra" />
            </n-steps>
        </n-space>
        <n-alert class="mt-2" type="warning"
            v-if="sumJaminan != 0 && calcCredit.nilai_yang_diterima > sumJaminan / 2">Nilai
            Plafon <b>{{ calcCredit.nilai_yang_diterima.toLocaleString() }}</b> > Nilai Jaminan {{
                (sumJaminan / 2).toLocaleString()
            }} (50%)
        </n-alert>
        <n-flex class="pt-2">
            <n-card v-show="current == 1" title="Informasi pelanggan" :segmented="{
                content: true,
                footer: 'soft',
            }">
                <template #header-extra>
                    <black-list :no_ktp="dataPelanggan.no_identitas" :no_kk="dataPelanggan.no_kk" />
                </template>
                <n-form ref="formPelanggan" :model="dataPelanggan" :rules="rulesPelanggan"
                    :label-placement="width <= 920 ? 'top' : 'top'" require-mark-placement="right-hanging"
                    :disabled="viewMode" label-width="auto">
                    <div class="flex w-full gap-2">
                        <n-form-item label="Nama" path="nama" class="w-full">
                            <n-input placeholder="nama" v-model:value="dataPelanggan.nama"
                                @input="$event => (dataPelanggan.nama = $event.toUpperCase())" />
                        </n-form-item>
                        <n-form-item label="Nama Panggilan" path="nama_panggilan" class="w-full">
                            <n-input placeholder="nama panggilan" v-model:value="dataPelanggan.nama_panggilan"
                                @input="$event => (dataPelanggan.nama_panggilan = $event.toUpperCase())" />
                        </n-form-item>
                    </div>
                    <div class="flex w-full gap-2">
                        <n-form-item label="Jenis kelamin" path="jenis_kelamin" class="w-full">
                            <n-select filterable placeholder="Jenis Kelamin" :options="optJenisKelamin"
                                v-model:value="dataPelanggan.jenis_kelamin" />
                        </n-form-item>
                        <n-form-item label="Tempat Lahir" path="tempat_lahir" class="w-full">
                            <n-input placeholder="tempat lahir" v-model:value="dataPelanggan.tempat_lahir"
                                @input="$event => (dataPelanggan.tempat_lahir = $event.toUpperCase())" />
                        </n-form-item>
                        <n-form-item label="Tanggal lahir" path="tgl_lahir" class="w-full">
                            <n-date-picker placeholder="Tanggal Lahir" v-model:formatted-value="dataPelanggan.tgl_lahir"
                                value-format="yyyy-MM-dd" format="dd-MM-yyyy" type="date"
                                @update:value="handleTanggalLahir" class="w-full" />
                            <span
                                class="absolute text-xs text-orange-500 top-6 bg-orange-50 w-full p-0.5 mt-2 animate-pulse"
                                v-show="notifUsia">{{ noteUsia }}</span>
                        </n-form-item>
                        <n-form-item label="Status Kawin" path="status_kawin" class="w-full">
                            <n-input-group>
                                <n-select filterable placeholder="Status Kawin" :options="optStatusKawin"
                                    v-model:value="dataPelanggan.status_kawin" />
                            </n-input-group>
                        </n-form-item>
                    </div>
                    <div class="flex w-full gap-2">
                        <n-form-item label="Tipe Identitas" path="tipe_identitas" class="w-full">
                            <n-select filterable placeholder="Jenis Identitas" :options="optJenisIdentitas"
                                v-model:value="dataPelanggan.tipe_identitas" />
                        </n-form-item>
                        <n-form-item label="No Identitas" path="no_identitas" class="w-full">
                            <n-input :allow-input="onlyAllowNumber" class="w-full" placeholder="No Identitas" show-count
                                :maxlength="16" v-model:value="dataPelanggan.no_identitas">
                            </n-input>
                        </n-form-item>
                        <n-form-item label="No KK" path="no_kk" class="w-full">
                            <n-input :allow-input="onlyAllowNumber" placeholder="No Kartu Keluarga"
                                v-model:value="dataPelanggan.no_kk" show-count :maxlength="16" />
                        </n-form-item>
                    </div>
                </n-form>
                <n-form ref="formPelangganPekerjaan" :model="dataPekerjaan" :rules="rulesPekerjaan" :disabled="viewMode"
                    :label-placement="width <= 920 ? 'top' : 'top'" require-mark-placement="right-hanging"
                    label-width="auto">
                    <div class="flex gap-4">
                        <n-form-item label="Sektor" path="pekerjaan_id" class="w-full">
                            <n-select filterable placeholder="pekerjaan" :options="optPekerjaan"
                                v-model:value="dataPekerjaan.pekerjaan_id" />
                        </n-form-item>
                        <n-form-item label="Pendidikan" path="pendidikan" class="w-full">
                            <n-select filterable placeholder="pendidikan" :options="optPendidikan"
                                v-model:value="dataPekerjaan.pendidikan" />
                        </n-form-item>
                    </div>
                    <div class="flex gap-2">
                        <n-form-item label="Telepon Selullar 1" path="telepon_selular" class="w-full">
                            <n-input placeholder="Telepon Sellular 1" :allow-input="onlyAllowNumber"
                                v-model:value="dataPekerjaan.telepon_selular" maxlength="13" />
                        </n-form-item>

                        <n-form-item label="Telepon Selullar 2" path="telepon_rumah" class="w-full">
                            <n-input placeholder="Telepon Sellular 2" v-model:value="dataPekerjaan.telepon_rumah"
                                :allow-input="onlyAllowNumber">
                            </n-input>
                        </n-form-item>
                    </div>
                    <n-divider title-placement="left">
                        Informasi Alamat Identitas
                    </n-divider>
                </n-form>
                <n-form ref="formPelangganAlamatIdentitas" :model="alamatIdentitas" :rules="rulesIdentitas"
                    :disabled="viewMode" :label-placement="width <= 920 ? 'top' : 'top'"
                    require-mark-placement="right-hanging" label-width="auto">
                    <div class="flex gap-2">
                        <n-form-item label="Alamat" class="w-full" path="alamat">
                            <n-input placeholder="Alamat" v-model:value="alamatIdentitas.alamat"
                                @input="$event => (alamatIdentitas.alamat = $event.toUpperCase())" />
                        </n-form-item>
                        <n-form-item label="RT" path="rt">
                            <n-input placeholder="RT" v-model:value="alamatIdentitas.rt" :allow-input="onlyAllowNumber"
                                :maxlength="3" @input="$event => (alamatIdentitas.rt = $event.toUpperCase())">
                            </n-input>
                        </n-form-item>
                        <n-form-item label="RW" path="rw">
                            <n-input placeholder="RW" v-model:value="alamatIdentitas.rw" :allow-input="onlyAllowNumber"
                                :maxlength="3" @input="$event => (alamatIdentitas.rw = $event.toUpperCase())">
                            </n-input>
                        </n-form-item>
                    </div>

                    <select-state-region v-model:provinsi="alamatIdentitas.provinsi" v-model:kota="alamatIdentitas.kota"
                        v-model:kecamatan="alamatIdentitas.kecamatan" v-model:desa="alamatIdentitas.kelurahan"
                        v-model:kodepos="alamatIdentitas.kode_pos" />
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <strong class="text-base">Informasi Alamat Tagih</strong>
                        <n-button secondary type="primary" @click="copyAddress" v-show="!viewMode">
                            salin alamat identitas
                        </n-button>
                    </div>
                </n-form>
                <n-form ref="formPelangganAlamatTagih" :model="alamatTagih" :rules="rulesAlamatTagih"
                    :disabled="viewMode" :label-placement="width <= 920 ? 'top' : 'top'"
                    require-mark-placement="right-hanging" label-width="auto">
                    <div class="flex gap-2">
                        <n-form-item label="Alamat" class="w-full" path="alamat">
                            <n-input placeholder="Alamat" v-model:value="alamatTagih.alamat"
                                @input="$event => (alamatTagih.alamat = $event.toUpperCase())" />
                        </n-form-item>
                        <n-form-item label="RT" path="rt">
                            <n-input placeholder="RT" v-model:value="alamatTagih.rt" :allow-input="onlyAllowNumber"
                                :maxlength="3" @input="$event => (alamatTagih.rt = $event.toUpperCase())">
                            </n-input>
                        </n-form-item>
                        <n-form-item label="RW" path="rw">
                            <n-input placeholder="RW" v-model:value="alamatTagih.rw" :allow-input="onlyAllowNumber"
                                :maxlength="3" @input="$event => (alamatTagih.rw = $event.toUpperCase())">
                            </n-input>
                        </n-form-item>
                    </div>
                    <select-state-region v-model:provinsi="alamatTagih.provinsi" v-model:kota="alamatTagih.kota"
                        v-model:kecamatan="alamatTagih.kecamatan" v-model:desa="alamatTagih.kelurahan"
                        v-model:kodepos="alamatTagih.kode_pos" />
                    <n-divider title-placement="left"> Dokumen Identitas</n-divider>
                    <n-space justify="space-between">
                        <n-space>
                            <file-upload title="KTP" :def_value="findDocByType(dok_identitas, 'ktp')"
                                endpoint="image_upload_prospect" type="ktp" :idapp="pageData.survey_id"
                                :view-mode="props.viewMode" />
                            <file-upload title="KK" :def_value="findDocByType(dok_identitas, 'kk')"
                                endpoint="image_upload_prospect" type="kk" :idapp="pageData.survey_id"
                                :view-mode="props.viewMode" />
                            <file-upload title="KTP Pasangan" :def_value="findDocByType(dok_identitas, 'ktp_pasangan')"
                                endpoint="image_upload_prospect" type="ktp_pasangan" :idapp="pageData.survey_id"
                                :view-mode="props.viewMode" />
                        </n-space>
                    </n-space>

                    <n-divider title-placement="left"> Dokumen Pendukung</n-divider>
                    <file-upload :def_preview="true" :multi="true" :data_multi="pageData.dokumen_pendukung"
                        title="dokumen pendukung" endpoint="image_upload_prospect" type="other" :idapp="idApp"
                        :view-mode="props.viewMode" />
                    <!-- <n-divider v-show="actionPage != 'view'" title-placement="left">Dokumen Pendukung</n-divider>
<div>
  <file-upload :def_preview="true" title="pendukung" :def_value="findDocByType(dok_pendukung, 'other')"
    endpoint="image_upload_prospect" type="other" :idapp="pageData.survey_id" />
  <div class="grid grid-cols-10 grid-flow-row gap-2 pt-2" v-if="dok_pendukung.length > 0">
    <n-image v-for="dok in dok_pendukung" :key="dok.id" :src="dok.PATH"
      class="min-w-20 rounded-xl hover:shadow-md hover:border-2" />
  </div>
</div> -->
                </n-form>
            </n-card>
            <n-card v-show="current == 2" title="Informasi Order" :segmented="{
                content: true,
                footer: 'soft',
            }">
                <n-form ref="formOrder" :model="dataOrder" :rules="rulesOrder"
                    :label-placement="width <= 920 ? 'top' : 'top'" require-mark-placement="right-hanging"
                    label-width="auto" :disabled="viewMode">
                    <div class="flex gap-2">
                        <n-form-item label="Tanggal Order" path="order_tanggal" class="w-full">
                            <n-input :value="dataOrder.order_tanggal" disabled></n-input>
                        </n-form-item>
                        <n-form-item label="Reff Pelanggan" path="ref_pelanggan" class="w-full">
                            <div class="flex gap-2 w-full">

                                <n-select filterable placeholder="reff pelanggan" :options="optReff"
                                    v-model:value="dataOrder.ref_pelanggan" class="w-full" />
                                <n-input placeholder="Reff Pelanggan" v-show="dataOrder.ref_pelanggan == 'LAINNYA' ||
                                    dataOrder.ref_pelanggan == 'MEDIATOR'
                                    " v-model:value="dataOrder.ref_pelanggan_oth"
                                    @input="$event => (dataOrder.ref_pelanggan_oth = $event.toUpperCase())" />
                            </div>
                        </n-form-item>
                        <n-form-item label="Surveyor" path="surveyor_name" class="w-full">
                            <n-input placeholder="Surveyor" v-model:value="dataOrder.surveyor_name" disabled />
                        </n-form-item>
                    </div>
                    <n-form-item label="Catatan Survey" path="catatan_survey">
                        <n-input type="textarea" show-count
                            @input="$event => (dataOrder.catatan_survey = $event.toUpperCase())"
                            placeholder="catatan surveyor" v-model:value="dataOrder.catatan_survey" :autosize="{
                                minRows: 3,
                            }" />
                    </n-form-item>
                    <div class="flex gap-2">
                        <n-form-item label="Nama Ibu Kandung" path="nama_ibu" class="w-full">
                            <n-input placeholder="Nama Ibu Kandung"
                                @input="$event => (dataOrder.nama_ibu = $event.toUpperCase())"
                                v-model:value="dataOrder.nama_ibu" />
                        </n-form-item>
                        <n-form-item label="Lama Bekerja" path="lama_bekerja" class="w-full">
                            <n-input-number v-bind:dir="isRtl ? 'rtl' : 'ltr'" :show-button="false"
                                placeholder="lama bekerja" v-model:value="dataOrder.lama_bekerja" class="w-full">
                                <template #suffix> bulan</template>
                            </n-input-number>
                        </n-form-item>
                        <n-form-item label="Tanggungan" path="tanggungan" class="w-full">
                            <n-input-number v-bind:dir="isRtl ? 'rtl' : 'ltr'" placeholder="Jumlah Tanggungan"
                                v-model:value="dataOrder.tanggungan" class="w-full" />
                        </n-form-item>
                    </div>
                    <div class="flex gap-2">
                        <n-form-item label="Pendapatan Pelanggan" path="pendapatan_pribadi" class="w-full">
                            <n-input-number v-bind:dir="isRtl ? 'rtl' : 'ltr'" :parse="parse" :format="format"
                                v-model:value="dataOrder.pendapatan_pribadi" :show-button="false" class="flex !w-full"
                                placeholder="Pribadi" />
                        </n-form-item>
                        <n-form-item label="Pendapatan Pasangan" path="pendapatan_pasangan" class="w-full">
                            <n-input-number v-bind:dir="isRtl ? 'rtl' : 'ltr'" :parse="parse" :format="format"
                                v-model:value="dataOrder.pendapatan_pasangan" :show-button="false" class="flex !w-full"
                                placeholder="Pasangan" />
                        </n-form-item>
                        <n-form-item label="Pendapatan Lainnya" path="pendapatan_lainnya" class="w-full">
                            <n-input-number v-bind:dir="isRtl ? 'rtl' : 'ltr'" :parse="parse" :format="format"
                                v-model:value="dataOrder.pendapatan_lainnya" :show-button="false" class="flex !w-full"
                                placeholder="Lainnya" />
                        </n-form-item>
                        <n-form-item label="Biaya" path="biaya_bulanan" class="w-full">
                            <n-input-number v-bind:dir="isRtl ? 'rtl' : 'ltr'" :parse="parse" :format="format"
                                v-model:value="dataOrder.biaya_bulanan" :show-button="false" class="flex !w-full"
                                placeholder="Pengeluaran" />
                        </n-form-item>
                    </div>
                    <n-divider title-placement="left"> NPWP</n-divider>
                    <n-form-item label="No NPWP" path="no_npwp">
                        <n-input placeholder="No NPWP" v-model:value="dataOrder.no_npwp"
                            :allow-input="onlyAllowNumber" />
                    </n-form-item>
                    <n-divider title-placement="left"> Barang Taksasi</n-divider>
                    <n-card embedded :segmented="true"
                        :title="`Jumlah Jaminan : ${jaminanStore.listJaminan.length}, Total Nilai Jaminan : ${sumJaminan.toLocaleString()}`">
                        <template #header-extra>
                            <div class="flex w-60 gap-2" v-show="!viewMode">
                                <n-select v-model:value="jenisJaminan" :options="optJaminan"
                                    placeholder="jenis jaminan" />
                                <n-button circle type="primary" @click="addJaminan">
                                    <n-icon>
                                        <add-icon />
                                    </n-icon>
                                </n-button>
                            </div>
                        </template>
                        <n-card :segmented="true" class="my-2  ring-yellow-100 rounded-xl hover:ring-4 hover:ring-pr"
                            v-for="(coll) in orderJaminan" :key="coll" :title="`${coll.type}`">
                            <template #header-extra>
                                <div class="flex gap-2" v-if="!viewMode">
                                    <n-button type="warning" @click="viewModal(coll)" secondary>
                                        <n-icon>
                                            <edit-icon />
                                        </n-icon>
                                        ubah
                                    </n-button>
                                    <n-popconfirm @positive-click="removeJaminan(coll)" positive-text="ya"
                                        negative-text="tidak">
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
                                <div v-else>
                                    <n-button type="info" @click="viewModal(coll)" secondary>
                                        <n-icon>
                                            <view-icon />
                                        </n-icon>
                                        detail
                                    </n-button>
                                </div>
                            </template>

                            <div>
                                <div class="pb-2"
                                    v-if="coll.type == 'KENDARAAN' && coll.atr.tahun && tahunJaminanValidate(coll.atr.tahun) > 10">
                                    <n-alert type="warning">usia KENDARAAN <b>{{
                                        tahunJaminanValidate(coll.atr.tahun)
                                            }}</b>
                                        tahun
                                    </n-alert>
                                </div>
                                <div class="pt-2">
                                    <n-descriptions v-if="coll.type.toLowerCase() === 'kendaraan'"
                                        :label-placement="width < 720 ? 'left' : 'top'" bordered
                                        :column="width < 720 ? 1 : 8">
                                        <n-descriptions-item v-for="item in modelKendaraan" :key="item"
                                            :label="item.toUpperCase()">
                                            <b>{{
                                                item === 'nilai' ? coll.atr[item].toLocaleString('US') :
                                                    coll.atr[item] ? coll.atr[item] : '--'
                                                }}</b>
                                        </n-descriptions-item>
                                    </n-descriptions>
                                    <n-descriptions v-if="coll.type.toLowerCase() === 'sertifikat'"
                                        :label-placement="width < 720 ? 'left' : 'top'" bordered
                                        :column="width < 720 ? 1 : 8">
                                        <n-descriptions-item v-for="item in modelSertifikat" :key="item"
                                            :label="item.toUpperCase()">
                                            <b>{{
                                                item === 'nilai' ? coll.atr[item].toLocaleString('US') :
                                                    coll.atr[item] ? coll.atr[item] : '--'
                                                }}</b>
                                        </n-descriptions-item>
                                    </n-descriptions>
                                </div>
                                <div>
                                    <div v-if="coll.type.toLowerCase() == 'kendaraan'">
                                        <n-divider title-placement="left"> UPLOAD DOKUMEN JAMINAN</n-divider>
                                        <div class="flex flex-col md:flex-row gap-2">

                                            <file-upload title="No Rangka" endpoint="image_upload_prospect"
                                                :type="`no_rangka`" :reff="coll.counter_id" :idapp="idApp"
                                                :view-mode="viewMode"
                                                :def_value="findDocByType(coll.atr.document, 'no_rangka')" />
                                            <file-upload title="No Mesin" :reff="coll.counter_id"
                                                endpoint="image_upload_prospect" :view-mode="viewMode"
                                                :type="`no_mesin`" :idapp="idApp"
                                                :def_value="findDocByType(coll.atr.document, 'no_mesin')" />
                                            <file-upload title="STNK" :reff="coll.counter_id"
                                                endpoint="image_upload_prospect" :type="`stnk`" :view-mode="viewMode"
                                                :def_value="findDocByType(coll.atr.document, 'stnk')" :idapp="idApp" />
                                        </div>
                                    </div>
                                    <n-divider title-placement="left" class="uppercase"> Upload Dokumen {{ coll.type }}
                                    </n-divider>
                                    <div v-if="coll.type.toLowerCase() == 'kendaraan'"
                                        class="flex flex-col md:flex-row gap-2">
                                        <file-upload title="Depan" endpoint="image_upload_prospect" :type="`depan`"
                                            :idapp="idApp" :view-mode="viewMode" :reff="coll.counter_id"
                                            :def_value="findDocByType(coll.atr.document, 'depan')" />
                                        <file-upload title="Belakang" :reff="coll.counter_id"
                                            :def_value="findDocByType(coll.atr.document, 'belakang')"
                                            endpoint="image_upload_prospect" :view-mode="viewMode" :type="`belakang`"
                                            :idapp="idApp" />
                                        <file-upload title="Kanan" :reff="coll.counter_id"
                                            endpoint="image_upload_prospect" :view-mode="viewMode"
                                            :def_value="findDocByType(coll.atr.document, 'kanan')" :type="`kanan`"
                                            :idapp="idApp" />
                                        <file-upload title="Kiri" :reff="coll.counter_id"
                                            endpoint="image_upload_prospect" :type="`kiri`" :view-mode="viewMode"
                                            :def_value="findDocByType(coll.atr.document, 'kiri')" :idapp="idApp" />
                                    </div>
                                    <div v-else class="flex flex-col w-full">
                                        <file-upload :title="`dokumen`" :def_preview="true" :multi="true"
                                            :data_multi="coll.atr.document" :view-mode="viewMode"
                                            endpoint="image_upload_prospect" :type="`sertifikat`"
                                            :reff="coll.counter_id" :idapp="idApp" />
                                    </div>
                                </div>
                            </div>
                        </n-card>
                    </n-card>
                    <n-modal v-model:show="showModal">
                        <n-card class="md:w-1/2" closable @close="showModal = false" :segmented="true"
                            :title="`form ${jenisJaminan}`">
                            <component :is="JaminanKendaraan" v-if="jenisJaminan.toLowerCase() == 'kendaraan'"
                                @childData="handleChildData" :def_data="dataProp" />
                            <component :is="JaminanSertifikat" v-if="jenisJaminan.toLowerCase() == 'sertifikat'"
                                @childData="handleChildData" :def_data="dataProp" />
                            <!-- <component :is="JaminanBillyet" v-if="jenisJaminan == 'billyet'" @childData="handleChildData" />
<component :is="JaminanEmas" v-if="jenisJaminan == 'emas'" @childData="handleChildData" /> -->
                            <template #footer>
                                <n-space v-if="!viewMode">
                                    <n-button type="primary" @click="ubahJaminan(jenisJaminan)" v-if="dataProp">ubah
                                    </n-button>
                                    <n-button type="primary" @click="pushJaminan(jenisJaminan)" v-else>tambah</n-button>

                                </n-space>
                            </template>
                        </n-card>
                    </n-modal>

                </n-form>
            </n-card>
            <n-card v-show="current == 3" title="Informasi Tambahan" :segmented="{
                content: true,
                footer: 'soft',
            }">
                <n-form ref="formTambahan" :model="dataPasangan" :rules="rulesPasangan"
                    :label-placement="width <= 920 ? 'top' : 'top'" require-mark-placement="right-hanging"
                    label-width="auto" :disabled="viewMode">
                    <div v-if="dataPelanggan.status_kawin == 'KAWIN'">
                        <n-divider title-placement="left"> Pasangan</n-divider>
                        <div class="flex gap-2">
                            <n-form-item label="Nama Pasangan" path="nama_kerabat" class="w-full">
                                <n-input placeholder="Nama Pasangan" v-model:value="dataPasangan.nama_pasangan"
                                    @input="$event => (dataPasangan.nama_pasangan = $event.toUpperCase())" />
                            </n-form-item>
                            <n-form-item label="Tempat / Tanggal Lahir" path="order" class="w-full">
                                <n-input-group>
                                    <n-input placeholder="Tempat lahir" v-model:value="dataPasangan.tmptlahir_pasangan"
                                        @input="$event => (dataPasangan.tmptlahir_pasangan = $event.toUpperCase())" />
                                    <n-date-picker placeholder="Tanggal lahir"
                                        v-model:formatted-value="dataPasangan.tgllahir_pasangan"
                                        value-format="yyyy-MM-dd" format="dd-MM-yyyy" type="date" class="w-full" />
                                </n-input-group>
                            </n-form-item>
                            <n-form-item label="Pekerjaan" path="pekerjaan_pasangan" class="w-full">
                                <n-input placeholder="pekerjaan" v-model:value="dataPasangan.pekerjaan_pasangan"
                                    @input="$event => (dataPasangan.pekerjaan_pasangan = $event.toUpperCase())" />
                            </n-form-item>
                        </div>
                        <n-form-item label="Alamat" path="alamat_pasangan" class="w-full">
                            <!-- <pre>{{ formAssign }}</pre> -->
                            <div class="w-full gap-2 flex flex-col">
                                <n-checkbox v-model:checked="alamatPelanggan" @update:checked="handleAlamatPasangan">
                                    sesuai dengan pelanggan
                                </n-checkbox>
                                <n-input type="textarea" ref="inputAlamatPasanganRef" :autosize="{
                                    minRows: 3,
                                }" placeholder="Alamat" v-model:value="dataPasangan.alamat_pasangan"
                                    @input="$event => (dataPasangan.alamat_pasangan = $event.toUpperCase())"
                                    @focus="handleInputPasanganFocus" />
                            </div>
                        </n-form-item>
                    </div>

                    <n-divider title-placement="left" v-show="!viewMode">

                        <div class="flex items-center gap-2">
                            <n-button class="hover:shadow" secondary type="primary" @click="addPenjamin">
                                <n-icon>
                                    <add-icon />
                                </n-icon>
                                Penjamin
                            </n-button>
                        </div>
                    </n-divider>
                    <!-- penjamin block -->
                    <div class="bg-sc-50 border rounded-xl mb-2" v-for="(penjamin, i) in formAssign.penjamin" :key="i">
                        <div class="flex items-center text-lg p-2 border-b justify-between">
                            <label class="ps-2">Penjamin {{ i + 1 }}</label>
                            <div class="flex gap-2" v-if="!viewMode">
                                <n-button circle type="primary" secondary class="hover:shadow" @click="addPenjamin">
                                    <n-icon>
                                        <add-icon />
                                    </n-icon>
                                </n-button>
                                <n-popconfirm @positive-click="removePenjamin({ id: penjamin.id })" positive-text="ya"
                                    negative-text="tidak">
                                    <template #trigger>
                                        <n-button type="error" secondary>hapus</n-button>
                                    </template>
                                    Apakah yakin ingin menghapus ?
                                </n-popconfirm>
                            </div>
                        </div>
                        <div class="p-4 pb-0">
                            <div class="flex gap-2">
                                <n-form-item label="No KTP" path="ktp_penjamin" class="w-full">
                                    <n-input placeholder="KTP Penjamin" v-model:value="penjamin.no_identitas" show-count
                                        :maxlength="16" :allow-input="onlyAllowNumber" />
                                </n-form-item>
                                <n-form-item label="Nama Penjamin" path="nama_penjamin" class="w-full">
                                    <n-input placeholder="Nama penjamin" v-model:value="penjamin.nama"
                                        @input="$event => (penjamin.nama = $event.toUpperCase())" />
                                </n-form-item>
                                <n-form-item label="Tanggal Lahir" path="tgllahir_penjamin" class="w-full">
                                    <n-date-picker placeholder="Tanggal lahir"
                                        v-model:formatted-value="penjamin.tgl_lahir" value-format="yyyy-MM-dd"
                                        format="dd-MM-yyyy" type="date" class="w-full" />
                                </n-form-item>
                            </div>
                            <div class="grid grid-cols-3 gap-2">
                                <n-form-item label="Hubungan Dengan konsumen" path="hub_penjamin">
                                    <n-select filterable :options="optHubCust" v-model:value="penjamin.hub_cust" />
                                </n-form-item>
                                <n-form-item label="Telepon" path="telepon_penjamin">
                                    <n-input placeholder="Telepon Sellular 1" v-model:value="penjamin.no_hp"
                                        maxlength="13" :allow-input="onlyAllowNumber" />
                                </n-form-item>
                                <n-form-item label="Pekerjaan" path="pekerjaan_penjamin">
                                    <n-input placeholder="Pekerjaan Penjamin" v-model:value="penjamin.pekerjaan"
                                        @input="$event => (penjamin.pekerjaan = $event.toUpperCase())">
                                    </n-input>
                                </n-form-item>
                            </div>
                            <n-form-item label="Alamat" path="alamat_penjamin" class="w-full">
                                <n-input :autosize="{
                                    minRows: 3,
                                }" type="textarea" placeholder="Alamat" v-model:value="penjamin.alamat"
                                    @input="$event => (penjamin.alamat = $event.toUpperCase())" />
                            </n-form-item>
                        </div>
                    </div>
                    <n-divider title-placement="left">
                        Kerabat dalam kondisi darurat
                    </n-divider>
                    <div class="flex gap-2">
                        <n-form-item label="Nama Kerabat" path="nama_kerabat" class="w-full">
                            <n-input placeholder="Nama Kerabat" v-model:value="dataKerabat.nama"
                                @input="$event => (dataKerabat.nama = $event.toUpperCase())" />
                        </n-form-item>
                        <n-form-item label="Telepon" path="telepon_kerabat" class="w-full">
                            <n-input placeholder="Telepon Selular" v-model:value="dataKerabat.no_hp" maxlength="13"
                                :allow-input="onlyAllowNumber" />
                        </n-form-item>
                    </div>
                    <n-form-item label="Alamat" path="alamat_kerabat">
                        <n-input-group>
                            <n-input placeholder="Alamat" v-model:value="dataKerabat.alamat"
                                @input="$event => (dataKerabat.alamat = $event.toUpperCase())" path="alamat_kerabat" />
                            <n-input placeholder="RT" v-model:value="dataKerabat.rt" maxlength="3"
                                :allow-input="onlyAllowNumber" path="rt_kerabat" />
                            <n-input placeholder="RW" v-model:value="dataKerabat.rw" maxlength="3"
                                :allow-input="onlyAllowNumber" path="rt_kerabat" />
                        </n-input-group>
                    </n-form-item>
                    <select-state-region v-model:provinsi="dataKerabat.provinsi" v-model:kota="dataKerabat.kota"
                        v-model:kecamatan="dataKerabat.kecamatan" v-model:desa="dataKerabat.kelurahan"
                        v-model:kodepos="dataKerabat.kodepos" />
                    <n-divider title-placement="left"> Informasi Bank</n-divider>
                    <n-dynamic-input v-model:value="formAssign.info_bank" :on-create="onCreate" disabled
                        v-if="viewMode">
                        <template #create-button-default> Tambah Bank</template>
                        <template #default="{ value }">
                            <div class="flex w-full gap-2 bg-pr-50 p-2 pb-0 rounded-md">
                                <n-form-item label="Kode Bank" path="kode Bank" class="w-full">
                                    <n-input v-model:value="value.kode_bank" type="text" />
                                </n-form-item>
                                <n-form-item label="Nama Bank" path="Nama Bank" class="w-full">
                                    <n-input v-model:value="value.nama_bank" type="text" />
                                </n-form-item>
                                <n-form-item label="No Rekening" path="norkening" class="w-full">
                                    <n-input v-model:value="value.no_rekening" type="text" />
                                </n-form-item>
                                <n-form-item label="Atas Nama" path="atasnama" class="w-full">
                                    <n-input v-model:value="value.atas_nama" type="text" />
                                </n-form-item>
                                <n-form-item label="Status" path="Nama Bank" class="w-full">
                                    <n-input v-model:value="value.status" type="text" />
                                </n-form-item>
                            </div>
                        </template>
                    </n-dynamic-input>
                </n-form>
            </n-card>
            <n-card v-show="current == 4" title="Data Ekstra" :segmented="{
                content: true,
                footer: 'soft',
            }" :loading="true">
                <n-form ref="formExtra" :model="ekstra" :rules="rulesExtra"
                    :label-placement="width <= 920 ? 'top' : 'top'" require-mark-placement="right-hanging"
                    label-width="auto" :disabled="viewMode">
                    <div class="w-full flex md:flex-row flex-col gap-4">
                        <div class="flex flex-col w-full">
                            <n-form-item label="Pokok Pembayaran" path="pokok_pembayaran" class="w-full">
                                <n-input-number
                                    v-model:value="ekstra.pokok_pembayaran" :parse="parse" :show-button="false"
                                    :format="format" class="w-full">
                                </n-input-number>
                            </n-form-item>
                            <n-form-item label="Jenis Angsuran" path="jenis">
                                <n-select filterable placeholder="Jenis Angsuran" :options="jenisAngsuran"
                                    v-model:value="ekstra.jenis_angsuran" @update:value="handleTipe" />
                            </n-form-item>
                            <div class="md:flex gap-2">
                                <n-form-item label="Tenor " path="tenor" class="w-full">
                                    <n-select :options="tenor" label-field="label" value-field="value"
                                        v-model:value="ekstra.tenor" />
                                </n-form-item>

                            </div>
                        </div>
                        <div class="flex flex-col w-full">
                            <n-form-item label="Bunga " path="bunga" class="w-full">
                                <div class="flex gap-2 w-full">
                                    <n-input-number class="w-full" :show-button="false" v-model:value="ekstra.bunga"
                                        :min="0" :max="100">
                                        <template #suffix>% /bulan</template>
                                    </n-input-number>
                                    <n-input class="w-full" pacleholder="tahunan" v-model:value="ekstra.bunga_tahunan"
                                        :min="1" :max="100" readonly>
                                        <template #suffix>% / tahun</template>
                                    </n-input>
                                </div>
                            </n-form-item>
                            <n-form-item label="Angsuran " path="angsuran" class="w-full">
                                <div class="flex gap-2 w-full">
                                    <n-input-number :parse="parse" :format class="w-full" :show-button="false"
                                        v-model:value="ekstra.angsuran" readonly>
                                    </n-input-number>
                                </div>
                            </n-form-item>
                            <n-form-item label="Biaya Admin" path="biaya_admin" class="w-full">
                                <div class="flex gap-2 w-full">
                                    <n-input-number v-model:value="ekstra.biaya_admin" type="text" class="w-full"
                                        :parse="parse" :format="format" :show-button="false">
                                    </n-input-number>
                                </div>
                            </n-form-item>
                            <!-- <n-form-item label="Nilai yang diterima" path="nilai_yang_diterima">
                                <n-input-number :parse="parse" :format="format" readonly
                                    :placeholder="calcCredit.pokok_pembayaran" :show-button="false" class="flex !w-full"
                                    @update:value="handlePlafond" :loading="loading"
                                    v-model:value="ekstra.nilai_yang_diterima" /> -->
                                <!-- <div class="absolute top-9 flex bg-yellow-50 gap-2 text-xs px-2" v-show="dataTaksasi.nilai != '' &&
  calcCredit.nilai_yang_diterima > dataTaksasi.nilai
  ">
                    <n-icon color="#FF9100"> <warning-icon /> </n-icon>Plafon >
                    Harga Pasar
                </div> -->
                            <!-- </n-form-item> -->
                        </div>
                    </div>
                </n-form>
            </n-card>
        </n-flex>
        <n-space class="pt-4" justify="between">
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
            <n-button :loading="loading" v-show="!viewMode" icon-placement="left" type="info" @click="handleSave">
                <n-icon>
                    <save-icon></save-icon>
                </n-icon>
                simpan
            </n-button>
            <n-button v-show="actionPage != 'view'" @click="hadleValid" type="primary" v-if="!viewMode">
                <template #icon>
                    <n-icon>
                        <send-icon />
                    </n-icon>
                </template>
                Kirim ke Manops
            </n-button>
        </n-space>
    </n-spin>
</template>
<script setup>
import { ref, reactive, computed, onMounted, toRef } from "vue";
import { useRoute } from "vue-router";
import { useApi } from "../../../helpers/axios";
import { useBlacklist } from "../../../helpers/blacklist";
import router from "../../../router";
import { useMessage } from "naive-ui";
import { useWindowSize } from "@vueuse/core";
import _ from "lodash";
import {
    PlusRound as AddIcon,
    EditOutlined as EditIcon,
    RemoveRedEyeOutlined as ViewIcon,
    DeleteOutlineFilled as DeleteIcon,
    ChevronLeftSharp as ArrowBack,
    ChevronRightSharp as ArrowForward,
    AccountCircleRound as AccountIcon,
    SendRound as SendIcon,
    SaveRound as SaveIcon,
} from "@vicons/material";
import { useJaminanStore } from "../../../stores/jaminan";
import JaminanKendaraan from "./survey/JaminanKendaraan.vue";
import JaminanSertifikat from "./survey/JaminanSertifikat.vue";

const message = useMessage();
const loading = ref(false);
const loadingSend = ref(false);
const baseRoute = useRoute();
const tipeAngsuran = ref({});
const jaminanStore = useJaminanStore();

const props = defineProps({
    viewMode: {
        type: Boolean,
        default: false,
    },
});

const calcCredit = reactive({
    angsuran: 0,
    biaya_admin: 0,
    net_admin: computed(() => parseInt(calcCredit.total_admin)),
    bunga_eff_actual: computed(() => calcCredit.bunga_eff),
    bunga_margin: computed(() =>
        Math.ceil(
            parseInt(
                ((calcCredit.bunga_flat / 12) *
                    parseInt(calcCredit.periode) *
                    parseInt(calcCredit.pokok_pembayaran)) /
                100
            )
        )
    ),
    pokok_margin: computed(
        () =>
            parseInt(calcCredit.pokok_pembayaran) + parseInt(calcCredit.bunga_margin)
    ),
    pokok_pembayaran: computed(() =>
        parseInt(calcCredit.nilai_yang_diterima) - parseInt(calcCredit.total_admin)
    ),
    total_admin: computed(() => calcCredit.nilai_yang_diterima * calcCredit.biaya_admin / 100),
    bunga_flat: computed(
        () =>
            ((calcCredit.periode * (calcCredit.bunga_eff_actual / 100 / 12)) /
                (1 -
                    (1 + calcCredit.bunga_eff_actual / 100 / 12) ** -calcCredit.periode) -
                1) *
            (12 / calcCredit.periode) *
            100
    ),

});
const dataPelanggan = ref({
    tipe_identitas: "KTP",
});

const { width } = useWindowSize();
const alamatIdentitas = ref({
    kelurahan: null,
});
const alamatTagih = ref({
    kelurahan: null,
});
const dataPekerjaan = ref({});
const dataOrder = ref({});
const dataTaksasi = ref({});
const dataTambahan = ref({});
const dataKerabat = ref({});
const dataPenjamin = ref([]);
const addPenjamin = () => formAssign.penjamin.push({
    id: new Date().getTime(),
    no_identitas: '',
    nama: '',
    no_hp: '',
    pekerjaan: '',
    alamat: ''
});
const removePenjamin = (e) => {
    let index = _.findIndex(formAssign.penjamin, e);
    formAssign.deleted_penjamin.push(e);
    formAssign.penjamin.splice(index, 1);
}
const dataSurat = ref({});
const dataAttachment = ref({});
const concatIdentitas = () => {
    const a = alamatIdentitas.value
    return `${a.alamat}, RT ${a.rt}, RW ${a.rw}, Kelurahan ${a.kelurahan}, Kecamatan ${a.kecamatan}, ${a.kota}, Provinsi ${a.provinsi}${a.kode_pos ? `, Kode Pos ${a.kode_pos}` : ''}`;
}

const inputAlamatPasanganRef = ref(null);
const alamatPelanggan = ref(false);
const handleAlamatPasangan = (e) => {
    if (e) {
        dataPasangan.value.alamat_pasangan = concatIdentitas();
    } else {
        dataPasangan.value.alamat_pasangan = "";
    }
}
const handleInputPasanganFocus = () => {
    inputAlamatPasanganRef.value?.select();
}
const dataPasangan = ref({
    nama_pasangan: null,
    tmptlahir_pasangan: null,
    pekerjaan_pasangan: null,
    tgllahir_pasangan: null,
    alamat_pasangan: null,
});

const dataBank = ref([]);
const onCreate = () => {
    return {
        kode_bank: null,
        nama_bank: null,
        no_rekening: null,
        atas_nama: null,
        status: null,
    };
};
const pageData = ref([]);
const suspense = ref(false);
const current = ref(1);
const userToken = localStorage.getItem("token");
const currentStatus = ref("process");
const skemaAngsuran = ref([]);
const tenor6 = ref([]);
const tenor12 = ref([]);
const tenor18 = ref([]);
const tenor24 = ref([]);

const formPelanggan = ref(null);
const formOrder = ref(null);
const formPelangganPekerjaan = ref(null);
const formPelangganAlamatIdentitas = ref(null);
const formPelangganAlamatTagih = ref(null);
const statusInformasiPelanggan = ref();
const statusInformasiOrder = ref();
const statusEkstra = ref();
const countError = ref(0);
const globalForm = ref("error");

const computForm = computed(() => (globalForm.value));
const next = () => {
    current.value += 1
};

const prev = () => (current.value -= 1);
const handleTipe = (e) => {
    tipeAngsuran.value = e;
    calcCredit.jenis_angsuran = e;
    calcCredit.tenor = "0";
    const body = {
        plafond: calcCredit.nilai_yang_diterima,
        jenis_angsuran: e,
    };
    refAdmin(body);
};
const optJenisKelamin = ["LAKI-LAKI", "PEREMPUAN"].map((v) => ({
    label: v,
    value: v,
}));
const jenisJaminan = ref('KENDARAAN');
const dataProp = ref();
const showModal = ref(false);
const receivedData = ref(null);
const orderJaminan = computed(() => _.orderBy(jaminanStore.listJaminan, 'counter_id', 'desc'));
const handleChildData = (data) => {
    receivedData.value = data;
};
const viewModal = (e) => {
    let findData = _.findIndex(jaminanStore.listJaminan, { 'counter_id': e.counter_id });
    let selectedData = jaminanStore.listJaminan[findData];
    jenisJaminan.value = e.type;
    dataProp.value = selectedData;
    showModal.value = !showModal.value;
}
const deletedKendaraan = ref([]);
const deletedSertifikat = ref([]);
const removeJaminan = (e) => {
    if (e.atr.id) {
        if (e.type === 'kendaraan') {
            deletedKendaraan.value.push({ 'id': e.atr.id });
        } else {
            deletedSertifikat.value.push({ 'id': e.atr.id });
        }
    }
    jaminanStore.removeJaminan({ 'counter_id': e.counter_id });
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

const modelKendaraan = ['merk', 'tipe', 'tahun', 'no_polisi', 'nilai', 'warna', 'tgl_stnk'];
const modelSertifikat = ['no_sertifikat', 'imb', 'status_kepemilikan', 'luas_tanah', 'luas_bangunan', 'nilai', 'atas_nama'];

const findDocByType = (c, e) => {
    const docPath = ref(_.find(c, { TYPE: e }));
    if (docPath.value) return docPath.value.PATH;
};
const optReff = [
    "Temen / Saudara",
    "Mediator",
    "Sales KSP Djaya",
    "Pelang atau Spanduk",
    "Brosur",
    "Wa Status",
    "Dealer Tridjaya",
    "Lainnya",
].map((v) => ({
    label: v.toUpperCase(),
    value: v.toUpperCase(),
}));
const optPekerjaan = [
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
const optJenisIdentitas = ["KTP"].map((v) => ({
    label: v,
    value: v,
}));
const optJaminan = ["KENDARAAN", "SERTIFIKAT"].map((v) => ({
    label: v.toUpperCase(),
    value: v.toLowerCase(),
}));
const jenisAngsuran = ["BULANAN",].map((v) => ({
    label: v.toUpperCase(),
    value: v.toLowerCase(),
}));
const optStatusKawin = ["Kawin", "Belum Kawin", "Janda", "Duda"].map((v) => ({
    label: v.toUpperCase(),
    value: v.toUpperCase(),
}));
const optPendidikan = [
    "SEKOLAH DASAR",
    "SEKOLAH MENENGAH PERTAMA",
    "SEKOLAH MENENGAH ATAS",
    "DIPLOMA 1",
    "DIPLOMA 2",
    "DIPLOMA 3",
    "SARJANA S1",
].map((v) => ({
    label: v,
    value: v,
}));
const optHubCust = ["SAUDARA", "ORANG TUA", "TEMAN", "LAINNYA"].map((v) => ({
    label: v,
    value: v,
}));
const idApp = baseRoute.params.idapplication;
const actionPage = baseRoute.params.action;
const copyAddress = () =>
    Object.assign(alamatTagih.value, alamatIdentitas.value);
const sum = (num1, num2) => {
    if (isNaN(num1) || isNaN(num2)) {
        return undefined;
    }
    return num1 + num2;
};
const onlyAllowNumber = (value) => !value || /^\d+$/.test(value);
const rulesPelanggan = {
    nama: {
        trigger: "blur",
        required: true,
        message: "nama harus diisi",
    },
    jenis_kelamin: {
        trigger: "blur",
        required: true,
        message: "jenis kelamin harus dipilih",
    },
    tempat_lahir: {
        trigger: "blur",
        required: true,
        message: "tempat lahir harus diisi ",
    },
    tgl_lahir: {
        trigger: "blur",
        required: true,
        message: "tanggal lahir harus diisi",
    },
    status_kawin: {
        trigger: "blur",
        required: true,
        message: "status kawin harus diisi ",
    },
    no_kk: {
        trigger: "blur",
        required: true,
        min: 16,
        message: "No identitas minimal 16 karakter",
    },
    no_identitas: {
        trigger: "blur",
        required: true,
        min: 16,
        message: "No identitas minimal 16 karakter",
    },
    tipe_identitas: {
        trigger: "blur",
        required: true,
    },
    sektor: {
        trigger: "blur",
        required: true,
        message: "status kawin harus diisi",
    },
};
const rulesPekerjaan = {
    pekerjaan_id: {
        trigger: "blur",
        required: true,
        message: "status kawin harus diisi ",
    },
    pendidikan: {
        trigger: "blur",
        required: true,
        message: "pendidikan harus diisi",
    },
    telepon_selular: {
        trigger: "blur",
        required: true,
        message: "harus diisi",
    },
}
const rulesIdentitas = {
    alamat: {
        trigger: "blur",
        required: true,
        message: "harus diisi",
    },
    rt: {
        trigger: "blur",
        required: true,
        message: "harus diisi",
    },
    rw: {
        trigger: "blur",
        required: true,
        message: "harus diisi",
    },
    kode_pos: {
        trigger: "blur",
        required: true,
        message: "harus diisi",
    },
}
const rulesAlamatTagih = {
    alamat: {
        trigger: "blur",
        required: true,
        message: "harus diisi",
    },
    rt: {
        trigger: "blur",
        required: true,
        message: "harus diisi",
    },
    rw: {
        trigger: "blur",
        required: true,
        message: "harus diisi",
    },
    kode_pos: {
        trigger: "blur",
        required: true,
        message: "harus diisi",
    },
}
const numberValidator = (rule, value) => {
    return value > 0;
};
const numberNilai = (rule, value) => {
    return value >= 1000000;
};
const rulesOrder = {
    order_tanggal: {
        trigger: "blur",
        required: true,
        message: "harus diisi",
    },
    ref_pelanggan: {
        trigger: "blur",
        required: true,
        message: "harus diisi",
    },
    surveyor_name: {
        trigger: "blur",
        required: true,
        message: "harus diisi",
    },
    catatan_survey: {
        trigger: "blur",
        required: true,
        message: "harus diisi",
    },
    nama_ibu: {
        trigger: "blur",
        required: true,
        message: "harus diisi",
    },
    lama_bekerja: {
        trigger: "blur",
        required: true,
        validator: numberValidator,
        message: "harus diisi",
    },
    pendapatan_pribadi: {
        trigger: "blur",
        required: true,
        validator: numberValidator,
        message: "harus diisi",
    },
    biaya_bulanan: {
        trigger: "blur",
        required: true,
        validator: numberValidator,
        message: "harus diisi",
    },
}
const rulesPasangan = {
    ktp_penjamin: {
        trigger: "blur",
        required: true,
        message: "harus diisi",
    },
    nama_penjamin: {
        trigger: "blur",
        required: true,
        message: "harus diisi",
    },
    tgllahir_penjamin: {
        trigger: "blur",
        required: true,
        message: "harus diisi",
    },
    hub_penjamin: {
        trigger: "blur",
        required: true,
        message: "harus diisi",
    },
    telepon_penjamin: {
        trigger: "blur",
        required: true,
        message: "harus diisi",
    },
    pekerjaan_penjamin: {
        trigger: "blur",
        required: true,
        message: "harus diisi",
    },
    alamat_penjamin: {
        trigger: "blur",
        required: true,
        message: "harus diisi",
    },
    nama_kerabat: {
        trigger: "blur",
        required: true,
        message: "harus diisi",
    },
    telepon_kerabat: {
        trigger: "blur",
        required: true,
        message: "harus diisi",
    },
    alamat_kerabat: {
        trigger: "blur",
        required: true,
        message: "harus diisi",
    },
}
const formExtra = ref();
const rulesExtra = {
    pokok_pembayaran: {
        trigger: "blur",
        required: true,
        validator: numberNilai,
        message: "minimal 1.000.000",
    },
    biaya_admin: {
        trigger: "blur",
        required: true,
        validator: numberValidator,
    },
    bunga: {
        trigger: "blur",
        required: true,
        validator: numberValidator,
    },
}
const ekstra = reactive({
    jenis_angsuran: "bulanan",
    tenor: 0,
    bunga: 0,
    bunga_tahunan: computed(() => (parseInt(ekstra.bunga) * 12).toFixed(2)),
    biaya_admin: 0,
    nilai_yang_diterima: computed(() => ekstra.pokok_pembayaran - ekstra.total_admin),
    pokok_pembayaran: 0,
    flat_rate: 0,
    angsuran: computed(() => (Math.ceil(Math.round((ekstra.pokok_pembayaran * ekstra.bunga / 100) * ekstra.tenor + ekstra.pokok_pembayaran) / ekstra.tenor / 1000) * 1000)),

});
const bl_pesan = ref();
const dok_identitas = ref([]);
const dok_pendukung = ref([]);
const dok_jaminan = ref([]);
const approval = ref({});
const getData = async () => {
    const response = await useApi({
        method: "get",
        api: `cr_application/${idApp}`,
        token: userToken,
    });
    if (!response.ok) {
        message.error("halam tidak ditemukan !");
        suspense.value = true;
    } else {
        message.loading("memuat Order");
        suspense.value = false;
        pageData.value = response.data.response;
        //Object.assign(calcCredit, pageData.value.pelanggan);
        Object.assign(ekstra, pageData.value.ekstra);
        Object.assign(dataPelanggan.value, pageData.value.pelanggan);
        Object.assign(dataPenjamin.value, pageData.value.penjamin);
        Object.assign(dataPasangan.value, pageData.value.pasangan);

        Object.assign(alamatIdentitas.value, pageData.value.alamat_identitas);

        Object.assign(alamatTagih.value, pageData.value.alamat_tagih);
        Object.assign(dataPekerjaan.value, pageData.value.pekerjaan);
        Object.assign(dataOrder.value, pageData.value.order);
        Object.assign(dataTaksasi.value, pageData.value.jaminan_kendaraan);
        Object.assign(dataTambahan.value, pageData.value.tambahan);
        Object.assign(dataKerabat.value, pageData.value.kerabat_darurat);
        Object.assign(dataSurat.value, pageData.value.surat);
        Object.assign(dataBank.value, pageData.value.info_bank);
        Object.assign(dok_identitas.value, pageData.value.dokumen_indentitas);
        Object.assign(dok_jaminan.value, pageData.value.dokumen_jaminan);
        Object.assign(dok_pendukung.value, pageData.value.dokumen_pendukung);
        Object.assign(dataAttachment.value, pageData.value.attachment);
        Object.assign(approval.value, pageData.value.approval);
        jaminanStore.filledJaminan(pageData.value.jaminan);
        let tgllahir = toRef(pageData.value.pelanggan);
        var myDate = tgllahir.value.tgl_lahir;
        myDate = myDate.split("-");
        var newDate = new Date(myDate[0], myDate[1] - 1, myDate[2]);
        handleTanggalLahir(newDate.getTime());
        handleEkstra();
    }
    bl_pesan.value = await useBlacklist(calcCredit.no_identitas);
};
const tahunJaminanValidate = (e) => {
    let tahun = new Date().getFullYear();
    let diff = tahun - e;
    return diff;
};
const handlePlafond = (e) => {
    calcCredit.nilai_yang_diterima = e;
    const body = {
        plafond: e,
        jenis_angsuran: calcCredit.jenis_angsuran,
        tenor: calcCredit.tenor,
    };
    handleChange();
};
const handleEkstra = () => {
    calcCredit.tenor = calcCredit.tenor ? calcCredit.tenor.toString() : null;
    const body = {
        plafond: calcCredit.nilai_yang_diterima,
        jenis_angsuran: calcCredit.jenis_angsuran,
        tenor: calcCredit.tenor,
    };
    handleChange();
};
const selectSkema = ref([]);
const handleChange = async () => {
    selectSkema.value = [];
    const body = {
        plafond: calcCredit.nilai_yang_diterima,
        jenis_angsuran: calcCredit.jenis_angsuran,
        tenor: calcCredit.tenor,
    };
    loading.value = true;
    const response = await useApi({
        method: "post",
        api: "fee",
        data: body,
        token: userToken,
    });
    if (!response.ok) {
        console.log(response.error);
    } else {
        loading.value = false;
        Object.assign(calcCredit, response.data);
    }
};
const formAssign = reactive({
    flag_pengajuan: null,
    pelanggan: dataPelanggan.value,
    alamat_identitas: alamatIdentitas.value,
    alamat_tagih: alamatTagih.value,
    pekerjaan: dataPekerjaan.value,
    order: dataOrder.value,
    barang_taksasi: dataTaksasi.value,
    tambahan: dataTambahan.value,
    pasangan: dataPasangan.value,
    kerabat_darurat: dataKerabat.value,
    info_bank: dataBank.value,
    ekstra: ekstra,
    surat: dataSurat.value,
    deleted_kendaraan: deletedKendaraan.value,
    deleted_sertifikat: deletedSertifikat.value,
    jaminan: computed(() => jaminanStore.listJaminan),
    penjamin: dataPenjamin.value,
    deleted_penjamin: []
});
const parse = (input) => {
    const nums = input.replace(/,/g, "").trim();
    if (/^\d+(\.(\d+)?)?$/.test(nums)) return Number(nums);
    return nums === "" ? null : Number.NaN;
};
const format = (value) => {
    if (value === null) return "";
    return value.toLocaleString("en-US");
};
const notifUsia = ref();
const noteUsia = ref(false);
const handleTanggalLahir = (e) => {
    notifUsia.value = true;
    var month_diff = new Date().getTime() - e;
    var currentAge = month_diff / 31557600000;
    let flor = Math.floor(currentAge);
    if (flor >= 19 && flor <= 60) {
        notifUsia.value = false;
        noteUsia.value = flor;
    } else {
        if (flor <= 19) {
            notifUsia.value = true;
            noteUsia.value = `usia ${flor} tahun, usia < dari 19 Tahun`;
        } else {
            notifUsia.value = true;
            noteUsia.value = `usia ${flor} tahun, usia > dari 60 Tahun`;
        }
    }
};
const handleSave = async (e) => {
    e.preventDefault(e);
    formAssign.flag_pengajuan = "no";
    let idApp = pageData.value.id_application;
    loading.value = true;
    const response = await useApi({
        method: "PUT",
        api: `cr_application/${idApp}`,
        data: formAssign,
        token: userToken,
    });
    if (!response.ok) {
        message.error("data gagal disimpan");
        loading.value = false;
    } else {
        message.success("data berhasil disimpan");
        loading.value = false;
        router.push("/task/apply-credit");
    }
};

const tenor = [6, 12, 18, 24, 36, 48, 60].map((i) => ({
    value: i,
    label: `${i} Bulan`
}))
const handleSend = async () => {
    formAssign.flag_pengajuan = "yes";
    let idApp = pageData.value.id_application;
    const response = await useApi({
        method: "PUT",
        api: `cr_application/${idApp}`,
        data: formAssign,
        token: userToken,
    });
    if (!response.ok) {
        loadingSend.value = false;
    } else {
        message.success("data berhasil dikirim");
        loadingSend.value = false;
        router.push("/task/apply-credit");
    }
};
const hadleValid = async () => {
    await formPelanggan.value?.validate((errors) => {
        if (errors) {
            message.error("periksa kembali isian data pelanggan");
            statusInformasiPelanggan.value = "error"
        } else {

            statusInformasiPelanggan.value = "finish"
        }
    });
    await formPelangganPekerjaan.value?.validate((errors) => {
        if (errors) {
            message.error("periksa kembali isian data pelanggan");
            statusInformasiPelanggan.value = "error"
        } else {

            statusInformasiPelanggan.value = "finish"
        }
    });
    await formPelangganAlamatIdentitas.value?.validate((errors) => {
        if (errors) {
            message.error("periksa kembali isian data alamat pelanggan");
            statusInformasiPelanggan.value = "error"
        } else {

            statusInformasiPelanggan.value = "finish"
        }
    });
    await formPelangganAlamatTagih.value?.validate((errors) => {
        if (errors) {
            message.error("periksa kembali isian data alamat tagih");
            statusInformasiPelanggan.value = "error"
        } else {

            statusInformasiPelanggan.value = "finish"
        }
    });
    await formOrder.value?.validate((errors) => {
        if (errors) {
            message.error("periksa kembali isian data order");
            statusInformasiOrder.value = "error"
        } else {
            statusInformasiOrder.value = "finish"
        }
    });
    await formExtra.value?.validate((errors) => {
        if (errors) {
            message.error("periksa kembali isian data Extra");
            statusEkstra.value = "error"
        } else {

            statusEkstra.value = "finish"
        }
    });
    console.log('kirim');
    handleSend();
}

const sumJaminan = computed(() => {
    return jaminanStore.listJaminan.reduce((sum, item) => sum + parseInt(item.atr.nilai, 10), 0);
});
const isRtl = true;
onMounted(() => {
    getData();
});
</script>
