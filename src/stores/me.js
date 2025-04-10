import { defineStore } from "pinia";
import {computed, ref} from "vue";
import _ from "lodash";
export const useMeStore = defineStore("me", () => {
  const me = ref([]);
  const storeMe = (meData) => {
    me.value = meData;
  };

  return { me, storeMe };
});
