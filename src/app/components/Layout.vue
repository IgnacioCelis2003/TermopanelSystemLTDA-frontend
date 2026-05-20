<template>
  <div class="flex h-screen overflow-hidden">
    <Sidebar />

    <div class="flex-1 flex flex-col overflow-hidden">
      <main class="flex-1 overflow-auto p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import Sidebar from './Sidebar.vue';
</script>