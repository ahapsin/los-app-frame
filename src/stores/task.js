import { defineStore } from "pinia";
import { ref } from "vue";

export const useTaskStore = defineStore("task", () => {
  const listTask = ref([]);
  const storeTask = (taskData) => {
    storeTask.value = taskData;
  };
  return { storeTask, listTask };
});
