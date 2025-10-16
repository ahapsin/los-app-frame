<template>
    <n-card size="small" title="Data Kunjungan" :segmented="{
        content: true,
        footer: 'soft',
    }">
        <template #header-extra>
            <n-button type="primary" @click="handleAddButton">Tambah Kunjungan</n-button>
        </template>
        <n-data-table :columns="columnKunjungan" :data="dataKunjungan" />
    </n-card>
</template>

<script setup>
import router from '../../../../router';
import { useLoadingBar } from 'naive-ui';


const loadingBar = useLoadingBar();

const columnKunjungan = [{
    key: 'tgl',
    title: 'Kode Kunjungan',
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
    key: 'berkas',
    title: 'Berkas',
},
{
    key: 'permohonan_slik',
    title: 'Permohonan Slik',
},
{
    key: 'permohonan_slik',
    title: 'Detail',
},
];

const dataKunjungan = [];

const handleAddButton = () => router.push({ name: 'addvisit' });

loadingBar.finish();
</script>
