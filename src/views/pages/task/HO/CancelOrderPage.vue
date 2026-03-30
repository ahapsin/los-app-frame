<template>
    <n-card :class="`shadow-lg`">
        <template #header>Batal Order</template>
        <div>
            <n-data-table striped size="small" :row-key="(row) => row.loan_number" :columns="columns" :data="props.data"
                :max-height="300" class="pb-2" :pagination="pagination" />
        </div>
    </n-card>
    <n-modal v-model:show="confModal" preset="dialog" draggable title="Konfirmasi" positive-text="Yakin"
        negative-text="Hmm, belum yakin" @positive-click="handleCancel" @negative-click="cancelCallback">
        Jadi, kamu yakin ingin batalin order ini ?
        <n-input type="textarea" placeholder="tulis alasannya disini" v-model:value="bodyCancel.descr_ho" />
    </n-modal>
</template>
<script setup>
import {
    NButton, useMessage
} from "naive-ui";
import { computed, h, reactive, ref } from "vue";
import { useApi } from "../../../../helpers/axios";

const checkedRowCredit = ref([]);
const pagination = ref({ pageSize: 10 });
const totalPay = computed(() => {
    const totalInstallment = () =>
        checkedRowCredit.value.reduce(
            (total, installment) => total + installment.bayar_angsuran,
            0
        );
    const totalPenalty = () =>
        checkedRowCredit.value.reduce(
            (total, installment) => total + installment.bayar_denda,
            0
        );
    const combinedTotal = () => totalInstallment() + totalPenalty();
    return combinedTotal();
});
const pageData = reactive({
    no_facility: null,
    total_bayar: totalPay,
    jumlah_uang: 0,
    payment_method: "cash",
    pembulatan: 0,
    kembalian: computed(() =>
        pageData.jumlah_uang
            ? pageData.jumlah_uang - pageData.total_bayar - pageData.pembulatan
            : 0
    ),
    struktur: checkedRowCredit,
    bank_tujuan: null,
    no_rekening: null,
    bukti_transafer: null,
});

const props = defineProps({
    data: Object,
});
const createColumns = () => {
    return [
        {
            title: "No Kontrak",
            sorter: "default",
            key: "no_kontrak",
        },
        {
            title: "Tanggal Kontrak",
            sorter: "default",
            key: "tgl_kontrak",
        },
        {
            title: "Pemohon",
            sorter: "default",
            key: "request_by",
        },
        {
            title: "Cabang",
            sorter: "default",
            key: "request_branch",
        },
        {
            title: "Alasan",
            sorter: "default",
            key: "request_descr",
        },
        {
            align: "right",
            render(row) {
                return h(
                    NButton,
                    {
                        secondary: false,
                        size: "small",
                        type: "success",
                        onClick: () => {
                            handleConf(row);
                        },
                    },
                    {
                        default: () => "konfirmasi",
                    }
                );
            }
        }
    ];
};



const columns = createColumns();


const loaddataCancel = ref(false);
const message = useMessage();


const confModal = ref(false);
const bodyCancel = reactive({
    descr_ho: null,
    descr: "",
});
const handleConf = (row) => {
    confModal.value = true;
    bodyCancel.order_number = row.order_number;
    bodyCancel.req_flag = "cancel";
    bodyCancel.flag = "yes";
}

const emit = defineEmits();

const handleCancel = async () => {
    bodyCancel.descr_ho = null;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "POST",
        data: bodyCancel,
        api: "pk_cancel",
        token: userToken,
    });
    if (!response.ok) {
        message.error("ERROR API");
    } else {
        emit('conf', true);
        bodyCancel.descr_ho = null;
        message.success("order berhasil dibatalkan !");
        confModal.value = false;
    }
};
</script>
