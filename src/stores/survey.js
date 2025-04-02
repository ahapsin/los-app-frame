import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import {useApi} from "../helpers/axios.js";
import {useValidator} from "../utils/validator.js";

export const useSurveyStore = defineStore('surveys', () => {
    // State
    const surveys = ref([]);
    const loading = ref(false);
    const error = ref(null);

    const {millionValidator} = useValidator();

    const fetchSurveys = async () => {

        const response = await useApi({
            api: 'kunjungan',
            method: 'GET',
            token: localStorage.getItem('token'),
        });
        if (response.ok) {
            loading.value = false;
            surveys.value = response.data.response;
        } else {
            loading.value = false;
            error.value = response.error;
        }
    }

    const groupedByDate = computed(() => {
        return surveys.value?.reduce((acc, item) => {
            // Ambil tanggal sebagai key
            const date = item.visit_date;

            // Jika tanggal belum ada di accumulator, buat array baru untuk tanggal itu
            if (!acc[date]) {
                acc[date] = [];
            }

            // Masukkan item ke dalam grup yang sesuai dengan tanggal
            acc[date].push(item);

            return acc;
        }, {});
    });

    const createSurvey = async (newSurvey) => {

        const response = await useApi({
            api: 'kunjungan',
            method: 'POST',
            data: newSurvey,
            token: localStorage.getItem('token'),
        });
        console.log(response);
        // if (response.ok) {
        //     loading.value = false;
        //     surveys.value = response.data.response;
        // } else {
        //     loading.value = false;
        //     error.value = response.error;
        // }

    }


    const orderRules = {
        plafond: {
            required: true,
            validator: millionValidator,
            trigger: "blur",
            message: "wajib diisi & minimal 1.000.000",
        }, tenor: {
            required: true,
            trigger: "blur",
            message: "tenor wajib diisi",
        }, angsuran: {
            required: true,
            trigger: "blur",
            message: "angsuran wajib diisi",
        }, tujuan_kredit: {
            required: true,
            trigger: "blur",
            message: "tujuan kredit wajib diisi",
        },

    }

    const pelangganRules = {
        no_ktp: {
            required: true,
            trigger: "blur",
            message: "wajib diisi & minimal 1.000.000",
        }, kategori: {
            required: true,
            trigger: "blur",
            message: "tenor wajib diisi",
        }, no_kk: {
            required: true,
            trigger: "blur",
            message: "angsuran wajib diisi",
        }, nama_pelanggan: {
            required: true,
            trigger: "blur",
            message: "tujuan kredit wajib diisi",
        }, no_hp: {
            required: true,
            trigger: "blur",
            message: "tujuan kredit wajib diisi",
        }, alamat: {
            required: true,
            trigger: "blur",
            message: "tujuan kredit wajib diisi",
        }, rt: {
            required: true,
            trigger: "blur",
            message: "tujuan kredit wajib diisi",
        }, rw: {
            required: true,
            trigger: "blur",
            message: "tujuan kredit wajib diisi",
        }, provinsi: {
            required: true,
            trigger: "blur",
            message: "tujuan kredit wajib diisi",
        }, kota: {
            required: true,
            trigger: "blur",
            message: "tujuan kredit wajib diisi",
        }, kecamatan: {
            required: true,
            trigger: "blur",
            message: "tujuan kredit wajib diisi",
        }, desa: {
            required: true,
            trigger: "blur",
            message: "tujuan kredit wajib diisi",
        }, kode_pos: {
            required: true,
            trigger: "blur",
            message: "tujuan kredit wajib diisi",
        },

    }

    return {
        surveys,
        loading,
        error,
        fetchSurveys,
        createSurvey,
        orderRules,
        pelangganRules,
        groupedByDate,
    };
});
