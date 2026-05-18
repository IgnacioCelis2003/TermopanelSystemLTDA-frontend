<template>
  <div class="pb-24">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--text-primary);">{{ title }}</h1>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      
      <div class="lg:col-span-2 p-6 rounded-xl border" style="background-color: var(--surface); border-color: var(--border-color);">
        <div class="flex items-center gap-2 mb-6">
          <User :size="20" style="color: var(--accent);" />
          <h3 class="font-medium" style="color: var(--text-primary);">Sección A: Datos del Cliente</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold uppercase mb-2" style="color: var(--text-secondary);">
              Nombre del Cliente / Empresa
            </label>
            <input
              v-model="clienteNombre"
              type="text"
              placeholder="Ej: Constructora Horizonte S.A."
              class="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none"
              style="background-color: white; border-color: var(--border-color); color: var(--text-primary);"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold uppercase mb-2" style="color: var(--text-secondary);">
              Correo Electrónico
            </label>
            <input
              v-model="clienteCorreo"
              type="email"
              placeholder="contacto@empresa.com"
              class="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none"
              style="background-color: white; border-color: var(--border-color); color: var(--text-primary);"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold uppercase mb-2" style="color: var(--text-secondary);">
              Dirección de Obra
            </label>
            <input
              v-model="clienteDireccion"
              type="text"
              placeholder="Av. Industrial 405, Sector Norte"
              class="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none"
              style="background-color: white; border-color: var(--border-color); color: var(--text-primary);"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold uppercase mb-2" style="color: var(--text-secondary);">
              Teléfono de Contacto
            </label>
            <input
              v-model="clienteTelefono"
              type="tel"
              placeholder="+56 9 1234 5678"
              class="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none"
              style="background-color: white; border-color: var(--border-color); color: var(--text-primary);"
            />
          </div>
        </div>
      </div>

      <div class="p-6 rounded-xl border" style="background-color: var(--surface); border-color: var(--border-color);">
        <div class="flex items-center gap-2 mb-6">
          <Settings :size="20" style="color: var(--accent);" />
          <h3 class="font-medium" style="color: var(--text-primary);">Valores Generales</h3>
        </div>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <label class="text-xs font-semibold uppercase" style="color: var(--text-secondary);">
              Transporte e instalación
            </label>
            <div class="relative w-32">
              <span class="absolute left-3 top-2.5 text-sm" style="color: var(--text-hint);">$</span>
              <input
                v-model.number="transporte"
                type="number"
                class="w-full pl-8 pr-3 py-2 rounded-lg border text-sm text-right focus:outline-none"
                style="background-color: white; border-color: var(--border-color); color: var(--text-primary);"
              />
            </div>
          </div>
          <div class="flex items-center justify-between">
            <label class="text-xs font-semibold uppercase" style="color: var(--text-secondary);">
              Instalación
            </label>
            <div class="relative w-32">
              <span class="absolute left-3 top-2.5 text-sm" style="color: var(--text-hint);">$</span>
              <input
                v-model.number="manoObra"
                type="number"
                class="w-full pl-8 pr-3 py-2 rounded-lg border text-sm text-right focus:outline-none"
                style="background-color: white; border-color: var(--border-color); color: var(--text-primary);"
              />
            </div>
          </div>
          <div class="flex items-center justify-between">
            <label class="text-xs font-semibold uppercase" style="color: var(--text-secondary);">
              Margen global (%)
            </label>
            <div class="relative w-32">
              <input
                v-model.number="margenGlobal"
                type="number"
                class="w-full pr-8 pl-3 py-2 rounded-lg border text-sm text-right focus:outline-none"
                style="background-color: white; border-color: var(--border-color); color: var(--text-primary);"
              />
              <span class="absolute right-3 top-2.5 text-sm" style="color: var(--text-hint);">%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between mb-4">
      <h3 class="font-bold text-lg" style="color: var(--text-primary);">Sección B: Propuestas Comerciales</h3>
      <button
        v-if="propuestas.length < 3"
        class="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors font-medium text-sm"
        style="background-color: white; border-color: var(--accent); color: var(--accent);"
        @click="addPropuesta"
      >
        <Plus :size="16" />
        <span>Agregar Propuesta</span>
      </button>
    </div>

    <div class="space-y-8">
      <div
        v-for="(propuesta, idx) in propuestas"
        :key="propuesta.id"
        class="rounded-xl border overflow-hidden"
        style="background-color: var(--surface); border-color: var(--border-color);"
      >
        <div class="px-6 py-4 border-b flex items-center justify-between" style="border-color: var(--border-color); background-color: var(--page-bg);">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style="background-color: var(--accent);">
              {{ String(idx + 1).padStart(2, '0') }}
            </div>
            <input
               v-model="propuesta.titulo"
               :disabled="idx === 0"
               type="text"
               class="bg-transparent border-none text-lg font-medium focus:outline-none focus:ring-1 rounded px-2 w-80"
               style="color: var(--text-primary);"
            />
          </div>
          <div class="flex items-center gap-2">
            <button
              title="Eliminar propuesta"
              class="p-2 rounded hover:bg-red-50 transition-colors"
              style="color: var(--error);"
              @click="deletePropuesta(idx)"
              v-if="idx > 0"
            >
              <Trash2 :size="18" />
            </button>
          </div>
        </div>

        <div class="p-6">
          <div class="mb-4">
            <label class="block text-xs font-semibold uppercase mb-2" style="color: var(--text-secondary);">
              Calidad y Material
            </label>
            <select
              v-model="propuesta.calidadMaterial"
              class="w-full md:w-1/2 px-4 py-2 rounded-lg border text-sm font-medium focus:outline-none"
              style="background-color: white; border-color: var(--border-color); color: var(--text-primary);"
            >
              <option v-for="calidad in calidades" :key="calidad" :value="calidad">
                {{ calidad }}
              </option>
            </select>
          </div>

          <div class="overflow-x-auto mb-2 rounded-lg border" style="border-color: var(--border-color);">
            <table class="w-full">
              <thead>
                <tr style="background-color: var(--page-bg); color: var(--text-primary);">
                  <th class="text-left px-4 py-3 text-xs uppercase font-bold">Tipo</th>
                  <th class="text-left px-4 py-3 text-xs uppercase font-bold">Cristal</th>
                  <th class="text-left px-4 py-3 text-xs uppercase font-bold">Color</th>
                  <th class="text-center px-4 py-3 text-xs uppercase font-bold">Ancho (mm)</th>
                  <th class="text-center px-4 py-3 text-xs uppercase font-bold">Alto (mm)</th>
                  <th class="text-center px-4 py-3 text-xs uppercase font-bold">Cant.</th>
                  <th class="text-right px-4 py-3 text-xs uppercase font-bold">Unitario</th>
                  <th class="text-right px-4 py-3 text-xs uppercase font-bold">Total</th>
                  <th class="w-10"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in propuesta.items"
                  :key="item.id"
                  class="border-t transition-colors"
                  style="background-color: white; border-color: var(--border-color);"
                >
                  <td class="px-3 py-3">
                    <select
                      v-model="item.tipo"
                      class="w-full px-2 py-1.5 rounded border text-sm"
                      style="background-color: white; border-color: transparent; color: var(--text-primary);"
                    >
                      <option v-for="t in tiposVentana" :key="t" :value="t">{{ t }}</option>
                    </select>
                  </td>
                  <td class="px-3 py-3">
                    <select
                      v-model="item.cristal"
                      class="w-full px-2 py-1.5 rounded border text-sm"
                      style="background-color: white; border-color: transparent; color: var(--text-primary);"
                    >
                      <option v-for="c in cristales" :key="c" :value="c">{{ c }}</option>
                    </select>
                  </td>
                  <td class="px-3 py-3">
                    <select
                      v-model="item.color"
                      class="w-full px-2 py-1.5 rounded border text-sm"
                      style="background-color: white; border-color: transparent; color: var(--text-primary);"
                    >
                      <option v-for="c in colores" :key="c" :value="c">{{ c }}</option>
                    </select>
                  </td>
                  <td class="px-3 py-3">
                    <input
                      v-model.number="item.ancho"
                      :disabled="idx > 0"
                      type="number"
                      class="w-20 px-2 py-1.5 rounded border text-sm text-center mx-auto block"
                      style="background-color: white; border-color: transparent; color: var(--text-primary);"
                    />
                  </td>
                  <td class="px-3 py-3">
                    <input
                      v-model.number="item.alto"
                      :disabled="idx > 0"
                      type="number"
                      class="w-20 px-2 py-1.5 rounded border text-sm text-center mx-auto block"
                      style="background-color: white; border-color: transparent; color: var(--text-primary);"
                    />
                  </td>
                  <td class="px-3 py-3">
                    <input
                      v-model.number="item.cantidad"
                      :disabled="idx > 0"
                      type="number"
                      class="w-16 px-2 py-1.5 rounded border text-sm text-center mx-auto block"
                      style="background-color: white; border-color: transparent; color: var(--text-primary);"
                    />
                  </td>
                  <td class="px-3 py-3 text-right text-sm font-medium" style="color: var(--text-primary);">
                    {{ formatCurrency(item.valorUnitario) }}
                  </td>
                  <td class="px-3 py-3 text-right text-sm font-bold" style="color: var(--accent);">
                    {{ formatCurrency(item.valorUnitario * item.cantidad) }}
                  </td>
                  <td class="px-2 py-3 text-center">
                    <button
                      class="p-1 rounded transition-colors opacity-60 hover:opacity-100"
                      style="color: var(--error);"
                      @click="removeItem(propuesta.id, item.id)"
                      v-if="idx === 0"
                    >
                      <Trash2 :size="16" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <button
            v-if="idx === 0"
            class="flex items-center gap-1 text-sm font-medium mb-6 transition-opacity hover:opacity-80"
            style="color: var(--accent);"
            @click="addItem(propuesta.id)"
          >
            <Plus :size="16" />
            <span>Añadir fila</span>
          </button>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <label class="block text-xs font-semibold uppercase mb-2" style="color: var(--text-secondary);">
                Notas de la propuesta
              </label>
              <textarea
                v-model="propuesta.notas"
                rows="4"
                placeholder="Especificaciones de herrajes, tiempos de entrega, etc..."
                class="w-full px-4 py-3 rounded-lg border text-sm resize-none focus:outline-none"
                style="background-color: white; border-color: var(--border-color); color: var(--text-primary);"
              ></textarea>
            </div>

            <div class="space-y-3">
              <div class="flex justify-between items-center text-sm">
                <span style="color: var(--text-secondary);">Subtotal Ítems</span>
                <span class="font-medium" style="color: var(--text-primary);">{{ formatCurrency(calcularSubtotal(propuesta)) }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span style="color: var(--text-secondary);">Transporte e instalación</span>
                <span class="font-medium" style="color: var(--text-primary);">{{ formatCurrency(transporte + manoObra) }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span style="color: var(--text-secondary);">Descuento</span>
                <div class="relative w-32">
                  <span class="absolute left-3 top-1 text-sm" style="color: var(--text-hint);">$</span>
                  <input
                    v-model.number="propuesta.descuento"
                    type="number"
                    min="0"
                    class="w-full pl-7 pr-2 py-1 rounded border text-right focus:outline-none"
                    style="background-color: white; border-color: var(--border-color); color: var(--text-primary);"
                  />
                </div>
              </div>
              <div class="pt-3 mt-3 border-t flex justify-between items-center" style="border-color: var(--border-color);">
                <span class="font-semibold" style="color: var(--text-primary);">Total Propuesta</span>
                <span class="font-bold text-lg" style="color: var(--accent);">{{ formatCurrency(calcularTotal(propuesta)) }}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    
    <div class="fixed bottom-0 left-0 right-0 z-40 border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] p-4 flex items-center justify-between transition-colors" 
         style="background-color: var(--surface); border-color: var(--border-color);">
      <div class="max-w-7xl mx-auto w-full flex items-center justify-between">
        <div class="flex items-center gap-12">
          
          <div>
            <div class="text-xs uppercase font-bold tracking-wider mb-1" style="color: var(--text-secondary);">Resumen General</div>
            <div class="flex gap-6 text-sm">
              <div>
                <span class="opacity-70 mr-2" style="color: var(--text-secondary);">Propuestas</span> 
                <span class="font-medium" style="color: var(--text-primary);">{{ propuestas.length }} / 3</span>
              </div>
              <div>
                <span class="opacity-70 mr-2" style="color: var(--text-secondary);">Ítems Totales</span> 
                <span class="font-medium" style="color: var(--text-primary);">{{ totalItemsBase }}</span>
              </div>
            </div>
          </div>

          <div class="hidden md:block w-px h-10" style="background-color: var(--border-color);"></div>

          <div>
            <div class="text-xs uppercase font-bold tracking-wider mb-1" style="color: var(--accent);">Presupuesto Referencial (Base)</div>
            <div class="text-3xl font-bold" style="color: var(--text-primary);">
              {{ formatCurrency(presupuestoBase) }}
              <span class="text-sm font-medium opacity-70 ml-1" style="color: var(--text-secondary);">CLP</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <button
            @click="openPdfModal"
            class="flex items-center gap-2 px-5 py-3 rounded-lg border font-medium transition-colors"
            style="background-color: var(--surface); border-color: var(--border-color); color: var(--text-primary);"
          >
            <Eye :size="18" />
            <span>Previsualizar</span>
          </button>
          <button
            class="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-opacity hover:opacity-90"
            style="background-color: var(--accent);"
            @click="handleGuardar"
          >
            <Send :size="18" />
            <span>Finalizar Cotización</span>
          </button>
        </div>
      </div>
    </div>

    <PdfPreviewModal 
      :isOpen="isPdfModalOpen" 
      :cotizacion="currentCotizacionFullData" 
      @close="closePdfModal" 
    />

  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Eye, Plus, Trash2, User, Settings, Send } from 'lucide-vue-next';
import { useCotizaciones, type Cotizacion } from '../state/cotizaciones';
import PdfPreviewModal from '../components/PdfPreviewModal.vue';

type Item = {
  id: number;
  tipo: string;
  cristal: string;
  color: string;
  ancho: number;
  alto: number;
  cantidad: number;
  valorUnitario: number;
};

type PropuestaLocal = {
  id: number;
  titulo: string;
  calidadMaterial: string;
  items: Item[];
  descuento: number;
  notas: string;
};

const route = useRoute();
const router = useRouter();
const {
  getCotizacionById,
  saveCotizacion,
  createBlankCotizacion,
} = useCotizaciones();

// Estado del Modal PDF
const isPdfModalOpen = ref(false);

const openPdfModal = () => {
  isPdfModalOpen.value = true;
};

const closePdfModal = () => {
  isPdfModalOpen.value = false;
};

// Datos de la cotización
const cotizacionId = ref<number | null>(null);
const numero = ref('');
const fecha = ref('');
const hora = ref('');
const aceptada = ref(false);

const clienteNombre = ref('');
const clienteDireccion = ref('');
const clienteTelefono = ref('');
const clienteCorreo = ref('');

const transporte = ref(0);
const manoObra = ref(0);
const margenGlobal = ref(15);

const propuestas = ref<PropuestaLocal[]>([]);

const tiposVentana = [
  'Paño Fijo',
  'Ventana Cc',
  'Marco fijo',
  'Corredera chica',
  'Corredera grande',
  'Abatir',
  'Proyectante',
  'Puerta',
];

const cristales = [
  'Laminado 3+3',
  'DVH 4/12/4',
  '20mm (5+10+5) Incoloro',
  '20mm (4+10+6) LAM ACÚSTICO',
  '18mm (4+8+6) LAM ACÚSTICO INCOLORO',
  '20mm (5+10+5) Satén',
  '18mm (4+10+4) Incoloro',
  '18mm (4+10+4) Satén',
];

const colores = ['Titanio', 'Blanco', 'Nogal', 'Antracita', 'Negro'];

const calidades = [
  'ALTA CALIDAD EN PCV EUROPEO®',
  'ALTA CALIDAD EN ALUMINIO PREMIUM XELENTIA®',
  'MEDIA CALIDAD EN ALUMINIO BÁSICO AL25 / AL43'
];

const getUniqueId = () => Date.now() + Math.floor(Math.random() * 10000);

const addItem = (propuestaId: number) => {
  const propuesta = propuestas.value.find((p) => p.id === propuestaId);
  if (!propuesta) return;

  propuesta.items.push({
    id: getUniqueId(),
    tipo: 'Paño Fijo',
    cristal: 'DVH 4/12/4',
    color: 'Titanio',
    ancho: 1000,
    alto: 1000,
    cantidad: 1,
    valorUnitario: 92000,
  });
};

const removeItem = (propuestaId: number, itemId: number) => {
  const propuesta = propuestas.value.find((p) => p.id === propuestaId);
  if (!propuesta) return;

  propuesta.items = propuesta.items.filter((item) => item.id !== itemId);
};

const buildAlternativeFromBase = (proposalNumber: number): PropuestaLocal => {
  const base = propuestas.value[0];
  const sourceItems = base?.items ?? [];

  return {
    id: getUniqueId(),
    titulo: `Propuesta ${proposalNumber}`,
    calidadMaterial: base?.calidadMaterial || calidades[0],
    descuento: base?.descuento || 0,
    notas: base?.notas || '',
    items: sourceItems.map((item) => ({ ...item, id: getUniqueId() })),
  };
};

const addPropuesta = () => {
  if (propuestas.value.length >= 3) return;

  if (propuestas.value.length > 0) {
    propuestas.value.push(buildAlternativeFromBase(propuestas.value.length + 1));
  } else {
    const id = getUniqueId();
    propuestas.value.push({
      id,
      titulo: 'Propuesta 1',
      calidadMaterial: calidades[0],
      items: [
        {
          id: id + 1,
          tipo: 'Ventana Cc',
          cristal: 'DVH 4/12/4',
          color: 'Titanio',
          ancho: 1200,
          alto: 1500,
          cantidad: 4,
          valorUnitario: 145000,
        },
      ],
      descuento: 0,
      notas: ''
    });
  }
};

const deletePropuesta = (idx: number) => {
  if (idx === 0) return;
  propuestas.value.splice(idx, 1);
};

const calcularSubtotal = (propuesta: PropuestaLocal) =>
  propuesta.items.reduce(
    (sum, item) => sum + item.valorUnitario * item.cantidad,
    0
  );

const calcularTotal = (propuesta: PropuestaLocal) => {
  const subtotal = calcularSubtotal(propuesta);
  const descuentoMonto = propuesta.descuento || 0;
  return Math.max(subtotal - descuentoMonto, 0) + transporte.value + manoObra.value;
};

const totalItemsBase = computed(() => {
  if (propuestas.value.length === 0) return 0;
  return propuestas.value[0].items.reduce((sum, item) => sum + item.cantidad, 0);
});

const presupuestoBase = computed(() => {
  if (propuestas.value.length === 0) return 0;
  return calcularTotal(propuestas.value[0]);
});

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(amount);

const title = computed(() =>
  cotizacionId.value ? `Editar cotización ${numero.value}` : 'Nueva cotización'
);

const cloneDeep = <T,>(data: T): T => JSON.parse(JSON.stringify(data));

// Objeto computado completo para enviar al Modal
const currentCotizacionFullData = computed<Cotizacion>(() => ({
  id: cotizacionId.value ?? 0,
  numero: numero.value,
  fecha: fecha.value,
  hora: hora.value,
  aceptada: aceptada.value,
  cliente: clienteNombre.value,
  direccion: clienteDireccion.value,
  telefono: clienteTelefono.value,
  correo: clienteCorreo.value,
  transporte: transporte.value,
  manoObra: manoObra.value,
  margenGlobal: margenGlobal.value,
  propuestas: cloneDeep(propuestas.value),
}));

const applyCotizacion = (cotizacion: Cotizacion) => {
  cotizacionId.value = cotizacion.id || null;
  numero.value = cotizacion.numero;
  fecha.value = cotizacion.fecha;
  hora.value = cotizacion.hora;
  aceptada.value = cotizacion.aceptada;
  clienteNombre.value = cotizacion.cliente;
  clienteDireccion.value = cotizacion.direccion;
  clienteTelefono.value = cotizacion.telefono;
  clienteCorreo.value = cotizacion.correo;
  transporte.value = cotizacion.transporte;
  manoObra.value = cotizacion.manoObra;
  margenGlobal.value = cotizacion.margenGlobal;
  
  const propsMapeadas = cloneDeep(cotizacion.propuestas).slice(0, 3).map((p: any, i: number) => ({
    ...p,
    titulo: i === 0 ? 'Propuesta 1' : (p.titulo || `Propuesta ${i + 1}`),
    calidadMaterial: p.calidadMaterial || calidades[0],
    notas: p.notas || ''
  }));

  propuestas.value = propsMapeadas.length > 0 ? propsMapeadas : [];
  
  if (propuestas.value.length === 0) {
    addPropuesta();
  }

  syncAlternativeProposalsBaseData();
};

const loadCotizacion = () => {
  const idParam = Number(route.params.id);
  if (Number.isFinite(idParam) && idParam > 0) {
    const existing = getCotizacionById(idParam);
    if (existing) {
      applyCotizacion(existing);
      return;
    }
  }
  applyCotizacion(createBlankCotizacion());
};

watch(
  () => route.params.id,
  () => loadCotizacion(),
  { immediate: true }
);


function syncAlternativeProposalsBaseData() {
  const base = propuestas.value[0];
  if (!base) return;

  propuestas.value.slice(1).forEach((propuesta, idx) => {
    propuesta.titulo = `Propuesta ${idx + 2}`;
    propuesta.notas = base.notas;

    propuesta.items = base.items.map((baseItem, itemIndex) => {
      const current = propuesta.items[itemIndex];
      return {
        ...baseItem,
        id: current?.id ?? getUniqueId(),
        tipo: current?.tipo ?? baseItem.tipo,
        cristal: current?.cristal ?? baseItem.cristal,
        color: current?.color ?? baseItem.color,
      };
    });
  });
}

watch(
  () => propuestas.value[0]?.items.map((item) => ({
    id: item.id,
    ancho: item.ancho,
    alto: item.alto,
    cantidad: item.cantidad,
    valorUnitario: item.valorUnitario,
  })),
  syncAlternativeProposalsBaseData,
  { deep: true }
);

const handleGuardar = () => {
  syncAlternativeProposalsBaseData();
  const payload: Cotizacion = {
    ...currentCotizacionFullData.value
  };

  const savedId = saveCotizacion(payload);
  cotizacionId.value = savedId;
  router.push('/historial');
};
</script>