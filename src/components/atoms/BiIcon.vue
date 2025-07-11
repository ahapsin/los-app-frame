<template>
  <div class="p-4">
    <div class="h-1/2 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-5 justify-center gap-4">
      <div v-for="icon in iconNames" class=" items-center justify-center  rounded hover:bg-slate-100">
        <v-icon :name="icon.dashed" scale="2" @click="handleClick(icon)" />
        <p class="text-[10px]">{{ icon.dashed }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Import hanya untuk ambil nama-nama icon
import * as BIIcons from 'oh-vue-icons/icons/bi'

const rawNames = [...Object.keys(BIIcons)]

const iconNames = rawNames.map(name => ({
  original: name,
  dashed: camelToDash(name)
}))

function camelToDash(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
const emit = defineEmits();
const handleClick = (e) => {
  emit('select', e);
}
</script>
