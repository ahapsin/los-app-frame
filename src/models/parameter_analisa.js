//table-table
//table analisa
const tableAnalisaModel = [
    {
        bulan: null,
        mutasi_debet: null,
        mutasi_kredit: null
    }
];
const useAnalisaModalKerja = [{
    key: 0,
    param: "latar belakang",
    paramlist: {
        sikap:
            {
                title: "sikap calon debitur selama interview",
                mode: {
                    type: "area",
                    options: [],
                },
                val: null
            },
        kemudahan: {
            title: "kemudahan dalam memberikan data & informasi",
            mode: {
                type: "select",
                options: [
                    'cukup sulit/tidak kooperatif',
                    'Cukup mudah dan terbuka'
                ],
            },
            val: null
        },
        reputasi: {
            title: "reputasi SLIK",
            mode: {
                type: "select",
                options: [
                    'kurang baik',
                    'cukup baik'
                ],
            },
            val: null
        },
        rumah: {
            title: "rumah tinggal",
            mode: {
                type: "select",
                options: [
                    'sewa / kontrak',
                    'milik Sendiri',
                    'milik Keluarga'
                ],
            },
            val: null
        },
        aktor_penting: {
            title: "aktor penting dalam usaha",
            mode: {
                type: "select",
                options: [
                    'orang lain / keluarga',
                    'calon debitur'
                ],
            },
            val: null
        },
        lingkungan: {
            title: "lingkungan tempat tinggal",
            mode: {
                type: "select",
                options: [
                    'kawasan Perumahan',
                    'kawasan Perkampungan',
                    'kawasan Perkantoran'
                ],
            },
            val: null
        },
        keterangan: {
            title: "keterangan / penjelasan",
            mode: {
                type: "area",
                options: [],
            },
            val: null
        },
    }
},
    {
        key: 1,
        param: "aspek usaha",
        paramlist: {
            tempat_usaha: {
                title: "tempat usaha",
                mode: {
                    type: "select",
                    options: [
                        'tidak ada',
                        'sewa',
                        'milik sendiri'
                    ],
                },
                val: null,
            },
            supplier: {
                title: "supplier dari mana saja ",
                mode: {
                    type: "select",
                    options: [
                        'luar kota',
                        'dalam kota'
                    ],
                },
                val: null,
            },
            kondisi_usaha: {
                title: "kondisi lokasi usaha ",
                mode: {
                    type: "select",
                    options: [
                        'ramai',
                        'sepi'
                    ],
                },
                val: null,
            },
            sarana: {
                title: "sarana & prasarana ",
                mode: {
                    type: "select",
                    options: [
                        'kurang memadai',
                        'cukup memadai'
                    ],
                },
                val: null,
            },
            tenaga_kerja: {
                title: "jumlah tenaga kerja ",
                mode: {
                    type: "select",
                    options: [
                        'tidak ada',
                        'kurang mencukupi',
                        'mencukupi'
                    ],
                },
                val: null,
            },
            ketergantungan_supplier: {
                title: "ketergantungan pada supplier tertentu",
                mode: {
                    type: "select",
                    options: [
                        '< 3 Suppliers',
                        '3 - 5 Suppliers',
                        '> 5 Suppliers'
                    ],
                },
                val: null,
            },
            keterangan: {
                title: "keterangan / penjelasan ",
                mode: {
                    type: "area",
                    options: [],
                },
                val: null,
            },
        },
    },
    {
        key: 2,
        param: "aspek pemasaran",
        paramlist: {
            jenis_barang: {
                title: "jenis barang yang dipasarkan ",
                mode: {
                    type: "select",
                    options: [
                        'lokal',
                        'ekspor'
                    ],
                },
                val: null,
            },
            daerah_pemasaran: {
                title: "daerah pemasaran",
                mode: {
                    type: "select",
                    options: [
                        'lokal',
                        'ekspor'
                    ],
                },
                val: null,
            },
            ketergantungan_buyer: {
                title: "ketergantungan pada buyer tertentu",
                mode: {
                    type: "select",
                    options: [
                        'sangat tergantung ( < 3 buyers )',
                        'Cukup Tergantung ( 3 - 5 buyers )',
                        'Tidak tergantung ( >5 buyers )'
                    ],
                },
                val: null,
            },
            tingkat_persaingan: {
                title: "tingkat persaingan",
                mode: {
                    type: "select",
                    options: [
                        'kurang ketat',
                        'cukup ketat',
                        'sangat ketat'
                    ],
                },
                val: null,
            },
            strategi_pasar: {
                title: "strategi pasar",
                mode: {
                    type: "select",
                    options: [
                        'Rata rata pasar',
                        '> harga pasar',
                        '< harga pasar'
                    ],
                },
                val: null,
            },
            keterangan: {
                title: "keterangan / penjelasan",
                mode: {
                    type: "area",
                    options: [],
                },
                val: null,
            },
        },
    },
    {
        key: 6,
        param: "aspek bisnis",
        paramlist: {
            jenis_barang: {
                title: "jenis barang yang dipasarkan ",
                mode: {
                    type: "select",
                    options: [
                        'lokal',
                        'ekspor'
                    ],
                },
                val: null,
            },
            daerah_pemasaran: {
                title: "daerah pemasaran",
                mode: {
                    type: "select",
                    options: [
                        'lokal',
                        'ekspor'
                    ],
                },
                val: null,
            },
            ketergantungan_buyer: {
                title: "ketergantungan pada buyer tertentu",
                mode: {
                    type: "select",
                    options: [
                        'sangat tergantung ( < 3 buyers )',
                        'Cukup Tergantung ( 3 - 5 buyers )',
                        'Tidak tergantung ( >5 buyers )'
                    ],
                },
                val: null,
            },
            tingkat_persaingan: {
                title: "tingkat persaingan",
                mode: {
                    type: "select",
                    options: [
                        'kurang ketat',
                        'cukup ketat',
                        'sangat ketat'
                    ],
                },
                val: null,
            },
            strategi_pasar: {
                title: "strategi pasar",
                mode: {
                    type: "select",
                    options: [
                        'Rata rata pasar',
                        '> harga pasar',
                        '< harga pasar'
                    ],
                },
                val: null,
            },
            keterangan: {
                title: "keterangan / penjelasan",
                mode: {
                    type: "area",
                    options: [],
                },
                val: null,
            },
        },
    },
    {
        key: 3,
        param: "pola usaha",
        paramlist: {
            sikus_pemasaran: {
                title: "sikus pemasaran",
                mode: {
                    type: "select",
                    options: [
                        'grosir',
                        'agen / supplier',
                        'lainnya'
                    ],
                },
                val: null,
            },
            cara_pembayaran: {
                title: "cara pembayaran",
                mode: {
                    type: "select",
                    options: [
                        'tunai / melalui transfer antar rekening',
                        'tarter dengan barang lain',
                        'bertempo selama lebih dari 1 bulan'
                    ],
                },
                val: null,
            },
            keterangan: {
                title: "keterangan / penjelasan",
                mode: {
                    type: "area",
                    options: [],
                },
                val: null,
            },
        },
    },
    {
        key: 4,
        param: "analisis capital",
        paramlist: {
            keterangan: {
                title: "keterangan / penjelasan",
                mode: {
                    type: "area",
                    options: [],
                },
                val: null,
            },
        },
    },
    {
        key: 5,
        param: "analisa kuantitatif",
        paramlist: {
            catatan_table_rekap: {
                title: "rekapitulasi rekening tabungan",
                mode: {
                    type: "table",
                    options: tableAnalisaModel,
                },
                val: "rek_tabungan",
            },
            catatan_table_rekening: {
                title: "catatan table rekening tabungan",
                mode: {
                    type: "area",
                    options: [],
                },
                val: null,
            },
            tabel_kegiatan_transaksi: {
                title: "rekapitulasi kegiatan transaksi",
                mode: {
                    type: "table",
                    options: [],
                },
                val: "rek_transaksi",
            },
            catatan_table_kegiatan_transaksi: {
                title: "catatan table kegiatan transaksi",
                mode: {
                    type: "area",
                    options: [],
                },
                val: null,
            },
            tabel_fasilitas_pinjaman: {
                title: "tabel fasilitas pinjaman",
                mode: {
                    type: "table",
                    options: [],
                },
                val: "rek_fasilitas",
            },
            catatan_table_fasilitas: {
                title: "catatan table fasilitas",
                mode: {
                    type: "area",
                    options: [],
                },
                val: null,
            },
        }
    }];

export {useAnalisaModalKerja}
