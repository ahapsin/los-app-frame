<!-- components/Breadcrumb.vue -->
<template>
  <n-breadcrumb>
    <n-breadcrumb-item :key="home">
       <router-link to="/"
          class="text-blue-500 hover:underline"
        >
         <v-icon name="bi-grid"></v-icon>
        </router-link>
    </n-breadcrumb-item>
      <n-breadcrumb-item v-for="(crumb, index) in breadcrumbs" :key="index">
        <router-link
          v-if="index !== breadcrumbs.length - 1"
          :to="crumb.path"
          class=""
        >
          {{ crumb.meta.breadcrumb }}
        </router-link>
        <span v-else class="text-pr">
          {{ crumb.meta.breadcrumb }}
        </span>
      </n-breadcrumb-item>
  </n-breadcrumb>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const breadcrumbs = computed(() => {
  const matched = route.matched.filter(r => r.meta && r.meta.breadcrumb)
  return matched
})
</script>