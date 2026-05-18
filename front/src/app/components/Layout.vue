<template>
  <div class="flex h-screen overflow-hidden">
    <Sidebar />
    <div class="flex-1 flex flex-col overflow-hidden">
      <header
        class="px-6 py-4 flex items-center justify-end border-b"
        style="background-color: var(--surface); border-color: var(--border-color);"
      >
        <PaletteSwitcher />
      </header>
      <main class="flex-1 overflow-auto p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import Sidebar from './Sidebar.vue';
import PaletteSwitcher from './PaletteSwitcher.vue';
</script>
