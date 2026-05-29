<template>
  <div class="pb-24">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--text-primary);">Administrar diseño PDF</h1>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      
      <div class="p-6 rounded-xl border flex flex-col" style="background-color: var(--surface); border-color: var(--border-color);">
        <div class="flex items-center gap-2 mb-6">
          <Building2 :size="20" style="color: var(--accent);" />
          <h3 class="font-bold text-lg" style="color: var(--text-primary);">Datos de la empresa</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
          <div class="md:col-span-2">
            <label class="block text-xs font-bold uppercase mb-1" style="color: var(--text-secondary);">Nombre Comercial</label>
            <input
              v-model="datosEmpresa.nombre"
              type="text"
              class="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-1"
              style="background-color: var(--page-bg); border-color: var(--border-color); color: var(--text-primary);"
            />
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs font-bold uppercase mb-1" style="color: var(--text-secondary);">Dirección Fiscal</label>
            <input
              v-model="datosEmpresa.direccion"
              type="text"
              class="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-1"
              style="background-color: var(--page-bg); border-color: var(--border-color); color: var(--text-primary);"
            />
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs font-bold uppercase mb-1" style="color: var(--text-secondary);">Email de Contacto</label>
            <input
              v-model="datosEmpresa.email_contacto"
              type="text"
              class="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-1"
              style="background-color: var(--page-bg); border-color: var(--border-color); color: var(--text-primary);"
            />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase mb-1" style="color: var(--text-secondary);">NIT / CIF / RUT</label>
            <input
              v-model="datosEmpresa.rut"
              type="text"
              class="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-1"
              style="background-color: var(--page-bg); border-color: var(--border-color); color: var(--text-primary);"
            />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase mb-1" style="color: var(--text-secondary);">Teléfono</label>
            <input
              v-model="datosEmpresa.telefono"
              type="text"
              class="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-1"
              style="background-color: var(--page-bg); border-color: var(--border-color); color: var(--text-primary);"
            />
          </div>
        </div>
      </div>

      <div class="p-6 rounded-xl border flex flex-col" style="background-color: var(--surface); border-color: var(--border-color);">
        <div class="flex items-center gap-2 mb-6">
          <AlignLeft :size="20" style="color: var(--accent);" />
          <h3 class="font-bold text-lg" style="color: var(--text-primary);">Texto de presentación</h3>
        </div>
        <div class="flex-1 flex flex-col">
          <label class="block text-xs font-bold uppercase mb-1" style="color: var(--text-secondary);">Mensaje de introducción (PDF)</label>
          <textarea
            v-model="textoPresentacion"
            class="w-full flex-1 px-4 py-3 rounded-lg border text-sm resize-none focus:outline-none focus:ring-1 leading-relaxed"
            style="background-color: var(--page-bg); border-color: var(--border-color); color: var(--text-primary);"
          ></textarea>
        </div>
      </div>
    </div>

    <div class="flex justify-end mb-6">
      <button
        class="flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider text-white transition-opacity hover:opacity-90 shadow-md disabled:opacity-50"
        style="background-color: #925B16;"
        :disabled="saving"
        @click="saveChanges"
      >
        <Save :size="18" />
        <span>{{ saving ? 'Guardando empresa...' : 'Guardar datos empresa' }}</span>
      </button>
    </div>

    <div class="p-6 rounded-xl border mb-6" style="background-color: var(--surface); border-color: var(--border-color);">
      <div class="flex items-center gap-2 mb-6">
        <ListTree :size="20" style="color: var(--accent);" />
        <h3 class="font-bold text-lg" style="color: var(--text-primary);">Configuración de Listas Maestras</h3>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="list in listas" :key="list.key">
          <div class="flex justify-between items-center mb-4 border-b pb-2" style="border-color: var(--border-color);">
            <h4 class="text-xs font-bold uppercase" style="color: var(--text-secondary);">{{ list.title }}</h4>
            <button 
              @click="nuevoItem.list = list.key; nuevoItem.value = ''"
              class="p-1 rounded-full hover:bg-gray-100 transition-colors" 
              style="color: var(--accent);"
            >
              <PlusCircle :size="18" />
            </button>
          </div>
          
          <ul class="space-y-2 mb-3">
            <li
              v-for="item in list.items"
              :key="item.id"
              class="flex items-center gap-3 px-3 py-2 rounded border text-sm group"
              style="background-color: var(--page-bg); border-color: var(--border-color);"
            >
              <div class="w-2 h-2 rounded-full" style="background-color: var(--text-secondary);"></div>

              <span class="flex-1 truncate" style="color: var(--text-primary);">
                {{ item.label }}
              </span>

              <button
                class="opacity-0 group-hover:opacity-100 transition-opacity"
                style="color: var(--error);"
                title="Eliminar"
                @click="removeItem(list.key, item)"
              >
                <X :size="14" />
              </button>
            </li>
          </ul>

          <div v-if="nuevoItem.list === list.key" class="flex items-center gap-2 mt-2">
            <input
              v-model="nuevoItem.value"
              type="text"
              class="flex-1 px-3 py-1.5 rounded border text-sm focus:outline-none"
              style="background-color: white; border-color: var(--border-color); color: var(--text-primary);"
              placeholder="Escribe y presiona enter..."
              @keyup.enter="addItem(list.key)"
            />
            <button @click="addItem(list.key)" class="text-sm font-medium hover:opacity-80" style="color: var(--accent);">
              <Check :size="18" />
            </button>
            <button @click="nuevoItem.list = ''" class="text-sm font-medium hover:opacity-80" style="color: var(--text-secondary);">
              <X :size="18" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <div class="p-6 rounded-xl border" style="background-color: var(--surface); border-color: var(--border-color);">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-2">
            <ImageIcon :size="20" style="color: var(--accent);" />
            <h3 class="font-bold text-lg" style="color: var(--text-primary);">Imágenes de Logo</h3>
          </div>
          <button
            class="px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-colors hover:bg-opacity-10"
            style="color: var(--accent); background-color: var(--accent-light, #fef3c7);"
            @click="headerInput?.click()"
          >
            Cargar Nueva
          </button>

          <input
            ref="headerInput"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            class="hidden"
            @change="uploadEmpresaImagen('header', $event)"
          >
        </div>
        
        <div class="flex gap-4 overflow-x-auto pb-2">
          <div
            class="relative min-w-[220px] h-[100px] rounded border-2 overflow-hidden cursor-pointer bg-gray-50 flex items-center justify-center"
            :class="headerImageUrl && !headerImageError ? 'border-orange-500' : 'border-dashed border-gray-300'"
            @click="headerInput?.click()"
          >
            <img
              v-if="headerImageUrl && !headerImageError"
              :src="headerImageUrl"
              class="w-full h-full object-contain bg-white"
              alt="Header empresa"
              @error="headerImageError = true"
            >

            <div
              v-else
              class="flex flex-col items-center justify-center gap-2 text-xs text-gray-400 px-4 text-center"
            >
              <ImageIcon :size="28" class="text-gray-300" />
              <span>Sin imagen de logo</span>
              <span class="text-[11px]">Haz clic para cargar una imagen</span>
            </div>

            <div
              v-if="headerImageUrl && !headerImageError"
              class="absolute top-1 right-1 rounded-full bg-white shadow p-0.5"
            >
              <CheckCircle2 :size="18" class="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div class="p-6 rounded-xl border" style="background-color: var(--surface); border-color: var(--border-color);">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-2">
            <LayoutTemplate :size="20" style="color: var(--accent);" />
            <h3 class="font-bold text-lg" style="color: var(--text-primary);">Imágenes de Pie de Página</h3>
          </div>
          <button
            class="px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-colors hover:bg-opacity-10"
            style="color: var(--accent); background-color: var(--accent-light, #fef3c7);"
            @click="footerInput?.click()"
          >
            Cargar Nueva
          </button>

          <input
            ref="footerInput"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            class="hidden"
            @change="uploadEmpresaImagen('footer', $event)"
          >
        </div>
        
        <div class="flex gap-4 overflow-x-auto pb-2 items-center h-[110px]">
          <div
            class="relative min-w-[220px] h-[100px] rounded border-2 overflow-hidden cursor-pointer bg-gray-50 flex items-center justify-center"
            :class="footerImageUrl && !footerImageError ? 'border-orange-500' : 'border-dashed border-gray-300'"
            @click="footerInput?.click()"
          >
            <img
              v-if="footerImageUrl && !footerImageError"
              :src="footerImageUrl"
              class="w-full h-full object-contain bg-white"
              alt="Footer empresa"
              @error="footerImageError = true"
            >

            <div
              v-else
              class="flex flex-col items-center justify-center gap-2 text-xs text-gray-400 px-4 text-center"
            >
              <ImageIcon :size="28" class="text-gray-300" />
              <span>Sin imagen de pie de página</span>
              <span class="text-[11px]">Haz clic para cargar una imagen</span>
            </div>

            <div
              v-if="footerImageUrl && !footerImageError"
              class="absolute top-1 right-1 rounded-full bg-white shadow p-0.5"
            >
              <CheckCircle2 :size="18" class="text-orange-600" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="fixed bottom-0 left-0 right-0 z-40 border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] p-4 flex items-center justify-between transition-colors bg-white" style="border-color: var(--border-color);">
      <div class="max-w-7xl mx-auto w-full flex items-center justify-between">
        <!--
        <div class="flex items-center gap-2 text-xs italic text-gray-400">
          <Clock :size="14" />
          <span>Última modificación: Hace 14 minutos por Admin</span>
        </div>
        -->

        <!-- Quitar justify-end w-full al volver a poner la seccion anterior de ultima modificación-->
        <div class="flex items-center gap-4 justify-end w-full">
          <button
            @click="openPdfModal"
            class="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider transition-colors hover:bg-gray-50"
            style="color: var(--text-secondary);"
          >
            Previsualizar PDF
          </button>
        </div>
      </div>
    </div>

    <PdfPreviewModal 
      :isOpen="isPdfModalOpen" 
      :cotizacion="dummyCotizacion"
      :empresa="empresaActual"
      @close="closePdfModal" 
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
  Save,
  Building2,
  AlignLeft,
  ListTree,
  PlusCircle,
  X,
  Check,
  Image as ImageIcon,
  LayoutTemplate,
  CheckCircle2,
  Clock,
} from 'lucide-vue-next';

import PdfPreviewModal from '../components/PdfPreviewModal.vue';

import { empresaService, type EmpresaImagenTipo } from '../services/empresaService';
import type { Empresa } from '../services/empresaService';
import { colorService } from '../services/colorService';
import { tipoPropuestaService } from '../services/tipoPropuestaService';
import { tipoTermopanelService } from '../services/tipoTermopanelService';

type ListaKey = 'materiales' | 'cristales' | 'colores';

type ListaItem = {
  id: number;
  label: string;
};

const loading = ref(false);
const saving = ref(false);

// Estado del Modal
const isPdfModalOpen = ref(false);

const openPdfModal = () => {
  isPdfModalOpen.value = true;
};

const closePdfModal = () => {
  isPdfModalOpen.value = false;
};

const empresaActual = ref<Empresa | null>(null);

// Datos empresa
const datosEmpresa = ref({
  rut: '',
  nombre: '',
  direccion: '',
  telefono: '',
  email_contacto: '',
  nombre_contacto: '',
  descuento_aluminio_estandar: 0,
  factor_iva_perfil: 0,
  empresa_ins: 0,
});

const textoPresentacion = ref('');

// Listas maestras
const materiales = ref<ListaItem[]>([]);
const cristales = ref<ListaItem[]>([]);
const colores = ref<ListaItem[]>([]);

const nuevoItem = ref<{
  list: '' | ListaKey;
  value: string;
}>({
  list: '',
  value: '',
});

const listas = computed(() => [
  { title: 'Materiales', items: materiales.value, key: 'materiales' as const },
  { title: 'Cristales', items: cristales.value, key: 'cristales' as const },
  { title: 'Colores / Acabados', items: colores.value, key: 'colores' as const },
]);

// Imágenes
const headerInput = ref<HTMLInputElement | null>(null);
const footerInput = ref<HTMLInputElement | null>(null);

const headerImageUrl = ref('');
const footerImageUrl = ref('');

const headerImageError = ref(false);
const footerImageError = ref(false);

const refreshImageUrls = () => {
  headerImageError.value = false;
  footerImageError.value = false;

  headerImageUrl.value = empresaService.getEmpresaImagenUrlNoCache('header');
  footerImageUrl.value = empresaService.getEmpresaImagenUrlNoCache('footer');
};

const loadEmpresa = async () => {
  const empresa = await empresaService.getEmpresa();

  empresaActual.value = empresa;

  datosEmpresa.value = {
    rut: empresa.rut ?? '',
    nombre: empresa.nombre ?? '',
    direccion: empresa.direccion ?? '',
    telefono: empresa.telefono ?? '',
    email_contacto: empresa.email_contacto ?? '',
    nombre_contacto: empresa.nombre_contacto ?? '',
    descuento_aluminio_estandar: empresa.descuento_aluminio_estandar ?? 0,
    factor_iva_perfil: empresa.factor_iva_perfil ?? 0,
    empresa_ins: empresa.empresa_ins ?? 0,
  };

  textoPresentacion.value = empresa.texto_presentacion ?? '';
};

const loadListasMaestras = async () => {
  const [tiposPropuesta, tiposTermopanel, listaColores] = await Promise.all([
    tipoPropuestaService.getTiposPropuesta(),
    tipoTermopanelService.getTiposTermopanel(),
    colorService.getColors(),
  ]);

  materiales.value = tiposPropuesta.map((item) => ({
    id: item.id,
    label: item.material,
  }));

  cristales.value = tiposTermopanel.map((item) => ({
    id: item.id,
    label: item.nombre,
  }));

  colores.value = listaColores.map((item) => ({
    id: item.id,
    label: item.nombre,
  }));
};

const loadData = async () => {
  loading.value = true;

  try {
    await Promise.all([
      loadEmpresa(),
      loadListasMaestras(),
    ]);

    refreshImageUrls();
  } finally {
    loading.value = false;
  }
};

const addItem = async (list: ListaKey) => {
  const value = nuevoItem.value.value.trim();

  if (nuevoItem.value.list !== list || !value) {
    return;
  }

  if (list === 'materiales') {
    await tipoPropuestaService.createTipoPropuesta({
      material: value,
    });
  }

  if (list === 'cristales') {
    await tipoTermopanelService.createTipoTermopanel({
      nombre: value,
      factor: 1,
      libre: false,
      especial: false,
    });
  }

  if (list === 'colores') {
    await colorService.createColor({
      nombre: value,
    });
  }

  nuevoItem.value = { list: '', value: '' };
  await loadListasMaestras();
};

const removeItem = async (list: ListaKey, item: ListaItem) => {
  if (!confirm(`¿Eliminar "${item.label}"?`)) {
    return;
  }

  if (list === 'materiales') {
    await tipoPropuestaService.deleteTipoPropuesta(item.id);
  }

  if (list === 'cristales') {
    await tipoTermopanelService.deleteTipoTermopanel(item.id);
  }

  if (list === 'colores') {
    await colorService.deleteColor(item.id);
  }

  await loadListasMaestras();
};

const saveChanges = async () => {
  saving.value = true;

  try {
    await empresaService.updateEmpresa({
      rut: datosEmpresa.value.rut,
      nombre: datosEmpresa.value.nombre,
      direccion: datosEmpresa.value.direccion,
      telefono: datosEmpresa.value.telefono,
      email_contacto: datosEmpresa.value.email_contacto,
      nombre_contacto: datosEmpresa.value.nombre_contacto,
      texto_presentacion: textoPresentacion.value,
      descuento_aluminio_estandar: datosEmpresa.value.descuento_aluminio_estandar,
      factor_iva_perfil: datosEmpresa.value.factor_iva_perfil,
      empresa_ins: datosEmpresa.value.empresa_ins,
    });

    await loadEmpresa();
  } finally {
    saving.value = false;
  }
};

const uploadEmpresaImagen = async (
  tipo: EmpresaImagenTipo,
  event: Event,
) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) {
    return;
  }

  try {
    await empresaService.uploadEmpresaImagen(tipo, file);

    input.value = '';
    refreshImageUrls();
    await loadEmpresa();
  } catch (error) {
    console.error(error);
    alert('Error al subir la imagen');
  }
};

// Objeto falso de cotización para previsualización
const dummyCotizacion = computed(() => ({
  id: 0,
  numero: '0000',
  fecha: '2026-04-29',
  hora: '14:00',
  aceptada: false,
  cliente: 'Cliente de Prueba',
  direccion: 'Av. Providencia 1234, Santiago',
  telefono: '+56 9 1234 5678',
  correo: 'cliente@prueba.cl',
  transporte: 50000,
  manoObra: 100000,
  margenGlobal: 30,
  propuestas: [
    {
      id: 1,
      titulo: 'Propuesta de Prueba',
      calidadMaterial: materiales.value[0]?.label ?? 'ALTA CALIDAD EN PVC EUROPEO®',
      descuento: 0,
      notas: 'Nota generada automáticamente para la previsualización.',
      items: [
        {
          id: 1,
          tipo: 'Paño Fijo',
          cristal: cristales.value[0]?.label ?? 'TERMOPANEL 20 mm (5+10+5) INCOLORO',
          color: colores.value[0]?.label ?? 'BLANCO',
          ancho: 1200,
          alto: 1500,
          cantidad: 2,
          valorUnitario: 145000,
        },
      ],
    },
  ],
}));

onMounted(loadData);
</script>