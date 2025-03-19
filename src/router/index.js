import {createRouter, createWebHistory} from "vue-router";

// slice

const routes = [
    {
        path: "/",
        name: "landing",
        component: () => import("../views/pages/LoginPage.vue"),
    },
    {
        path: "/visit",
        name: "visit",
        component: () => import("../views/pages/task/survey/MSurveyPage.vue"),
    },
    {
        path: "/no-service",
        name: "maintenance",
        component: () => import("../views/pages/503Page.vue"),
    },
    {
        path: "/test-view",
        name: "testview",
        component: () => import("../views/pages/TestViewPage.vue"),
    },
    {
        path: "/playground",
        name: "playground",
        component: () => import("../views/pages/PlaygroundPage.vue"),

    }, {
        path: "/pass-pk",
        name: "pass pk",
        component: () => import("../views/pages/PassPKView.vue"),

    },
    {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("../views/pages/LoginPage.vue"),
    },
    {
        path: "/exp-transaction",
        name: "expand transaction",
        component: () => import("../views/pages/transaction/cashInPage.vue"),
    },
    {
        path: "/transaction",
        name: "transaction",
        component: () => import("../views/pages/layout/DashboardLayout.vue"),
        children: [
            {
                path: "payment",
                name: "pembayaran",
                component: () => import("../views/pages/transaction/paymentPage.vue"),
            },
            {
                path: "addpayment",
                name: "tambah penerimaan",
                component: () => import("../views/pages/transaction/cashInPage.vue"),
            },
            {
                path: "repayment",
                name: "pelunasan",
                component: () => import("../views/pages/transaction/repaymentPage.vue"),
            },
            {
                path: "addrepayment",
                name: "tambah pelunasan",
                component: () => import("../views/pages/transaction/repayPage.vue"),
            },
            {
                path: "jaminan",
                name: "jaminan",
                component: () => import("../views/pages/jaminan/jaminanPage.vue"),
            },
            {
                path: "jaminan-action",
                name: "jaminan action",
                component: () => import("../views/pages/jaminan/trxJaminan.vue"),
            },
            {
                path: "jaminan-update",
                name: "jaminan update",
                component: () => import("../views/pages/jaminan/updateJaminanPage.vue"),
            },
        ],
    },
    {
        path: "/task",
        name: "task",
        component: () => import("../views/pages/layout/DashboardLayout.vue"),
        children: [
            {
                path: "apply-credit",
                name: "Order",
                component: () => import("../views/pages/task/FpkPage.vue"),
            },
            {
                path: "kunjungan_cust",
                name: "kunjungan",
                component: () => import("../views/pages/task/visit/VisitPage.vue"),
            },
            {
                path: "addvisit",
                name: "addvisit",
                component: () => import("../views/pages/task/visit/AddVisit.vue"),
            }, {
                path: "analisa",
                name: "analisa",
                component: () => import("../views/pages/task/analisa/AnalisaPage.vue"),
            }, {
                path: "addanalisa",
                name: "addanalisa",
                component: () => import("../views/pages/task/analisa/AnalisaForm.vue"),
            },
            {
                path: "apply-credit/:idapplication",
                name: "Form Pengajuan Kredit",
                component: () => import("../views/pages/task/AddFpkPage.vue"),
            },
            {
                path: "detail-credit/:idapplication",
                name: "Detail Kredit",
                component: () => import("../views/pages/task/DetailFpkPage.vue"),
            },
            {
                path: "kapos-fpk/:idapplication",
                name: "Konfirmasi Pengajuan Kredit",
                component: () => import("../views/pages/task/ConfFpkPage.vue"),
            },
            {
                path: "nego-fpk/:idapplication",
                name: "Nego Pengajuan Kredit",
                component: () => import("../views/pages/task/NegoFpkPage.vue"),
            },
            {
                path: "ho-fpk/:idapplication",
                name: "Konfirmasi HO Pengajuan Kredit",
                component: () => import("../views/pages/task/ConfHOFpkPage.vue"),
            },
            {
                path: "detail-fpk/:idapplication",
                name: "Detail Pengajuan Kredit",
                component: () => import("../views/pages/task/DetailFpkPage.vue"),
            },
            {
                path: "preprint-pk/:idapplication",
                name: "pre print pk",
                component: () => import("../views/pages/task/PrePrintPKPage.vue"),
            },
            {
                path: "survey",
                name: "survey",
                component: () => import("../views/pages/task/SurveyPage.vue"),
            },
            {
                path: "detail-survey/:idsurvey",
                name: "detail survey",
                component: () => import("../views/pages/task/survey/DetailSurveyPage.vue"),
            },
            {
                path: "survey/:idsurvey",
                name: "edit survey",
                component: () => import("../views/pages/task/AddSurveyPage.vue"),
            },
            {
                path: "Approval",
                name: "approval",
                component: () => import("../views/pages/task/ApprovalPage.vue"),
            },
            {
                path: "approval_ho",
                name: "Approval HO",
                component: () => import("../views/pages/task/ApprovalHOPage.vue"),
            },
            {
                path: "approval_trf",
                name: "pending transfer",
                component: () => import("../views/pages/task/HO/PersetujuanPage.vue"),
            },
            {
                path: "approval-center",
                name: "approval-center",
                component: () => import("../views/pages/task/HO/PersetujuanPage.vue"),
            },
            {
                path: "new-survey",
                name: "tambah survey",
                component: () => import("../views/pages/task/AddSurveyPage.vue"),
            },
        ],
    },
    {
        path: "/master",
        name: "master",
        component: () => import("../views/pages/layout/DashboardLayout.vue"),
        children: [
            {
                path: "admin_fee",
                name: "Biaya Admin",
                component: () => import("../views/pages/master/CalculatorPage.vue"),
            },
            {
                path: "taksasi",
                name: "taksasi",
                component: () => import("../views/pages/master/TaksasiPage.vue"),
            },
            {
                path: "taksasi-action",
                name: "Taksasi baru",
                component: () => import("../views/pages/master/ActionTaksasiPage.vue"),
            },
            {
                path: "taksasi-batch",
                name: "taksasi batch",
                component: () =>
                    import("../views/pages/master/UpdateBatchTakasasi.vue"),
            },
            {
                path: "taksasi-action/:idtaksasi",
                name: "Update Taksasi",
                component: () => import("../views/pages/master/ActionTaksasiPage.vue"),
            },
            {
                path: "employees",
                name: "karyawan",
                component: () => import("../views/pages/master/EmployeesPage.vue"),
            },
            {
                path: "master_jaminan",
                name: "Jaminan",
                component: () => import("../views/pages/master/jaminan/JaminanPage.vue"),
            },
            {
                path: "employee-action",
                name: "karyawan baru",
                component: () => import("../views/pages/master/ActionEmployeePage.vue"),
            },
            {
                path: "users",
                name: "pengguna",
                component: () => import("../views/pages/master/UsersPage.vue"),
            },
            {
                path: "users-action",
                name: "pengguna baru",
                component: () => import("../views/pages/master/ActionUsersPage.vue"),
            },
            {
                path: "users-action/:iduser",
                name: "update pengguna",
                component: () => import("../views/pages/master/ActionUsersPage.vue"),
            },
            {
                path: "users-action/:iduser/detail",
                name: "detail pengguna",
                component: () => import("../views/pages/master/ActionUsersPage.vue"),
            },
            {
                path: "users-menu/:iduser",
                name: "menu pengguna",
                component: () => import("../views/pages/master/MenuUserPage.vue"),
            },
            {
                path: "employee-action/:idemployee",
                name: "update karyawan",
                component: () => import("../views/pages/master/ActionEmployeePage.vue"),
            },
            {
                path: "employee-action/:idemployee/detail",
                name: "detail karyawan",
                component: () => import("../views/pages/master/ActionEmployeePage.vue"),
            },
            {
                path: "branch",
                name: "cabang",
                component: () => import("../views/pages/master/BranchPage.vue"),
            },
            {
                path: "branch-action",
                name: "cabang baru",
                component: () => import("../views/pages/master/ActionBranchPage.vue"),
            },
            {
                path: "branch-action/:idbranch",
                name: "update cabang",
                component: () => import("../views/pages/master/ActionBranchPage.vue"),
            },
            {
                path: "branch-action/:idbranch/detail",
                name: "detail cabang",
                component: () => import("../views/pages/master/ActionBranchPage.vue"),
            },
            {
                path: "blacklist",
                name: "blacklist",
                component: () =>
                    import("../views/pages/master/blacklist/BlacklistPage.vue"),
            },
            {
                path: "customer",
                name: "customer",
                component: () =>
                    import("../views/pages/master/customer/CustomerPage.vue"),
            },
            {
                path: "myaccount",
                name: "myaccount",
                component: () => import("../views/pages/user/MyAccountPage.vue"),
            },
            {
                path: "changepassword",
                name: "changepassword",
                component: () => import("../views/pages/user/PasswordSection.vue"),
            },
            {
                path: "menu",
                name: "menu",
                component: () => import("../views/pages/master/menus/MenuPage.vue"),
            },
            {
                path: "menu-action",
                name: "menu action",
                component: () =>
                    import("../views/pages/master/menus/ActionMenuPage.vue"),
            },
            {
                path: "menu-action/:idMenu",
                name: "update menu",
                component: () =>
                    import("../views/pages/master/menus/ActionMenuPage.vue"),
            },
            {
                path: "position",
                name: "position",
                component: () =>
                    import("../views/pages/master/position/PositionPage.vue"),
            },
            {
                path: "position-action",
                name: "position action",
                component: () =>
                    import("../views/pages/master/position/ActionPositionPage.vue"),
            },
        ],
    },
    {
        path: "/laporan",
        name: "laporan",
        component: () => import("../views/pages/layout/DashboardLayout.vue"),
        children: [
            {
                path: "inq_pinjaman",
                name: "Listing Beban",
                component: () => import("../views/pages/laporan/LapPinjaman.vue"),
                meta: {title: 'Listing Beban'}
            },
            {
                path: "list_ban",
                name: "Listing Beban",
                component: () => import("../views/pages/laporan/LapListingBeban.vue"),
            }, {
                path: "lap_pembayaran",
                name: "Laporan Pembayaran",
                component: () => import("../views/pages/laporan/LapPembayaran.vue"),
            },{
                path: "list_ban_test",
                name: "Listing Beban test",
                component: () => import("../views/pages/laporan/LapListingBebanTest.vue"),
            },
            {
                path: "jatuh_tempo",
                name: "Kredit Jatuh Tempo",
                component: () => import("../views/pages/laporan/LapJatuhTempo.vue"),
            },
            {
                path: "lap_inq_pinjaman",
                name: "Inquery Pinjaman",
                component: () => import("../views/pages/laporan/LapInqueryPinjaman.vue"),
            },
            {
                path: "lkbh",
                name: "lkbh",
                component: () => import("../views/pages/laporan/LapLkbh.vue"),
                meta: {title: 'LKBH'}
            },
            {
                path: "inq_jaminan",
                name: "inquery jaminan",
                component: () => import("../views/pages/laporan/LapJaminan.vue"),
            },

        ],
    },
     { path: "/:pathMatch(.*)*",  component: () => import("../views/pages/404Page.vue"), },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const apptitle = import.meta.env.VITE_APP_TITLE;
router.beforeEach((to, from) => {
    document.title = to.meta?.title ?? apptitle
})

// router.beforeEach((to)=>{
// });
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = () => {
//     if (localStorage.getItem("token")) {
//       return true;
//     }
//     return false;
//   };
//   if (to.matched.some((record) => record.meta.requiresAuth)) {
//     if (!isAuthenticated) {
//       next("/login");
//     } else {
//       next();
//     }
//   } else {
//     next();
//   }
// });

export default router;
