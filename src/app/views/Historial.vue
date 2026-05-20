<template>
  <div class="pb-24">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--text-primary);">Historial de cotizaciones</h1>
      <button
        class="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium transition-opacity hover:opacity-90 shadow-sm"
        style="background-color: var(--accent);"
        @click="goToCotizar()"
      >
        <Plus :size="20" />
        <span>Nueva cotización</span>
      </button>
    </div>

    <div
      class="p-6 rounded-xl border mb-6"
      style="background-color: var(--surface); border-color: var(--border-color);"
    >
      <div class="flex flex-wrap gap-4 mb-6">
        <div class="flex-1 relative min-w-[250px]">
          <Search
            :size="18"
            class="absolute left-3 top-1/2 -translate-y-1/2"
            style="color: var(--text-hint);"
          />
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Buscar por cliente o número de cotización..."
            class="w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none text-sm"
            style="background-color: white; border-color: var(--border-color); color: var(--text-primary);"
            @focus="setBorderColor($event, 'var(--accent)')"
            @blur="setBorderColor($event, 'var(--border-color)')"
          />
        </div>

        <select
          v-model="filterAceptada"
          class="px-4 py-2.5 rounded-lg border focus:outline-none text-sm font-medium"
          style="background-color: white; border-color: var(--border-color); color: var(--text-primary);"
        >
          <option value="all">Estado: Todos</option>
          <option value="true">Aceptadas</option>
          <option value="false">Pendientes</option>
        </select>

        <div class="flex items-center gap-2">
          <label class="text-xs font-bold uppercase" style="color: var(--text-hint);">Desde</label>
          <input
            v-model="dateFrom"
            type="date"
            class="px-3 py-2.5 rounded-lg border focus:outline-none text-sm"
            style="background-color: white; border-color: var(--border-color); color: var(--text-primary);"
          />
          <label class="text-xs font-bold uppercase ml-2" style="color: var(--text-hint);">Hasta</label>
          <input
            v-model="dateTo"
            type="date"
            class="px-3 py-2.5 rounded-lg border focus:outline-none text-sm"
            style="background-color: white; border-color: var(--border-color); color: var(--text-primary);"
          />
        </div>

        <select
          v-model="montoOrder"
          class="px-4 py-2.5 rounded-lg border focus:outline-none text-sm font-medium"
          style="background-color: white; border-color: var(--border-color); color: var(--text-primary);"
        >
          <option value="none">Monto: Sin orden</option>
          <option value="asc">Monto: Menor a Mayor</option>
          <option value="desc">Monto: Mayor a Menor</option>
        </select>

        <button
          class="px-4 py-2.5 rounded-lg border transition-opacity hover:opacity-80 text-sm font-medium whitespace-nowrap"
          style="background-color: white; border-color: var(--border-color); color: var(--text-secondary);"
          @click="resetFilters"
        >
          Restablecer
        </button>
      </div>

      <div class="overflow-x-auto border rounded-lg" style="border-color: var(--border-color);">
        <table class="w-full text-sm">
          <thead>
            <tr style="background-color: var(--page-bg); color: var(--text-hint);">
              <th class="text-left px-4 py-3 text-xs uppercase font-bold tracking-wider">Fecha</th>
              <th class="text-left px-4 py-3 text-xs uppercase font-bold tracking-wider">N° Cotización</th>
              <th class="text-left px-4 py-3 text-xs uppercase font-bold tracking-wider">Cliente</th>
              <th class="text-left px-4 py-3 text-xs uppercase font-bold tracking-wider">Estado / Propuesta</th>
              <th class="text-right px-4 py-3 text-xs uppercase font-bold tracking-wider">Monto Final</th>
              <th class="text-center px-4 py-3 text-xs uppercase font-bold tracking-wider">Revisar seguimiento de pago</th>
              <th class="text-center px-4 py-3 text-xs uppercase font-bold tracking-wider w-24">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y" style="border-color: var(--border-color);">
            <tr
              v-for="item in paginatedData"
              :key="item.id"
              class="transition-colors hover:bg-gray-50"
              style="background-color: white;"
            >
              <td class="px-4 py-3" style="color: var(--text-primary);">
                <div class="font-medium">{{ formatDateDisplay(item.fecha) }}</div>
                <div class="text-xs" style="color: var(--text-secondary);">{{ item.hora }}</div>
              </td>
              <td class="px-4 py-3 font-medium" style="color: var(--text-primary);">
                {{ item.numero }}
              </td>
              <td class="px-4 py-3 font-medium" style="color: var(--text-primary);">
                {{ item.cliente }}
              </td>
              <td class="px-4 py-3">
                <select
                  v-model="item.propuestaAceptadaId"
                  @change="updateEstadoAceptacion(item)"
                  class="w-full max-w-[200px] px-2 py-1.5 rounded border text-xs font-medium focus:outline-none"
                  :style="{
                    backgroundColor: item.propuestaAceptadaId ? 'var(--success-bg, #d1fae5)' : 'white',
                    borderColor: item.propuestaAceptadaId ? 'transparent' : 'var(--border-color)',
                    color: item.propuestaAceptadaId ? 'var(--success, #059669)' : 'var(--text-secondary)'
                  }"
                >
                  <option :value="null">Pendiente</option>
                  <option v-for="(prop, idx) in item.propuestas" :key="prop.id" :value="prop.id">
                    {{ prop.titulo || `Propuesta ${idx + 1}` }}
                  </option>
                </select>
              </td>
              <td class="px-4 py-3 text-right font-bold" style="color: var(--accent);">
                {{ formatCurrency(getCotizacionMontoEfectivo(item)) }}
              </td>
              <td class="px-4 py-3 text-center">
                <button
                  v-if="item.propuestaAceptadaId"
                  class="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90"
                  style="background-color: var(--accent);"
                  @click="goToPagoSeguimiento(item)"
                >
                  Revisar
                </button>
                <span v-else class="text-xs" style="color: var(--text-hint);">Pendiente</span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-center gap-2">
                  <button
                    class="p-1.5 rounded transition-colors hover:bg-gray-200"
                    style="color: var(--accent);"
                    title="Previsualizar"
                    @click="openPreview(item)"
                  >
                    <Eye :size="18" />
                  </button>
                  <button
                    class="p-1.5 rounded transition-colors hover:bg-gray-200"
                    style="color: var(--text-secondary);"
                    title="Editar Todos los Datos"
                    @click="openEditModal(item)"
                  >
                    <Edit :size="18" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="paginatedData.length === 0">
              <td colspan="7" class="px-4 py-8 text-center" style="color: var(--text-hint);">
                No se encontraron cotizaciones con los filtros aplicados.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between mt-6 border-t pt-4" style="border-color: var(--border-color);">
        <div class="text-sm" style="color: var(--text-secondary);">
          Mostrando {{ paginatedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0 }} a 
          {{ Math.min(currentPage * itemsPerPage, filteredData.length) }} de {{ filteredData.length }} cotizaciones
        </div>
        
        <div v-if="totalPages > 1" class="flex items-center gap-2">
          <button
            class="px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 text-sm font-medium"
            style="background-color: white; border-color: var(--border-color); color: var(--text-primary);"
            :disabled="currentPage === 1"
            @click="currentPage = Math.max(1, currentPage - 1)"
          >
            Anterior
          </button>
          <span class="text-sm font-medium px-2" style="color: var(--text-primary);">
            {{ currentPage }} / {{ totalPages }}
          </span>
          <button
            class="px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 text-sm font-medium"
            style="background-color: white; border-color: var(--border-color); color: var(--text-primary);"
            :disabled="currentPage === totalPages"
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="previewOpen && previewCotizacion"
      class="fixed inset-0 flex items-center justify-center z-[70] p-4"
      style="background-color: rgba(0, 0, 0, 0.6);"
      @click="closePreview"
    >
      <div
        class="w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] bg-white overflow-hidden"
        @click.stop
      >
        <div class="flex items-center justify-between p-6 border-b bg-gray-50">
          <div>
            <h2 class="text-xl font-bold text-gray-900">
              Resumen Cotización {{ previewCotizacion.numero }}
            </h2>
            <p class="text-sm text-gray-500">Cliente: {{ previewCotizacion.cliente }} | Estado: <span class="font-bold" :class="previewCotizacion.aceptada ? 'text-green-600' : 'text-orange-500'">{{ previewCotizacion.aceptada ? 'Aceptada' : 'Pendiente' }}</span></p>
          </div>
          <div class="flex items-center gap-2">
            <button
              class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white hover:opacity-90 transition-opacity"
              style="background-color: var(--accent);"
              @click="downloadPreviewPdf"
            >
              <Download :size="16" /> Descargar PDF
            </button>
            <button class="p-2 rounded-full hover:bg-gray-200 transition-colors" style="color: var(--text-secondary);" @click="closePreview">
              <X :size="24" />
            </button>
          </div>
        </div>

        <div class="p-6 overflow-y-auto space-y-6">
          <div v-for="(propuesta, index) in previewCotizacion.propuestas" :key="propuesta.id" class="border rounded-lg overflow-hidden" :class="{'ring-2 ring-green-500': previewCotizacion.propuestaAceptadaId === propuesta.id}">
            <div class="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <div class="flex items-center gap-2">
                <span v-if="previewCotizacion.propuestaAceptadaId === propuesta.id" class="bg-green-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">Seleccionada</span>
                <h3 class="font-bold text-gray-800 uppercase text-sm">{{ propuesta.titulo || `Propuesta ${index + 1}` }}</h3>
              </div>
              <span class="text-xs font-bold bg-[#FF6B00] text-white px-2 py-1 rounded">Subtotal: {{ formatCurrency(calcularSubtotalPropuesta(propuesta)) }}</span>
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
            <div class="w-72 bg-gray-50 p-4 rounded-lg border text-sm space-y-2 shadow-sm">
               <div class="flex justify-between text-gray-600">
                  <span>Transporte</span>
                  <span>{{ formatCurrency(previewCotizacion.transporte) }}</span>
               </div>
               <div class="flex justify-between text-gray-600 border-b border-gray-200 pb-2">
                  <span>Mano de obra</span>
                  <span>{{ formatCurrency(previewCotizacion.manoObra) }}</span>
               </div>
               <div class="flex justify-between font-black text-gray-900 pt-1 text-lg">
                  <span>Total Efectivo</span>
                  <span class="text-[#FF6B00]">{{ formatCurrency(getCotizacionMontoEfectivo(previewCotizacion)) }}</span>
               </div>
               <p class="text-[10px] text-gray-400 text-right italic leading-tight pt-1">
                  * El total efectivo se calcula basándose en la propuesta seleccionada. Si está pendiente, se usa la primera.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="editModalOpen && editingCotizacion"
      class="fixed inset-0 flex items-center justify-center z-[80] p-4"
      style="background-color: rgba(0, 0, 0, 0.6);"
      @click="closeEditModal"
    >
      <div
        class="w-full max-w-6xl rounded-xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden"
        style="background-color: var(--surface);"
        @click.stop
      >
        <div class="flex items-center justify-between p-6 border-b bg-gray-50" style="border-color: var(--border-color);">
          <div>
            <h2 class="text-xl font-bold" style="color: var(--text-primary);">
              Editar Cotización {{ editingCotizacion.numero }}
            </h2>
          </div>
          <button class="p-2 rounded-full hover:bg-gray-200 transition-colors" style="color: var(--text-secondary);" @click="closeEditModal">
            <X :size="24" />
          </button>
        </div>

        <div class="p-6 overflow-y-auto flex-1 space-y-8 bg-gray-50">
          
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 p-5 rounded-xl border bg-white" style="border-color: var(--border-color);">
              <h3 class="font-bold mb-4" style="color: var(--text-primary);">Datos del Cliente</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold uppercase mb-1" style="color: var(--text-secondary);">Nombre</label>
                  <input v-model="editingCotizacion.cliente" type="text" class="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style="border-color: var(--border-color);" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase mb-1" style="color: var(--text-secondary);">Correo</label>
                  <input v-model="editingCotizacion.correo" type="email" class="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style="border-color: var(--border-color);" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase mb-1" style="color: var(--text-secondary);">Dirección</label>
                  <input v-model="editingCotizacion.direccion" type="text" class="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style="border-color: var(--border-color);" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase mb-1" style="color: var(--text-secondary);">Teléfono</label>
                  <input v-model="editingCotizacion.telefono" type="tel" class="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style="border-color: var(--border-color);" />
                </div>
              </div>
            </div>

            <div class="p-5 rounded-xl border bg-white" style="border-color: var(--border-color);">
              <h3 class="font-bold mb-4" style="color: var(--text-primary);">Valores Generales</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-bold uppercase mb-1" style="color: var(--text-secondary);">Transporte ($)</label>
                  <input v-model.number="editingCotizacion.transporte" type="number" class="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style="border-color: var(--border-color);" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase mb-1" style="color: var(--text-secondary);">Mano de obra ($)</label>
                  <input v-model.number="editingCotizacion.manoObra" type="number" class="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style="border-color: var(--border-color);" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase mb-1" style="color: var(--text-secondary);">Margen Global (%)</label>
                  <input v-model.number="editingCotizacion.margenGlobal" type="number" class="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style="border-color: var(--border-color);" />
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <h3 class="font-bold text-lg" style="color: var(--text-primary);">Propuestas y Detalles</h3>
            
            <div v-for="(propuesta, pIdx) in editingCotizacion.propuestas" :key="propuesta.id" class="rounded-xl border bg-white overflow-hidden shadow-sm" style="border-color: var(--border-color);">
              <div class="bg-gray-100 p-4 border-b flex justify-between items-center" style="border-color: var(--border-color);">
                <div class="flex items-center gap-3 w-1/2">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style="background-color: var(--accent);">{{ pIdx + 1 }}</div>
                  <input v-model="propuesta.titulo" type="text" placeholder="Título de Propuesta" class="bg-transparent border-none font-bold focus:outline-none w-full" />
                </div>
                <div class="flex items-center gap-4">
                   <div class="flex items-center gap-2">
                    <label class="text-xs font-bold uppercase" style="color: var(--text-secondary);">Descuento ($)</label>
                    <input v-model.number="propuesta.descuento" type="number" class="w-16 px-2 py-1 rounded border text-sm text-center focus:outline-none" style="border-color: var(--border-color);" />
                   </div>
                   <button @click="deletePropuestaFromEdit(pIdx)" class="p-1.5 text-red-500 hover:bg-red-50 rounded" title="Eliminar Propuesta" v-if="editingCotizacion.propuestas.length > 1">
                     <Trash2 :size="18" />
                   </button>
                </div>
              </div>
              
              <div class="p-4">
                <div class="mb-4">
                   <label class="block text-xs font-bold uppercase mb-1" style="color: var(--text-secondary);">Calidad y Material</label>
                   <select v-model="propuesta.calidadMaterial" class="w-full md:w-1/2 px-3 py-2 rounded-lg border text-sm focus:outline-none" style="border-color: var(--border-color); background-color: white;">
                      <option v-for="calidad in calidades" :key="calidad" :value="calidad">{{ calidad }}</option>
                    </select>
                </div>

                <div class="overflow-x-auto border rounded-lg mb-4" style="border-color: var(--border-color);">
                  <table class="w-full min-w-[700px] text-xs">
                    <thead class="bg-gray-50 border-b">
                      <tr>
                        <th class="p-2 text-left font-bold">TIPO</th>
                        <th class="p-2 text-left font-bold">CRISTAL</th>
                        <th class="p-2 text-left font-bold">COLOR</th>
                        <th class="p-2 text-center font-bold">ANCH</th>
                        <th class="p-2 text-center font-bold">ALTO</th>
                        <th class="p-2 text-center font-bold">CANT</th>
                        <th class="p-2 text-right font-bold">VALOR U.</th>
                        <th class="p-2 text-center font-bold w-10"></th>
                      </tr>
                    </thead>
                    <tbody class="divide-y">
                      <tr v-for="(item, iIdx) in propuesta.items" :key="item.id">
                        <td class="p-1.5"><select v-model="item.tipo" class="w-full px-2 py-1.5 border rounded focus:outline-none bg-white"><option v-for="tipo in tiposVentana" :key="tipo" :value="tipo">{{ tipo }}</option></select></td>
                        <td class="p-1.5"><select v-model="item.cristal" class="w-full px-2 py-1.5 border rounded focus:outline-none bg-white"><option v-for="cristal in cristales" :key="cristal" :value="cristal">{{ cristal }}</option></select></td>
                        <td class="p-1.5"><select v-model="item.color" class="w-full px-2 py-1.5 border rounded focus:outline-none bg-white"><option v-for="color in colores" :key="color" :value="color">{{ color }}</option></select></td>
                        <td class="p-1.5"><input v-model.number="item.ancho" type="number" class="w-16 px-1 py-1.5 border rounded text-center mx-auto block focus:outline-none" /></td>
                        <td class="p-1.5"><input v-model.number="item.alto" type="number" class="w-16 px-1 py-1.5 border rounded text-center mx-auto block focus:outline-none" /></td>
                        <td class="p-1.5"><input v-model.number="item.cantidad" type="number" class="w-12 px-1 py-1.5 border rounded text-center mx-auto block focus:outline-none" /></td>
                        <td class="p-1.5"><input v-model.number="item.valorUnitario" type="number" class="w-24 px-2 py-1.5 border rounded text-right ml-auto block focus:outline-none" /></td>
                        <td class="p-1.5 text-center">
                           <button @click="deleteItemFromEdit(pIdx, iIdx)" class="p-1 text-red-500 hover:bg-red-50 rounded"><X :size="16" /></button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <button @click="addItemToEdit(pIdx)" class="text-sm font-bold flex items-center gap-1 hover:opacity-80 transition-opacity" style="color: var(--accent);">
                  <Plus :size="16" /> Añadir Fila
                </button>
              </div>
            </div>

            <button v-if="editingCotizacion.propuestas.length < 3" @click="addPropuestaToEdit" class="px-4 py-2 border-2 border-dashed rounded-xl w-full text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors" style="border-color: var(--border-color); color: var(--text-secondary);">
              <Plus :size="18" /> Agregar Nueva Propuesta
            </button>
          </div>
        </div>

        <div class="p-5 border-t flex justify-end gap-3 bg-white" style="border-color: var(--border-color);">
           <button @click="closeEditModal" class="px-6 py-2.5 rounded-lg border font-bold text-sm hover:bg-gray-50 transition-colors" style="border-color: var(--border-color); color: var(--text-secondary);">
             Cancelar
           </button>
           <button @click="saveEditModal" class="px-6 py-2.5 rounded-lg text-white font-bold text-sm hover:opacity-90 transition-opacity" style="background-color: var(--accent);">
             Guardar Cambios
           </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Eye, Edit, Plus, Search, X, Trash2, Download } from 'lucide-vue-next';

// --- Tipos de Datos (Alineados con Cotizar.vue) ---
type Item = { id: number; tipo: string; cristal: string; color: string; ancho: number; alto: number; cantidad: number; valorUnitario: number; };
type Propuesta = { id: number; titulo: string; calidadMaterial: string; items: Item[]; descuento: number; notas: string; };
type Cotizacion = { 
  id: number; numero: string; fecha: string; hora: string; 
  aceptada: boolean; propuestaAceptadaId: number | null;
  cliente: string; direccion: string; telefono: string; correo: string;
  transporte: number; manoObra: number; margenGlobal: number; 
  propuestas: Propuesta[]; 
};

// --- Mockup de Datos Estructurados ---
const mockupData = ref<Cotizacion[]>([
  {
    id: 1, numero: 'COT-2026-001', fecha: '2026-04-10', hora: '09:15',
    aceptada: true, propuestaAceptadaId: 1,
    cliente: 'Constructora del Norte Ltda.', direccion: 'Av. Industrial 123', telefono: '+56 9 1234 5678', correo: 'contacto@norte.cl',
    transporte: 45000, manoObra: 150000, margenGlobal: 25,
    propuestas: [
      { id: 1, titulo: 'Propuesta 1', calidadMaterial: 'ALTA CALIDAD EN PCV EUROPEO®', descuento: 100000, notas: '', items: [
        { id: 1, tipo: 'Ventana Cc', cristal: 'DVH 4/12/4', color: 'Blanco', ancho: 1200, alto: 1500, cantidad: 4, valorUnitario: 145000 },
        { id: 2, tipo: 'Paño Fijo', cristal: 'Laminado 3+3', color: 'Blanco', ancho: 800, alto: 2100, cantidad: 2, valorUnitario: 92000 }
      ]},
      { id: 2, titulo: 'Propuesta Alternativa', calidadMaterial: 'ALTA CALIDAD EN ALUMINIO PREMIUM XELENTIA®', descuento: 50000, notas: '', items: [
        { id: 3, tipo: 'Ventana Cc', cristal: 'DVH 4/12/4', color: 'Titanio', ancho: 1200, alto: 1500, cantidad: 4, valorUnitario: 120000 }
      ]}
    ]
  },
  {
    id: 2, numero: 'COT-2026-002', fecha: '2026-04-15', hora: '11:40',
    aceptada: false, propuestaAceptadaId: null,
    cliente: 'Inmobiliaria Los Robles S.A.', direccion: 'Las Condes 456', telefono: '+56 2 2333 4444', correo: 'proyectos@robles.cl',
    transporte: 30000, manoObra: 85000, margenGlobal: 30,
    propuestas: [
      { id: 1, titulo: 'Línea Básica', calidadMaterial: 'MEDIA CALIDAD EN ALUMINIO BÁSICO AL25 / AL43', descuento: 0, notas: '', items: [
        { id: 1, tipo: 'Corredera chica', cristal: 'Incoloro 18mm', color: 'Nogal', ancho: 1000, alto: 1000, cantidad: 8, valorUnitario: 85000 }
      ]}
    ]
  },
  {
    id: 3, numero: 'COT-2026-003', fecha: '2026-04-20', hora: '14:05',
    aceptada: true, propuestaAceptadaId: 2,
    cliente: 'Familia Soto Pérez', direccion: 'Pasaje Los Aromos 789', telefono: '+56 9 9988 7766', correo: 'fam.soto@gmail.com',
    transporte: 60000, manoObra: 210000, margenGlobal: 20,
    propuestas: [
      { id: 1, titulo: 'Opción Estándar', calidadMaterial: 'MEDIA CALIDAD EN ALUMINIO BÁSICO AL25 / AL43', descuento: 0, notas: '', items: [
        { id: 1, tipo: 'Proyectante', cristal: 'DVH 4/12/4', color: 'Antracita', ancho: 600, alto: 1200, cantidad: 3, valorUnitario: 110000 }
      ]},
      { id: 2, titulo: 'Opción Premium Acústica', calidadMaterial: 'ALTA CALIDAD EN PCV EUROPEO®', descuento: 50000, notas: '', items: [
        { id: 2, tipo: 'Proyectante', cristal: '20mm LAM ACÚSTICO', color: 'Antracita', ancho: 600, alto: 1200, cantidad: 3, valorUnitario: 165000 }
      ]}
    ]
  }
]);

// --- Estado y Router ---
const router = useRouter();
const searchTerm = ref('');
const filterAceptada = ref('all');
const dateFrom = ref('');
const dateTo = ref('');
const montoOrder = ref('none');
const currentPage = ref(1);
const itemsPerPage = 10;
const calidades = [
  'ALTA CALIDAD EN PCV EUROPEO®',
  'ALTA CALIDAD EN ALUMINIO PREMIUM XELENTIA®',
  'MEDIA CALIDAD EN ALUMINIO BÁSICO AL25 / AL43',
];

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


// Estado Modales
const previewOpen = ref(false);
const previewCotizacion = ref<Cotizacion | null>(null);
const editModalOpen = ref(false);
const editingCotizacion = ref<Cotizacion | null>(null);

// --- Funciones de Cálculo ---
const calcularSubtotalPropuesta = (prop: Propuesta): number => {
  if (!prop) return 0;
  return prop.items.reduce((sum, item) => sum + (item.valorUnitario * item.cantidad), 0);
};

const getCotizacionMontoEfectivo = (c: Cotizacion): number => {
  let prop = c.propuestas.find(p => p.id === c.propuestaAceptadaId);
  if (!prop && c.propuestas.length > 0) {
    prop = c.propuestas[0]; // Si no hay aceptada, calcular en base a la primera
  }
  if (!prop) return c.transporte + c.manoObra;

  const subtotal = calcularSubtotalPropuesta(prop);
  const descuentoMonto = prop.descuento || 0;
  return Math.max(subtotal - descuentoMonto, 0) + (c.transporte || 0) + (c.manoObra || 0);
};

const updateEstadoAceptacion = (item: Cotizacion) => {
  item.aceptada = item.propuestaAceptadaId !== null;
};

// --- Filtros y Paginación ---
const formatDateDisplay = (isoDate: string) => {
  const parts = isoDate.split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return isoDate;
};

const filteredData = computed(() => {
  const term = searchTerm.value.toLowerCase();
  return mockupData.value.filter((item) => {
    // Search
    const matchesSearch = !term || item.cliente.toLowerCase().includes(term) || item.numero.toLowerCase().includes(term);
    // Estado
    let matchesEstado = true;
    if (filterAceptada.value === 'true') matchesEstado = item.aceptada === true;
    if (filterAceptada.value === 'false') matchesEstado = item.aceptada === false;
    // Fechas
    const afterFrom = !dateFrom.value || item.fecha >= dateFrom.value;
    const beforeTo = !dateTo.value || item.fecha <= dateTo.value;

    return matchesSearch && matchesEstado && afterFrom && beforeTo;
  });
});

const sortedData = computed(() => {
  const data = [...filteredData.value];
  if (montoOrder.value === 'asc') return data.sort((a, b) => getCotizacionMontoEfectivo(a) - getCotizacionMontoEfectivo(b));
  if (montoOrder.value === 'desc') return data.sort((a, b) => getCotizacionMontoEfectivo(b) - getCotizacionMontoEfectivo(a));
  return data;
});

const totalPages = computed(() => Math.ceil(sortedData.value.length / itemsPerPage) || 1);
const paginatedData = computed(() => sortedData.value.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage));

watch([searchTerm, filterAceptada, dateFrom, dateTo, montoOrder], () => { currentPage.value = 1; });

const resetFilters = () => {
  searchTerm.value = ''; filterAceptada.value = 'all';
  dateFrom.value = ''; dateTo.value = '';
  montoOrder.value = 'none'; currentPage.value = 1;
};

// --- Formato ---
const formatCurrency = (amount: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(amount);
const setBorderColor = (event: FocusEvent, color: string) => { (event.target as HTMLInputElement).style.borderColor = color; };
const goToCotizar = () => { router.push('/cotizar'); };
const goToPagoSeguimiento = (item: Cotizacion) => { router.push({ path: '/pagos', query: { cotizacion: item.numero } }); };

// --- Controladores Modal Previsualización ---
const openPreview = (item: Cotizacion) => { previewCotizacion.value = item; previewOpen.value = true; };
const closePreview = () => { previewOpen.value = false; previewCotizacion.value = null; };
const downloadPreviewPdf = () => { window.print(); };

// --- Controladores Modal Edición Completa ---
const openEditModal = (item: Cotizacion) => {
  // Deep clone para evitar mutar la tabla antes de guardar
  editingCotizacion.value = JSON.parse(JSON.stringify({ ...item, propuestas: item.propuestas.slice(0, 3) }));
  editModalOpen.value = true;
};

const closeEditModal = () => {
  editModalOpen.value = false;
  editingCotizacion.value = null;
};

const saveEditModal = () => {
  if (!editingCotizacion.value) return;
  const index = mockupData.value.findIndex(c => c.id === editingCotizacion.value!.id);
  if (index !== -1) {
    mockupData.value[index] = JSON.parse(JSON.stringify(editingCotizacion.value));
  }
  closeEditModal();
};

const deletePropuestaFromEdit = (idx: number) => {
  if (editingCotizacion.value) editingCotizacion.value.propuestas.splice(idx, 1);
};

const deleteItemFromEdit = (pIdx: number, iIdx: number) => {
  if (editingCotizacion.value) editingCotizacion.value.propuestas[pIdx].items.splice(iIdx, 1);
};

const addItemToEdit = (pIdx: number) => {
  if (editingCotizacion.value) {
    editingCotizacion.value.propuestas[pIdx].items.push({
      id: Date.now() + Math.random(),
      tipo: tiposVentana[0], cristal: cristales[1], color: colores[1], ancho: 1000, alto: 1000, cantidad: 1, valorUnitario: 50000
    });
  }
};

const addPropuestaToEdit = () => {
  if (!editingCotizacion.value || editingCotizacion.value.propuestas.length >= 3) return;

  const newId = Date.now();
  const base = editingCotizacion.value.propuestas[0];
  editingCotizacion.value.propuestas.push({
    id: newId,
    titulo: `Propuesta ${editingCotizacion.value.propuestas.length + 1}`,
    calidadMaterial: base?.calidadMaterial || calidades[0],
    descuento: 0,
    notas: base?.notas || '',
    items: (base?.items || []).map((item, idx) => ({ ...item, id: newId + idx + 1 }))
  });
};
</script>