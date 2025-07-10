import { defineStore } from "pinia";
import { ref } from "vue";
import { useApi } from "../helpers/axios";

const token = localStorage.getItem("token");
export const useMasterMenu = defineStore("master_menu", () => {
  const list = ref([]);
  const isLoading = ref(false);
  const isError = ref(false);

  const fetchData = async () => {
    isLoading.value = true;
    const response = await useApi({
      method: "get",
      api: "menu",
      token: token,
    });
    if (!response.ok) {
      isLoading.value = false;
      isError.value = true;
    } else {
      isLoading.value = false;
      list.value = response.data.response;
    }
  };

  function $reset() {
    list.value = [];
  }

  return {
    list,
    isLoading,
    isError,
    fetchData,
    $reset,
  };
});
