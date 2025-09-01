<template>
    <div class="flex gap-4 w-full">
        <div class="w-full">
            <n-space vertical>
                <n-card title="Cetak Bilyet" :segmented="true" size="small">
                    <n-form-item label="Pilih No Deposito" class="w-full">
                        <n-select filterable v-model:value="rekening" :options="selectOptions"
                            @update:value="handleUpdateValue" />
                    </n-form-item>
                    <n-card v-if="selectedRekening" embedded title="Detail Bilyet" size="small" :segmented="true">
                        {{ selectedRekening }}
                    </n-card>
                    <div class="border border-black p-4">
                        <div class="flex justify-between">
                            <div class="flex gap-4">
                                <img class="h-10 md:h-10" :src="applogo" alt="logo_company" />
                                <div class="flex flex-col items-left justify-center">
                                    <n-text class="text-[20px]" strong>{{ apptitle }}</n-text>
                                    <span class="text-[12.361px]">Jl. Ahmad Yani, Larangan, Lemahwungkuk, Kota
                                        Cirebon</span>
                                </div>
                            </div>
                            <div class="border border-black">
                                <div class="bg-black">
                                    <n-text strong class="text-white px-2">BILYET SIMPANAN BERJANGKA </n-text>
                                </div>
                                <div class="flex justify-center">
                                    <n-text strong class="px-2">NO .BILYET : 1234566789 </n-text>
                                </div>
                            </div>
                        </div>
                        <div class="pt-4">
                            <n-text strong>kami menegaskan simpanan berjangka Saudara pada kami sesuai dengan rincian
                                sebagai berikut:</n-text>
                        </div>
                        <div class="flex w-full pt-4">
                            <div class="w-full">
                                <div class="flex flex-col border p-2 border-black">
                                    <n-text strong italic>Kepada Yth.</n-text>
                                    <n-text strong>Yume Sakura</n-text>
                                    Jl. Laut Tengah No. 7
                                    Kel. Timur Jaya Kec. Samudera
                                    Kota Malang
                                </div>
                                <div class="flex flex-col border mt-4 p-2 border-black">
                                    <n-text> Bunga setiap bulan akan dibayarkan ke:</n-text>

                                    <n-text strong>Yume Sakura</n-text>
                                    <n-text strong>AC. 100 1016 8888 - Bank Japan</n-text>
                                </div>
                            </div>
                        </div>
                        <div class="w-full">2</div>
                    </div>
                    <div>
                        footer
                    </div>
                </n-card>
            </n-space>
        </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useApi } from '../../../../helpers/axios';
import _ from 'lodash'
import moment from 'moment';
import { useVueToPrint } from 'vue-to-print';
const applogo = import.meta.env.VITE_APP_LOGO;
const apptitle = import.meta.env.VITE_APP_TITLE;

const appCompany = import.meta.env.VITE_APP_TITLE;
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