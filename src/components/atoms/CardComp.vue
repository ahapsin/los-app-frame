<template>
  <n-card :segmented="true" :title="$route.name">
    <template #header-extra> BUTTON </template>
    <slot />
  </n-card>
</template>