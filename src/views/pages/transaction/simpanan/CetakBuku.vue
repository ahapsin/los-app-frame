<<template>
    <div class="flex gap-4 w-full">
        <div class="w-full">
            <n-space vertical>
                <n-card title="Cetak buku tabungan" :segmented="true" size="small">
                    <n-form-item label="Pilih Rekening" class="w-full">
                        <n-select filterable v-model:value="rekening" :options="selectOptions"
                            @update:value="handleUpdateValue" />
                    </n-form-item>
                    <n-card v-if="selectedRekening" embedded title="Detail Buku" size="small" :segmented="true">
                        <template #header-extra>
                            <n-button type="success" @click="handleCetak">cetak kepala buku</n-button>
                        </template>
                        <div class="font-mono p-10" ref="headArea">
                            <div class="text-lg mb-2">{{ appCompany }}</div>
                            <div class="mt-4">Ac. {{ selectedRekening.no_rekening }}</div>
                            <div>{{ selectedRekening.nama_pemilik }}</div>
                            <div>{{ selectedRekening.alamat }}</div>
                        </div>
                    </n-card>
                    <n-input-group class="mt-4" v-if="selectedRekening">
                        <n-input-group-label>Buku</n-input-group-label>
                        <n-input-number v-model:value="bukuFilter" />
                        <n-input-group-label>Halaman</n-input-group-label>
                        <n-input-number placeholder="hal" v-model:value="halBarisAwal.hal" />
                        <n-input-group-label>Baris</n-input-group-label>
                        <n-input-number placeholder="baris" v-model:value="halBarisAwal.baris" />
                        <n-input-group-label>S/D</n-input-group-label>
                        <n-input-group-label>Halaman</n-input-group-label>
                        <n-input-number placeholder="hal" v-model:value="halBarisAkhir.hal" />
                        <n-input-group-label>Baris</n-input-group-label>
                        <n-input-number placeholder="baris" v-model:value="halBarisAkhir.baris" />
                    </n-input-group>

                    <n-data-table :data="transaksiTerfilter" :columns="columnsAktifitas" class="mt-4"
                        v-if="selectedRekening"></n-data-table>
                    <div class="pt-4 w-fit " v-if="selectedRekening">
                        <n-input-group>
                            <n-input-group-label>Mulai Baris</n-input-group-label>
                            <n-input-number v-model:value="startRow" />
                            <n-button v-if="selectedRekening" type="success" @click="handleCetakMutasi">Cetak</n-button>
                        </n-input-group>
                        <div class="border border-dashed mt-4 bg-slate-50 hidden">
                            <div ref="printArea">
                                <table class="font-mono text-[11px]">
                                    <tbody>
                                        <tr v-for="i in startRow" :key="i">
                                            <td>&nbsp;</td>
                                        </tr>
                                        <tr v-for="(col) in transaksiTerfilter" :key="col">
                                            <td style="width:0.9cm">&nbsp;</td>
                                            <td style="width:1.8cm">{{ moment(col.tgl_transaksi).format('MM-DD-YYYY') }}
                                            </td>
                                            <td style="width:1cm">{{ col.sandi_transaksi }}</td>
                                            <td style="width:3.5cm" align="right">{{ col.type_transaksi === 'debet' ?
                                                col.nominal.toLocaleString() : null }}</td>
                                            <td style="width:3.5cm" align="right">{{ col.type_transaksi === 'kredit' ?
                                                col.nominal.toLocaleString() : null }}</td>
                                            <td style="width:4cm" align="right">{{ col.saldo.toLocaleString() }}</td>
                                            <td style="width:0.9cm" align="right">{{ col.operator }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

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
    import { useVueToPrint } from 'vue-to-print';

    const appCompany = import.meta.env.VITE_APP_TITLE;
    const currentState = ref();
    const selectedRekening = ref(null);
    const selectOptions = ref([]);
    const isLoading = ref(false);
    const dataRekening = ref([]);
    const dataAktifitas = ref([]);
    const startRow = ref(0);
    const printArea = ref();
    const headArea = ref();

    const bukuFilter = ref(1)
    const halBarisAwal = ref({ hal: 1, baris: 1 })
    const halBarisAkhir = ref({ hal: 2, baris: 1 })

    const fetchData = async () => {
        selectedRekening.value = null;
        isLoading.value = true;
        const response = await useApi({
            api: 'account',
            method: 'GET',
            token: localStorage.getItem('token')
        });
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
            key: "hal"
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

    const handleCetak = () => {
        const { handlePrint } = useVueToPrint({
            content: headArea,
            documentTitle: "Cetak Kepala Buku",
        });
        handlePrint()
    }
    const handleCetakMutasi = () => {
        const { handlePrint } = useVueToPrint({
            content: printArea,
            documentTitle: "Cetak Mutasi",
        });
        handlePrint(printArea.value)
    }
    const maskNumber = (value) => {
        const visible = 6
        const maskedPart = '*'.repeat(value.length - visible)
        const visiblePart = value.slice(-visible)
        return maskedPart + visiblePart
    }

    function posisiAsNumber(hal, baris) {
        return hal + baris / 100
    }
    const transaksiTerfilter = computed(() => {
        const awal = posisiAsNumber(halBarisAwal.value.hal, halBarisAwal.value.baris)
        const akhir = posisiAsNumber(halBarisAkhir.value.hal, halBarisAkhir.value.baris)

        return _.filter(dataAktifitas.value, t => {
            if (t.buku !== bukuFilter.value) return false
            const posisi = posisiAsNumber(t.hal, t.baris)
            return posisi >= awal && posisi <= akhir
        })
    })



    onMounted(() => { fetchData() });
</script>