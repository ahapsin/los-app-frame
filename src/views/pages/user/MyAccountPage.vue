<template>
  <!-- <n-tabs type="line" animated>
    <n-tab-pane name="notification" tab="Notifikasi">
      {{ error }}
    </n-tab-pane>
    <n-tab-pane name="profile" tab="Profile">
      <ProfileSection />
    </n-tab-pane>
    <n-tab-pane name="password" tab="Password">
      <PasswordSection />
    </n-tab-pane>
  </n-tabs> -->
  <HAppBar title="Akun"/>
  <div class="p-4">
    <div class="flex bg-pr-50 justify-center rounded-xl">
      <n-avatar circle :size="120" class="top-14">
        SI PALING TESTER
      </n-avatar>
    </div>
    <div class="mt-14">
      <ProfileSection />
      <PasswordSection />
    </div>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
import { useEventSource } from '@vueuse/core'
import HAppBar from '../../../components/molecules/HAppBar.vue';

const { status, data, error, close } = useEventSource('https://dev.kspdjaya.id/tasks')

const ProfileSection = defineAsyncComponent(() =>
  import('./ProfileSection.vue')
);
const PasswordSection = defineAsyncComponent(() =>
  import('./PasswordSection.vue')
);

</script>