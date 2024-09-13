import { defineStore } from "pinia";
import { ref } from "vue";
export const useMeStore = defineStore("me", () => {
  const me = ref([]);
  const storeMe = (meData) => {
    me.value = meData;
  };
  return { me, storeMe };
});
