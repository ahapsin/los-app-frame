import { computed, ref } from "vue";

import { defineStore } from "pinia";
import { useApi } from "../helpers/axios";

const token = localStorage.getItem("token");
export const useMenuStore = defineStore("menu", () => {
  const list = ref([]);
  const loading = ref(false);
  const setData = (e) => {
    list.value = e;
  };
  const keyData = computed(() => {
    var social = list.value;
    var x = social.map(function (item) {
      return Object.keys(item);
    });
    return x[0];
  });
  const fetchData = async () => {
    loading.value = true;
    const response = await useApi({
      method: "get",
      api: 'menu-sub-list',
      token: token,
    });
    if (!response.ok) {
      console.log("error");
      loading.value = true;
    } else {
      loading.value = false;
      list.value = response.data.response;
    }
  };
  const deletedData = () => {
    list.value--;
    console.log(token);
  };
  function $reset() {
    list.value = [];
  }
  const doubleCount = computed(() => list.value * 2);
  return {
    list,
    keyData,
    setData,
    loading,
    fetchData,
    deletedData,
    doubleCount,
    $reset,
  };
});
