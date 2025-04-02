<template>

  <SingleSideBar />
</template>
<script setup>
import { onMounted } from "vue";
import router from "../../../router";
onMounted(() => {
  if (!localStorage.getItem("token")) {
    router.push("/");

  }
});
</script>
