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
              v-for="(item, index) in list.items"
              :key="index"
              class="flex items-center gap-3 px-3 py-2 rounded border text-sm group"
              style="background-color: var(--page-bg); border-color: var(--border-color);"
            >
              <div class="w-2 h-2 rounded-full" style="background-color: var(--text-secondary);"></div>
              <span class="flex-1 truncate" style="color: var(--text-primary);">{{ item }}</span>
              <button
                class="opacity-0 group-hover:opacity-100 transition-opacity"
                style="color: var(--error);"
                @click="removeItem(list.key, index)"
                title="Eliminar"
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
            <h3 class="font-bold text-lg" style="color: var(--text-primary);">Imágenes de Encabezado</h3>
          </div>
          <button class="px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-colors hover:bg-opacity-10" style="color: var(--accent); background-color: var(--accent-light, #fef3c7);">
            Cargar Nueva
          </button>
        </div>
        
        <div class="flex gap-4 overflow-x-auto pb-2">
          <div class="relative min-w-[120px] h-[80px] rounded border-2 border-orange-500 overflow-hidden cursor-pointer">
            <img src="https://via.placeholder.com/150/EEEEEE/999999?text=Encabezado+1" class="w-full h-full object-cover" alt="H1" />
            <div class="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <CheckCircle2 :size="24" class="text-white drop-shadow-md" />
            </div>
          </div>
          <div class="relative min-w-[120px] h-[80px] rounded border border-gray-300 overflow-hidden cursor-pointer opacity-70 hover:opacity-100">
            <img src="https://via.placeholder.com/150/DDDDDD/666666?text=Encabezado+2" class="w-full h-full object-cover" alt="H2" />
          </div>
        </div>
      </div>

      <div class="p-6 rounded-xl border" style="background-color: var(--surface); border-color: var(--border-color);">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-2">
            <LayoutTemplate :size="20" style="color: var(--accent);" />
            <h3 class="font-bold text-lg" style="color: var(--text-primary);">Imágenes de Pie de Página</h3>
          </div>
          <button class="px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-colors hover:bg-opacity-10" style="color: var(--accent); background-color: var(--accent-light, #fef3c7);">
            Cargar Nueva
          </button>
        </div>
        
        <div class="flex gap-4 overflow-x-auto pb-2 items-center h-[80px]">
          <div class="px-4 py-2 border rounded border-gray-200 text-xs text-gray-400 font-medium whitespace-nowrap cursor-pointer">
            Logos Certificaciones ISO
          </div>
          <div class="px-4 py-2 border-2 border-orange-500 rounded text-xs font-bold text-orange-700 whitespace-nowrap cursor-pointer">
            Marcas Aliadas
          </div>
          <div class="px-4 py-2 border rounded border-gray-200 bg-gray-50 text-xs text-gray-400 font-medium whitespace-nowrap cursor-pointer">
            Iconografía Seguridad
          </div>
        </div>
      </div>
    </div>

    <div class="fixed bottom-0 left-0 right-0 z-40 border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] p-4 flex items-center justify-between transition-colors bg-white" style="border-color: var(--border-color);">
      <div class="max-w-7xl mx-auto w-full flex items-center justify-between">
        
        <div class="flex items-center gap-2 text-xs italic text-gray-400">
          <Clock :size="14" />
          <span>Última modificación: Hace 14 minutos por Admin</span>
        </div>

        <div class="flex items-center gap-4">
          <button
            @click="openPdfModal"
            class="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider transition-colors hover:bg-gray-50"
            style="color: var(--text-secondary);"
          >
            Previsualizar PDF
          </button>
          <button
            class="flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider text-white transition-opacity hover:opacity-90 shadow-md"
            style="background-color: #925B16;" 
          >
            <Save :size="18" />
            <span>Guardar Cambios</span>
          </button>
        </div>
      </div>
    </div>

    <PdfPreviewModal 
      :isOpen="isPdfModalOpen" 
      :cotizacion="dummyCotizacion" 
      @close="closePdfModal" 
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
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
  Clock 
} from 'lucide-vue-next';
import PdfPreviewModal from '../components/PdfPreviewModal.vue';

// Estado del Modal
const isPdfModalOpen = ref(false);

const openPdfModal = () => {
  isPdfModalOpen.value = true;
};

const closePdfModal = () => {
  isPdfModalOpen.value = false;
};

// Objeto falso de cotización para que el modal renderice contenido válido al abrirse
const dummyCotizacion = ref({
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
      calidadMaterial: 'ALTA CALIDAD EN PCV EUROPEO®',
      descuento: 0,
      notas: 'Nota generada automáticamente para la previsualización.',
      items: [
        { id: 1, tipo: 'Paño Fijo', cristal: 'DVH 4/12/4', color: 'Blanco', ancho: 1200, alto: 1500, cantidad: 2, valorUnitario: 145000 }
      ]
    }
  ]
});

// Datos de la vista
const datosEmpresa = ref({
  nombre: 'Aperture Industrial Solutions',
  rut: 'B-12345678',
  direccion: 'Calle de la Forja 45, Polígono Industrial',
  telefono: '+34 912 345 678',
  correo: 'contacto@aperture.com',
  web: 'www.aperture.com',
});

const textoPresentacion = ref(
  'A CONTINUACIÓN ENTREGAMOS PROPUESTAS PARA SU PROYECTO DE CAMBIO DE VENTANAS DE TERMOPANEL PARA SU HOGAR. NOS PREOCUPAMOS DE TENER LA MEJOR RELACION PRECIO / CALIDAD DEL MERCADO.'
);

const materiales = ref([
  'Aluminio Extruido 6063',
  'Acero Inoxidable AISI 304',
  'Madera de Roble Tratada',
]);

const cristales = ref([
  'Doble Acristalamiento 4/12/4',
  'Laminado de Seguridad 6+6',
  'Bajo Emisivo Guardián Sun',
]);

const colores = ref([
  'Gris Antracita RAL 7016',
  'Blanco Satinado RAL 9010',
  'Efecto Madera Nogal',
]);

const nuevoItem = ref({ list: '', value: '' });

const listas = computed(() => [
  { title: 'Materiales', items: materiales.value, key: 'materiales' },
  { title: 'Cristales', items: cristales.value, key: 'cristales' },
  { title: 'Colores / Acabados', items: colores.value, key: 'colores' },
]);

const addItem = (list: string) => {
  if (nuevoItem.value.list !== list || !nuevoItem.value.value.trim()) {
    return;
  }

  if (list === 'materiales') {
    materiales.value.push(nuevoItem.value.value);
  } else if (list === 'cristales') {
    cristales.value.push(nuevoItem.value.value);
  } else if (list === 'colores') {
    colores.value.push(nuevoItem.value.value);
  }

  nuevoItem.value = { list: '', value: '' };
};

const removeItem = (list: string, index: number) => {
  if (list === 'materiales') {
    materiales.value.splice(index, 1);
  } else if (list === 'cristales') {
    cristales.value.splice(index, 1);
  } else if (list === 'colores') {
    colores.value.splice(index, 1);
  }
};
</script>