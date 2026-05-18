<template>
  <div class="flex flex-wrap gap-3 items-center">
    <button
      v-for="p in palettes"
      :key="p.id"
      class="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all"
      :class="
        palette === p.id
          ? 'bg-white/10 ring-1 ring-white/20'
          : 'hover:bg-white/5'
      "
      @click="setPalette(p.id)"
    >
      <div
        class="w-4 h-4 rounded-full ring-1 ring-white/30"
        :style="{ backgroundColor: p.color }"
      />
      <span class="text-sm" style="color: var(--nav-text);">
        {{ p.name }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { usePalette } from '../hooks/usePalette';

const { palette, setPalette } = usePalette();

const palettes = [
  { id: 'amber', name: 'Ámbar', color: '#d97706' },
  { id: 'terracotta', name: 'Terracota', color: '#7a3535' },
  { id: 'blue', name: 'Azul corporativo', color: '#2563eb' },
  { id: 'editorial', name: 'Editorial', color: '#1a1a1a' },
  { id: 'tech', name: 'Tech', color: '#06b6d4' },
  { id: 'green', name: 'Verde Suave', color: '#588157' },
  { id: 'yellow', name: 'Amarillo Pastel', color: '#d4a373' },
  { id: 'red', name: 'Rojo Pastel', color: '#e53838' },
  { id: 'sunset', name: 'Sunset', color: '#f45b31' },
];
</script>