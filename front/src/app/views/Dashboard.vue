<template>
  <div class="pb-10">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-black tracking-tight" style="color: var(--text-primary);">Dashboard de Operaciones</h1>
        <p class="flex items-center gap-2 text-sm mt-1" style="color: var(--text-secondary);">
          <Activity :size="16" class="text-green-500" />
          Monitoreo de producción y flujo comercial en tiempo real.
        </p>
      </div>
      
      <div class="relative">
        <button 
          class="flex items-center gap-3 px-4 py-2.5 rounded-xl border font-bold text-sm transition-all hover:bg-gray-50"
          style="background-color: var(--surface); border-color: var(--border-color); color: var(--text-primary);"
        >
          <Calendar :size="18" style="color: var(--accent);" />
          <span>Últimos 30 Días</span>
          <ChevronDown :size="16" class="ml-2 opacity-50" />
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="p-6 rounded-2xl border shadow-sm" style="background-color: var(--surface); border-color: var(--border-color);">
        <div class="flex justify-between items-start mb-4">
          <p class="text-xs font-bold uppercase tracking-wider" style="color: var(--text-hint);">Saldo Pendiente Total</p>
          
        </div>
        <h2 class="text-3xl font-black mb-4" style="color: var(--text-primary);">$42.500.000</h2>
        <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
          <div class="h-full bg-orange-500 w-[65%] rounded-full"></div>
        </div>
      </div>

      <div class="p-6 rounded-2xl border shadow-sm" style="background-color: var(--surface); border-color: var(--border-color);">
        <div class="flex justify-between items-start mb-4">
          <p class="text-xs font-bold uppercase tracking-wider" style="color: var(--text-hint);">Cotizaciones Finalizadas</p>
          <span class="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-lg">
             42% Éxito
          </span>
        </div>
        <h2 class="text-3xl font-black mb-4" style="color: var(--text-primary);">128 Cotizaciones</h2>
        <div class="flex items-center gap-2">
          
        </div>
      </div>

      <div class="p-6 rounded-2xl border shadow-sm" style="background-color: var(--surface); border-color: var(--border-color);">
        <div class="flex justify-between items-start mb-4">
          <p class="text-xs font-bold uppercase tracking-wider" style="color: var(--text-hint);">Cotizaciones en Proceso</p>
          <span class="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg uppercase tracking-tighter">
            <Clock :size="12" /> En tiempo
          </span>
        </div>
        <h2 class="text-3xl font-black mb-4" style="color: var(--text-primary);">45 Cotizaciones</h2>
        <p class="text-[11px]" style="color: var(--text-secondary);">Distribución del turno: 40% en negociación final</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div class="p-8 rounded-3xl border shadow-sm flex flex-col" style="background-color: var(--surface); border-color: var(--border-color);">
        <div class="flex items-center justify-between mb-8">
          <h3 class="font-bold text-lg" style="color: var(--text-primary);">Materiales Más Vendidos</h3>
          <MoreHorizontal :size="20" class="text-gray-400 cursor-pointer" />
        </div>
        
        <div class="flex items-center justify-around flex-1">
          <div class="relative w-48 h-48">
            <svg class="w-full h-full transform -rotate-90">
              <circle cx="96" cy="96" r="80" stroke="currentColor" stroke-width="24" fill="transparent" class="text-gray-100" />
              <circle 
                cx="96" cy="96" r="80" stroke="var(--accent)" stroke-width="24" fill="transparent" 
                stroke-dasharray="502.6" stroke-dashoffset="125.6" 
                stroke-linecap="round"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-3xl font-black" style="color: var(--text-primary);">100%</span>
              <span class="text-[10px] uppercase font-bold text-gray-400">Total</span>
            </div>
          </div>

          <div class="space-y-6">
            <div class="flex items-center gap-4">
              <div class="w-3 h-3 rounded-full" style="background-color: var(--accent);"></div>
              <div>
                <p class="text-sm font-bold" style="color: var(--text-primary);">PVC Premium</p>
                <p class="text-xl font-black" style="color: var(--text-primary);">75%</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-3 h-3 rounded-full bg-gray-300"></div>
              <div>
                <p class="text-sm font-bold text-gray-400">Aluminio RPT</p>
                <p class="text-xl font-black text-gray-400">25%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="p-8 rounded-3xl border shadow-sm" style="background-color: var(--surface); border-color: var(--border-color);">
        <div class="flex items-center justify-between mb-8">
          <h3 class="font-bold text-lg" style="color: var(--text-primary);">Rendimiento por Tipo de Ventana</h3>
        </div>

        <div class="space-y-5">
          <div v-for="item in rendimiento" :key="item.tipo">
            <div class="flex justify-between text-xs font-bold mb-2 uppercase tracking-wide">
              <span style="color: var(--text-secondary);">{{ item.tipo }}</span>
              <span style="color: var(--text-primary);">{{ item.cantidad }} Unid.</span>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  class="h-full rounded-full transition-all duration-1000"
                  :style="{ width: item.porcentaje + '%', backgroundColor: item.color }"
                ></div>
              </div>
              <span class="text-[11px] font-black w-8" :style="{ color: item.color }">{{ item.porcentaje }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="p-8 rounded-3xl border shadow-sm" style="background-color: var(--surface); border-color: var(--border-color);">
        <div class="flex items-center justify-between mb-8">
          <h3 class="font-bold text-lg" style="color: var(--text-primary);">Top Colores</h3>
        </div>
        <div class="space-y-6">
          <div v-for="color in topColores" :key="color.nombre" class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl shadow-inner border border-gray-100" :style="{ backgroundColor: color.hex }"></div>
              <div>
                <p class="text-sm font-bold" style="color: var(--text-primary);">{{ color.nombre }}</p>
                <p class="text-[10px] uppercase font-bold text-gray-400">{{ color.ref }}</p>
              </div>
            </div>
            <span class="text-lg font-black" style="color: var(--text-primary);">{{ color.uso }}%</span>
          </div>
        </div>
      </div>

      <div class="lg:col-span-2 p-8 rounded-3xl border shadow-sm flex flex-col" style="background-color: var(--surface); border-color: var(--border-color);">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="font-bold text-lg" style="color: var(--text-primary);">Ventas por Mes</h3>
            <p class="text-xs text-gray-400">Cotizaciones finalizadas (últimos 6 meses)</p>
          </div>
          <div class="flex items-center gap-4 bg-gray-100 p-1 rounded-xl">
             <button class="px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white shadow-sm text-black">Producción</button>
          </div>
        </div>

        <div class="flex-1 relative min-h-[200px] mt-4">
           <svg class="w-full h-full overflow-visible" viewBox="0 0 600 150">
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.2" />
                  <stop offset="100%" stop-color="var(--accent)" stop-opacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,120 Q100,130 200,80 T400,40 T600,60 V150 H0 Z" fill="url(#lineGrad)" />
              <path d="M0,120 Q100,130 200,80 T400,40 T600,60" fill="none" stroke="var(--accent)" stroke-width="4" stroke-linecap="round" />
              <circle cx="200" cy="80" r="6" fill="white" stroke="var(--accent)" stroke-width="3" />
              <circle cx="400" cy="40" r="6" fill="white" stroke="var(--accent)" stroke-width="3" />
              <circle cx="600" cy="60" r="6" fill="white" stroke="var(--accent)" stroke-width="3" />
           </svg>
           <div class="flex justify-between mt-4 px-2 text-[10px] font-bold uppercase text-gray-300">
              <span>Ene</span><span>Feb</span><span>Mar</span><span>Abr</span><span>May</span><span>Jun</span>
           </div>
        </div>

        <div class="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
           <div class="flex items-center gap-2 text-green-500 font-bold">
              <TrendingUp :size="18" />
              <span class="text-sm">+28% de crecimiento acumulado</span>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  Activity, Calendar, ChevronDown, TrendingUp, ArrowUpRight, 
  Clock, Activity as MoreHorizontal, Calculator, TrendingDown,
  FileDown, TrendingUp as TrendingIcon 
} from 'lucide-vue-next';

// Mockup Data
const rendimiento = ref([
  { tipo: 'Corredera', cantidad: 84, porcentaje: 92, color: '#f97316' },
  { tipo: 'Abatir', cantidad: 52, porcentaje: 65, color: '#fb923c' },
  { tipo: 'Fijo', cantidad: 31, porcentaje: 40, color: '#fdba74' },
  { tipo: 'Proyectante', cantidad: 18, porcentaje: 15, color: '#fed7aa' },
]);

const topColores = ref([
  { nombre: 'Nogal Rústico', ref: 'Ref 7016', hex: '#4B3621', uso: 42 },
  { nombre: 'Blanco Puro', ref: 'RAL 9010', hex: '#FFFFFF', uso: 28 },
  { nombre: 'Antracita', ref: 'RAL 7016', hex: '#383E42', uso: 15 },
  { nombre: 'Negro Profundo', ref: 'RAL 9005', hex: '#1A1A1A', uso: 15 },
]);

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(amount);
};
</script>

<style scoped>
/* Transiciones suaves para las barras */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Scrollbar estética para las listas si crecen */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 10px;
}
</style>