<template>
    <n-card :title="prop?.label" :segmented="true" size="small" class="w-1/2">
        <n-spin :show="loading">
            <div ref="printReceiptRef" class="flex flex-col" :class="width > 850 ? 'p-4' : 'p-0'" v-if="!uploadState">
                <n-watermark :content="apptitle" cross selectable :font-size="16" :line-height="16" :width="192"
                    :height="128" :x-offset="12" :y-offset="28" :rotate="-15">
                    <div class="p-2">
                        <div class="flex justify-between">
                            <n-text strong class="text-md"> {{ bodyModal?.tgl_transaksi }}</n-text>
                            <n-text strong class="text-md"> {{ bodyModal?.payment_method == 'cash' ? 'TUNAI' :
                                'TRANSFER'
                                }}</n-text>

                        </div>
                        <div class="flex justify-between border-b border-dashed border-black">
                            <div class="flex flex-col py-4">
                                <small class="text-reg">No Transaksi : </small>
                                <n-text class="text-reg font-bold"> {{ bodyModal?.no_transaksi }}</n-text>
                                <small class="text-reg">No Kontrak : </small>
                                <n-text class="text-reg font-bold"> {{ bodyModal?.no_fasilitas }}</n-text>
                            </div>
                            <div class="flex items-center justify-between">
                                <div class="flex flex-col py-4 w-fit">
                                    <small class="text-reg">Terima dari (No Pelanggan) : </small>
                                    <n-text class="text-lg font-bold"> {{ bodyModal?.nama }}</n-text>
                                    <small class="text-reg">({{ bodyModal?.cust_code }})</small>
                                </div>
                                <div v-if="bodyModal?.payment_method !== 'cash'">
                                    <small class="text-reg">Bukti Transfer </small>
                                    <div class="w-12">
                                        <n-image :src="bodyModal?.attachment" size="30"></n-image>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex gap-2 justify-around border-b border-dashed border-black pb-2"
                            :class="width > 850 ? 'grid-cols-5 gap-4' : 'grid-cols-1 '"
                            v-if="bodyModal?.payment_type != 'pelunasan'">
                            <div class="flex flex-col">
                                <small class="text-reg">JML. ANGS</small>
                                <n-text strong class="text-md"> {{
                                    bodyModal?.bayar_angsuran.toLocaleString('US') ?
                                        bodyModal?.bayar_angsuran.toLocaleString('US') : 'n/a'
                                }}
                                </n-text>
                            </div>
                            <div class="flex flex-col">
                                <small class="text-reg">JML. DENDA</small>
                                <n-text strong class="text-md">
                                    {{ bodyModal?.bayar_denda.toLocaleString() }}
                                </n-text>
                            </div>
                            <div class="flex flex-col">
                                <small class="text-reg">CUST. BAYAR</small>
                                <n-text strong class="text-md"> {{ bodyModal?.jumlah_uang.toLocaleString("US")
                                }}</n-text>
                            </div>
                            <div class="flex flex-col">
                                <small class="text-reg">PEMBULATAN</small>
                                <n-text strong class="text-md"> {{ bodyModal?.pembulatan.toLocaleString() }}</n-text>
                            </div>

                            <div class="flex flex-col">
                                <small class="text-reg">KEMBALIAN</small>
                                <td>
                                    <n-text strong class="text-md"> {{ bodyModal?.kembalian.toLocaleString("US")
                                    }}</n-text>
                                </td>
                            </div>

                        </div>
                        <div class="flex gap-4 border-b border-dashed border-black pb-2"
                            :class="width > 850 ? 'grid-cols-5 gap-4' : 'grid-cols-1 '" v-else>
                            <div class="flex flex-col">
                                <small class="text-reg">Total Pelunasan</small>
                                <n-text class="text-md font-bold"> {{
                                    bodyModal?.total_bayar.toLocaleString('US') ?
                                        bodyModal?.total_bayar.toLocaleString('US') : 'n/a'
                                }}
                                </n-text>
                            </div>
                            <div class="flex flex-col">
                                <small class="text-reg">Pembulatan</small>
                                <n-text class="text-md font-bold"> {{ bodyModal?.pembulatan }}</n-text>
                            </div>
                            <div class="flex flex-col">
                                <small class="text-reg">Cust. Bayar</small>
                                <n-text class="text-md font-bold"> {{
                                    bodyModal?.jumlah_uang.toLocaleString("US")
                                    }}
                                </n-text>
                            </div>
                            <div class="flex flex-col">
                                <small class="text-reg">Diskon</small>
                                <n-text class="text-md font-bold"> {{
                                    (Math.abs(bodyModal?.total_bayar - bodyModal?.jumlah_uang)).toLocaleString("US")
                                    }}
                                </n-text>
                            </div>
                            <div class="flex flex-col">
                                <small class="text-reg">Pinalti</small>
                                <n-text class="text-md font-bold"> {{
                                    bodyModal.pinalti.toLocaleString("US")
                                    }}
                                </n-text>
                            </div>
                            <div class="flex flex-col">
                                <small class="text-reg">Metode Pembayaran</small>
                                <n-text class="text-md font-bold"> {{ bodyModal?.payment_method }}
                                    {{ bodyModal?.payment_type == 'pelunasan' ? '/ pelunasan' : '' }}
                                </n-text>
                            </div>
                        </div>
                    </div>
                    <div class="px-3">

                        <table width="100%" class="border border-black" v-if="bodyModal?.payment_type != 'pelunasan'">
                            <tr>
                                <th class="border border-black p-1">ANGS. KE</th>
                                <th class="border border-black p-1">TANGGAL JT.</th>
                                <th class="border border-black p-1">BYR. ANGS</th>
                                <th class="border border-black p-1">BYR. DENDA</th>
                                <th class="border border-black p-1">DISKON</th>
                                <!--              <th class="border border-black">Jumlah</th>-->
                            </tr>
                            <tr v-for="angs in bodyModal?.struktur" :key="angs.id">
                                <td class="border text-center border-black">{{ angs.angsuran_ke }}</td>
                                <td class="border  border-black text-center">{{ angs.tgl_angsuran }}</td>
                                <td class="border pe-2 border-black text-right">{{
                                    parseInt(angs.bayar_angsuran).toLocaleString('US')
                                    }}
                                </td>
                                <td class="border pe-2 border-black text-right">{{
                                    parseInt(angs.bayar_denda).toLocaleString('US')
                                    }}
                                </td>
                                <td align="right" class="border pe-2 border-black text-right">
                                    {{
                                        (angs.diskon_denda).toLocaleString(('US'))
                                    }}
                                </td>
                                <!--              <td class="border pe-2 border-black text-right">-->
                                <!--                {{ (parseInt(angs.bayar_denda) + parseInt(angs.bayar_pokok + angs.bayar_bunga)+parseInt(angs.diskon_pokok) +-->
                                <!--                  parseInt(angs.diskon_bunga) + parseInt(angs.diskon_denda)).toLocaleString('US') }}-->
                                <!--              </td>-->

                            </tr>
                            <!--            <tr>-->
                            <!--              <td><strong>Total</strong></td>-->
                            <!--              <td colspan="5" align="right" class="pe-2">-->
                            <!--                <strong>{{ bodyModal?.total_bayar.toLocaleString("US") }}</strong>-->
                            <!--              </td>-->
                            <!--            </tr>-->
                        </table>
                    </div>

                </n-watermark>
            </div>
        </n-spin>
        <template #footer>
            <div class="flex flex-col gap-2">
                <n-radio-group v-model:value="radioAcc" name="radiogroup">
                    <n-space>
                        <n-radio value="yes" label="Setuju" />
                        <n-radio value="no" label="Tolak" />
                    </n-space>
                </n-radio-group>
                <n-input v-model:value="keterangan" type="textarea" placeholder="keterangan" />
                <n-button class="w-fit" type="primary" :loading="buttonSave" @click="handleSave"
                    :disabled="keterangan ? false : true">Kirim</n-button>
            </div>
        </template>
    </n-card>
</template>
<script setup>
import { useMessage } from "naive-ui";
import { useApi } from "../../helpers/axios.js";
import router from "../../router/";
const prop = defineProps({
    id: String,
    type: String,
    label: String,
    route: String,
});
const bodyModal = ref();
const loading = ref(false);
const getDetailNotif = async (e) => {
    loading.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "GET",
        api: `payment/${e}`,
        token: userToken,
    });
    if (!response.ok) {
        loading.value = false;
        message.info('SESI BERAKHIR');
    } else {
        bodyModal.value = response.data;
        loading.value = false;
    }
};
const radioAcc = ref("yes");
const keterangan = ref();
const buttonSave = ref(false);
const message = useMessage();

const emit = defineEmits([]);
const handleSave = async () => {
    buttonSave.value = true;
    const bodyPayment = {
        no_invoice: bodyModal?.value.no_transaksi,
        flag: radioAcc.value,
        keterangan: keterangan.value,
    }
    const response = await useApi({
        method: "POST",
        data: bodyPayment,
        api: prop.route,
        token: localStorage.getItem('token'),
    });
    if (!response.ok) {
        buttonSave.value = false;
    } else {
        message.success("persetujuan berhasil");
        buttonSave.value = false;
        router.go();
        emit('save', false);
    }
}
onMounted(() => {
    getDetailNotif(prop?.id);
});
</script>