<template>
  <div class="flex items-center gap-4 p-1 cursor-pointer rounded-full">
    <div class="flex gap-2">

      <n-popover placement="bottom-end" width="350">
        <template #trigger>
          <n-badge :value="tasks.length">
            <n-button type="primary" tertiary circle @click="handleTask">
              <template #icon>
                <v-icon name="bi-bell" />
              </template>
            </n-button>
          </n-badge>
        </template>

        <!-- <n-skeleton text :repeat="2" /> <n-skeleton text style="width: 60%" v-show="false"/> -->
        <!-- <div v-for="task in tasks" :key="task" @click="tasks = []">
          <div>
            
          </div>
          <div><b>{{ task.type }}</b></div>
          <div>{{ task.descr }}</div>
          <div class="text-[10px] text-slate-500">{{ task.created_at }}</div>
        </div> -->


        <div v-if="tasks.length != 0">
          <div v-for="task in tasks" :key="task" class="hover:bg-pr-50 rounded-lg p-2 cursor-pointer"
            @click="handleDetail(task)">
            <div>
            </div>
            <div><b>{{ task.type }}</b></div>
            <div>{{ task.descr }}</div>
            <div class="text-[10px] text-slate-500">{{ task.created_at }}</div>
          </div>
          <div class="flex justify-center p-2">
            <n-button text type="primary" size="small">Selengkapnya</n-button>
          </div>
        </div>
        <div v-else class="flex">
          <div class="text-gray-300 text-center w-full">Tidak ada data</div>
        </div>
      </n-popover>
    </div>
    <div></div>
    <n-dropdown trigger="hover" :options="options">
      <div class="flex items-center gap-2">
        <span class="flex flex-col items-end">
          <n-text type="primary" class="text-primary uppercase"><strong>{{ dataUser?.nama }}</strong></n-text>
          <!-- <small class="text-primary hidden md:flex uppercase"> POS :{{ dataUser?.cabang_nama }}</small> -->
        </span>
        <n-avatar round size="small" class="aspect-square" :src="dataUser
          ? dataUser.PHOTO_URL
          : 'https://icones.pro/wp-content/uploads/2021/02/icone-utilisateur-vert.png'
          ">
          {{ dataUser?.nama.at(0) }}
        </n-avatar>
      </div>
    </n-dropdown>
  </div>

  <n-modal class="w-fit" title="Upload Berkas Pencairan" v-model:show="modalNotif" :on-after-leave="onAfterLeave">
        <n-card title="Detail Pembayaran" :segmented="{
            content: true,
            footer: 'soft',
        }">
            <template #header-extra>
                <div class="flex gap-2">
                    <n-space>
                        <n-tag strong
                            :type="bodyModal.STATUS == 'PENDING' ? 'warning' : bodyModal.STATUS == 'PAID' ? 'success' : 'error'">
                            {{ bodyModal.STATUS }}
                        </n-tag>
                        <n-button circle secondary @click="showModal = false">X</n-button>
                    </n-space>
                </div>
            </template>
            <template #footer>
                <n-space>
                    <n-button type="warning" @click="printNota(bodyModal.no_transaksi)"
                        v-show="bodyModal.STATUS == 'PAID'" :disabled="bodyModal.print_ke > 1500">
                        <n-space>
                            <n-icon>
                                <print-icon />
                            </n-icon>
                            <p>Sisa Cetak {{ printCount - bodyModal.print_ke }}</p>
                        </n-space>
                    </n-button>

                    <n-button type="info" @click="uploadState = !uploadState" v-show="bodyModal.STATUS == 'PAID'">
                        <n-space>
                            <p>Lihat/Upload Nota</p>
                        </n-space>
                    </n-button>
                    <div class="">
                      <n-form-item class="w-full">
                        <n-input type="textarea" class="w-full" v-model:value="keterangan"></n-input>
                      </n-form-item>
                      <n-form-item>
                        <n-button @click="handleApprove(bodyModal.no_transaksi)">Setuju</n-button>
                      </n-form-item>
                    </div>
                    <n-button secondary type="info" @click="uploadState = !uploadState"
                        v-show="bodyModal.STATUS == 'PAID'">
                        <n-icon>
                            <file-icon />
                        </n-icon>
                        Tampilkan Nota
                    </n-button>
                </n-space>
            </template>
            <div ref="printReceiptRef" class="flex flex-col" :class="width > 850 ? 'p-4' : 'p-0'" v-if="!uploadState">
                <n-watermark :content="apptitle" cross selectable :font-size="16" :line-height="16" :width="192"
                    :height="128" :x-offset="12" :y-offset="28" :rotate="-15">
                    <div class="p-2">
                        <div class="flex items-center gap-2 pb-2 justify-between border-b border-dashed border-black">
                            <div class="flex gap-2 items-center">
                                <img class="h-10 md:h-10" :src="applogo" alt="logo_company" />
                                <div class="flex flex-col">
                                    <span class="text-xl font-bold">{{ apptitle }}</span>
                                    <n-text strong class="text-md"> POS: {{ bodyModal.cabang }}</n-text>
                                </div>
                            </div>
                            <div class="text-lg font-bold hidden md:flex">KWITANSI {{
                                bodyModal.payment_type ==
                                    'pelunasan' ? 'PELUNASAN' : 'PEMBAYARAN'
                            }}
                            </div>
                        </div>
                        <div class="flex justify-between">
                            <n-text strong class="text-md"> {{ bodyModal.tgl_transaksi }}</n-text>
                            <n-text strong class="text-md"> {{ bodyModal.payment_method == 'cash' ? 'TUNAI' : 'TRANSFER'
                            }}</n-text>

                        </div>
                        <div class="flex justify-between border-b border-dashed border-black"
                            :class="width > 850 ? 'flex-row' : 'flex-col'">
                            <div class="flex flex-col py-4">
                                <small class="text-reg">No Transaksi : </small>
                                <n-text class="text-reg font-bold"> {{ bodyModal.no_transaksi }}</n-text>
                                <small class="text-reg">No Kontrak : </small>
                                <n-text class="text-reg font-bold"> {{ bodyModal.no_fasilitas }}</n-text>
                            </div>
                            <div class="flex flex-col py-4">
                                <small class="text-reg">Terima dari (No Pelanggan) : </small>
                                <n-text class="text-lg font-bold"> {{ bodyModal.nama }}</n-text>
                                <small class="text-reg">({{ bodyModal.cust_code }})</small>
                            </div>
                        </div>

                        <div class="grid border-b border-dashed border-black pb-2"
                            :class="width > 850 ? 'grid-cols-5 gap-4' : 'grid-cols-1 '"
                            v-if="bodyModal.payment_type != 'pelunasan'">
                            <div class="flex flex-col">
                                <small class="text-reg">JML. ANGS</small>
                                <n-text strong class="text-md"> {{
                                    bodyModal.bayar_angsuran.toLocaleString('US') ?
                                        bodyModal.bayar_angsuran.toLocaleString('US') : 'n/a'
                                }}
                                </n-text>
                            </div>
                            <div class="flex flex-col">
                                <small class="text-reg">JML. DENDA</small>
                                <n-text strong class="text-md">
                                    {{ bodyModal.bayar_denda.toLocaleString() }}
                                </n-text>
                            </div>
                            <div class="flex flex-col">
                                <small class="text-reg">CUST. BAYAR</small>
                                <n-text strong class="text-md"> {{ bodyModal.jumlah_uang.toLocaleString("US")
                                }}</n-text>
                            </div>
                            <div class="flex flex-col">
                                <small class="text-reg">PEMBULATAN</small>
                                <n-text strong class="text-md"> {{ bodyModal.pembulatan.toLocaleString() }}</n-text>
                            </div>

                            <div class="flex flex-col">
                                <small class="text-reg">KEMBALIAN</small>
                                <td>
                                    <n-text strong class="text-md"> {{ bodyModal.kembalian.toLocaleString("US")
                                    }}</n-text>
                                </td>
                            </div>

                        </div>
                        <div class="grid border-b border-dashed border-black pb-2"
                            :class="width > 850 ? 'grid-cols-5 gap-4' : 'grid-cols-1 '" v-else>
                            <div class="flex flex-col">
                                <small class="text-reg">Total Pelunasan</small>
                                <n-text class="text-md font-bold"> {{
                                    bodyModal.total_bayar.toLocaleString('US') ?
                                        bodyModal.total_bayar.toLocaleString('US') : 'n/a'
                                }}
                                </n-text>
                            </div>
                            <div class="flex flex-col">
                                <small class="text-reg">Pembulatan</small>
                                <n-text class="text-md font-bold"> {{ bodyModal.pembulatan }}</n-text>
                            </div>
                            <div class="flex flex-col">
                                <small class="text-reg">Cust. Bayar</small>
                                <n-text class="text-md font-bold"> {{
                                    bodyModal.jumlah_uang.toLocaleString("US")
                                    }}
                                </n-text>
                            </div>
                            <div class="flex flex-col">
                                <small class="text-reg">Diskon</small>
                                <n-text class="text-md font-bold"> {{
                                    (bodyModal.total_bayar - bodyModal.jumlah_uang).toLocaleString("US")
                                    }}
                                </n-text>
                            </div>
                            <div class="flex flex-col">
                                <small class="text-reg">Metode Pembayaran</small>
                                <n-text class="text-md font-bold"> {{ bodyModal.payment_method }}
                                    {{ bodyModal.payment_type == 'pelunasan' ? '/ pelunasan' : '' }}
                                </n-text>
                            </div>
                        </div>
                    </div>
                    <div class="px-3">

                        <table width="100%" class="border border-black" v-if="bodyModal.payment_type != 'pelunasan'">
                            <tr>
                                <th class="border border-black">ANGS. KE</th>
                                <th class="border border-black">TANGGAL JT.</th>
                                <th class="border border-black">BYR. ANGS</th>
                                <th class="border border-black">BYR. DENDA</th>
                                <th class="border border-black">DISKON</th>
                                <!--              <th class="border border-black">Jumlah</th>-->
                            </tr>
                            <tr v-for="angs in bodyModal.struktur" :key="angs.id">
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
                            <!--                <strong>{{ bodyModal.total_bayar.toLocaleString("US") }}</strong>-->
                            <!--              </td>-->
                            <!--            </tr>-->
                        </table>
                    </div>
                    <div class="flex flex-col border-b border-dashed border-black pb-4 ms-3">
                        <div class="flex gap-4">
                            <div class="border-b border-black pt-20 px-4">
                                <n-text strong class="text-md font-bold"> {{ bodyModal.created_by }}</n-text>
                            </div>
                            <div class="border-b border-black pt-20 px-4">
                                <n-text strong class="text-md font-bold"> {{ bodyModal.nama }}</n-text>
                            </div>
                        </div>
                    </div>
                </n-watermark>
            </div>
            <div v-else>
                <file-upload title="Upload Nota" type="nota" :idapp="bodyModal.payment_id" endpoint="payment_attachment"
                    :def_value="bodyModal?.attachment" />
            </div>
            <div v-show="bodyModal.payment_method == 'transfer'">
                <n-divider>bukti transfer</n-divider>
                <n-image :src="bodyModal?.attachment" class="max-w-36" />
            </div>
        </n-card>
    </n-modal>
</template>
<script setup>
import { ref, h, onMounted } from "vue";
import router from "../../router";
import { useMessage, NIcon } from "naive-ui";
import {
  AccountCircleOutlined as Account,
  LockOutlined as Locked,
  LogOutOutlined as SignOut,
} from "@vicons/material";

import { useApi } from "../../helpers/axios";
import { useMeStore } from "../../stores/me";
import { useTaskStore } from "../../stores/task";
import { useCollateralStore } from "../../stores/collateral.js";

const message = useMessage();
const me = useMeStore();
const dataUser = ref();
const options = [
  {
    label: `Akun`,
    icon() {
      return h(NIcon, null, {
        default: () => h(Account),
      });
    },
    key: 1,
    props: {
      onClick: () => {
        handleAccount();
      },
    },
  },
  {
    label: "Ganti Password",
    icon() {
      return h(NIcon, null, {
        default: () => h(Locked),
      });
    },
    key: 2,
    props: {
      onClick: () => {
        handleChangePassword();
      },
    },
  },
  {
    type: "divider",
    key: "d1",
  },
  {
    label: "Logout",
    icon() {
      return h(NIcon, null, {
        default: () => h(SignOut),
      });
    },
    key: 3,
    props: {
      onClick: () => {
        LogOut();
      },
    },
  },
];

const task = useTaskStore();
const coll = useCollateralStore();

const modalNotif = ref(false);

const approvalCenter = () => {
  router.push({ name: "approval-center" })
}
const handleAccount = () => {
  router.push({ name: "myaccount" });
};
const handleChangePassword = () => {
  router.push({ name: "changepassword" });
};

const GetMe = async () => {
  let userToken = localStorage.getItem("token");
  const response = await useApi({
    method: "GET",
    api: "me",
    token: userToken,
  });
  if (!response.ok) {
    message.info('SESI BERAKHIR');
  } else {
    dataUser.value = response.data.response;
    me.storeMe(response.data.response);
    task.storeTask(response.data.response);
  }
};

const tasks = ref([]);
const handleTask = async () => {
  let userToken = localStorage.getItem("token");
  const response = await useApi({
    method: "GET",
    api: "task_pusher",
    token: userToken,
  });
  if (!response.ok) {
    message.info('SESI BERAKHIR');
  } else {
    tasks.value = response.data;
  }
};
const bodyModal = ref();

const getDetailNotif = async (e) => {
  let userToken = localStorage.getItem("token");
  const response = await useApi({
    method: "GET",
    api: `payment/${e}`,
    token: userToken,
  });
  if (!response.ok) {
    message.info('SESI BERAKHIR');
  } else {
    bodyModal.value=response.data;
  }
};

const keterangan = ref();
const handleApprove = async (e) => {
  const bodyPost = {
    no_invoice: e,
    flag: "yes",
    keterangan: keterangan.value,
  };
  const response = await useApi({
    method: "POST",
    api: `payment_approval`,
    data: bodyPost,
    token: localStorage.getItem('token'),
  });
  if (!response.ok) {
    loadingConf.value = true;
    message.error("konfirmasi gagal");
  } else {
    loadingConf.value = false;
    message.success("konfirmasi berhasil");
    getDataPayment();
    showModal.value = false;
    router.push({ name: "pending transfer" });
  }
};

const handleDetail = async (e) => {
  await getDetailNotif(e.type_id);
  console.log(modalNotif.value )
  modalNotif.value=true;
  tasks.value = [];
}
// const getDataColl = async () => {
//   let userToken = localStorage.getItem("token");
//
//   const response = await useApi({
//     method: "GET",
//     api: "jaminan",
//     token: userToken,
//   });
//   if (!response.ok) {
//     console.log(response);
//   } else {
//     coll.storeCollateral(response.data);
//   }
// };

const GetPayment = async () => {
  let userToken = localStorage.getItem("token");
  const response = await useApi({
    method: "GET",
    api: "me",
    token: userToken,
  });
  if (!response.ok) {
    message.info('SESI BERAKHIR');
  } else {
    dataUser.value = response.data.response;
    me.storeMe(response.data.response);
    task.storeTask(response.data.response);
  }
};



const LogOut = async () => {

  localStorage.removeItem("token");
  message.success("logout berhasil");
  router.go();
  // }
};
onMounted(() => {
  GetMe();
  handleTask();
});
</script>
