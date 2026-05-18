<template>
  <div class="pb-24">
    <h1 class="mb-6 text-2xl font-bold" style="color: var(--text-primary);">Seguimiento de pagos</h1>

    <div
      class="p-6 rounded-xl border mb-6"
      style="background-color: var(--surface); border-color: var(--border-color);"
    >
      <div class="flex flex-wrap gap-4 mb-6">
        <div class="flex-1 min-w-[240px]">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Buscar por cotización, cliente, correo o comprobante..."
            class="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none"
            style="background-color: white; border-color: var(--border-color); color: var(--text-primary);"
          />
        </div>
        <select
          v-model="estadoFilter"
          class="px-4 py-2.5 rounded-lg border text-sm font-medium focus:outline-none"
          style="background-color: white; border-color: var(--border-color); color: var(--text-primary);"
        >
          <option value="all">Estado: Todos</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Parcial">Parcial</option>
          <option value="Pagado">Pagado</option>
        </select>
        <select
          v-model="montoOrder"
          class="px-4 py-2.5 rounded-lg border text-sm font-medium focus:outline-none"
          style="background-color: white; border-color: var(--border-color); color: var(--text-primary);"
        >
          <option value="none">Monto: Sin orden</option>
          <option value="asc">Monto: Menor a Mayor</option>
          <option value="desc">Monto: Mayor a Menor</option>
        </select>
        <button
          class="px-4 py-2.5 rounded-lg border text-sm font-medium hover:bg-gray-50 transition-colors"
          style="background-color: white; border-color: var(--border-color); color: var(--text-secondary);"
          @click="resetFilters"
        >
          Restablecer
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr style="background-color: var(--surface); color: var(--text-hint);">
              <th class="text-left px-4 py-3 text-xs uppercase font-bold">ID Cotización</th>
              <th class="text-left px-4 py-3 text-xs uppercase font-bold">Cliente</th>
              <th class="text-left px-4 py-3 text-xs uppercase font-bold">Teléfono</th>
              <th class="text-left px-4 py-3 text-xs uppercase font-bold">Correo</th>
              <th class="text-center px-4 py-3 text-xs uppercase font-bold">Cotización</th>
              <th class="text-right px-4 py-3 text-xs uppercase font-bold">Monto</th>
              <th class="text-left px-4 py-3 text-xs uppercase font-bold">% Pagado</th>
              <th class="text-right px-4 py-3 text-xs uppercase font-bold">Saldo</th>
              <th class="text-left px-4 py-3 text-xs uppercase font-bold">Último comprobante</th>
              <th class="text-center px-4 py-3 text-xs uppercase font-bold">Estado</th>
              <th class="text-center px-4 py-3 text-xs uppercase font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="pago in paginatedPagos"
              :key="pago.id"
              class="transition-colors hover:bg-gray-50"
              style="background-color: white;"
            >
              <td class="px-4 py-4 font-medium" style="color: var(--text-primary);">{{ pago.cotizacionId }}</td>
              <td class="px-4 py-4 font-medium" style="color: var(--text-primary);">{{ pago.cliente }}</td>
              <td class="px-4 py-4 text-sm" style="color: var(--text-secondary);">{{ pago.telefono }}</td>
              <td class="px-4 py-4 text-sm" style="color: var(--text-secondary);">{{ pago.correo }}</td>
              <td class="px-4 py-4 text-center">
                <button
                  @click="openQuoteModal(pago)"
                  class="p-2 rounded-lg transition-colors hover:bg-gray-200"
                  style="color: var(--accent);"
                  title="Ver cotización"
                >
                  <FileText :size="20" />
                </button>
              </td>
              <td class="px-4 py-4 text-right font-medium" style="color: var(--accent);">
                {{ formatCurrency(pago.montoTotal) }}
              </td>
              <td class="px-4 py-4">
                <div class="flex items-center gap-3 w-32">
                  <div
                    class="flex-1 h-2 rounded-full overflow-hidden"
                    style="background-color: var(--border-color);"
                  >
                    <div
                      class="h-full transition-all"
                      :style="{
                        width: `${Math.min(calcularPorcentaje(pago), 100)}%`,
                        backgroundColor: getEstadoColor(getEstado(pago)).bgSolid,
                      }"
                    />
                  </div>
                  <span class="text-xs font-bold" style="color: var(--text-secondary);">
                    {{ calcularPorcentaje(pago) }}%
                  </span>
                </div>
              </td>
              <td class="px-4 py-4 text-right font-medium" style="color: var(--text-primary);">
                {{ formatCurrency(calcularSaldo(pago)) }}
              </td>
              <td class="px-4 py-4 text-sm font-medium" style="color: var(--text-secondary);">
                {{ getUltimoComprobante(pago) || 'Sin comprobante' }}
              </td>
              <td class="px-4 py-4 text-center">
                <span
                  class="inline-block px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider"
                  :style="{
                    backgroundColor: getEstadoColor(getEstado(pago)).bg,
                    color: getEstadoColor(getEstado(pago)).text,
                  }"
                >
                  {{ getEstado(pago) }}
                </span>
              </td>
              <td class="px-4 py-4 text-center">
                <button
                  class="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
                  :style="{ backgroundColor: 'var(--accent)', color: 'white' }"
                  @click="openModal(pago)"
                >
                  Gestionar Pagos
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between mt-6 pt-4 border-t" style="border-color: var(--border-color);">
        <div class="text-sm" style="color: var(--text-secondary);">
          Mostrando <span class="font-medium" style="color: var(--text-primary);">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> a 
          <span class="font-medium" style="color: var(--text-primary);">{{ Math.min(currentPage * itemsPerPage, filteredPagos.length) }}</span> de 
          <span class="font-medium" style="color: var(--text-primary);">{{ filteredPagos.length }}</span> resultados
        </div>
        <div class="flex gap-2">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="p-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style="border-color: var(--border-color); color: var(--text-primary); background-color: white;"
          >
            <ChevronLeft :size="20" />
          </button>
          <div class="flex items-center px-4 font-medium text-sm" style="color: var(--text-primary);">
            Página {{ currentPage }} de {{ totalPages }}
          </div>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="p-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style="border-color: var(--border-color); color: var(--text-primary); background-color: white;"
          >
            <ChevronRight :size="20" />
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="modalOpen && selectedPago"
      class="fixed inset-0 flex items-center justify-center z-[60] p-4"
      style="background-color: rgba(0, 0, 0, 0.5);"
      @click="closeModal"
    >
      <div
        class="w-full max-w-3xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]"
        style="background-color: var(--surface);"
        @click.stop
      >
        <div class="flex items-center justify-between p-6 border-b bg-gray-50 rounded-t-xl" style="border-color: var(--border-color);">
          <div>
            <h2 class="text-xl font-bold" style="color: var(--text-primary);">
              Pagos - {{ selectedPago.cliente }}
            </h2>
            <p class="text-sm mt-1" style="color: var(--text-secondary);">Cotización: {{ selectedPago.cotizacionId }}</p>
          </div>
          <button class="p-2 rounded-full hover:bg-gray-200 transition-colors" style="color: var(--text-secondary);" @click="closeModal">
            <X :size="24" />
          </button>
        </div>

        <div class="p-6 overflow-y-auto">
          <div class="grid grid-cols-3 gap-6 mb-8 p-6 rounded-xl border bg-white" style="border-color: var(--border-color);">
            <div class="text-center border-r" style="border-color: var(--border-color);">
              <div class="text-xs uppercase font-bold mb-1" style="color: var(--text-secondary);">Total Cotización</div>
              <div class="text-2xl font-bold" style="color: var(--text-primary);">
                {{ formatCurrency(selectedPago.montoTotal) }}
              </div>
            </div>
            <div class="text-center border-r" style="border-color: var(--border-color);">
              <div class="text-xs uppercase font-bold mb-1" style="color: var(--text-secondary);">Total Abonado</div>
              <div class="text-2xl font-bold" style="color: var(--success, #10b981);">
                {{ formatCurrency(calcularPagado(selectedPago)) }}
              </div>
            </div>
            <div class="text-center">
              <div class="text-xs uppercase font-bold mb-1" style="color: var(--text-secondary);">% Pagado</div>
              <div class="text-2xl font-bold" :style="{ color: getEstadoColor(getEstado(selectedPago)).bgSolid }">
                {{ calcularPorcentaje(selectedPago) }}%
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-lg" style="color: var(--text-primary);">Historial de Abonos</h3>
            <button
              v-if="!addPaymentOpen"
              class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
              style="background-color: var(--accent);"
              @click="openAddPayment"
            >
              <Plus :size="16" />
              <span>Añadir pago</span>
            </button>
          </div>

          <div
            v-if="addPaymentOpen"
            class="p-5 mb-6 rounded-lg border bg-gray-50"
            style="border-color: var(--border-color);"
          >
            <h4 class="font-bold text-sm mb-4 uppercase" style="color: var(--text-secondary);">
              {{ editingAbonoId ? 'Editar Abono' : 'Registrar Nuevo Abono' }}
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label class="block text-xs font-bold uppercase mb-2" style="color: var(--text-secondary);">Fecha</label>
                <input
                  v-model="nuevoAbono.fecha"
                  type="date"
                  class="w-full px-3 py-2 rounded-lg border text-sm"
                  style="background-color: white; border-color: var(--border-color); color: var(--text-primary);"
                />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase mb-2" style="color: var(--text-secondary);">Monto</label>
                <input
                  v-model.number="nuevoAbono.monto"
                  type="number"
                  class="w-full px-3 py-2 rounded-lg border text-sm"
                  style="background-color: white; border-color: var(--border-color); color: var(--text-primary);"
                />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase mb-2" style="color: var(--text-secondary);">Método</label>
                <select
                  v-model="nuevoAbono.metodo"
                  class="w-full px-3 py-2 rounded-lg border text-sm"
                  style="background-color: white; border-color: var(--border-color); color: var(--text-primary);"
                >
                  <option>Transferencia</option>
                  <option>Efectivo</option>
                  <option>Cheque</option>
                  <option>Tarjeta de Crédito</option>
                  <option>Tarjeta de Débito</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase mb-2" style="color: var(--text-secondary);">Comprobante</label>
                <input
                  v-model="nuevoAbono.comprobante"
                  type="text"
                  placeholder="Ej: CP-0001"
                  class="w-full px-3 py-2 rounded-lg border text-sm"
                  style="background-color: white; border-color: var(--border-color); color: var(--text-primary);"
                />
              </div>
            </div>
            <div class="flex justify-end gap-3">
              <button
                class="px-5 py-2 rounded-lg border text-sm font-medium bg-white hover:bg-gray-100 transition-colors"
                style="border-color: var(--border-color); color: var(--text-secondary);"
                @click="cancelAddPayment"
              >
                Cancelar
              </button>
              <button
                class="px-5 py-2 rounded-lg text-white text-sm font-medium transition-opacity hover:opacity-90"
                style="background-color: var(--accent);"
                @click="handleAddOrEditAbono"
              >
                {{ editingAbonoId ? 'Actualizar' : 'Guardar Pago' }}
              </button>
            </div>
          </div>

          <div class="border rounded-lg overflow-hidden" style="border-color: var(--border-color);">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-gray-50 border-b" style="border-color: var(--border-color); color: var(--text-secondary);">
                  <th class="text-left px-4 py-3 font-bold uppercase text-xs">Fecha</th>
                  <th class="text-left px-4 py-3 font-bold uppercase text-xs">Método</th>
                  <th class="text-left px-4 py-3 font-bold uppercase text-xs">Comprobante</th>
                  <th class="text-right px-4 py-3 font-bold uppercase text-xs">Monto</th>
                  <th class="text-center px-4 py-3 font-bold uppercase text-xs w-24">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y" style="border-color: var(--border-color);">
                <tr v-for="abono in selectedPago.abonos" :key="abono.id" class="bg-white hover:bg-gray-50 transition-colors">
                  <td class="px-4 py-3 font-medium" style="color: var(--text-primary);">{{ abono.fecha }}</td>
                  <td class="px-4 py-3" style="color: var(--text-secondary);">{{ abono.metodo }}</td>
                  <td class="px-4 py-3" style="color: var(--text-secondary);">{{ abono.comprobante || 'Sin código' }}</td>
                  <td class="px-4 py-3 text-right font-bold" style="color: var(--success, #10b981);">
                    {{ formatCurrency(abono.monto) }}
                  </td>
                  <td class="px-4 py-3 text-center">
                    <div class="flex justify-center gap-2">
                      <button @click="editAbono(abono)" class="p-1.5 rounded text-blue-600 hover:bg-blue-50 transition-colors" title="Editar">
                        <Edit2 :size="16" />
                      </button>
                      <button @click="deleteAbono(abono.id)" class="p-1.5 rounded text-red-600 hover:bg-red-50 transition-colors" title="Eliminar">
                        <Trash2 :size="16" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="selectedPago.abonos.length === 0">
                  <td colspan="5" class="px-4 py-12 text-center text-gray-500">
                    No hay pagos registrados para esta cotización.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="quoteModalOpen && selectedQuoteData"
      class="fixed inset-0 flex items-center justify-center z-[70] p-4"
      style="background-color: rgba(0, 0, 0, 0.6);"
      @click="closeQuoteModal"
    >
      <div
        class="w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] bg-white overflow-hidden"
        @click.stop
      >
        <div class="flex items-center justify-between p-6 border-b bg-gray-50">
          <div>
            <h2 class="text-xl font-bold text-gray-900">
              Resumen Cotización {{ selectedQuoteData.numero }}
            </h2>
            <p class="text-sm text-gray-500">Cliente: {{ selectedQuoteData.cliente }}</p>
          </div>
        </div>

        <div class="p-6 overflow-y-auto space-y-6">
          <div v-for="(propuesta, index) in selectedQuoteData.propuestas" :key="index" class="border rounded-lg overflow-hidden">
            <div class="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 class="font-bold text-gray-800 uppercase text-sm">Propuesta {{ index + 1 }}: {{ propuesta.calidadMaterial || 'Termopanel Estándar' }}</h3>
              <span class="text-xs font-bold bg-[#FF6B00] text-white px-2 py-1 rounded">Monto Base: {{ formatCurrency(calcularSubtotalPropuesta(propuesta)) }}</span>
            </div>
            <table class="w-full text-xs text-center">
              <thead class="bg-gray-50 border-b border-gray-200 text-gray-600">
                <tr>
                  <th class="py-2 px-2 text-left">TIPO</th>
                  <th class="py-2 px-2 text-left">CRISTAL</th>
                  <th class="py-2 px-2">COLOR</th>
                  <th class="py-2 px-2">ANCHO</th>
                  <th class="py-2 px-2">ALTO</th>
                  <th class="py-2 px-2">CANT</th>
                  <th class="py-2 px-2 text-right">VALOR UNI</th>
                  <th class="py-2 px-2 text-right">TOTAL</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="item in propuesta.items" :key="item.id" class="text-gray-800">
                  <td class="py-2 px-2 text-left uppercase">{{ item.tipo }}</td>
                  <td class="py-2 px-2 text-left uppercase text-[10px]">{{ item.cristal }}</td>
                  <td class="py-2 px-2 uppercase">{{ item.color }}</td>
                  <td class="py-2 px-2">{{ item.ancho }}</td>
                  <td class="py-2 px-2">{{ item.alto }}</td>
                  <td class="py-2 px-2 font-bold">{{ item.cantidad }}</td>
                  <td class="py-2 px-2 text-right">{{ formatCurrency(item.valorUnitario) }}</td>
                  <td class="py-2 px-2 text-right font-bold text-[#FF6B00]">{{ formatCurrency(item.valorUnitario * item.cantidad) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="flex justify-end">
            <div class="w-64 bg-gray-50 p-4 rounded-lg border text-sm space-y-2">
               <div class="flex justify-between text-gray-600">
                  <span>Transporte</span>
                  <span>{{ formatCurrency(selectedQuoteData.transporte) }}</span>
               </div>
               <div class="flex justify-between text-gray-600 border-b pb-2">
                  <span>Mano de obra</span>
                  <span>{{ formatCurrency(selectedQuoteData.manoObra) }}</span>
               </div>
               <div class="flex justify-between font-bold text-gray-900 pt-1 text-base">
                  <span>Total Final</span>
                  <span class="text-[#FF6B00]">{{ formatCurrency(selectedQuoteData.montoTotal) }}</span>
               </div>
            </div>
          </div>
        </div>

        <div class="p-4 border-t bg-gray-50 flex justify-end">
          <button @click="closeQuoteModal" class="px-6 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Plus, X, Edit2, Trash2, ChevronLeft, ChevronRight, FileText } from 'lucide-vue-next';

// Tipos
type Item = { id: number; tipo: string; cristal: string; color: string; ancho: number; alto: number; cantidad: number; valorUnitario: number; };
type Propuesta = { id: number; titulo: string; calidadMaterial: string; items: Item[]; descuento: number; };
type DetalleCotizacion = { numero: string; cliente: string; transporte: number; manoObra: number; montoTotal: number; propuestas: Propuesta[]; };

type Abono = {
  id: number;
  fecha: string;
  monto: number;
  metodo: string;
  comprobante: string;
};

type Pago = {
  id: number;
  cotizacionId: string;
  cliente: string;
  telefono: string;
  correo: string;
  montoTotal: number;
  abonos: Abono[];
  cotizacion: DetalleCotizacion; // Datos para la previsualización
};

// Generador de cotizaciones dummy para mockups
const generarCotizacionDummy = (numero: string, cliente: string, montoBase: number): DetalleCotizacion => ({
  numero, cliente, transporte: 50000, manoObra: 150000, montoTotal: montoBase,
  propuestas: [
    {
      id: 1, titulo: 'Propuesta Única', calidadMaterial: 'ALTA CALIDAD EN PCV EUROPEO®', descuento: 0,
      items: [
        { id: 1, tipo: 'Ventana Cc', cristal: 'DVH 4/12/4', color: 'Blanco', ancho: 1200, alto: 1500, cantidad: 2, valorUnitario: (montoBase - 200000) / 2 }
      ]
    }
  ]
});

// Mockup Data Ampliado (10 registros)
const pagos = ref<Pago[]>([
  { id: 101, cotizacionId: 'COT-2026-001', cliente: 'Constructora del Norte Ltda.', telefono: '+56 9 1234 5678', correo: 'contacto@norte.cl', montoTotal: 1295000,
    abonos: [{ id: 1, fecha: '2026-04-22', monto: 650000, metodo: 'Transferencia', comprobante: 'CP-COT-001' }],
    cotizacion: generarCotizacionDummy('COT-2026-001', 'Constructora del Norte Ltda.', 1295000) },
  { id: 102, cotizacionId: 'COT-2026-003', cliente: 'Familia Soto Pérez', telefono: '+56 9 9988 7766', correo: 'fam.soto@gmail.com', montoTotal: 870000,
    abonos: [{ id: 1, fecha: '2026-04-24', monto: 870000, metodo: 'Transferencia', comprobante: 'CP-COT-003' }],
    cotizacion: generarCotizacionDummy('COT-2026-003', 'Familia Soto Pérez', 870000) },
  { id: 1, cotizacionId: 'COT-2583', cliente: 'María González', telefono: '+56 9 8765 4321', correo: 'maria.gonzalez@email.com', montoTotal: 2450000, 
    abonos: [{ id: 1, fecha: '2026-04-20', monto: 1000000, metodo: 'Transferencia', comprobante: 'CP-TR-001' }, { id: 2, fecha: '2026-04-25', monto: 1450000, metodo: 'Efectivo', comprobante: 'CP-EF-001' }],
    cotizacion: generarCotizacionDummy('COT-2583', 'María González', 2450000) },
  { id: 2, cotizacionId: 'COT-2584', cliente: 'Constructora Los Andes S.A.', telefono: '+56 2 2345 6789', correo: 'contacto@losandes.cl', montoTotal: 8750000, 
    abonos: [{ id: 1, fecha: '2026-04-15', monto: 3000000, metodo: 'Transferencia', comprobante: 'CP-TR-001' }],
    cotizacion: generarCotizacionDummy('COT-2584', 'Constructora Los Andes S.A.', 8750000) },
  { id: 3, cotizacionId: 'COT-2585', cliente: 'Pedro Soto', telefono: '+56 9 7654 3210', correo: 'pedro.soto@email.com', montoTotal: 1890000, 
    abonos: [],
    cotizacion: generarCotizacionDummy('COT-2585', 'Pedro Soto', 1890000) },
  { id: 4, cotizacionId: 'COT-2586', cliente: 'Inmobiliaria Pacífico', telefono: '+56 2 3456 7890', correo: 'proyectos@pacifico.cl', montoTotal: 12300000, 
    abonos: [{ id: 1, fecha: '2026-04-10', monto: 5000000, metodo: 'Cheque', comprobante: 'CP-CH-001' }, { id: 2, fecha: '2026-04-20', monto: 5000000, metodo: 'Transferencia', comprobante: 'CP-TR-001' }, { id: 3, fecha: '2026-04-26', monto: 2300000, metodo: 'Transferencia', comprobante: 'CP-TR-001' }],
    cotizacion: generarCotizacionDummy('COT-2586', 'Inmobiliaria Pacífico', 12300000) },
  { id: 5, cotizacionId: 'COT-2587', cliente: 'Laura Tapia', telefono: '+56 9 1122 3344', correo: 'ltapia@gmail.com', montoTotal: 3100000, 
    abonos: [{ id: 1, fecha: '2026-04-28', monto: 1550000, metodo: 'Transferencia', comprobante: 'CP-TR-001' }],
    cotizacion: generarCotizacionDummy('COT-2587', 'Laura Tapia', 3100000) },
  { id: 6, cotizacionId: 'COT-2588', cliente: 'Hotel Miramar', telefono: '+56 32 298 7654', correo: 'finanzas@miramar.cl', montoTotal: 15400000, 
    abonos: [],
    cotizacion: generarCotizacionDummy('COT-2588', 'Hotel Miramar', 15400000) },
  { id: 7, cotizacionId: 'COT-2589', cliente: 'Carlos Ruiz', telefono: '+56 9 5544 3322', correo: 'carlos.ruiz.88@hotmail.com', montoTotal: 850000, 
    abonos: [{ id: 1, fecha: '2026-04-05', monto: 850000, metodo: 'Tarjeta de Crédito', comprobante: 'CP-TC-001' }],
    cotizacion: generarCotizacionDummy('COT-2589', 'Carlos Ruiz', 850000) },
  { id: 8, cotizacionId: 'COT-2590', cliente: 'Arquitectos Asociados', telefono: '+56 2 2999 8877', correo: 'pagos@arqasociados.cl', montoTotal: 6200000, 
    abonos: [{ id: 1, fecha: '2026-03-15', monto: 3100000, metodo: 'Transferencia', comprobante: 'CP-TR-001' }, { id: 2, fecha: '2026-04-15', monto: 1000000, metodo: 'Transferencia', comprobante: 'CP-TR-001' }],
    cotizacion: generarCotizacionDummy('COT-2590', 'Arquitectos Asociados', 6200000) },
  { id: 9, cotizacionId: 'COT-2591', cliente: 'Ana Rojas', telefono: '+56 9 9988 7766', correo: 'ana.rojas@empresa.cl', montoTotal: 1200000, 
    abonos: [{ id: 1, fecha: '2026-04-29', monto: 600000, metodo: 'Efectivo', comprobante: 'CP-EF-001' }],
    cotizacion: generarCotizacionDummy('COT-2591', 'Ana Rojas', 1200000) },
  { id: 10, cotizacionId: 'COT-2592', cliente: 'Clínica San José', telefono: '+56 2 2777 6655', correo: 'adquisiciones@sanjose.cl', montoTotal: 9800000, 
    abonos: [{ id: 1, fecha: '2026-04-02', monto: 4900000, metodo: 'Cheque', comprobante: 'CP-CH-001' }, { id: 2, fecha: '2026-04-28', monto: 4900000, metodo: 'Transferencia', comprobante: 'CP-TR-001' }],
    cotizacion: generarCotizacionDummy('COT-2592', 'Clínica San José', 9800000) },
]);

const route = useRoute();
const searchTerm = ref('');
const estadoFilter = ref('all');
const montoOrder = ref('none');

const getUltimoComprobante = (pago: Pago) => pago.abonos.at(-1)?.comprobante || '';

const filteredPagos = computed(() => {
  const term = searchTerm.value.trim().toLowerCase();
  let data = pagos.value.filter((pago) => {
    const comprobantes = pago.abonos.map((abono) => abono.comprobante).join(' ').toLowerCase();
    const matchesSearch = !term
      || pago.cotizacionId.toLowerCase().includes(term)
      || pago.cliente.toLowerCase().includes(term)
      || pago.correo.toLowerCase().includes(term)
      || comprobantes.includes(term);
    const matchesEstado = estadoFilter.value === 'all' || getEstado(pago) === estadoFilter.value;
    return matchesSearch && matchesEstado;
  });

  if (montoOrder.value === 'asc') data = data.sort((a, b) => a.montoTotal - b.montoTotal);
  if (montoOrder.value === 'desc') data = data.sort((a, b) => b.montoTotal - a.montoTotal);
  return data;
});

const resetFilters = () => {
  searchTerm.value = '';
  estadoFilter.value = 'all';
  montoOrder.value = 'none';
  currentPage.value = 1;
};

watch([searchTerm, estadoFilter, montoOrder], () => { currentPage.value = 1; });

// Paginación
const currentPage = ref(1);
const itemsPerPage = 5;

const totalPages = computed(() => Math.ceil(filteredPagos.value.length / itemsPerPage) || 1);

const paginatedPagos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredPagos.value.slice(start, end);
});

const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };
const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };

// Estado Modal Pagos
const modalOpen = ref(false);
const selectedPago = ref<Pago | null>(null);
const addPaymentOpen = ref(false);
const editingAbonoId = ref<number | null>(null);
const nuevoAbono = ref({ fecha: '', monto: 0, metodo: 'Transferencia', comprobante: '' });

// Estado Modal Cotización
const quoteModalOpen = ref(false);
const selectedQuoteData = ref<DetalleCotizacion | null>(null);

// Cálculos Generales
const calcularPagado = (pago: Pago) => pago.abonos.reduce((sum, abono) => sum + abono.monto, 0);
const calcularPorcentaje = (pago: Pago) => Math.round((calcularPagado(pago) / pago.montoTotal) * 100) || 0;
const calcularSaldo = (pago: Pago) => pago.montoTotal - calcularPagado(pago);
const calcularSubtotalPropuesta = (propuesta: Propuesta) => propuesta.items.reduce((sum, item) => sum + item.valorUnitario * item.cantidad, 0);

const getEstado = (pago: Pago) => {
  const porcentaje = calcularPorcentaje(pago);
  if (porcentaje >= 100) return 'Pagado';
  if (porcentaje > 0) return 'Parcial';
  return 'Pendiente';
};

const getEstadoColor = (estado: string) => {
  if (estado === 'Pagado') return { bg: 'var(--success-bg, #d1fae5)', text: 'var(--success, #059669)', bgSolid: '#10b981' };
  if (estado === 'Parcial') return { bg: 'var(--accent-light, #fef3c7)', text: 'var(--accent, #d97706)', bgSolid: '#f59e0b' };
  return { bg: 'var(--error-bg, #fee2e2)', text: 'var(--error, #dc2626)', bgSolid: '#ef4444' };
};

// Formato de Moneda
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(amount);

// Acciones Cotización Modal
const openQuoteModal = (pago: Pago) => {
  selectedQuoteData.value = pago.cotizacion;
  quoteModalOpen.value = true;
};

const closeQuoteModal = () => {
  quoteModalOpen.value = false;
  selectedQuoteData.value = null;
};

// Acciones Pagos Modal
const openModal = (pago: Pago) => {
  selectedPago.value = pago;
  modalOpen.value = true;
  addPaymentOpen.value = false;
  editingAbonoId.value = null;
};

const closeModal = () => {
  modalOpen.value = false;
  addPaymentOpen.value = false;
  editingAbonoId.value = null;
};

// CRUD Abonos
const openAddPayment = () => {
  nuevoAbono.value = { fecha: new Date().toISOString().split('T')[0], monto: 0, metodo: 'Transferencia', comprobante: '' };
  editingAbonoId.value = null;
  addPaymentOpen.value = true;
};

const cancelAddPayment = () => {
  addPaymentOpen.value = false;
  editingAbonoId.value = null;
};

const handleAddOrEditAbono = () => {
  if (!selectedPago.value || nuevoAbono.value.monto <= 0) return;

  const pagoIndex = pagos.value.findIndex((p) => p.id === selectedPago.value?.id);
  if (pagoIndex === -1) return;

  if (editingAbonoId.value) {
    // Editar
    const abonoIndex = pagos.value[pagoIndex].abonos.findIndex(a => a.id === editingAbonoId.value);
    if (abonoIndex !== -1) {
      pagos.value[pagoIndex].abonos[abonoIndex] = {
        id: editingAbonoId.value,
        fecha: nuevoAbono.value.fecha,
        monto: nuevoAbono.value.monto,
        metodo: nuevoAbono.value.metodo,
        comprobante: nuevoAbono.value.comprobante,
      };
    }
  } else {
    // Crear
    pagos.value[pagoIndex].abonos.push({
      id: Date.now(),
      fecha: nuevoAbono.value.fecha,
      monto: nuevoAbono.value.monto,
      metodo: nuevoAbono.value.metodo,
      comprobante: nuevoAbono.value.comprobante,
    });
  }

  selectedPago.value = pagos.value[pagoIndex];
  cancelAddPayment();
};

const editAbono = (abono: Abono) => {
  nuevoAbono.value = { fecha: abono.fecha, monto: abono.monto, metodo: abono.metodo, comprobante: abono.comprobante || '' };
  editingAbonoId.value = abono.id;
  addPaymentOpen.value = true;
};

const deleteAbono = (abonoId: number) => {
  if (!selectedPago.value || !confirm('¿Estás seguro de que deseas eliminar este abono?')) return;
  
  const pagoIndex = pagos.value.findIndex((p) => p.id === selectedPago.value?.id);
  if (pagoIndex !== -1) {
    pagos.value[pagoIndex].abonos = pagos.value[pagoIndex].abonos.filter(a => a.id !== abonoId);
    selectedPago.value = pagos.value[pagoIndex];
  }
};

watch(
  () => route.query.cotizacion,
  (cotizacion) => {
    if (!cotizacion) return;
    const cotizacionId = String(cotizacion);
    const pago = pagos.value.find((item) => item.cotizacionId === cotizacionId);
    if (pago) {
      searchTerm.value = cotizacionId;
      openModal(pago);
    }
  },
  { immediate: true }
);
</script>