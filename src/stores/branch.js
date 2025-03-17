import {defineStore} from "pinia";
import {ref} from "vue";
import _ from "lodash";
import {useMeStore} from "./me.js";

export const useBranchStore = defineStore("branch", () => {
    const list = ref([]);
    const me =useMeStore();
    const storeBranch = (data) => {
        list.value = data;
    };
    const listExclude = computed(() => _.filter(list.value, (o) => o.id != me.me.cabang_id));

    return {list, storeBranch, listExclude};
});
