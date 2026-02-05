import { ref } from "vue";
import { useApi } from "../helpers/axios";

export function useTickets() {
  const tickets = ref([]);
  const ticket = ref(null);
  const userToken = localStorage.getItem("token");
  const loading = ref(false);
  const error = ref(false);

  const fetchTickets = async () => {
    loading.value = true;
    error.value = null;

    const response = await useApi({
      method: "GET",
      api: "ticketing",
      token: userToken,
    });

    if (!response.ok) {
      loading.value = false;
      return false;
    }

    tickets.value = response.data;
    loading.value = false;
    return true;
  };

  const postTicket = async (e) => {
    loading.value = true;
    error.value = null;

    const response = await useApi({
      method: "POST",
      api: "ticketing",
      data: e,
      token: userToken,
    });

    if (!response.ok) {
      loading.value = false;
      return false;
    }

    tickets.value = response.data;
    loading.value = false;
    return true;
  };
  return { fetchTickets, postTicket, tickets, ticket };
}
