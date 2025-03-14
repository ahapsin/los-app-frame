<template>
  <div class="p-2 rounded-2xl border bg-white">
    <n-tabs type="line" animated>
      <n-tab-pane name="notification" tab="Notifikasi">
        {{error}}
      </n-tab-pane>
      <n-tab-pane name="profile" tab="Profile"> <ProfileSection/> </n-tab-pane>
      <n-tab-pane name="password" tab="Password"> <PasswordSection/> </n-tab-pane>



    </n-tabs>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
import { useEventSource } from '@vueuse/core'

const { status, data, error, close } = useEventSource('https://dev.kspdjaya.id/tasks')

const ProfileSection = defineAsyncComponent(() =>
  import('./ProfileSection.vue')
);
const PasswordSection = defineAsyncComponent(() =>
  import('./PasswordSection.vue')
);

</script>