<template>
  <div class="flex justify-center p-0 md:p-8 bg-gradient-to-tr from-blue-800 to-orange-500 gap-2">
    <div
        class="p-8 h-screen border shadow rounded-none md:rounded-2xl w-1/3 flex bg-white justify-between flex-col">
      <div class="text-lg flex items-center pb-8">
        <n-icon color="#">
          <history-icon/>
        </n-icon>
        history
      </div>
      <div class="h-[600px] overflow-auto flex flex-col gap-2 ">
        <div v-for="history in pushedHistoryChat" @click="textArea = history"
             class="bg-slate-100 rounded-lg cursor-pointer p-2"> {{ history }}
        </div>
      </div>

    </div>
    <div
        class="p-8 h-screen border shadow rounded-none md:rounded-2xl w-1/2 flex bg-white justify-between flex-col">
      <div class="flex justify-between h-20 ">
        <div class="text-2xl flex items-center pb-8">
          cheat<span :class="indikator ? 'animate-bounce' : 'animate-none'"><b> GPU 4.0</b></span>
          <n-icon
              color="#">
            <verify-icon/>
          </n-icon>
        </div>

        <n-button v-if="pushedInvoice.length > 0"
                  @click="() => { pushedInvoice = []; count = 0; pushedErrorInvoice = [] }">
          <n-icon>
            <close-icon/>
          </n-icon>
          <div>hapus log</div>
        </n-button>

        <div class="font-bold flex rounded-full w-[50px]" v-if="count > 0">
          {{ count }} / {{ noInvoice != null ? noInvoice.length : null }}
        </div>
      </div>
      <div class="flex flex-col gap-4 h-[600px] overflow-auto">
        <div v-for="inv in pushedInvoice" class="flex justify-between  p-2 rounded-lg"
             :class="inv.stts ? 'bg-slate-100' : 'bg-red-300 '">
                    <span>
                        <pre>{{ inv.no_invoice }}</pre>
                    </span>
          <span>{{ inv.type }}</span>
        </div>

      </div>

      <div class="">
        <div class="flex flex-col p-2 shadow-md border rounded-2xl">
                    <textarea v-model="textArea" style="resize:none" class="p-2 focus:outline-none"
                              placeholder="no invoice dipisahkan dengan koma" @focus="indikator = true"
                              @blur="indikator = !indikator">
    </textarea>
          <div class="flex justify-between items-center gap-2">
            <div v-if="noInvoice != null" class="border  items-center flex w-full p-1 rounded-lg shadow">
              {{ noInvoice != null ? noInvoice.length : null }} data
            </div>
            <div v-else></div>
            <n-select v-model:value="optVal" :options="optType"/>
            <div class="flex gap-2">
              <n-button type="error" circle v-if="textArea != null" @click="textArea = null">
                <n-icon>
                  <close-icon/>
                </n-icon>
              </n-button>

              <n-button @click="eksekusi(noInvoice)" type="primary" circle>
                <n-icon>
                  <up-icon/>
                </n-icon>
              </n-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
        class="p-8 h-screen border shadow rounded-none md:rounded-2xl w-1/3 flex bg-white justify-between flex-col">
      <div class="text-lg flex items-center pb-8">
        <n-icon color="#">
          <log-icon/>
        </n-icon>
        Log Error
      </div>
      <div class="h-[600px] overflow-auto flex flex-col gap-2 ">
        <div v-for="errHistory in pushedErrorInvoice" class="bg-slate-100 rounded-lg cursor-pointer p-2"> {{
            errHistory.no_invoice
          }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {useMessage} from 'naive-ui';
import {useApi} from '../../helpers/axios';
import {
  ArrowUpwardRound as UpIcon,
  CloseRound as CloseIcon,
  HistoryRound as HistoryIcon,
  ChecklistRtlRound as LogIcon,
  VerifiedRound as VerifyIcon
} from "@vicons/material";
import router from "../../router/index.js";

const message = useMessage();
const textArea = ref();
const pushedInvoice = ref([]);
const pushedHistoryChat = ref([]);
const pushedErrorInvoice = ref([]);
const noInvoice = computed(() => {
  return textArea.value ? textArea.value.split(',').map(item => item.trim()) : null;
});
const active = ref(false);
const placement = ref("right");
const activate = (place) => {
  active.value = true;
  placement.value = place;
};
const optVal = ref("pembayaran");
const optType = ref([
  {
    label: 'pembayaran',
    value: 'pembayaran'
  },
  {
    label: 'pelunasan',
    value: 'pelunasan',
  },]);
const count = ref(0);
const indikator = ref(false);
const eksekusi = (e) => {
  pushedHistoryChat.value.unshift(textArea.value);
  textArea.value = null;

  //payment(e);
  if (optVal.value == "pelunasan") {
    message.loading("memproses pelunasan");
    repayment(e);
  } else if (optVal.value == "pembayaran") {
    payment(e);
  }

}

const payment = async (e) => {
  for (let invoice of e) {
    const response = await useApi({
      method: "POST",
      api: "welcome",
      data: {
        "no_invoice": invoice,
        "tipe": "angsuran"
      },
    });
    if (!response.ok) {
      message.error('ERROR API');
      const date = Date.now();
      pushedErrorInvoice.value.unshift({no_invoice: invoice, tgl: date, stts: false});
      pushedInvoice.value.unshift({no_invoice: invoice, tgl: date, stts: false});
      count.value += 1;
    } else {
      textArea.value = null;
      message.success(invoice);
      const date = Date.now();
      pushedInvoice.value.unshift({no_invoice: invoice, tgl: date, stts: true, type: "pembayaran"});
      count.value += 1;
    }
  }
}

const proPel = async (e) => {
  const response = await useApi({
    method: "POST",
    api: "propel",
    data: e,
  });
  if (!response.ok) {
    message.error('gagal ketua propel !');
    const date = Date.now();
    pushedErrorInvoice.value.unshift({no_invoice: e, tgl: date, stts: false});
    pushedInvoice.value.unshift({no_invoice: e, tgl: date, stts: false});
    count.value += 1;
  } else {
    Object.assign(pelunasan, response.data);
    pushJumlahUang();
    const bentukReport = {
      loan: pelunasan.LOAN_NUMBER,
      jenis_bayar: pelunasan.METODE_PEMBAYARAN,
      total_bayar: pelunasan.TOTAL_BAYAR,
      uang_pel: pelunasan.UANG_PELANGGAN,
      jml_diskon: pelunasan.JUMLAH_DISKON,
      pembulatan: pelunasan.PEMBULATAN,
      kembalian: pelunasan.KEMBALIAN
    }
    textArea.value = null;
    message.success("berhasil proses pelunasan");
    const date = Date.now();
    pushedInvoice.value.unshift({no_invoice: pelunasan, tgl: date, stts: true, type: "pelunasan"});
    count.value += 1;
  }


}

const repayment = async (e) => {
  const date = Date.now();
  for (let invoice of e) {
    const response = await useApi({
      method: "POST",
      api: "botpel",
      data: {
        "no_invoice": invoice,
      },
    });
    if (!response.ok) {
      message.error('gagal ketua !');

      pushedErrorInvoice.value.unshift({no_invoice: invoice, tgl: date, stts: false});
      pushedInvoice.value.unshift({no_invoice: invoice, tgl: date, stts: false});
      count.value += 1;
    } else {
      Object.assign(pelunasan, response.data);
      pushJumlahUang();
      proPel(pelunasan);
    }

  }
}
const dateFormat = (e) => {
  var date = new Date(e * 1000);

  // Hours part from the timestamp
  var hours = date.getHours();

  // Minutes part from the timestamp
  var minutes = "0" + date.getMinutes();

  // Seconds part from the timestamp
  var seconds = "0" + date.getSeconds();

  // Will display time in 10:30:23 format
  var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

  return formattedTime;
}

//pelunasan
const pelunasan = reactive({
  LOAN_NUMBER: null,
  METODE_PEMBAYARAN: "cash",
  SISA_POKOK: 0,
  BUNGA_BERJALAN: 0,
  TUNGGAKAN_BUNGA: 0,
  DENDA: 0,
  PINALTI: 0,
  UANG_PELANGGAN: 0,
  DISKON: 0,
  BAYAR_POKOK: 0,
  BAYAR_BUNGA: 0,
  BAYAR_PINALTI: 0,
  BAYAR_DENDA: 0,
  DISKON_POKOK: 0,
  DISKON_PINALTI: 0,
  DISKON_BUNGA: 0,
  DISKON_DENDA: 0,
  JUMLAH_TAGIHAN: computed(
      () =>
          pelunasan.SISA_POKOK +
          pelunasan.TUNGGAKAN_BUNGA +
          pelunasan.PINALTI +
          pelunasan.DENDA
  ),
  TOTAL_BAYAR: computed(
      () =>
          pelunasan.SISA_POKOK +
          pelunasan.TUNGGAKAN_BUNGA +
          pelunasan.PINALTI +
          pelunasan.DENDA
  ),
  JUMLAH_BAYAR: computed(
      () =>
          pelunasan.BAYAR_POKOK +
          pelunasan.BAYAR_BUNGA +
          pelunasan.BAYAR_PINALTI +
          pelunasan.BAYAR_DENDA
  ),
  JUMLAH_DISKON: computed(
      () =>
          pelunasan.DISKON_POKOK +
          pelunasan.DISKON_BUNGA +
          pelunasan.DISKON_PINALTI +
          pelunasan.DISKON_DENDA
  ),
  PEMBULATAN: 0,
  KEMBALIAN: computed(() =>
      pelunasan.UANG_PELANGGAN - pelunasan.JUMLAH_TAGIHAN - pelunasan.PEMBULATAN <
      0
          ? 0
          : pelunasan.UANG_PELANGGAN -
          pelunasan.JUMLAH_TAGIHAN -
          pelunasan.PEMBULATAN
  ),
});
const pushJumlahUang = async () => {
  let sisaBayarPokok = pelunasan.UANG_PELANGGAN - pelunasan.SISA_POKOK;
  if (sisaBayarPokok >= 0) {
    pelunasan.BAYAR_POKOK = pelunasan.SISA_POKOK;
    pelunasan.DISKON_POKOK = 0;
    let sisaBayarBunga = sisaBayarPokok - pelunasan.TUNGGAKAN_BUNGA;
    if (sisaBayarBunga > 0) {
      pelunasan.BAYAR_BUNGA = pelunasan.TUNGGAKAN_BUNGA;
      pelunasan.DISKON_BUNGA = 0;
      let sisaBayarPinalti = sisaBayarBunga - pelunasan.PINALTI;
      if (sisaBayarPinalti > 0) {
        pelunasan.BAYAR_PINALTI = pelunasan.PINALTI;
        pelunasan.DISKON_PINALTI = 0;
        let sisaBayarDenda = sisaBayarPinalti - pelunasan.DENDA;
        if (sisaBayarDenda > 0) {
          pelunasan.BAYAR_DENDA = pelunasan.DENDA;
          pelunasan.DISKON_DENDA = 0;
        } else {
          pelunasan.BAYAR_DENDA = sisaBayarDenda + pelunasan.DENDA;
          pelunasan.DISKON_DENDA = pelunasan.DENDA - pelunasan.BAYAR_DENDA;
        }
      } else {
        pelunasan.BAYAR_PINALTI = sisaBayarPinalti + pelunasan.PINALTI;
        pelunasan.DISKON_PINALTI = pelunasan.PINALTI - pelunasan.BAYAR_PINALTI;
        pelunasan.DISKON_DENDA = pelunasan.DENDA;
      }
    } else {
      pelunasan.BAYAR_BUNGA = pelunasan.TUNGGAKAN_BUNGA + sisaBayarBunga;
      pelunasan.DISKON_POKOK = 0;
      pelunasan.DISKON_BUNGA = Math.abs(sisaBayarBunga);
      pelunasan.DISKON_DENDA = pelunasan.DENDA;
      pelunasan.DISKON_PINALTI = pelunasan.PINALTI;
    }
  } else {
    pelunasan.BAYAR_POKOK = sisaBayarPokok + pelunasan.SISA_POKOK;
    pelunasan.DISKON_POKOK = pelunasan.SISA_POKOK - pelunasan.UANG_PELANGGAN;
    pelunasan.DISKON_BUNGA = pelunasan.TUNGGAKAN_BUNGA;
    pelunasan.DISKON_DENDA = pelunasan.DENDA;
    pelunasan.DISKON_PINALTI = pelunasan.PINALTI;
  }
};
</script>
