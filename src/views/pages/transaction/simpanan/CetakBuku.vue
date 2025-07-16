<<template>
    <div class="flex gap-4 w-full">
        <div class="w-full">
            <n-space vertical>
                <n-card :title="`Cetak Buku Rekening`" :segmented="true" size="small">
                    <div class="flex gap-2">
                        <n-button @click="currentState = 'printHead'">
                            <template #icon>
                                <v-icon name="bi-postcard" />
                            </template>
                            <span>Cetak Kepala</span>
                        </n-button>
                        <n-button @click="currentState = 'printBook'">
                            <template #icon>
                                <v-icon name="bi-receipt" />
                            </template>
                            <span>Cetak Mutasi</span>
                        </n-button>
                    </div>
                </n-card>
                <n-card v-if="currentState === 'printHead'" title="Cetak kepala tabungan">
                    <n-form-item label="Pilih Rekening" class="w-full">
                        <n-select filterable v-model:value="rekening" :options="selectOptions"
                            @update:value="handleUpdateValue" />
                    </n-form-item>
                    <n-card v-if="selectedRekening" embedded>
                        <div class="font-mono">
                            <div class="text-lg mb-2">{{ appCompany }}</div>
                            <table class="font-mono">
                                <tbody>
                                    <tr>
                                        <td>No Rekening</td>
                                        <td>:</td>
                                        <td class="font-semibold">{{ selectedRekening.no_rekening }}</td>
                                    </tr>
                                    <tr>
                                        <td>Nama</td>
                                        <td>:</td>
                                        <td>{{ selectedRekening.nama_pemilik }}</td>
                                    </tr>
                                    <tr>
                                        <td>Alamat</td>
                                        <td>:</td>
                                        <td>{{ selectedRekening.alamat }}</td>
                                    </tr>
                                    <tr>
                                        <td>Tanda Pengenal</td>
                                        <td>:</td>
                                        <td>{{ selectedRekening.tipe_identitas }} / {{
                                            maskNumber(selectedRekening.no_identitas) }}</td>
                                    </tr>
                                    <tr>
                                        <td>Tanggal</td>
                                        <td>:</td>
                                        <td>{{ selectedRekening.tgl_registrasi }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </n-card>
                    <n-button class="mt-4" v-if="selectedRekening">Cetak</n-button>
                </n-card>
                <n-card v-if="currentState === 'printBook'" title="Cetak mutasi tabungan" :segmented="true"
                    size="small">
                    <n-form-item label="Pilih Rekening" class="w-full">
                        <n-select filterable v-model:value="rekening" :options="selectOptions"
                            @update:value="handleUpdateValue" />
                    </n-form-item>
                    <n-card v-if="selectedRekening" embedded>
                        <div class="font-mono">
                            <div class="text-lg mb-2">{{ appCompany }}</div>
                            <table class="font-mono">
                                <tbody>
                                    <tr>
                                        <td>No Rekening</td>
                                        <td>:</td>
                                        <td class="font-semibold">{{ selectedRekening.no_rekening }}</td>
                                    </tr>
                                    <tr>
                                        <td>Nama</td>
                                        <td>:</td>
                                        <td>{{ selectedRekening.nama_pemilik }}</td>
                                    </tr>
                                    <tr>
                                        <td>Alamat</td>
                                        <td>:</td>
                                        <td>{{ selectedRekening.alamat }}</td>
                                    </tr>
                                    <tr>
                                        <td>Tanda Pengenal</td>
                                        <td>:</td>
                                        <td>{{ selectedRekening.tipe_identitas }} / {{
                                            maskNumber(selectedRekening.no_identitas) }}</td>
                                    </tr>
                                    <tr>
                                        <td>Tanggal</td>
                                        <td>:</td>
                                        <td>{{ moment(selectedRekening.tgl_registrasi).format('DD-MM-YYYY') }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </n-card>
                    <n-input-group class="mt-4" v-if="selectedRekening">
                        <n-input-group-label>Buku</n-input-group-label>
                        <n-input-number placeholder="buku" />
                        <n-input-group-label>Halaman</n-input-group-label>
                        <n-input-number placeholder="hal" />
                        <n-input-group-label>Baris</n-input-group-label>
                        <n-input-number placeholder="baris" />
                        <n-input-group-label>S/D</n-input-group-label>
                        <n-input-group-label>Halaman</n-input-group-label>
                        <n-input-number placeholder="hal" />
                        <n-input-group-label>Baris</n-input-group-label>
                        <n-input-number placeholder="baris" />
                    </n-input-group>

                    <n-data-table :data="dataAktifitas" :columns="columnsAktifitas" class="mt-4"
                        v-if="selectedRekening"></n-data-table>
                    <n-button class="mt-4" v-if="selectedRekening" type="success">Cetak</n-button>
                </n-card>

            </n-space>
        </div>
    </div>
</template>

    <script setup>
    import { onMounted } from 'vue';
    import { useApi } from '../../../../helpers/axios';
    import _ from 'lodash'
    import moment from 'moment';

    const appCompany = import.meta.env.VITE_APP_TITLE;
    const currentState = ref();
    const selectedRekening = ref(null);
    const selectOptions = ref([]);
    const isLoading = ref(false);
    const dataRekening = ref([]);
    const dataAktifitas = ref([]);

    const fetchData = async () => {
        selectedRekening.value = null;
        isLoading.value = true;
        const response = await useApi({ url: 'http://localhost:3001/rekening' });
        if (!response.ok) {
            message.error("error");
            isLoading.value = false;
        } else {
            isLoading.value = false;
            dataRekening.value = response.data;
            selectOptions.value = response.data.map(row => ({
                label: `${row.no_rekening} ${row.nama_pemilik}`,
                value: row.no_rekening,
                disabled: row.status === 'inactive'
            }));
        }
    }

    const fetchDataAktifitas = async (e) => {
        isLoading.value = true;
        const response = await useApi({ url: `http://localhost:3001/aktivitas?nomor_rekening=${e}` });
        if (!response.ok) {
            message.error("error");
            isLoading.value = false;
        } else {
            isLoading.value = false;
            dataAktifitas.value = response.data;
        }
    }


    const columnsAktifitas = [
        {
            title: "Tgl Transaksi",
            key: "tgl_transaksi",
            render(row) {
                return h("div", moment(row.tgl_transaksi).format('DDMMYYYY'))
            }
        },
        {
            title: "Buku",
            key: "buku"
        },
        {
            title: "Hal",
            key: "halaman"
        },
        {
            title: "Baris",
            key: "baris"
        },
        {
            title: "Sandi",
            key: "sandi_transaksi"
        },
        {
            title: "Nominal",
            key: "nominal",
            render(row) {
                return h("div", row.nominal.toLocaleString())
            }
        },
        {
            title: "Saldo",
            key: "saldo",
            render(row) {
                return h("div", row.saldo.toLocaleString())
            }
        },
    ];
    const handleUpdateValue = async (val, options) => {
        selectedRekening.value = _.find(dataRekening.value, { no_rekening: val });
        await fetchDataAktifitas(val);
    }
    function formatKey(key) {
        return key.replace(/_/g, ' ')
    }
    const maskNumber = (value) => {
        const visible = 6
        const maskedPart = '*'.repeat(value.length - visible)
        const visiblePart = value.slice(-visible)
        return maskedPart + visiblePart
    }

    onMounted(() => { fetchData() });
</script>