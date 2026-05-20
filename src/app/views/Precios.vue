<template>
  <div class="flex gap-6">
    <!-- ─── CONTENIDO PRINCIPAL ─── -->
    <div class="flex-1">
      <div class="flex items-center justify-between mb-6">
        <h1 style="color: var(--text-primary);">Administrar bases de precios</h1>
        <div class="flex items-center gap-3">
          <span
            v-if="hasChanges"
            class="px-3 py-1.5 rounded-md text-sm"
            style="background-color: var(--accent-light); color: var(--accent);"
          >
            Cambios sin guardar
          </span>
          <button
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90"
            style="background-color: var(--accent);"
            @click="guardar"
          >
            <Save :size="20" />
            <span>Guardar cambios</span>
          </button>
        </div>
      </div>

      <!-- Tabs principales -->
      <div class="flex gap-2 mb-6">
        <button
          v-for="t in ['pvc','aluminio']" :key="t"
          class="px-6 py-3 rounded-lg transition-all"
          :style="{
            backgroundColor: activeTab === t ? 'var(--accent)' : 'var(--surface)',
            color: activeTab === t ? 'white' : 'var(--text-primary)',
            border: activeTab === t ? 'none' : '1px solid var(--border-color)',
          }"
          @click="activeTab = t"
        >
          {{ t === 'pvc' ? 'PVC (Clase A)' : 'Aluminio (Clase A / B)' }}
        </button>
      </div>

      <!-- ══════════ TAB PVC ══════════ -->
      <div v-if="activeTab === 'pvc'">
        <div class="flex gap-2 mb-6 flex-wrap">
          <button
            v-for="tab in pvcSubTabs" :key="tab.id"
            class="px-4 py-2 rounded-lg text-sm transition-all"
            :style="{
              backgroundColor: pvcSubTab === tab.id ? 'var(--accent-light)' : 'var(--surface)',
              color: pvcSubTab === tab.id ? 'var(--accent)' : 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
            }"
            @click="pvcSubTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="space-y-6">
          <!-- Bloque A — Perfiles -->
          <div class="p-6 rounded-xl border" style="background-color: var(--surface); border-color: var(--border-color);">
            <h3 class="mb-1" style="color: var(--text-primary);">Bloque A — Perfiles</h3>
            <p class="text-xs mb-4" style="color: var(--text-hint);">Solo el campo "Valor tira" es editable. Los demás son de referencia.</p>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr style="background-color: var(--page-bg); color: var(--text-hint);">
                    <th class="text-left px-4 py-3 text-xs uppercase font-semibold">Código</th>
                    <th class="text-left px-4 py-3 text-xs uppercase font-semibold">Tipo</th>
                    <th class="text-left px-4 py-3 text-xs uppercase font-semibold">Dim. ancho</th>
                    <th class="text-center px-4 py-3 text-xs uppercase font-semibold">Cant.</th>
                    <th class="text-left px-4 py-3 text-xs uppercase font-semibold">Dim. alto</th>
                    <th class="text-center px-4 py-3 text-xs uppercase font-semibold">Cant.</th>
                    <th class="text-center px-4 py-3 text-xs uppercase font-semibold">Ángulo</th>
                    <th class="text-right px-4 py-3 text-xs uppercase font-semibold">Valor tira ($)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, idx) in perfilesActuales" :key="idx"
                    class="border-t"
                    style="background-color: white; border-color: var(--border-color);"
                  >
                    <td class="px-4 py-3 font-mono text-xs" style="color: var(--text-secondary);">{{ row.codigo }}</td>
                    <td class="px-4 py-3 font-medium" style="color: var(--text-primary);">{{ row.tipo }}</td>
                    <td class="px-4 py-3" style="color: var(--text-secondary);">{{ row.dimAncho }}</td>
                    <td class="px-4 py-3 text-center" style="color: var(--text-secondary);">{{ row.cantAncho }}</td>
                    <td class="px-4 py-3" style="color: var(--text-secondary);">{{ row.dimAlto }}</td>
                    <td class="px-4 py-3 text-center" style="color: var(--text-secondary);">{{ row.cantAlto }}</td>
                    <td class="px-4 py-3 text-center" style="color: var(--text-secondary);">{{ row.angulo }}</td>
                    <td class="px-4 py-3">
                      <input
                        v-model.number="row.valor"
                        type="number"
                        class="w-32 px-3 py-1.5 rounded-lg border text-right font-medium"
                        style="background-color: white; border-color: var(--border-color); color: var(--accent);"
                        @input="hasChanges = true"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Bloque B — Costos fijos -->
          <div class="p-6 rounded-xl border" style="background-color: var(--surface); border-color: var(--border-color);">
            <h3 class="mb-4" style="color: var(--text-primary);">Bloque B — Costos fijos</h3>
            <div class="grid grid-cols-5 gap-4">
              <div v-for="(item, idx) in costosFijosActuales" :key="idx">
                <label class="block text-sm mb-2" style="color: var(--text-secondary);">{{ item.label }}</label>
                <input
                  v-model.number="item.value"
                  type="number"
                  class="w-full px-3 py-2 rounded-lg border text-right"
                  style="background-color: white; border-color: var(--border-color); color: var(--text-primary);"
                  @input="hasChanges = true"
                />
              </div>
            </div>
          </div>

          <!-- Bloque C — Termopanel -->
          <div class="p-6 rounded-xl border" style="background-color: var(--surface); border-color: var(--border-color);">
            <h3 class="mb-4" style="color: var(--text-primary);">Bloque C — Termopanel: precio base y factores</h3>
            <div class="mb-5">
              <label class="block text-sm mb-2" style="color: var(--text-secondary);">Precio base termopanel ($/m²)</label>
              <input
                v-model.number="termoPrecioBase"
                type="number"
                class="w-48 px-4 py-2.5 rounded-lg border text-right font-medium"
                style="background-color: white; border-color: var(--border-color); color: var(--text-primary);"
                @input="hasChanges = true"
              />
            </div>
            <table class="w-full text-sm">
              <thead>
                <tr style="background-color: var(--page-bg); color: var(--text-hint);">
                  <th class="text-left px-4 py-3 text-xs uppercase font-semibold">Tipo de cristal</th>
                  <th class="text-right px-4 py-3 text-xs uppercase font-semibold">Factor</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, idx) in pvcTermopanel" :key="idx"
                  class="border-t"
                  style="background-color: white; border-color: var(--border-color);"
                >
                  <td class="px-4 py-3" style="color: var(--text-primary);">{{ item.label }}</td>
                  <td class="px-4 py-3">
                    <input
                      v-model.number="item.value"
                      type="number"
                      step="0.01"
                      class="w-24 px-3 py-1.5 rounded-lg border text-right ml-auto block"
                      style="background-color: white; border-color: var(--border-color); color: var(--text-primary);"
                      @input="hasChanges = true"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Bloque D — Factores color -->
          <div class="p-6 rounded-xl border" style="background-color: var(--surface); border-color: var(--border-color);">
            <h3 class="mb-4" style="color: var(--text-primary);">Bloque D — Factores por color</h3>
            <table class="w-full text-sm">
              <thead>
                <tr style="background-color: var(--page-bg); color: var(--text-hint);">
                  <th class="text-left px-4 py-3 text-xs uppercase font-semibold">Color</th>
                  <th class="text-right px-4 py-3 text-xs uppercase font-semibold">Factor</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, idx) in pvcFactoresColor" :key="idx"
                  class="border-t"
                  style="background-color: white; border-color: var(--border-color);"
                >
                  <td class="px-4 py-3" style="color: var(--text-primary);">{{ item.label }}</td>
                  <td class="px-4 py-3">
                    <input
                      v-model.number="item.value"
                      type="number"
                      step="0.01"
                      class="w-24 px-3 py-1.5 rounded-lg border text-right ml-auto block"
                      style="background-color: white; border-color: var(--border-color); color: var(--text-primary);"
                      @input="hasChanges = true"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Bloque E — Precios finales (tabla PRECIOS PARA PCV) -->
          <div class="p-6 rounded-xl border" style="background-color: var(--surface); border-color: var(--border-color);">
            <h3 class="mb-1" style="color: var(--text-primary);">Bloque E — Precios finales por termopanel</h3>
            <p class="text-xs mb-4" style="color: var(--text-hint);">Precios calculados para la medida de referencia · Solo lectura · Se actualizan al guardar</p>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr style="background-color: var(--page-bg); color: var(--text-hint);">
                    <th class="text-left px-4 py-3 text-xs uppercase font-semibold">Tipo termopanel</th>
                    <th class="text-center px-4 py-3 text-xs uppercase font-semibold">Factor</th>
                    <th class="text-right px-4 py-3 text-xs uppercase font-semibold">Blanco</th>
                    <th class="text-right px-4 py-3 text-xs uppercase font-semibold">Nogal / Antracita</th>
                    <th class="text-right px-4 py-3 text-xs uppercase font-semibold">Negro</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, idx) in preciosFinalesActuales" :key="idx"
                    class="border-t"
                    :style="{ backgroundColor: idx === 0 ? 'var(--accent-light)' : 'white', borderColor: 'var(--border-color)' }"
                  >
                    <td class="px-4 py-3 font-medium" style="color: var(--text-primary);">
                      {{ row.tipo }}
                      <span v-if="idx === 0" class="ml-2 text-xs px-1.5 py-0.5 rounded" style="background-color: var(--accent); color: white;">base</span>
                    </td>
                    <td class="px-4 py-3 text-center" style="color: var(--text-secondary);">{{ row.factor }}</td>
                    <td class="px-4 py-3 text-right font-semibold" style="color: var(--accent);">{{ fmt(row.blanco) }}</td>
                    <td class="px-4 py-3 text-right font-semibold" style="color: var(--accent);">{{ fmt(row.nogal) }}</td>
                    <td class="px-4 py-3 text-right font-semibold" style="color: var(--accent);">{{ fmt(row.negro) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════ TAB ALUMINIO ══════════ -->
      <div v-if="activeTab === 'aluminio'">
        <div class="flex gap-2 mb-6">
          <button
            v-for="tab in aluminioSubTabs" :key="tab.id"
            class="px-4 py-2 rounded-lg text-sm transition-all"
            :style="{
              backgroundColor: aluminioSubTab === tab.id ? 'var(--accent-light)' : 'var(--surface)',
              color: aluminioSubTab === tab.id ? 'var(--accent)' : 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
            }"
            @click="aluminioSubTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Sub-tab: Tabla precios/m² -->
        <div v-if="aluminioSubTab === 'tabla-precios'" class="space-y-5">
          <div class="p-6 rounded-xl border" style="background-color: var(--surface); border-color: var(--border-color);">
            <div class="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label class="block text-sm mb-2" style="color: var(--text-secondary);">Descuento Básico vs Premium ($/m²)</label>
                <input v-model.number="aluminioDescuento" type="number" class="w-full px-4 py-2.5 rounded-lg border text-right" style="background-color: white; border-color: var(--border-color); color: var(--text-primary);" @input="hasChanges = true" />
              </div>
              <div>
                <label class="block text-sm mb-2" style="color: var(--text-secondary);">Factor IVA</label>
                <input v-model.number="aluminioIva" type="number" step="0.01" class="w-full px-4 py-2.5 rounded-lg border text-right" style="background-color: white; border-color: var(--border-color); color: var(--text-primary);" @input="hasChanges = true" />
              </div>
              <div>
                <label class="block text-sm mb-2" style="color: var(--text-secondary);">Recargo termopaneles especiales ($)</label>
                <input v-model.number="aluminioRecargoEspecial" type="number" class="w-full px-4 py-2.5 rounded-lg border text-right" style="background-color: white; border-color: var(--border-color); color: var(--text-primary);" @input="hasChanges = true" />
              </div>
            </div>

            <h4 class="text-sm font-semibold mb-1" style="color: var(--text-primary);">Valores base Xelentia ($/m²)</h4>
            <p class="text-xs mb-3" style="color: var(--text-hint);">Referencia de precios por tipo de ventana</p>
            <div class="grid grid-cols-5 gap-3 mb-6">
              <div v-for="vb in valoresBase" :key="vb.label">
                <label class="block text-xs mb-1.5" style="color: var(--text-secondary);">{{ vb.label }}</label>
                <input v-model.number="vb.value" type="number" class="w-full px-3 py-2 rounded-lg border text-right text-sm font-medium" style="background-color: white; border-color: var(--border-color); color: var(--accent);" @input="hasChanges = true" />
              </div>
            </div>

            <h4 class="text-sm font-semibold mb-3" style="color: var(--text-primary);">Tabla de precios por m² — lookup completa</h4>
            <div class="overflow-x-auto max-h-96 overflow-y-auto">
              <table class="w-full text-sm">
                <thead class="sticky top-0">
                  <tr style="background-color: var(--surface); color: var(--text-hint);">
                    <th class="text-left px-4 py-3 text-xs uppercase font-semibold">m²</th>
                    <th class="text-right px-4 py-3 text-xs uppercase font-semibold">Corredera ($/m²)</th>
                    <th class="text-right px-4 py-3 text-xs uppercase font-semibold">Abatir / Proy. ($/m²)</th>
                    <th class="text-right px-4 py-3 text-xs uppercase font-semibold">Fijo ($/m²)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, idx) in aluminioTabla" :key="idx"
                    class="border-t"
                    style="background-color: white; border-color: var(--border-color);"
                  >
                    <td class="px-4 py-2.5 font-medium" style="color: var(--text-primary);">{{ row.m2.toFixed(2) }}</td>
                    <td class="px-4 py-2.5">
                      <input v-if="row.corredera !== null" v-model.number="row.corredera" type="number" class="w-full px-3 py-1.5 rounded-lg border text-right" style="background-color: white; border-color: var(--border-color); color: var(--accent);" @input="hasChanges = true" />
                      <span v-else class="block text-right" style="color: var(--text-hint);">—</span>
                    </td>
                    <td class="px-4 py-2.5">
                      <input v-if="row.abatir !== null" v-model.number="row.abatir" type="number" class="w-full px-3 py-1.5 rounded-lg border text-right" style="background-color: white; border-color: var(--border-color); color: var(--accent);" @input="hasChanges = true" />
                      <span v-else class="block text-right" style="color: var(--text-hint);">—</span>
                    </td>
                    <td class="px-4 py-2.5">
                      <input v-if="row.fijo !== null" v-model.number="row.fijo" type="number" class="w-full px-3 py-1.5 rounded-lg border text-right" style="background-color: white; border-color: var(--border-color); color: var(--accent);" @input="hasChanges = true" />
                      <span v-else class="block text-right" style="color: var(--text-hint);">—</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Sub-tab: Instalación -->
        <div v-if="aluminioSubTab === 'instalacion'" class="p-6 rounded-xl border" style="background-color: var(--surface); border-color: var(--border-color);">
          <h3 class="mb-1" style="color: var(--text-primary);">Costos de instalación por cantidad de ventanas</h3>
          <p class="text-xs mb-5" style="color: var(--text-hint);">Datos extraídos de la hoja CALCULOS ALUMINIO</p>
          <table class="w-full text-sm max-w-sm">
            <thead>
              <tr style="background-color: var(--page-bg); color: var(--text-hint);">
                <th class="text-left px-4 py-3 text-xs uppercase font-semibold">N° ventanas</th>
                <th class="text-right px-4 py-3 text-xs uppercase font-semibold">Costo instalación ($)</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, idx) in aluminioInstalacion" :key="idx"
                class="border-t"
                style="background-color: white; border-color: var(--border-color);"
              >
                <td class="px-4 py-3 font-medium" style="color: var(--text-primary);">{{ item.label }}</td>
                <td class="px-4 py-3">
                  <input
                    v-model.number="item.value"
                    type="number"
                    class="w-full px-3 py-1.5 rounded-lg border text-right font-medium"
                    style="background-color: white; border-color: var(--border-color); color: var(--accent);"
                    @input="hasChanges = true"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Sub-tab: Adicionales -->
        <div v-if="aluminioSubTab === 'adicionales'" class="p-6 rounded-xl border" style="background-color: var(--surface); border-color: var(--border-color);">
          <h3 class="mb-1" style="color: var(--text-primary);">Elementos adicionales</h3>
          <p class="text-xs mb-5" style="color: var(--text-hint);">Precios diferenciados por material — Hoja CALCULOS ALUMINIO</p>
          <table class="w-full text-sm">
            <thead>
              <tr style="background-color: var(--page-bg); color: var(--text-hint);">
                <th class="text-left px-4 py-3 text-xs uppercase font-semibold">Elemento</th>
                <th class="text-right px-4 py-3 text-xs uppercase font-semibold">Aluminio ($)</th>
                <th class="text-right px-4 py-3 text-xs uppercase font-semibold">PVC ($)</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, idx) in aluminioAdicionales" :key="idx"
                class="border-t"
                style="background-color: white; border-color: var(--border-color);"
              >
                <td class="px-4 py-3 font-medium" style="color: var(--text-primary);">{{ row.elemento }}</td>
                <td class="px-4 py-3">
                  <input v-model.number="row.aluminio" type="number" class="w-full px-3 py-1.5 rounded-lg border text-right font-medium" style="background-color: white; border-color: var(--border-color); color: var(--accent);" @input="hasChanges = true" />
                </td>
                <td class="px-4 py-3">
                  <input v-model.number="row.pvc" type="number" class="w-full px-3 py-1.5 rounded-lg border text-right font-medium" style="background-color: white; border-color: var(--border-color); color: var(--accent);" @input="hasChanges = true" />
                </td>
              </tr>
            </tbody>
          </table>
          <div class="mt-4 p-3 rounded-lg text-xs" style="background-color: var(--accent-light); color: var(--text-secondary);">
            Los termopaneles especiales (LAM ACÚS 18mm, Incoloro 18mm, Satén 18mm, Especial) suman un recargo de ${{ fmt(aluminioRecargoEspecial) }} al precio base.
          </div>
        </div>
      </div>
    </div>

    <!-- ─── SIMULADOR LATERAL ─── -->
    <div
      class="w-80 sticky top-6 self-start rounded-xl border overflow-hidden"
      style="background-color: var(--surface); border-color: var(--border-color);"
    >
      <!-- Header del simulador -->
      <div class="px-5 py-4 border-b" style="background-color: var(--accent); border-color: transparent;">
        <div class="flex items-center gap-2 mb-0.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>
          </svg>
          <span class="text-white font-semibold text-sm uppercase tracking-wider">Simulador de precio</span>
        </div>
        <p class="text-xs" style="color: rgba(255,255,255,0.7);">Pruebas en tiempo real con bases actuales</p>
      </div>

      <div class="p-5">
        <!-- Configuración de prueba -->
        <div class="mb-5">
          <p class="text-xs font-semibold uppercase tracking-wider mb-3" style="color: var(--text-hint);">Configuración de prueba</p>

          <div class="mb-3">
            <label class="block text-xs mb-1.5" style="color: var(--text-secondary);">Tipo de Ventana</label>
            <select
              v-model="sim.tipo"
              class="w-full px-3 py-2.5 rounded-lg border text-sm"
              style="background-color: white; border-color: var(--border-color); color: var(--text-primary);"
            >
              <option v-for="t in tiposSimulador" :key="t.id" :value="t.id">{{ t.label }}</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label class="block text-xs mb-1.5" style="color: var(--text-secondary);">Ancho (mm)</label>
              <input v-model.number="sim.ancho" type="number" class="w-full px-3 py-2.5 rounded-lg border text-sm" style="background-color: white; border-color: var(--border-color); color: var(--text-primary);" />
            </div>
            <div>
              <label class="block text-xs mb-1.5" style="color: var(--text-secondary);">Alto (mm)</label>
              <input v-model.number="sim.alto" type="number" class="w-full px-3 py-2.5 rounded-lg border text-sm" style="background-color: white; border-color: var(--border-color); color: var(--text-primary);" />
            </div>
          </div>

          <div>
            <label class="block text-xs mb-1.5" style="color: var(--text-secondary);">Termopanel</label>
            <select
              v-model="sim.termopanel"
              class="w-full px-3 py-2.5 rounded-lg border text-sm"
              style="background-color: white; border-color: var(--border-color); color: var(--text-primary);"
            >
              <option v-for="t in pvcTermopanel" :key="t.label" :value="t.label">{{ t.label }}</option>
            </select>
          </div>
        </div>

        <!-- Desglose de costos -->
        <div class="mb-5">
          <p class="text-xs font-semibold uppercase tracking-wider mb-3" style="color: var(--text-hint);">Desglose de costos estimado</p>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span style="color: var(--text-secondary);">Perfiles ({{ desglose.metrosLineal.toFixed(1) }} ml)</span>
              <span class="font-medium" style="color: var(--text-primary);">{{ fmt(desglose.perfiles) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span style="color: var(--text-secondary);">Vidrio ({{ desglose.area.toFixed(2) }} m²)</span>
              <span class="font-medium" style="color: var(--text-primary);">{{ fmt(desglose.vidrio) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span style="color: var(--text-secondary);">Mano de Obra</span>
              <span class="font-medium" style="color: var(--text-primary);">{{ fmt(desglose.manoObra) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span style="color: var(--text-secondary);">Herrajes & Accesorios</span>
              <span class="font-medium" style="color: var(--text-primary);">{{ fmt(desglose.herrajes) }}</span>
            </div>
          </div>
        </div>

        <!-- Resultado final -->
        <div class="rounded-lg px-4 py-3 flex items-end justify-between" style="background-color: var(--accent);">
          <div>
            <p class="text-xs mb-0.5" style="color: rgba(255,255,255,0.7);">Precio sugerido</p>
            <p class="text-2xl font-bold text-white">{{ fmt(desglose.precioFinal) }}</p>
          </div>
          <div class="text-right">
            <p class="text-xs mb-0.5" style="color: rgba(255,255,255,0.7);">Margen bruto</p>
            <p class="text-xl font-bold text-white">{{ desglose.margen }}%</p>
          </div>
        </div>

        <p class="text-xs mt-3 text-center" style="color: var(--text-hint);">Precio incluye IVA · Color: Blanco</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Save } from 'lucide-vue-next'

type Tab = { id: string; label: string }
type PvcPerfilItem = { codigo: string; tipo: string; dimAncho: string; cantAncho: number; dimAlto: string; cantAlto: number; angulo: string; valor: number; trozoPct: number }
type CostoItem = { label: string; value: number }
type AluminioRow = { m2: number; corredera: number | null; abatir: number | null; fijo: number | null }
type AdicionalRow = { elemento: string; aluminio: number; pvc: number }
type PrecioFinalRow = { tipo: string; factor: number; blanco: number; nogal: number; negro: number }

const activeTab = ref<'pvc' | 'aluminio'>('pvc')
const pvcSubTab = ref('marco-fijo')
const aluminioSubTab = ref('tabla-precios')
const hasChanges = ref(false)

const pvcSubTabs: Tab[] = [
  { id: 'marco-fijo', label: 'Marco fijo' },
  { id: 'corredera-chica', label: 'Corredera chica' },
  { id: 'corredera-grande', label: 'Corredera grande' },
  { id: 'abatir', label: 'Abatir' },
  { id: 'proyectante', label: 'Proyectante' },
  { id: 'puerta', label: 'Puerta' },
]

const aluminioSubTabs: Tab[] = [
  { id: 'tabla-precios', label: 'Tabla precios/m²' },
  { id: 'instalacion', label: 'Instalación' },
  { id: 'adicionales', label: 'Elementos adicionales' },
]

const tiposSimulador = [
  { id: 'marco-fijo', label: 'PVC – Marco Fijo 70mm' },
  { id: 'corredera-chica', label: 'PVC – Corredera Chica' },
  { id: 'corredera-grande', label: 'PVC – Corredera Grande' },
  { id: 'abatir', label: 'PVC – Abatir Exterior' },
  { id: 'proyectante', label: 'PVC – Proyectante' },
  { id: 'puerta', label: 'PVC – Puerta' },
]

// ─── DATOS DE PERFILES (extraídos del Excel hoja a hoja) ──────────────────
const todosPerfiles: Record<string, PvcPerfilItem[]> = {
  'marco-fijo': [
    { codigo: '65201VER',    tipo: 'Marco',     dimAncho: 'KSG+6',  cantAncho: 2, dimAlto: 'KSY+6',  cantAlto: 2, angulo: '45°', valor: 17432, trozoPct: 0.5 },
    { codigo: '61011VER999', tipo: 'Refuerzo',  dimAncho: 'KSG-85', cantAncho: 2, dimAlto: 'KSY-85', cantAlto: 2, angulo: '90°', valor: 8256,  trozoPct: 0.5 },
    { codigo: 'todos',       tipo: 'Junquillo', dimAncho: 'KSG-80', cantAncho: 2, dimAlto: 'KSY-80', cantAlto: 2, angulo: '45°', valor: 4188,  trozoPct: 0.5 },
  ],
  'corredera-chica': [
    { codigo: '67401VER',    tipo: 'Marco',      dimAncho: 'KSG+6',  cantAncho: 2, dimAlto: 'KSY+6',  cantAlto: 2, angulo: '45°', valor: 22063, trozoPct: 0.5 },
    { codigo: '69040STL001', tipo: 'Refuerzo',   dimAncho: 'KSG+0',  cantAncho: 2, dimAlto: 'KSY+0',  cantAlto: 2, angulo: '90°', valor: 11626, trozoPct: 0.5 },
    { codigo: '67415VER',    tipo: 'Hoja chica', dimAncho: 'KSG/2',  cantAncho: 4, dimAlto: 'KSY+0',  cantAlto: 4, angulo: '45°', valor: 22514, trozoPct: 0.5 },
    { codigo: '69041STL000', tipo: 'Ref. hoja',  dimAncho: 'KSG/2',  cantAncho: 4, dimAlto: 'KSY+0',  cantAlto: 4, angulo: '90°', valor: 6261,  trozoPct: 0.5 },
    { codigo: 'todos',       tipo: 'Junquillo',  dimAncho: 'KSG/2',  cantAncho: 4, dimAlto: 'KSY+0',  cantAlto: 4, angulo: '45°', valor: 8466,  trozoPct: 0.5 },
    { codigo: '67419ver',    tipo: 'Traslapo',   dimAncho: 'KSY+0',  cantAncho: 2, dimAlto: 'KSY+0',  cantAlto: 0, angulo: '90°', valor: 8321,  trozoPct: 0.5 },
    { codigo: '61016ver',    tipo: 'Riel',       dimAncho: 'KSG/2',  cantAncho: 2, dimAlto: 'KSG/2',  cantAlto: 0, angulo: '90°', valor: 7668,  trozoPct: 0.5 },
  ],
  'corredera-grande': [
    { codigo: '67401VER',    tipo: 'Marco',       dimAncho: 'KSG+6',  cantAncho: 2, dimAlto: 'KSY+6',  cantAlto: 2, angulo: '45°', valor: 22063, trozoPct: 0.5 },
    { codigo: '69014STL001', tipo: 'Refuerzo',    dimAncho: 'KSG+0',  cantAncho: 2, dimAlto: 'KSY+0',  cantAlto: 2, angulo: '90°', valor: 11626, trozoPct: 0.5 },
    { codigo: '67414VER',    tipo: 'Hoja grande', dimAncho: 'KSG/2',  cantAncho: 4, dimAlto: 'KSY+0',  cantAlto: 4, angulo: '45°', valor: 27359, trozoPct: 0.5 },
    { codigo: '69069STL000', tipo: 'Ref. hoja',   dimAncho: 'KSG/2',  cantAncho: 4, dimAlto: 'KSY+0',  cantAlto: 4, angulo: '90°', valor: 11262, trozoPct: 0.5 },
    { codigo: 'todos',       tipo: 'Junquillo',   dimAncho: 'KSG/2',  cantAncho: 4, dimAlto: 'KSY+0',  cantAlto: 4, angulo: '45°', valor: 8466,  trozoPct: 0.5 },
    { codigo: '67418ver',    tipo: 'Traslapo',    dimAncho: 'KSY+0',  cantAncho: 2, dimAlto: 'KSY+0',  cantAlto: 0, angulo: '90°', valor: 8833,  trozoPct: 0.5 },
    { codigo: '61016ver',    tipo: 'Riel',        dimAncho: 'KSG/2',  cantAncho: 2, dimAlto: 'KSG/2',  cantAlto: 0, angulo: '90°', valor: 7668,  trozoPct: 0.5 },
  ],
  'abatir': [
    { codigo: '65201VER',    tipo: 'Marco',              dimAncho: 'KSG+6',   cantAncho: 2, dimAlto: 'KSY+6',   cantAlto: 2, angulo: '45°', valor: 17432, trozoPct: 0.7 },
    { codigo: '61011VER999', tipo: 'Refuerzo marco',     dimAncho: 'KSG-85',  cantAncho: 2, dimAlto: 'KSY-85',  cantAlto: 2, angulo: '90°', valor: 8256,  trozoPct: 0.7 },
    { codigo: '65209VER',    tipo: 'Hoja exterior',      dimAncho: 'KSG-58',  cantAncho: 2, dimAlto: 'KSY-58',  cantAlto: 2, angulo: '45°', valor: 20474, trozoPct: 0.7 },
    { codigo: '61011VER990', tipo: 'Refuerzo hoja',      dimAncho: 'KSG-181', cantAncho: 2, dimAlto: 'KSY-176', cantAlto: 2, angulo: '90°', valor: 12147, trozoPct: 0.7 },
    { codigo: 'todos',       tipo: 'Junquillo',          dimAncho: 'KSG-176', cantAncho: 2, dimAlto: 'KSY-176', cantAlto: 2, angulo: '45°', valor: 8466,  trozoPct: 0.7 },
  ],
  'proyectante': [
    { codigo: '65201VER',    tipo: 'Marco',              dimAncho: 'KSG+6',   cantAncho: 2, dimAlto: 'KSY+6',   cantAlto: 2, angulo: '45°', valor: 17432, trozoPct: 0.7 },
    { codigo: '61011VER999', tipo: 'Refuerzo marco',     dimAncho: 'KSG-85',  cantAncho: 2, dimAlto: 'KSY-85',  cantAlto: 2, angulo: '90°', valor: 8256,  trozoPct: 0.7 },
    { codigo: '65209VER',    tipo: 'Hoja proyectante',   dimAncho: 'KSG-58',  cantAncho: 2, dimAlto: 'KSY-58',  cantAlto: 2, angulo: '45°', valor: 20474, trozoPct: 0.7 },
    { codigo: '61011VER990', tipo: 'Refuerzo hoja',      dimAncho: 'KSG-181', cantAncho: 2, dimAlto: 'KSY-176', cantAlto: 2, angulo: '90°', valor: 12147, trozoPct: 0.7 },
    { codigo: 'todos',       tipo: 'Junquillo',          dimAncho: 'KSG-176', cantAncho: 2, dimAlto: 'KSY-176', cantAlto: 2, angulo: '45°', valor: 8466,  trozoPct: 0.7 },
  ],
  'puerta': [
    { codigo: '65201VER',    tipo: 'Marco',              dimAncho: 'KSG+6',   cantAncho: 2, dimAlto: 'KSY+6',   cantAlto: 2, angulo: '45°', valor: 16343, trozoPct: 0.5 },
    { codigo: '69070STL001', tipo: 'Refuerzo marco',     dimAncho: 'KSG-85',  cantAncho: 1, dimAlto: 'KSY-85',  cantAlto: 2, angulo: '90°', valor: 7796,  trozoPct: 0.5 },
    { codigo: '65210VER',    tipo: 'Hoja de puerta ext', dimAncho: 'KSG-58',  cantAncho: 2, dimAlto: 'KSY-58',  cantAlto: 2, angulo: '45°', valor: 24864, trozoPct: 0.5 },
    { codigo: '69025STL000', tipo: 'Refuerzo hoja',      dimAncho: 'KSG-178', cantAncho: 2, dimAlto: 'KSY-178', cantAlto: 2, angulo: '90°', valor: 12147, trozoPct: 0.5 },
    { codigo: 'todos',       tipo: 'Junquillo',          dimAncho: 'KSG-173', cantAncho: 2, dimAlto: 'KSY-173', cantAlto: 2, angulo: '45°', valor: 3887,  trozoPct: 0.5 },
  ],
}

const perfilesActuales = computed(() => todosPerfiles[pvcSubTab.value] ?? [])

// ─── COSTOS FIJOS por sub-tab ────────────────────────────────────────────
const todosCostos: Record<string, CostoItem[]> = {
  'marco-fijo':      [{ label: 'Quincallería ($)', value: 15000 }, { label: 'MOF ($)', value: 40000 }, { label: 'MOI ($)', value: 40000 }, { label: 'Costos fijos ($)', value: 70000 }, { label: 'Menos instalación ($)', value: 30000 }],
  'corredera-chica': [{ label: 'Quincallería ($)', value: 46000 }, { label: 'MOF ($)', value: 40000 }, { label: 'MOI ($)', value: 40000 }, { label: 'Costos fijos ($)', value: 70000 }, { label: 'Menos instalación ($)', value: 30000 }],
  'corredera-grande':[{ label: 'Quincallería ($)', value: 46000 }, { label: 'MOF ($)', value: 40000 }, { label: 'MOI ($)', value: 40000 }, { label: 'Costos fijos ($)', value: 70000 }, { label: 'Menos instalación ($)', value: 30000 }],
  'abatir':          [{ label: 'Quincallería ($)', value: 46000 }, { label: 'MOF ($)', value: 40000 }, { label: 'MOI ($)', value: 40000 }, { label: 'Costos fijos ($)', value: 70000 }, { label: 'Menos instalación ($)', value: 30000 }],
  'proyectante':     [{ label: 'Quincallería ($)', value: 46000 }, { label: 'MOF ($)', value: 40000 }, { label: 'MOI ($)', value: 40000 }, { label: 'Costos fijos ($)', value: 70000 }, { label: 'Menos instalación ($)', value: 30000 }],
  'puerta':          [{ label: 'Quincallería ($)', value: 75205 }, { label: 'MOF ($)', value: 40000 }, { label: 'MOI ($)', value: 40000 }, { label: 'Costos fijos ($)', value: 70000 }, { label: 'Menos instalación ($)', value: 30000 }],
}
const costosFijosActuales = computed(() => todosCostos[pvcSubTab.value] ?? todosCostos['marco-fijo'])

// ─── TERMOPANEL ──────────────────────────────────────────────────────────
const termoPrecioBase = ref(35000) // precio base $/m² para PVC Marco Fijo (Blanco)

const pvcTermopanel = ref([
  { label: 'TERMOPANEL 20 mm (5+10+5) INCOLORO',     value: 1.00 },
  { label: 'TERMOPANEL 20 mm (4+10+6) LAM ACUS',     value: 1.06 },
  { label: 'TERMOPANEL 18 mm (4+8+6) LAM ACUS INCO', value: 1.06 },
  { label: 'TERMOPANEL 20 mm (5+10+5) SATEN',        value: 1.08 },
  { label: 'TERMOPANEL 18 mm (4+10+4) INCOLORO',     value: 0.98 },
  { label: 'TERMOPANEL 18 mm (4+10+4) SATEN',        value: 1.00 },
  { label: 'TERMOPANEL ESPECIAL (TEXTO LIBRE)',       value: 1.06 },
])

const pvcFactoresColor = ref([
  { label: 'Blanco',                value: 1.00 },
  { label: 'Nogal / Roble / Antracita', value: 1.34 },
  { label: 'Negro / Mate',          value: 1.52 },
])

// ─── PRECIOS FINALES por sub-tab (PRECIOS PARA PCV) ─────────────────────
const todosPreciosFinales: Record<string, PrecioFinalRow[]> = {
  'marco-fijo': [
    { tipo: 'TERMOPANEL 20 mm (5+10+5) INCOLORO',     factor: 1.00, blanco:  95527, nogal: 128152, negro: 145235 },
    { tipo: 'TERMOPANEL 20 mm (4+10+6) LAM ACUS',     factor: 1.06, blanco: 101259, nogal: 135841, negro: 153949 },
    { tipo: 'TERMOPANEL 18 mm (4+8+6) LAM ACUS INCO', factor: 1.06, blanco: 101259, nogal: 135841, negro: 153949 },
    { tipo: 'TERMOPANEL 20 mm (5+10+5) SATEN',        factor: 1.08, blanco: 103170, nogal: 138404, negro: 156854 },
    { tipo: 'TERMOPANEL 18 mm (4+10+4) INCOLORO',     factor: 0.98, blanco:  93617, nogal: 125589, negro: 142330 },
    { tipo: 'TERMOPANEL 18 mm (4+10+4) SATEN',        factor: 1.00, blanco:  95527, nogal: 128152, negro: 145235 },
    { tipo: 'TERMOPANEL ESPECIAL (TEXTO LIBRE)',       factor: 1.06, blanco: 101259, nogal: 135841, negro: 153949 },
  ],
  'corredera-chica': [
    { tipo: 'TERMOPANEL 20 mm (5+10+5) INCOLORO',     factor: 1.00, blanco: 531425, nogal: 681671, negro:  853173 },
    { tipo: 'TERMOPANEL 20 mm (4+10+6) LAM ACUS',     factor: 1.06, blanco: 563311, nogal: 722571, negro:  904363 },
    { tipo: 'TERMOPANEL 18 mm (4+8+6) LAM ACUS INCO', factor: 1.06, blanco: 563311, nogal: 722571, negro:  904363 },
    { tipo: 'TERMOPANEL 20 mm (5+10+5) SATEN',        factor: 1.08, blanco: 573939, nogal: 736204, negro:  921427 },
    { tipo: 'TERMOPANEL 18 mm (4+10+4) INCOLORO',     factor: 0.98, blanco: 520797, nogal: 668037, negro:  836109 },
    { tipo: 'TERMOPANEL 18 mm (4+10+4) SATEN',        factor: 1.00, blanco: 531425, nogal: 681671, negro:  853173 },
    { tipo: 'TERMOPANEL ESPECIAL (TEXTO LIBRE)',       factor: 1.06, blanco: 563311, nogal: 722571, negro:  904363 },
  ],
  'corredera-grande': [
    { tipo: 'TERMOPANEL 20 mm (5+10+5) INCOLORO',     factor: 1.00, blanco: 721879, nogal: 854528, negro: 1094408 },
    { tipo: 'TERMOPANEL 20 mm (4+10+6) LAM ACUS',     factor: 1.06, blanco: 765192, nogal: 905799, negro: 1160073 },
    { tipo: 'TERMOPANEL 18 mm (4+8+6) LAM ACUS INCO', factor: 1.06, blanco: 765192, nogal: 905799, negro: 1160073 },
    { tipo: 'TERMOPANEL 20 mm (5+10+5) SATEN',        factor: 1.08, blanco: 779629, nogal: 922890, negro: 1181961 },
    { tipo: 'TERMOPANEL 18 mm (4+10+4) INCOLORO',     factor: 0.98, blanco: 707441, nogal: 837437, negro: 1072520 },
    { tipo: 'TERMOPANEL 18 mm (4+10+4) SATEN',        factor: 1.00, blanco: 721879, nogal: 854528, negro: 1094408 },
    { tipo: 'TERMOPANEL ESPECIAL (TEXTO LIBRE)',       factor: 1.06, blanco: 765192, nogal: 905799, negro: 1160073 },
  ],
  'abatir': [
    { tipo: 'TERMOPANEL 20 mm (5+10+5) INCOLORO',     factor: 1.00, blanco: 376087, nogal: 456230, negro: 503750 },
    { tipo: 'TERMOPANEL 20 mm (4+10+6) LAM ACUS',     factor: 1.06, blanco: 398653, nogal: 483603, negro: 533975 },
    { tipo: 'TERMOPANEL 18 mm (4+8+6) LAM ACUS INCO', factor: 1.06, blanco: 398653, nogal: 483603, negro: 533975 },
    { tipo: 'TERMOPANEL 20 mm (5+10+5) SATEN',        factor: 1.08, blanco: 406174, nogal: 492728, negro: 544050 },
    { tipo: 'TERMOPANEL 18 mm (4+10+4) INCOLORO',     factor: 0.98, blanco: 368566, nogal: 447105, negro: 493675 },
    { tipo: 'TERMOPANEL 18 mm (4+10+4) SATEN',        factor: 1.00, blanco: 376087, nogal: 456230, negro: 503750 },
    { tipo: 'TERMOPANEL ESPECIAL (TEXTO LIBRE)',       factor: 1.06, blanco: 398653, nogal: 483603, negro: 533975 },
  ],
  'proyectante': [
    { tipo: 'TERMOPANEL 20 mm (5+10+5) INCOLORO',     factor: 1.00, blanco: 265336, nogal: 456230, negro: 503750 },
    { tipo: 'TERMOPANEL 20 mm (4+10+6) LAM ACUS',     factor: 1.06, blanco: 281256, nogal: 483603, negro: 533975 },
    { tipo: 'TERMOPANEL 18 mm (4+8+6) LAM ACUS INCO', factor: 1.06, blanco: 281256, nogal: 483603, negro: 533975 },
    { tipo: 'TERMOPANEL 20 mm (5+10+5) SATEN',        factor: 1.08, blanco: 286563, nogal: 492728, negro: 544050 },
    { tipo: 'TERMOPANEL 18 mm (4+10+4) INCOLORO',     factor: 0.98, blanco: 260029, nogal: 447105, negro: 493675 },
    { tipo: 'TERMOPANEL 18 mm (4+10+4) SATEN',        factor: 1.00, blanco: 265336, nogal: 456230, negro: 503750 },
    { tipo: 'TERMOPANEL ESPECIAL (TEXTO LIBRE)',       factor: 1.06, blanco: 281256, nogal: 483603, negro: 533975 },
  ],
  'puerta': [
    { tipo: 'TERMOPANEL 20 mm (5+10+5) INCOLORO',     factor: 1.00, blanco: 691225, nogal: 830840, negro:  982533 },
    { tipo: 'TERMOPANEL 20 mm (4+10+6) LAM ACUS',     factor: 1.06, blanco: 732699, nogal: 880691, negro: 1041485 },
    { tipo: 'TERMOPANEL 18 mm (4+8+6) LAM ACUS INCO', factor: 1.06, blanco: 732699, nogal: 880691, negro: 1041485 },
    { tipo: 'TERMOPANEL 20 mm (5+10+5) SATEN',        factor: 1.08, blanco: 746523, nogal: 897307, negro: 1061136 },
    { tipo: 'TERMOPANEL 18 mm (4+10+4) INCOLORO',     factor: 0.98, blanco: 677401, nogal: 814223, negro:  962883 },
    { tipo: 'TERMOPANEL 18 mm (4+10+4) SATEN',        factor: 1.00, blanco: 691225, nogal: 830840, negro:  982533 },
    { tipo: 'TERMOPANEL ESPECIAL (TEXTO LIBRE)',       factor: 1.06, blanco: 732699, nogal: 880691, negro: 1041485 },
  ],
}
const preciosFinalesActuales = computed(() => todosPreciosFinales[pvcSubTab.value] ?? todosPreciosFinales['marco-fijo'])

// ─── ALUMINIO ─────────────────────────────────────────────────────────────
const aluminioDescuento = ref(15000)
const aluminioIva = ref(1.19)
const aluminioRecargoEspecial = ref(30000)

const valoresBase = ref([
  { label: 'Proyect./Abatir ($/m²)', value: 190000 },
  { label: 'Fija ($/m²)',            value: 110000 },
  { label: 'Puerta ($/m²)',          value: 220000 },
  { label: 'Corredera ≤2300mm',      value: 145000 },
  { label: 'Corredera >2300mm',      value: 135000 },
])

const aluminioTabla = ref<AluminioRow[]>([
  { m2: 0.25, corredera: 500000, abatir: 520000, fijo: 350000 },
  { m2: 0.30, corredera: 450000, abatir: 510000, fijo: 315000 },
  { m2: 0.35, corredera: 400000, abatir: 505000, fijo: 280000 },
  { m2: 0.40, corredera: 372000, abatir: 495000, fijo: 260400 },
  { m2: 0.45, corredera: 345000, abatir: 487500, fijo: 241500 },
  { m2: 0.50, corredera: 317000, abatir: 460000, fijo: 221900 },
  { m2: 0.55, corredera: 290000, abatir: 455700, fijo: 203000 },
  { m2: 0.60, corredera: 277000, abatir: 450000, fijo: 193900 },
  { m2: 0.65, corredera: 265000, abatir: 395000, fijo: 185500 },
  { m2: 0.70, corredera: 252000, abatir: 340000, fijo: 176400 },
  { m2: 0.75, corredera: 240000, abatir: 307000, fijo: 168000 },
  { m2: 0.80, corredera: 230000, abatir: 275000, fijo: 161000 },
  { m2: 0.85, corredera: 220000, abatir: 252500, fijo: 154000 },
  { m2: 0.90, corredera: 210000, abatir: 230000, fijo: 147000 },
  { m2: 0.95, corredera: 205000, abatir: 215000, fijo: 143500 },
  { m2: 1.00, corredera: 200000, abatir: 210000, fijo: 140000 },
  { m2: 1.05, corredera: 190000, abatir: 195000, fijo: 133000 },
  { m2: 1.10, corredera: 180000, abatir: 185000, fijo: 126000 },
  { m2: 1.15, corredera: 175000, abatir: 180000, fijo: 122500 },
  { m2: 1.20, corredera: 170000, abatir: 175000, fijo: 119000 },
  { m2: 1.25, corredera: 170000, abatir: null,   fijo: 119000 },
  { m2: 1.30, corredera: 165000, abatir: null,   fijo: 115500 },
  { m2: 1.35, corredera: 160000, abatir: null,   fijo: 112000 },
  { m2: 1.40, corredera: 155000, abatir: null,   fijo: null   },
  { m2: 1.45, corredera: 150000, abatir: null,   fijo: null   },
  { m2: 1.50, corredera: 145000, abatir: null,   fijo: null   },
  { m2: 1.55, corredera: 140000, abatir: null,   fijo: null   },
  { m2: 1.60, corredera: 135000, abatir: null,   fijo: null   },
])

const aluminioInstalacion = ref([
  { label: '1 chica',  value: 45000  },
  { label: '1 grande', value: 65000  },
  { label: '2',        value: 78000  },
  { label: '3',        value: 108000 },
  { label: '4',        value: 136000 },
  { label: '5',        value: 160000 },
  { label: '6',        value: 180000 },
  { label: '7',        value: 196000 },
  { label: '8',        value: 208000 },
  { label: '9',        value: 226800 },
  { label: '10',       value: 244000 },
  { label: '11',       value: 259600 },
  { label: '12',       value: 273600 },
  { label: '13',       value: 286000 },
  { label: '14',       value: 296800 },
  { label: '15',       value: 306000 },
  { label: '16',       value: 313600 },
  { label: '17',       value: 319600 },
  { label: '18',       value: 324000 },
  { label: '19',       value: 326800 },
  { label: '20',       value: 328000 },
])

const aluminioAdicionales = ref<AdicionalRow[]>([
  { elemento: 'Rodón / Pilar estructural para unión de elementos', aluminio: 35478,  pvc: 75897  },
  { elemento: 'Perfil de ajuste estructural para unión de elementos', aluminio: 16310, pvc: 16310 },
  { elemento: 'Perfil base inferior',                                aluminio: 45065,  pvc: 45065  },
  { elemento: 'Manilla adicional',                                   aluminio: 25856,  pvc: 0      },
  { elemento: 'Termopanel ($/m²)',                                   aluminio: 120000, pvc: 120000 },
  { elemento: 'Puerta mascota',                                      aluminio: 125000, pvc: 125000 },
])

// ─── SIMULADOR ─────────────────────────────────────────────────────────────
const sim = ref({
  tipo: 'marco-fijo',
  ancho: 1200,
  alto: 1500,
  termopanel: 'TERMOPANEL 20 mm (5+10+5) INCOLORO',
})

const desglose = computed(() => {
  const ancho = sim.value.ancho / 1000
  const alto  = sim.value.alto  / 1000
  const area  = ancho * alto
  const perfilesSel = todosPerfiles[sim.value.tipo] ?? todosPerfiles['marco-fijo']

  // Cálculo de perfiles: (longAncho * cantAncho + longAlto * cantAlto) * (valorTira / 6) * trozoPct * 2
  let costoPerfiles = 0
  let metrosLineal  = 0
  for (const p of perfilesSel) {
    const longA = ancho
    const longB = alto
    const ml = (longA * p.cantAncho + longB * p.cantAlto)
    metrosLineal  += ml
    costoPerfiles += ml * (p.valor / 6) * p.trozoPct * 2
  }

  const termoFactor = pvcTermopanel.value.find(t => t.label === sim.value.termopanel)?.value ?? 1
  const costoVidrio = area * termoPrecioBase.value * termoFactor

  const costos = costosFijosActuales.value
  const herrajes  = (costos.find(c => c.label.includes('Quinc'))?.value ?? 0)
  const manoObra  = (costos.find(c => c.label === 'MOF ($)')?.value ?? 0) + (costos.find(c => c.label === 'MOI ($)')?.value ?? 0)
  const costosFijos = costos.find(c => c.label.includes('fijos'))?.value ?? 0

  const totalNeto  = costoPerfiles + costoVidrio + manoObra + herrajes + costosFijos
  const totalConIVA = totalNeto * 1.19
  // Precio de venta = precio de la tabla PRECIOS PARA PCV para la medida Blanco base
  const precioVenta = preciosFinalesActuales.value[0]?.blanco ?? totalConIVA
  const margen = precioVenta > 0 ? Math.round(((precioVenta - totalConIVA) / precioVenta) * 100) : 0

  return {
    area: Number(area.toFixed(4)),
    metrosLineal: Number(metrosLineal.toFixed(1)),
    perfiles:   Math.round(costoPerfiles),
    vidrio:     Math.round(costoVidrio),
    manoObra:   Math.round(manoObra),
    herrajes:   Math.round(herrajes),
    precioFinal: Math.round(precioVenta),
    margen,
  }
})

// ─── ACCIONES ──────────────────────────────────────────────────────────────
const guardar = () => { hasChanges.value = false }
const fmt = (n: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n)
</script>