<template>
    <div>
      <n-button @click="handlePrint">cetak</n-button>
    </div>
    <div ref="printArea" class="pt-[3cm] text-[8pt] font-mono">
      <div v-for="data, i in jsonDataTable1" :key="data">
        <div class="flex">
          <div class="w-[1cm] text-center">{{ i+1 }}</div>
          <div class="w-[2cm]">{{ data.tanggal }}</div>
          <div class="w-[1cm] text-center">{{ data.acc_key }}</div>
          <div class="w-[3.5cm]">{{ data.debet.toLocaleString() }}</div>
          <div class="w-[3.5cm]">{{ data.kredit.toLocaleString() }}</div>
          <div class="w-[4cm]">{{ data.saldo.toLocaleString() }}</div>
          <div class="w-[1cm]">{{ data.op_id }}</div>
        </div>
        <div class="flex h-[20pt]" v-if="(i + 1) === 15">
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useVueToPrint } from "vue-to-print";
  
  const printArea = ref();
  const { handlePrint } = useVueToPrint({
    content: printArea,
    documentTitle: "cetak buku",
  });
  const jsonDataTable1 = [
    { tanggal: "1-02-1970", acc_key: 28, debet: 1234567890, kredit: 1234567890, saldo: 12345678900, op_id: 'tl' },
    { tanggal: "2-02-1970", acc_key: 28, debet: 1234567890, kredit: 1234567890, saldo: 12345678900, op_id: 'tl' },
    { tanggal: "3-02-1970", acc_key: 28, debet: 1234567890, kredit: 1234567890, saldo: 12345678900, op_id: 'tl' },
    { tanggal: "4-02-1970", acc_key: 28, debet: 1234567890, kredit: 1234567890, saldo: 12345678900, op_id: 'tl' },
    { tanggal: "5-02-1970", acc_key: 28, debet: 1234567890, kredit: 1234567890, saldo: 12345678900, op_id: 'tl' },
    { tanggal: "6-02-1970", acc_key: 28, debet: 1234567890, kredit: 1234567890, saldo: 12345678900, op_id: 'tl' },
    { tanggal: "7-02-1970", acc_key: 28, debet: 1234567890, kredit: 1234567890, saldo: 12345678900, op_id: 'tl' },
    { tanggal: "8-02-1970", acc_key: 28, debet: 1234567890, kredit: 1234567890, saldo: 12345678900, op_id: 'tl' },
    { tanggal: "9-02-1970", acc_key: 28, debet: 1234567890, kredit: 1234567890, saldo: 12345678900, op_id: 'tl' },
    { tanggal: "10-02-1970", acc_key: 28, debet: 1234567890, kredit: 1234567890, saldo: 12345678900, op_id: 'tl' },
    { tanggal: "11-02-1970", acc_key: 28, debet: 1234567890, kredit: 1234567890, saldo: 12345678900, op_id: 'tl' },
    { tanggal: "12-02-1970", acc_key: 28, debet: 1234567890, kredit: 1234567890, saldo: 12345678900, op_id: 'tl' },
    { tanggal: "13-02-1970", acc_key: 28, debet: 1234567890, kredit: 1234567890, saldo: 12345678900, op_id: 'tl' },
    { tanggal: "14-02-1970", acc_key: 28, debet: 1234567890, kredit: 1234567890, saldo: 12345678900, op_id: 'tl' },
    { tanggal: "15-02-1970", acc_key: 28, debet: 1234567890, kredit: 1234567890, saldo: 12345678900, op_id: 'tl' },
    { tanggal: "16-02-1970", acc_key: 28, debet: 1234567890, kredit: 1234567890, saldo: 12345678900, op_id: 'tl' },
    { tanggal: "17-02-1970", acc_key: 28, debet: 1234567890, kredit: 1234567890, saldo: 12345678900, op_id: 'tl' },
    { tanggal: "18-02-1970", acc_key: 28, debet: 1234567890, kredit: 1234567890, saldo: 12345678900, op_id: 'tl' },
    { tanggal: "19-02-1970", acc_key: 28, debet: 1234567890, kredit: 1234567890, saldo: 12345678900, op_id: 'tl' },
    { tanggal: "20-02-1970", acc_key: 28, debet: 1234567890, kredit: 1234567890, saldo: 12345678900, op_id: 'tl' },
    { tanggal: "20-02-1970", acc_key: 28, debet: 1234567890, kredit: 1234567890, saldo: 12345678900, op_id: 'tl' },
    { tanggal: "20-02-1970", acc_key: 28, debet: 1234567890, kredit: 1234567890, saldo: 12345678900, op_id: 'tl' },
    { tanggal: "20-02-1970", acc_key: 28, debet: 1234567890, kredit: 1234567890, saldo: 12345678900, op_id: 'tl' },
    { tanggal: "20-02-1970", acc_key: 28, debet: 1234567890, kredit: 1234567890, saldo: 12345678900, op_id: 'tl' },
    { tanggal: "20-02-1970", acc_key: 28, debet: 1234567890, kredit: 1234567890, saldo: 12345678900, op_id: 'tl' },
    { tanggal: "20-02-1970", acc_key: 28, debet: 1234567890, kredit: 1234567890, saldo: 12345678900, op_id: 'tl' },
    { tanggal: "20-02-1970", acc_key: 28, debet: 1234567890, kredit: 1234567890, saldo: 12345678900, op_id: 'tl' },
    { tanggal: "20-02-1970", acc_key: 28, debet: 1234567890, kredit: 1234567890, saldo: 12345678900, op_id: 'tl' },
    { tanggal: "20-02-1970", acc_key: 28, debet: 1234567890, kredit: 1234567890, saldo: 12345678900, op_id: 'tl' },
    { tanggal: "20-02-1970", acc_key: 28, debet: 1234567890, kredit: 1234567890, saldo: 12345678900, op_id: 'tl' },
    { tanggal: "20-02-1970", acc_key: 28, debet: 1234567890, kredit: 1234567890, saldo: 12345678900, op_id: 'tl' },
    { tanggal: "20-02-1970", acc_key: 28, debet: 1234567890, kredit: 1234567890, saldo: 12345678900, op_id: 'tl' },
    { tanggal: "20-02-1970", acc_key: 28, debet: 1234567890, kredit: 1234567890, saldo: 12345678900, op_id: 'tl' },
  ];
  </script>
  