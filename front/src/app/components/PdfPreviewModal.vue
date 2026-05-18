<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-[9999] flex justify-center overflow-y-auto bg-black bg-opacity-60 print:bg-transparent print:static print:overflow-visible print:block py-8 print:py-0">
        
        <div class="fixed top-6 right-8 flex gap-3 print-hide z-50">
          <button @click="closeModal" class="px-4 py-2 bg-white text-gray-800 rounded-lg shadow-lg font-medium border border-gray-200 hover:bg-gray-50 transition-colors">
            Cerrar Vista
          </button>
          <button @click="printPdf" class="px-5 py-2 bg-[#FF6B00] text-white rounded-lg shadow-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2">
            <Printer :size="18" />
            Imprimir / Guardar PDF
          </button>
        </div>

        <div id="printable-pdf" class="bg-white text-black shadow-2xl relative" style="width: 210mm; min-height: 297mm; font-family: Arial, sans-serif;">
          
          <div class="p-[10mm]">
            
            <div class="w-full h-[120px] border-2 border-dashed border-gray-400 bg-gray-50 flex items-center justify-center mb-6">
              <span class="text-gray-500 font-bold text-lg uppercase tracking-widest">Acá va la imagen (Encabezado)</span>
            </div>

            <div class="flex gap-2 mb-6 text-[11px]">
              <div class="border border-gray-400 p-3 w-[45%] rounded-md leading-tight">
                A continuación entregamos propuesta(s) para su proyecto de cambio de <span class="font-bold">Ventanas de Termopanel</span> para su hogar, en <span class="text-blue-600 font-bold">Termoacusticos.cl</span> nos preocupamos de tener la mejor <span class="text-blue-600 font-bold">Relación Precio / Calidad del Mercado.</span>
              </div>
              <div class="border border-gray-400 p-2 flex-1 rounded-md flex justify-around items-end pb-1">
                <div class="flex flex-col items-center gap-1"><div class="w-8 h-10 border-4 border-orange-700 bg-blue-100"></div><span class="text-[8px] font-bold uppercase">Fija</span></div>
                <div class="flex flex-col items-center gap-1"><div class="w-8 h-10 border-4 border-orange-700 bg-blue-100 relative"><div class="absolute right-0 bottom-0 w-6 h-8 border-l border-t border-orange-700 bg-white"></div></div><span class="text-[8px] font-bold uppercase">Proyectante</span></div>
                <div class="flex flex-col items-center gap-1"><div class="w-12 h-10 border-4 border-orange-700 bg-blue-100 flex"><div class="w-1/2 border-r border-orange-700"></div></div><span class="text-[8px] font-bold uppercase">Corredera</span></div>
                <div class="flex flex-col items-center gap-1"><div class="w-12 h-10 border-4 border-orange-700 bg-blue-100 flex"><div class="w-1/2 border-r-2 border-orange-700"></div></div><span class="text-[8px] font-bold uppercase">Doble Abatir</span></div>
                <div class="flex flex-col items-center gap-1"><div class="w-6 h-12 border-4 border-orange-700 bg-blue-100"></div><span class="text-[8px] font-bold uppercase">Puerta</span></div>
              </div>
            </div>

            <div class="space-y-6">
              <div v-for="(propuesta, index) in cotizacion.propuestas" :key="propuesta.id" class="border-[1.5px] border-black rounded-lg overflow-hidden">
                
                <div class="flex text-[12px] font-bold border-b-[1.5px] border-black text-center items-stretch">
                  <div class="w-[20%] bg-[#fcece3] p-1.5 border-r-[1.5px] border-black flex items-center justify-center">
                    PROPUESTA {{ index + 1 }}:
                  </div>
                  <div class="w-[60%] p-1.5 flex items-center justify-center">
                    {{ propuesta.calidadMaterial || calidadesMaterial[index] }}
                  </div>
                  <div class="w-[20%] bg-[#e3fcee] p-1.5 border-l-[1.5px] border-black flex items-center justify-center">
                    Promoción GAS ARGÓN
                  </div>
                </div>

                <table class="w-full text-[10px] text-center border-b-[1.5px] border-black">
                  <thead class="bg-gray-100">
                    <tr class="border-b border-gray-400">
                      <th class="py-1 px-1 text-left w-[20%]">TIPO</th>
                      <th class="py-1 px-1 text-left w-[30%]">CRISTAL MARCA {{ getCristalMarca(propuesta.calidadMaterial) }}</th>
                      <th class="py-1 px-1">COLOR</th>
                      <th class="py-1 px-1">ANCHO</th>
                      <th class="py-1 px-1">ALTO</th>
                      <th class="py-1 px-1">CANT</th>
                      <th class="py-1 px-1 text-right">VALOR UNI</th>
                      <th class="py-1 px-1 text-right w-[12%]">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in propuesta.items" :key="item.id" class="border-b border-gray-200 last:border-0">
                      <td class="py-1.5 px-1 text-left uppercase flex justify-between">
                        <span>{{ item.tipo }}</span> 
                        <span class="mr-2 opacity-80">{{ getClase(propuesta.calidadMaterial) }}</span>
                      </td>
                      <td class="py-1.5 px-1 text-left uppercase text-[9px]">{{ item.cristal }}</td>
                      <td class="py-1.5 px-1 uppercase">{{ item.color }}</td>
                      <td class="py-1.5 px-1">{{ item.ancho }}</td>
                      <td class="py-1.5 px-1">{{ item.alto }}</td>
                      <td class="py-1.5 px-1">{{ item.cantidad }}</td>
                      <td class="py-1.5 px-1 text-right whitespace-nowrap">{{ formatCurrency(item.valorUnitario).replace('CLP', '$') }}</td>
                      <td class="py-1.5 px-1 text-right whitespace-nowrap">{{ formatCurrency(item.valorUnitario * item.cantidad).replace('CLP', '$') }}</td>
                    </tr>
                  </tbody>
                </table>

                <div class="flex text-[10px] items-stretch">
                  <div class="w-[70%] p-2 border-r-[1.5px] border-black text-justify leading-tight flex items-center">
                    <span v-html="getTextoDescriptivo(propuesta.calidadMaterial)"></span>
                  </div>
                  <div class="w-[30%] bg-gray-50 flex flex-col justify-center">
                    <div class="flex justify-between px-2 py-1 border-b border-gray-300">
                      <span>Total</span>
                      <span>{{ formatCurrency(calcularSubtotal(propuesta)).replace('CLP', '$') }}</span>
                    </div>
                    <div class="flex justify-between px-2 py-1 border-b border-gray-300">
                      <span>Descuento</span>
                      <span>-{{ formatCurrency(propuesta.descuento || 0).replace('CLP', '$') }}</span>
                    </div>
                    <div class="flex justify-between px-2 py-1 border-b border-gray-300">
                      <span>Transporte (RM)</span>
                      <span>{{ formatCurrency(cotizacion.transporte).replace('CLP', '$') }}</span>
                    </div>
                    <div class="flex justify-between px-2 py-1 border-b border-gray-300">
                      <span>Instalación</span>
                      <span>{{ formatCurrency(cotizacion.manoObra).replace('CLP', '$') }}</span>
                    </div>
                    <div class="flex justify-between px-2 py-1 font-bold text-[11px] bg-gray-200">
                      <span>Total Iva Incluido</span>
                      <span>{{ formatCurrency(calcularTotalPropuesta(propuesta)).replace('CLP', '$') }}</span>
                    </div>
                  </div>
                </div>

                <div class="border-t-[1.5px] border-black p-1 text-[9px] font-bold text-center bg-gray-50">
                  Pte chequear Izaje/subida caja escala, ascensor / En algunos casos pueden existir daños menores por retiro ventanas.
                </div>
              </div>
            </div>

            <div class="w-full h-[60px] border-2 border-dashed border-gray-400 bg-gray-50 flex items-center justify-center mt-8">
              <span class="text-gray-500 font-bold text-sm uppercase tracking-widest">Acá va la imagen (Marcas / Pie de página)</span>
            </div>

          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { Printer } from 'lucide-vue-next';
import type { Cotizacion, Propuesta } from '../state/cotizaciones';

const props = defineProps<{
  isOpen: boolean;
  cotizacion: Cotizacion;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const closeModal = () => {
  emit('close');
};

const calidadesMaterial = [
    'ALTA CALIDAD EN PCV EUROPEO®',
    'ALTA CALIDAD EN ALUMINIO PREMIUM XELENTIA®',
    'MEDIA CALIDAD EN ALUMINIO BÁSICO AL25 / AL43'
];

// Lógica para textos dinámicos según el material
const getCristalMarca = (calidad?: string) => {
  const c = calidad || '';
  if (c.includes('BÁSICO')) return 'GENÉRICO';
  return 'LIRQUEN®';
};

const getClase = (calidad?: string) => {
  const c = calidad || '';
  if (c.includes('BÁSICO')) return 'CLASE B';
  return 'CLASE A';
};

const getTextoDescriptivo = (calidad?: string) => {
  const c = calidad || '';
  if (c.includes('PCV EUROPEO')) {
    return '<b>Ventanas de PVC Europeo</b> con sistema multicámara y perfiles reforzados brindan una óptima aislación termoacústica. Somos únicos en Chile con el <span style="color: #2563eb;">innovador sistema de doble contacto</span> e <span style="color: #2563eb;">inyección de gas argón</span>, garantizando confort superior, eficiencia energética y materiales de la más alta calidad.';
  } else if (c.includes('XELENTIA')) {
    return 'Las <b>Ventanas de Termopanel en Aluminio Marca Xelentia</b> destacan por su <span style="color: #2563eb;">excelente relación Precio / Calidad</span>. Fabricadas con Aluminio Certificado y ensambladas con el sistema de doble cristal que incorpora gas argón desde fábrica, ofrece un desempeño termoacústico técnicamente superior.';
  } else {
    return 'Nuestras ventanas de termopanel de las <b>Líneas Básicas Estándar AL25/AL43</b> representan la opción <span style="color: #2563eb;">más accesible y popular del mercado</span>. Su diseño se basa en componentes esenciales que cumplen con los requerimientos mínimos, permitiendo alcanzar una funcionalidad adecuada a un bajo costo.';
  }
};

// Utilidades de formato y cálculo
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(amount);
};

const calcularSubtotal = (propuesta: Propuesta) =>
  propuesta.items.reduce((sum, item) => sum + item.valorUnitario * item.cantidad, 0);

const calcularTotalPropuesta = (propuesta: Propuesta) => {
  const subtotal = calcularSubtotal(propuesta);
  const descuentoMonto = propuesta.descuento || 0;
  return Math.max(subtotal - descuentoMonto, 0) + props.cotizacion.transporte + props.cotizacion.manoObra;
};

// Función de impresión
const printPdf = () => {
    window.print();
};
</script>

<style>
/* ESTOS ESTILOS SON GLOBALES DURANTE LA IMPRESIÓN PARA OCULTAR LA APP.
  No usamos 'scoped' para garantizar que afectan al 'body' y al '#app'.
*/
@media print {
  /* Oculta absolutamente todo en el body... */
  body * {
    visibility: hidden;
  }
  
  /* ...excepto el contenedor del PDF y sus hijos */
  #printable-pdf, #printable-pdf * {
    visibility: visible;
  }

  /* Posiciona el PDF en la esquina superior izquierda de la hoja */
  #printable-pdf {
    position: absolute;
    left: 0;
    top: 0;
    margin: 0 !important;
    padding: 0 !important;
    width: 100%;
    box-shadow: none !important;
  }

  /* Oculta los botones dentro del modal */
  .print-hide {
    display: none !important;
  }
  
  /* Ajuste de márgenes de página del navegador */
  @page {
    margin: 0; /* Quitamos márgenes por defecto del navegador para usar los nuestros */
    size: A4 portrait;
  }
}
</style>