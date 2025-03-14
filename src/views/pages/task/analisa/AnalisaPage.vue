<template>
    <n-card size="small" title="Data Analisa" :segmented="{
        content: true,
        footer: 'soft',
    }">
        <n-data-table :columns="columnKunjungan" :data="dataKunjungan" />
    </n-card>
</template>

<script setup>
import { h } from "vue";
import router from '../../../../router';
import { NButton, useLoadingBar } from 'naive-ui';


const loadingBar = useLoadingBar();

const columnKunjungan = [{
    key: 'id',
    title: 'Kode Analisa',
}, {
    key: 'tgl',
    title: 'Tanggal',
}, {
    key: 'nama_cust',
    title: 'Nama Nasabah',
}, {
    key: 'no_hp',
    title: 'No HP',
}, {
    key: 'plafon',
    title: 'plafon',
}, {
    key: 'alamat',
    title: 'alamat',
},
{
    key: 'detail',
    title: 'Detail',
    render(e) {
        return h(
            NButton,
            {
                secondary: true,
                round: true,
                size: "small",
                onClick: () => {
                    handleAddButton(e);
                },
            },
            {
                default: () => "detail",
            }
        );
    }
},
];

const dataKunjungan = [{
    id: "CFA-0001",
    tgl: "22-08-1994",
    nama_cust: "Hinata",
    no_hp: "088878987978",
    plafon: 12000000000,
    alamat: "lemahwungkuk rt 12 rw 2 kab.burau"
}, {
        id: "CFA-0002",
        tgl: "22-08-1994",
        nama_cust: "Sakura Haruno",
        no_hp: "088878987978",
        plafon: 13000000000,
        alamat: "Konohagakure rt 12 rw 2 kab."
    }];

const handleAddButton = (row) => router.push({ name: 'addanalisa',query:row });

loadingBar.finish();
</script>
