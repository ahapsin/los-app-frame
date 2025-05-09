<template>
  <div class="  p-2 py-4 " v-bind="$attrs">
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2 w-full">
        <slot name="prefix"/>
        <n-button v-if="!props.primary" circle quaternary @click="router.back()">
          <v-icon :inverse="!true" name="bi-chevron-left" scale="1.5"/>
        </n-button>
        <div v-if="!searching" class="text-base flex :md:hidden">{{ props.title }}</div>
        <div v-show="searching" class="flex w-full pe-2">
          <n-input class="w-full" clearable placeholder="cari disini"/>
        </div>
      </div>
      <div v-if="props.find" class="flex gap-2">
        <n-button circle quaternary @click="handleSearch">
          <v-icon v-if="!searching" :inverse="!true" name="bi-search" scale="1.2"/>
          <v-icon v-else :inverse="!true" name="bi-x" scale="1.5"/>
        </n-button>
      </div>
      <div class="px-2">
        <slot name="suffix"/>
      </div>
    </div>
  </div>
  <div>
    <slot name="progress"></slot>
  </div>
</template>
<script setup>
import {ref} from "vue";
import router from "../../router/index.js"

const searching = ref(false);

const handleSearch = () => {

  searching.value = !searching.value;
}

const props = defineProps({
  title: {
    type: String,
    default: 'title',
  },
  primary: {
    type: Boolean,
    default: false,
  },
  find: {
    type: Boolean,
    default: false,
  }
});

</script>