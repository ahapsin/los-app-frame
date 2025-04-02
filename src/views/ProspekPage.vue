<template>
  <div class="bg-sfc h-screen">
    <HAppBar :find="true" class="sticky sticky-top top-0" title="Survey"/>
    <div v-for="(grouped,i) in surveyStore.groupedByDate"
         :key="i"
    >
      <div class="p-4 sticky top-0 z-20 text-sf-drk-500 bg-sfc">{{ i }}</div>
      <div class="flex flex-col gap-2">
        <div v-for="list in grouped"
             :key="list.id" class=" flex  justify-between bg-white p-4 rounded-2xl">
          <div>
            <div class="text-lg">{{ list.nama_debitur || 'N/A' }}</div>
            <span class="text-xs">{{ list.alamat }}</span>
            <n-tag class="text-xs" size="small" type="info">{{ list.status }}</n-tag>
            <div>
            </div>
            <n-dropdown :options="options" trigger="click"
                        @select="handleSelect">
              <n-button circle secondary size="small">
                <v-icon name="bi-three-dots"/>
              </n-button>
            </n-dropdown>
          </div>
        </div>
      </div>
    </div>

    <div class="p-4 text-sf-drk-500 justify-center flex">
      menampilkan {{ surveyStore.surveys.length }} data
    </div>
    <n-float-button :bottom="20" :right="20" :width="60" class="z-30" height="60" shape="circle"
                    type="primary" @click="router.push({name:'buat-prospek'})">
      <v-icon name="bi-plus-lg" scale="1.5"></v-icon>
    </n-float-button>

    <n-modal v-model:show="showModal">
      <n-card
          :bordered="false"
          aria-modal="true"
          role="dialog"
          size="huge"
          style="position: fixed; right: 0; bottom: 0"
          title="Modal"
      >
        <template #header-extra>
          Oops!
        </template>
        Content
        <template #footer>
          Footer
        </template>
      </n-card>
    </n-modal>
  </div>
</template>
<script setup>
import HAppBar from "../components/molecules/HAppBar.vue";
import router from "../router"
import {onMounted, ref} from "vue";
import {useSurveyStore} from "../stores/survey.js";

const surveyStore = useSurveyStore();

const handleSelect = () => {
  return null
}

const options = [
  {
    label: "Detail",
    key: "detail"
  }, {
    label: "Ubah",
    key: "ubah"
  }, {
    label: "Hapus",
    key: "hapus",
    disabled: true
  },
];

const showModal = ref(false);

onMounted(() => surveyStore.fetchSurveys());

</script>