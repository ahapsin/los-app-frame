import {defineStore} from "pinia";
import {computed, ref} from "vue";
import _ from "lodash";
import {useMeStore} from "./me.js";

export const useCollateralStore = defineStore("collateral", () => {

    const collateral = ref([]);

    const storeCollateral = (colldata) => {
        collateral.value = colldata;
    };
    // const loading = ref(false);
    // const loadData = (e) => {
    //     loading.value = e;
    // }

    // const me = useMeStore();
    //
    // const onDemand = computed(() => _.filter(collateral.value, {'LOCATION_BRANCH': me.me.cabang_id}));
    //
    // const onGoing = computed(() => _.filter(collateral.value, (o) => o.LOCATION_BRANCH != me.me.cabang_id));


    return {collateral, storeCollateral};
});
