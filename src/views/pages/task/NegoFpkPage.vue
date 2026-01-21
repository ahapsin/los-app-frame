<template>
  <n-card :class="`shadow-lg`">
    <n-tabs type="line" animated>
      <n-tab-pane name="pelanggan" tab="Pelanggan">
        <div class="flex w-full gap-2">
          <n-form-item label="Nama" path="nama" class="w-full">
            <n-input
              placeholder="nama"
              v-model:value="dataPelanggan.nama"
              readonly
            />
          </n-form-item>
          <n-form-item
            label="Nama Panggilan"
            path="nama_panggilan"
            class="w-full"
          >
            <n-input
              placeholder="nama panggilan"
              v-model:value="dataPelanggan.nama_panggilan"
              readonly
            />
          </n-form-item>
        </div>
        <div class="flex w-full gap-2">
          <n-form-item
            label="Jenis kelamin"
            path="jenis_kelamin"
            class="w-full"
          >
            <n-select
              disabled
              placeholder="Jenis Kelamin"
              :options="optJenisKelamin"
              v-model:value="dataPelanggan.jenis_kelamin"
            />
          </n-form-item>
          <n-form-item label="Tanggal Lahir" path="tgl_lahir" class="w-full">
            <n-date-picker
              placeholder="Tanggal Lahir"
              v-model:formatted-value="dataPelanggan.tgl_lahir"
              value-format="yyyy-MM-dd"
              format="dd-MM-yyyy"
              type="date"
              class="w-full"
              disabled
            />
          </n-form-item>
          <n-form-item label="Golongan Darah" path="gol_darah" class="w-full">
            <n-input
              placeholder="golongan darah"
              v-model:value="dataPelanggan.gol_darah"
              readonly
            >
            </n-input>
          </n-form-item>
        </div>
        <n-form-item label="Status Kawin" path="jenis_kelamin">
          <n-input-group>
            <n-select
              disabled
              placeholder="Status Kawin"
              :options="optStatusKawin"
              v-model:value="dataPelanggan.status_kawin"
              readonly
            />
          </n-input-group>
        </n-form-item>
        <div class="flex w-full gap-2">
          <n-form-item label="Identitas" path="plafond" class="w-full">
            <n-select
              disabled
              placeholder="Jenis Identitas"
              :options="optJenisIdentitas"
              v-model:value="dataPelanggan.tipe_identitas"
              readonly
            />
          </n-form-item>
          <n-form-item label="No Identitas" path="no_identitas" class="w-full">
            <n-input
              placeholder="No Identitas"
              v-model:value="dataPelanggan.no_identitas"
            >
            </n-input>
          </n-form-item>
        </div>
        <div class="flex w-full gap-2">
          <n-form-item label="No KK" path="no KK" class="w-full">
            <n-input
              placeholder="No Kartu Keluarga"
              v-model:value="dataPelanggan.no_kk"
              readonly
            />
          </n-form-item>
          <n-form-item label="Warganegara" path="warganegara" class="w-full">
            <n-input
              placeholder="Warganegara"
              v-model:value="dataPelanggan.warganegara"
              readonly
            >
            </n-input>
          </n-form-item>
        </div>
        <n-divider title-placement="left"> Dokumen </n-divider>
        <n-space>
          <n-image
            v-for="attachment in dataAttachment"
            :key="attachment"
            class="w-24 border-b border-2 border-pr h-24"
            :src="attachment.PATH"
          ></n-image>
          <n-upload
            :data="{ type: 'nego' }"
            list-type="image-card"
            :custom-request="handleImagePost"
          >
          </n-upload>
        </n-space>
        <n-divider title-placement="left">
          Informasi Alamat Identitas
        </n-divider>
        <div class="flex gap-2">
          <n-form-item label="Alamat" class="w-full">
            <n-input
              placeholder="Alamat"
              v-model:value="alamatIdentitas.alamat"
              readonly
            />
          </n-form-item>
          <n-form-item label="RT">
            <n-input
              placeholder="RT"
              v-model:value="alamatIdentitas.rt"
              readonly
            >
            </n-input>
          </n-form-item>
          <n-form-item label="RW">
            <n-input
              placeholder="RW"
              v-model:value="alamatIdentitas.rw"
              readonly
            >
            </n-input>
          </n-form-item>
        </div>
        <select-state-region
          v-model:provinsi="alamatIdentitas.provinsi"
          v-model:kota="alamatIdentitas.kota"
          v-model:kecamatan="alamatIdentitas.kecamatan"
          v-model:desa="alamatIdentitas.kelurahan"
          readonly
        />
        <n-form-item label="Kode Pos" path="desa">
          <n-input
            placeholder="Kode Pos"
            v-model:value="alamatIdentitas.kode_pos"
            readonly
          />
        </n-form-item>
        <n-divider title-placement="left"> Informasi Alamat Tagih </n-divider>
        <div class="flex gap-2">
          <n-form-item label="Alamat" class="w-full">
            <n-input
              placeholder="Alamat"
              v-model:value="alamatTagih.alamat"
              readonly
            />
          </n-form-item>
          <n-form-item label="RT">
            <n-input placeholder="RT" v-model:value="alamatTagih.rt" readonly>
            </n-input>
          </n-form-item>
          <n-form-item label="RW">
            <n-input placeholder="RW" v-model:value="alamatTagih.rw" readonly>
            </n-input>
          </n-form-item>
        </div>
        <select-state-region
          active="false"
          v-model:provinsi="alamatTagih.provinsi"
          v-model:kota="alamatTagih.kota"
          v-model:kecamatan="alamatTagih.kecamatan"
          v-model:desa="alamatTagih.kelurahan"
          readonly
        />
        <n-form-item label="Kode Pos" path="desa">
          <n-input
            placeholder="Kode Pos"
            v-model:value="alamatTagih.kode_pos"
            readonly
          />
        </n-form-item>
        <n-divider title-placement="left"> Informasi Pekerjaan </n-divider>
        <div class="flex gap-2">
          <n-form-item label="Pekerjaan" path="nama" class="w-full">
            <n-input
              placeholder="pekerjaan"
              v-model:value="dataPekerjaan.pekerjaan"
              readonly
            />
          </n-form-item>
          <n-form-item label="Pekerjaan ID" path="nama" class="w-full">
            <n-input
              placeholder="Pekerjaan ID"
              v-model:value="dataPekerjaan.pekerjaan_id"
              readonly
            >
            </n-input>
          </n-form-item>
        </div>
        <n-form-item label="Agama" path="agama">
          <n-select
            disabled
            placeholder="agama"
            :options="optAgama"
            v-model:value="dataPekerjaan.agama"
            readonly
          />
        </n-form-item>
        <n-form-item label="Pendidikan" path="pendidikan">
          <n-select
            disabled
            placeholder="pendidikan"
            :options="optPendidikan"
            v-model:value="dataPekerjaan.pendidikan"
            readonlyreadonly
          />
        </n-form-item>
        <div class="flex gap-2">
          <n-form-item label="Telepon" path="telepon" class="w-full">
            <n-input
              placeholder="Telepon Rumah"
              v-model:value="dataPekerjaan.telepon_rumah"
              readonly
            />
          </n-form-item>
          <n-form-item
            label="Telepon Selullar"
            path="telepon_selullar"
            class="w-full"
          >
            <n-input
              placeholder="Telepon Selular"
              v-model:value="dataPekerjaan.telepon_selular"
            >
            </n-input>
          </n-form-item>
          <n-form-item label="Telepon" path="Kantor" class="w-full">
            <n-input
              placeholder="Telepon Kantor"
              v-model:value="dataPekerjaan.telepon_kantor"
            >
            </n-input>
          </n-form-item>
        </div>
        <div class="flex gap-2">
          <n-form-item label="Ekstra" path="ekstra" class="w-full">
            <n-input
              placeholder="Ekstra 1"
              v-model:value="dataPekerjaan.ekstra1"
              readonly
            />
          </n-form-item>
          <n-form-item label="Ekstra 2" path="ekstra" class="w-full">
            <n-input
              placeholder="Ekstra 2"
              v-model:value="dataPekerjaan.ekstra2"
            >
            </n-input>
          </n-form-item>
        </div>
      </n-tab-pane>
      <n-tab-pane name="order" tab="Order">
        <div class="flex gap-2">
          <n-form-item label="Tanggal Order" path="order" class="w-full">
            <n-date-picker
              placeholder="Tanggal order"
              v-model:formatted-value="dataOrder.order_tanggal"
              value-format="yyyy-MM-dd"
              format="dd-MM-yyyy"
              type="date"
              class="w-full"
              disabled
            />
          </n-form-item>
          <n-form-item label="Status Order" path="status_order" class="w-full">
            <n-select
              disabled
              placeholder="status order"
              :options="optStatusOrder"
              v-model:value="dataOrder.order_status"
            />
          </n-form-item>
          <n-form-item label="Tipe Order" path="order" class="w-full">
            <n-select
              disabled
              placeholder="tipe"
              :options="optTipeOrder"
              v-model:value="dataOrder.order_tipe"
              readonly
            />
          </n-form-item>
        </div>
        <n-form-item label="Unit Bisnis" path="unit_bisnis">
          <n-input
            placeholder="Unit bisnis"
            v-model:value="dataOrder.unit_bisnis"
            readonly
          />
        </n-form-item>
        <n-form-item label="Reff Pelanggan" path="reff_pelanggan">
          <n-input
            placeholder="Reff Pelanggan"
            v-model:value="dataOrder.ref_pelanggan"
            readonly
          />
        </n-form-item>
        <n-form-item label="Surveyor" path="surveyor">
          <n-input
            placeholder="Surveyor"
            v-model:value="dataOrder.surveyor_id"
            disabled
            readonly
          />
        </n-form-item>
        <n-form-item label="Catatan Survey" path="cat_survey">
          <n-input
            type="textarea"
            show-count
            placeholder="catatan surveyor"
            maxlength="1000"
            v-model:value="dataOrder.catatan_survey"
            disabled
            readonly
          />
        </n-form-item>
        <n-form-item label="Prog. Marketing" path="prog_marketing">
          <n-input
            placeholder="Program Marketing"
            v-model:value="dataOrder.prog_marketing"
            readonly
          />
        </n-form-item>
        <n-form-item label="Cara Bayar" path="cara_bayar">
          <n-input
            placeholder="Cara Bayar"
            v-model:value="dataOrder.cara_bayar"
            readonly
          />
        </n-form-item>
        <n-divider readonly />
        <n-form-item label="Nama Ibu Kandung" path="nama_ibu_kandung">
          <n-input
            placeholder="Nama Ibu Kandung"
            v-model:value="dataOrder.nama_ibu"
            readonly
          />
        </n-form-item>
        <n-form-item label="Kategori" path="kategori">
          <n-select
            disabled
            placeholder="agama"
            :options="optKategori"
            v-model:value="dataOrder.kategori"
            readonly
          />
        </n-form-item>
        <n-form-item label="Lama Bekerja" path="lama_kerja">
          <n-input
            placeholder="lama bekerja"
            v-model:value="dataOrder.lama_bekerja"
            readonly
          />
        </n-form-item>
        <n-form-item label="Tanggungan" path="tanggungan">
          <n-input
            placeholder="Jumlah Tanggungan"
            v-model:value="dataOrder.tanggungan"
            readonly
          />
        </n-form-item>
        <div class="flex gap-2">
          <n-form-item
            label="Pendapatan Pelanggan"
            path="pendapatan_pribadi"
            class="w-full"
          >
            <n-input-number
              :parse="parse"
              :format="format"
              v-model:value="dataOrder.pendapatan_pribadi"
              :show-button="false"
              class="flex !w-full"
              placeholder="Pribadi"
              readonly
            />
          </n-form-item>
          <n-form-item
            label="Pendapatan Pasangan"
            path="pendapatan_pasangan"
            class="w-full"
          >
            <n-input-number
              :parse="parse"
              :format="format"
              v-model:value="dataOrder.pendapatan_pasangan"
              :show-button="false"
              class="flex !w-full"
              placeholder="Pasangan"
              readonly
            />
          </n-form-item>
          <n-form-item
            label="Pendapatan Lainnya"
            path="pendapatan_lainnya"
            class="w-full"
          >
            <n-input-number
              :parse="parse"
              :format="format"
              v-model:value="dataOrder.pendapatan_lainnya"
              :show-button="false"
              class="flex !w-full"
              placeholder="Lainnya"
              readonly
            />
          </n-form-item>
        </div>
        <n-form-item label="Biaya" path="biaya">
          <n-input-number
            :parse="parse"
            :format="format"
            v-model:value="dataOrder.biaya_bulanan"
            :show-button="false"
            class="flex !w-full"
            placeholder="Pengeluaran"
            readonly
          />
        </n-form-item>
        <n-divider title-placement="left"> NPWP </n-divider>
        <n-form-item label="No NPWP" path="no_npwp">
          <n-input
            placeholder="No NPWP"
            v-model:value="dataOrder.no_npwp"
            readonly
          />
        </n-form-item>
        <n-divider title-placement="left"> Barang Taksasi </n-divider>
        <n-form-item label="Kode Barang" path="kode_barang">
          <n-input
            placeholder="Kode Barang"
            v-model:value="dataTaksasi.kode_barang"
            readonly
          />
        </n-form-item>
        <n-form-item label="ID Tipe" path="id_tipe">
          <n-input
            placeholder="ID Tipe"
            v-model:value="dataTaksasi.id_tipe"
            readonly
          />
        </n-form-item>
        <n-form-item label="Tahun" path="tahun">
          <n-input
            placeholder="Tahun"
            v-model:value="dataTaksasi.tahun"
            readonly
          />
        </n-form-item>
        <n-form-item label="Harga Pasar" path="harga_pasar">
          <n-input-number
            :parse="parse"
            :format="format"
            v-model:value="dataTaksasi.harga_pasar"
            :show-button="false"
            class="flex !w-full"
            placeholder="harga pasar"
            readonly
          />
        </n-form-item>
      </n-tab-pane>
      <n-tab-pane name="tambahan" tab="Tambahan">
        <n-form-item label="Nama BI" path="nama_bi">
          <n-input
            placeholder="Nama BI"
            v-model:value="dataTambahan.nama_bi"
            readonly
          />
        </n-form-item>
        <n-form-item label="Email" path="email">
          <n-input
            placeholder="Email"
            v-model:value="dataTambahan.email"
            readonly
          />
        </n-form-item>
        <n-form-item label="Info Khusus" path="info_khusus">
          <n-input
            placeholder="Info Khusus"
            v-model:value="dataTambahan.info_khusus"
            readonly
          />
        </n-form-item>
        <n-form-item label="Usaha Lain 1" path="usaha_lain1">
          <n-input
            placeholder="Usaha Lain 1"
            v-model:value="dataTambahan.usaha_lain1"
            readonly
          />
        </n-form-item>
        <n-form-item label="Usaha Lain 2" path="usaha_lain2">
          <n-input
            placeholder="Usaha Lain 2"
            v-model:value="dataTambahan.usaha_lain2"
            readonly
          />
        </n-form-item>
        <n-form-item label="Usaha Lain 3" path="usaha_lain3">
          <n-input
            placeholder="Usaha Lain 3"
            v-model:value="dataTambahan.usaha_lain3"
            readonly
          />
        </n-form-item>
        <n-form-item label="Usaha Lain 4" path="usaha_lain1">
          <n-input
            placeholder="Usaha Lain 4"
            v-model:value="dataTambahan.usaha_lain4"
            readonly
          />
        </n-form-item>
        <n-divider title-placement="left">
          Kerabat dalam kondisi darurat
        </n-divider>
        <n-form-item label="Nama Kerabat" path="nama_kerabat">
          <n-input
            placeholder="Nama Kerbat"
            v-model:value="dataKerabat.nama"
            readonly
          />
        </n-form-item>
        <n-form-item label="Alamat" path="alamat">
          <div class="flex gap-2">
            <n-form-item label="Alamat" class="w-full">
              <n-input
                placeholder="Alamat"
                v-model:value="dataKerabat.alamat"
                readonly
              />
            </n-form-item>
            <n-form-item label="RT">
              <n-input
                placeholder="RT"
                v-model:value="alamatIdentitas.rt"
                readonly
              >
              </n-input>
            </n-form-item>
            <n-form-item label="RW">
              <n-input placeholder="RW" v-model:value="dataKerabat.rw" readonly>
              </n-input>
            </n-form-item>
          </div>
        </n-form-item>
        <select-state-region
          v-model:provinsi="dataKerabat.provinsi"
          v-model:kota="dataKerabat.kota"
          v-model:kecamatan="dataKerabat.kecamatan"
          v-model:desa="dataKerabat.kelurahan"
          readonly
        />
        <n-form-item label="Kode Pos" path="kodepos">
          <n-input
            placeholder="Kode Pos"
            v-model:value="dataKerabat.kode_pos"
            readonly
          />
        </n-form-item>
        <n-form-item label="Telepon" path="telepon">
          <div class="flex gap-2">
            <n-form-item label="Telepon Rumah" class="w-full">
              <n-input
                placeholder="Telepon Rumah"
                v-model:value="dataKerabat.no_telp"
                readonly
              />
            </n-form-item>
            <n-form-item label="Telepon Selular" class="w-full">
              <n-input
                placeholder="Telepon Selular"
                v-model:value="dataKerabat.no_hp"
                readonly
              />
            </n-form-item>
          </div>
        </n-form-item>
        <n-divider title-placement="left"> Informasi Surat </n-divider>
        <n-form-item label="Alamat">
          <div class="flex gap-2">
            <n-form-item label="Alamat" class="w-full">
              <n-input
                placeholder="Alamat"
                v-model:value="dataSurat.alamat"
                readonly
              />
            </n-form-item>
            <n-form-item label="RT">
              <n-input placeholder="RT" v-model:value="dataSurat.rt" readonly>
              </n-input>
            </n-form-item>
            <n-form-item label="RW">
              <n-input placeholder="RW" v-model:value="dataSurat.rw" readonly>
              </n-input>
            </n-form-item>
          </div>
        </n-form-item>
        <select-state-region
          v-model:provinsi="dataSurat.provinsi"
          v-model:kota="dataSurat.kota"
          v-model:kecamatan="dataSurat.kecamatan"
          v-model:desa="dataSurat.kelurahan"
          readonly
        />
        <n-form-item label="Kode Pos" path="desa">
          <n-input
            placeholder="Kode Pos"
            v-model:value="dataSurat.kode_pos"
            readonly
          />
        </n-form-item>
        <n-divider title-placement="left"> Informasi Bank </n-divider>
        <n-dynamic-input
          v-model:value="formAssign.info_bank"
          :on-create="onCreate"
        >
          <template #create-button-default> Tambah Bank </template>
          <template #default="{ value }">
            <div
              class="flex flex-col md:flex-row w-full gap-2 bg-pr-50 p-2 pb-0 rounded-md"
            >
              <n-form-item label="Kode Bank" path="kode Bank" class="w-full">
                <n-input v-model:value="value.kode_bank" type="text" readonly />
              </n-form-item>
              <n-form-item label="Nama Bank" path="Nama Bank" class="w-full">
                <n-input v-model:value="value.nama_bank" type="text" readonly />
              </n-form-item>
              <n-form-item label="No Rekening" path="norkening" class="w-full">
                <n-input
                  v-model:value="value.no_rekening"
                  type="text"
                  readonly
                />
              </n-form-item>
              <n-form-item label="Atas Nama" path="atasnama" class="w-full">
                <n-input v-model:value="value.atas_nama" type="text" readonly />
              </n-form-item>
              <n-form-item label="Status" path="Nama Bank" class="w-full">
                <n-input v-model:value="value.status" type="text" readonly />
              </n-form-item>
            </div>
          </template>
        </n-dynamic-input>
      </n-tab-pane>
      <n-tab-pane name="ekstra" tab="Ekstra">
        <div class="w-full flex md:flex-row flex-col gap-4">
          <div class="flex flex-col w-full">
            <n-form-item label="Pokok pembayaran" path="Pokok Pembayaran">
              <n-input-number
                :parse="parse"
                :format="format"
                v-model:value="calcCredit.pokok_pembayaran"
                :show-button="false"
                class="flex !w-full"
                placeholder="pokok pembayaran"
                disabled
              />
            </n-form-item>
            <n-form-item label="Tipe Angsuran" path="tipe_angsuran">
              <n-select
                disabled
                v-model:value="calcCredit.tipe_angsuran"
                :options="optTipeAngsuran"
              />
            </n-form-item>
            <n-form-item label="Cara Pembayaraan" path="cara_bayar">
              <n-select
                disabled
                placeholder="Cara Pembayaran"
                :options="optCaraBayar"
                v-model:value="calcCredit.cara_pembayaran"
              />
            </n-form-item>
            <n-form-item label="Jumlah Angsuran" path="jml_angsuran">
              <n-input
                v-model:value="calcCredit.periode"
                placeholder="periode"
              />
            </n-form-item>
            <n-form-item label="Periode" path="periode">
              <n-space>
                <n-input
                  v-model:value="calcCredit.periode"
                  placeholder="periode"
                  disabled
                />
                <n-select
                  disabled
                  placeholder="Pilih Periode"
                  :options="optPeriode"
                  v-model:value="calcCredit.opt_periode"
                />
              </n-space>
            </n-form-item>
            <n-form-item label="Angsuran" path="angsuran">
              <n-input-number
                :parse="parse"
                :format="format"
                v-model:value="calcCredit.angsuran"
                placeholder="angsuran"
                :show-button="false"
                class="flex !w-full"
                disabled
              />
            </n-form-item>
            <n-form-item label="Total Admin" path="total_admin">
              <n-input-number
                :parse="parse"
                :format="format"
                v-model:value="calcCredit.total_admin"
                placeholder="Total Admin"
                :show-button="false"
                class="flex !w-full"
              />
            </n-form-item>
            <n-form-item label="Cadangan" path="cadangan">
              <n-input-number
                :parse="parse"
                :format="format"
                v-model:value="calcCredit.cadangan"
                placeholder="Cadangan"
                :show-button="false"
                class="flex !w-full"
                disabled
              />
            </n-form-item>
            <n-form-item label="Provisi" path="provisi">
              <n-input-number
                :parse="parse"
                :format="format"
                v-model:value="calcCredit.provisi"
                placeholder="Provisi"
                :show-button="false"
                class="flex !w-full"
                disabled
              />
            </n-form-item>
            <n-form-item label="Asuransi" path="asuransi">
              <n-input-number
                :parse="parse"
                :format="format"
                v-model:value="calcCredit.asuransi"
                placeholder="Asuransi"
                :show-button="false"
                class="flex !w-full"
                disabled
              />
            </n-form-item>
            <n-form-item label="Biaya Transfer" path="biaya_transfer">
              <n-input-number
                :parse="parse"
                :format="format"
                v-model:value="calcCredit.biaya_transfer"
                placeholder="Biaya Transfer"
                :show-button="false"
                class="flex !w-full"
                disabled
              />
            </n-form-item>
            <n-form-item label="Bunga / Margin Eff" path="bunga_margin_eff">
              <n-input
                v-model:value="calcCredit.bunga_eff"
                placeholder="Bunga / Margin Eff"
              />
            </n-form-item>
            <n-form-item label="Bunga / Margin Flat" path="bunga_margin_flat">
              <n-input
                v-model:value="calcCredit.bunga_flat"
                placeholder="Bunga / Margin Flat"
                disabled
              />
            </n-form-item>
          </div>
          <div class="flex flex-col w-full">
            <n-form-item label="Bunga / Margin" path="bunga_margin">
              <n-input-number
                :parse="parse"
                :format="format"
                v-model:value="calcCredit.bunga_margin"
                placeholder="Bunga / Margin"
                :show-button="false"
                class="flex !w-full"
                disabled
              />
            </n-form-item>
            <n-form-item label="Pokok + Margin" path="pokok_margin">
              <n-input-number
                :parse="parse"
                :format="format"
                v-model:value="calcCredit.pokok_margin"
                placeholder="Pokok + Margin"
                :show-button="false"
                class="flex !w-full"
                disabled
              />
            </n-form-item>
            <n-form-item
              label="Bunga / Margin Eff Actual"
              path="bunga_margin_eff_actual"
            >
              <n-input
                v-model:value="calcCredit.bunga_eff_actual"
                placeholder="Bunga / Margin Eff Actual"
                disabled
              />
            </n-form-item>
            <n-form-item
              label="Bunga / Margin Eff Flat Actual"
              path="bunga_margin_eff_flat_actual"
            >
              <n-input
                v-model:value="calcCredit.bunga_margin_eff_flat"
                placeholder=" Bunga / Margin Eff Flat
                                Actual"
                disabled
              />
            </n-form-item>
            <n-form-item label="Nett Admin" path="net_admin">
              <n-input-number
                :parse="parse"
                :format="format"
                v-model:value="calcCredit.net_admin"
                placeholder="Net Admin"
                :show-button="false"
                class="flex !w-full"
                disabled
              />
            </n-form-item>
            <n-form-item label="Nilai yang diterima" path="nilai_diterima">
              <n-input-number
                :parse="parse"
                :format="format"
                v-model:value="calcCredit.nilai_yang_diterima"
                placeholder="Nilai yang diterima"
                size="large"
                :show-button="false"
                class="flex !w-full"
              />
            </n-form-item>
          </div>
        </div>
      </n-tab-pane>
      <template #suffix>
        <n-button :loading="loading" type="primary" @click="handleSave"
          >Simpan</n-button
        >
      </template>
    </n-tabs>
  </n-card :class="`shadow-lg`">
</template>
<script setup>
import { ref, reactive, computed } from "vue";
import {
  DeleteOutlineRound as DeleteIcon,
  ArrowForwardOutlined as ArrowForward,
  SendRound as SendIcon,
  SaveAsOutlined as SaveIcon,
} from "@vicons/material";
import { useRoute } from "vue-router";
import { useMessage } from "naive-ui";
import { useApi } from "../../../helpers/axios";
import router from "../../../router";
import { lyla } from "@lylajs/web";
const message = useMessage();
const loading = ref(false);
const baseRoute = useRoute();
const keterangan = ref();
const dataPelanggan = ref({});
const alamatIdentitas = ref({});
const alamatTagih = ref({});
const dataPekerjaan = ref({});
const dataOrder = ref({});
const dataTaksasi = ref({});
const dataTambahan = ref({});
const dataKerabat = ref({});
const dataSurat = ref({});
const dataAttachment = ref({});
const dataBank = ref([]);
const calcCredit = reactive({
  admin: computed(() => parseInt(calcCredit.total_admin)),
  plafond: computed(() => parseInt(calcCredit.nilai_yang_diterima)),
  net_admin: computed(() => parseInt(calcCredit.total_admin)),
  bunga_eff_actual: computed(() => calcCredit.bunga_eff),
  bunga_margin: computed(
    () =>
      ((calcCredit.bunga_flat / 12) *
        parseInt(calcCredit.periode) *
        parseInt(calcCredit.pokok_pembayaran)) /
      100
  ),
  pokok_margin: computed(
    () =>
      parseInt(calcCredit.pokok_pembayaran) + parseInt(calcCredit.bunga_margin)
  ),
  pokok_pembayaran: computed(() =>
    sum(
      parseInt(calcCredit.nilai_yang_diterima),
      parseInt(calcCredit.total_admin)
    )
  ),
  angsuran: computed(
    () =>
      (calcCredit.pokok_pembayaran + calcCredit.bunga_margin) /
      calcCredit.periode
  ),
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
const onCreate = () => {
  return {
    kode_bank: null,
    nama_bank: null,
    no_rekening: null,
    atas_nama: null,
    status: null,
  };
};
const pageData = ref();
const suspense = ref(false);
const current = ref(1);
const userToken = localStorage.getItem("token");
const optJenisKelamin = ["Laki-laki", "perempuan"].map((v) => ({
  label: v,
  value: v,
}));
const optJenisIdentitas = ["KTP", "SIM", "PASPOR"].map((v) => ({
  label: v,
  value: v,
}));
const optTipeAngsuran = ["Tetap"].map((v) => ({
  label: v,
  value: v,
}));
const optCaraBayar = ["Advance", "Arrear"].map((v) => ({
  label: v,
  value: v,
}));
const optStatusOrder = ["Approve"].map((v) => ({
  label: v,
  value: v,
}));
const optTipeOrder = ["RETAIL"].map((v) => ({
  label: v,
  value: v,
}));
const optKategori = ["Karyawan", "Bukan Karyawan"].map((v) => ({
  label: v,
  value: v,
}));
const optStatusKawin = ["Kawin", "Belum Kawin", "Janda", "Duda"].map((v) => ({
  label: v,
  value: v,
}));
const optAgama = ["ISLAM", "KRISTEN"].map((v) => ({
  label: v,
  value: v,
}));
const optPendidikan = ["SMA", "SD"].map((v) => ({
  label: v,
  value: v,
}));
const optPeriode = ["Bulan", "tahun"].map((v) => ({
  label: v,
  value: v,
}));
const idApp = baseRoute.params.idapplication;
const sum = (num1, num2) => {
  if (isNaN(num1) || isNaN(num2)) {
    return undefined;
  }
  return num1 + num2;
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
  kerabat_darurat: dataKerabat.value,
  info_bank: dataBank.value,
  ekstra: calcCredit,
  surat: dataSurat.value,
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
const handleImagePost = ({ file, onError, onFinish, onProgress }) => {
  let idApp = pageData.value.order.cr_prospect_id;
  const form = new FormData();
  form.append("image", file.file);
  form.append("type", "KK");
  form.append("cr_prospect_id", idApp);
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
      message.success("upload image berhasil");
      onFinish();
    })
    .catch(() => {
      message.success("upload image gagal !");
      onError();
    });
};
const handleSave = async (e) => {
  e.preventDefault(e);
  formAssign.flag_pengajuan = "yes";
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
    router.push("/task/approval");
  }
};
</script>
