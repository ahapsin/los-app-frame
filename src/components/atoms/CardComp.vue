<template>
  <n-card :class="`shadow-lg`" :segmented="true" :title="$route.name">
    <template #header-extra> BUTTON </template>
    <slot />
  </n-card :class="`shadow-lg`">
</template>