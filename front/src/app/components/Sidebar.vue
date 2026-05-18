<template>
  <div
    class="h-screen sticky top-0 left-0 z-[100] transition-all duration-300 flex flex-col shrink-0 shadow-xl"
    :style="{
      width: collapsed ? '80px' : '280px',
      backgroundColor: 'var(--sidebar-bg)',
    }"
  >
    <div class="p-6 flex items-center justify-between">
      <h2
        v-if="!collapsed"
        class="text-xl font-semibold whitespace-nowrap"
        style="color: var(--nav-text); font-family: var(--font-family-headings);"
      >
        Termopanel
      </h2>
      <button
        class="p-2 rounded-lg transition-colors"
        style="background-color: transparent; color: var(--nav-text);"
        @mouseenter="setToggleHover($event, true)"
        @mouseleave="setToggleHover($event, false)"
        @click="collapsed = !collapsed"
      >
        <ChevronRight v-if="collapsed" :size="20" />
        <ChevronLeft v-else :size="20" />
      </button>
    </div>

    <nav class="flex-1 px-3 overflow-y-auto">
      <RouterLink
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-3 py-3 mb-1 rounded-lg transition-all"
        :style="{
          backgroundColor: isActive(item.path) ? 'var(--accent)' : 'transparent',
          color: isActive(item.path) ? 'white' : 'var(--nav-text)',
        }"
        @mouseenter="setItemHover($event, item.path, true)"
        @mouseleave="setItemHover($event, item.path, false)"
      >
        <component :is="item.icon" :size="20" class="shrink-0" />
        <span v-if="!collapsed" class="text-sm whitespace-nowrap">{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="p-4 border-t" style="border-color: var(--sidebar-hover);">
      <div 
        class="flex items-center gap-3 mb-4" 
        :class="collapsed ? 'justify-center' : ''"
      >
        <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold shrink-0">
          {{ userName.charAt(0) }}
        </div>
        <div v-if="!collapsed" class="flex-1 min-w-0">
          <p class="text-sm font-bold truncate" style="color: var(--nav-text);">{{ userName }}</p>
          <p class="text-[11px] uppercase tracking-wider truncate opacity-70" style="color: var(--nav-text);">
            {{ role === 'admin' ? 'Administrador' : 'Vendedor' }}
          </p>
        </div>
      </div>

      <button
        class="flex items-center gap-3 w-full p-2 rounded-lg transition-colors text-red-400 hover:bg-red-400/10 hover:text-red-500"
        :class="collapsed ? 'justify-center' : ''"
        @click="handleLogout"
      >
        <LogOut :size="20" class="shrink-0" />
        <span v-if="!collapsed" class="text-sm font-medium whitespace-nowrap">Cerrar sesión</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  DollarSign,
  FileEdit,
  Settings,
  Calculator,
  LayoutDashboard,
  LogOut
} from 'lucide-vue-next';
import { useSession } from '../state/session';

const collapsed = ref(false);
const route = useRoute();
const router = useRouter();
const { role, setRole } = useSession();

const userName = computed(() => role.value === 'admin' ? 'Alejandro Gonzalez' : 'Ana Vendedora');

const roleValue = computed({
  get: () => role.value,
  set: (value) => setRole(value),
});

const roleBadge = computed(() => (role.value === 'admin' ? 'Admin' : 'Vend'));

const baseMenuItems = [
  { path: '/historial', icon: FileText, label: 'Historial' },
  { path: '/cotizar', icon: FileEdit, label: 'Nueva cotización' },
  { path: '/pagos', icon: DollarSign, label: 'Seguimiento de pagos' },
];

const adminMenuItems = [
  { path: '/diseno-pdf', icon: Settings, label: 'Administrar diseño PDF' },
  { path: '/precios', icon: Calculator, label: 'Bases de precios' },
  { path: '/administracion-usuarios', icon: FileText, label: 'Administración de usuarios' },
];

const menuItems = computed(() => {
  if (role.value === 'admin') {
    return [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      ...baseMenuItems,
      ...adminMenuItems
    ];
  }
  return baseMenuItems;
});

const isActive = (path: string) => route.path === path;

const setToggleHover = (event: MouseEvent, isHovering: boolean) => {
  const target = event.currentTarget as HTMLElement;
  target.style.backgroundColor = isHovering ? 'var(--sidebar-hover)' : 'transparent';
};

const setItemHover = (event: MouseEvent, path: string, isHovering: boolean) => {
  if (isActive(path)) {
    return;
  }
  const target = event.currentTarget as HTMLElement;
  target.style.backgroundColor = isHovering ? 'var(--sidebar-hover)' : 'transparent';
};

const handleLogout = () => {
  // Opcional: Aquí puedes agregar la lógica para limpiar el estado de la sesión si la tienes
  // session.setRole(null); 
  
  // Redirigir a la vista de login
  router.push('/login');
};
</script>