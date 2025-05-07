import { defineStore } from "pinia";
import { ref } from "vue";
import router from "../router/";
import { useApi } from "../helpers/axios";
import { useMessage } from "naive-ui";
import { v4 as uuidv4 } from "uuid";

export const useVisitStore = defineStore("visit", () => {
  const uuid = uuidv4();
  const listData = ref();
  const initVisit = ref({
    id: uuid,
    no_handphone: null,
    tgl_kunjungan: null,
    nama_nasabah: null,
    provinsi: null,
    kota: null,
    kecamatan: null,
    desa: null,
    kodepos: null,
    alamat_detail: null,
    lampiran_kunjungan: [],
    slik_request: false,
  });
  const message = useMessage();
  const loading = ref(false);

  const storeVisit = async (visitData) => {
    const response = await useApi({
      method: "post",
      data: visitData,
      api: "cr_prospect",
      token: localStorage.getItem("token"),
    });
    if (!response.ok) {
      message.error("TERJADI ERROR API");
      router.push("/");
    } else {
      message.success("BERHASIL TAMBAH DATA");
      router.push({ name: "survey" });
    }
  };

  const getData = async () => {
    loading.value = true;
    const response = await useApi({
      method: "get",
      api: "cr_prospect",
      token: localStorage.getItem("token"),
    });
    if (!response.ok) {
      loading.value = false;
      message.error("TERJADI ERROR API");
      router.push("/");
    } else {
      loading.value = false;
      listData.value = response.data.response;
    }
  };

  return { storeVisit, initVisit, getData, listData, loading };
});
