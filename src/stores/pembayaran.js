import { defineStore } from "pinia";
import { ref } from "vue";
export const usePaymentStore = defineStore("payment", () => {
    const payment= ref([]);
    const storePayment = (e) => {
        payment.value = e;
    };
    return { payment, storePayment };
});
