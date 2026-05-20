import { ref } from 'vue';

export type Item = {
  id: number;
  tipo: string;
  cristal: string;
  color: string;
  ancho: number;
  alto: number;
  cantidad: number;
  valorUnitario: number;
};

export type Propuesta = {
  id: number;
  items: Item[];
  descuento: number;
};

export type Cotizacion = {
  id: number;
  numero: string;
  fecha: string;
  hora: string;
  aceptada: boolean;
  cliente: string;
  direccion: string;
  telefono: string;
  correo: string;
  transporte: number;
  manoObra: number;
  margenGlobal: number;
  propuestas: Propuesta[];
};

const cotizaciones = ref<Cotizacion[]>([
  {
    id: 41,
    numero: 'COT-0041',
    fecha: '2025-04-12',
    hora: '10:35',
    aceptada: true,
    cliente: 'María González',
    direccion: 'Av. Los Leones 123, Santiago',
    telefono: '+56 9 8765 4321',
    correo: 'maria@mail.com',
    transporte: 50000,
    manoObra: 100000,
    margenGlobal: 30,
    propuestas: [
      {
        id: 1,
        descuento: 100000,
        items: [
          {
            id: 1,
            tipo: 'Corredera chica',
            cristal: '20mm (5+10+5) Incoloro',
            color: 'Blanco',
            ancho: 1100,
            alto: 400,
            cantidad: 2,
            valorUnitario: 347800,
          },
          {
            id: 2,
            tipo: 'Marco fijo',
            cristal: '20mm (4+10+6) LAM ACÚSTICO',
            color: 'Nogal',
            ancho: 820,
            alto: 1320,
            cantidad: 1,
            valorUnitario: 412500,
          },
        ],
      },
    ],
  },
  {
    id: 40,
    numero: 'COT-0040',
    fecha: '2025-04-11',
    hora: '16:20',
    aceptada: false,
    cliente: 'Juan Pérez',
    direccion: 'San Martín 456, Santiago',
    telefono: '+56 9 7654 3210',
    correo: 'juan@mail.com',
    transporte: 50000,
    manoObra: 100000,
    margenGlobal: 30,
    propuestas: [
      {
        id: 2,
        descuento: 0,
        items: [
          {
            id: 1,
            tipo: 'Abatir',
            cristal: '18mm (4+8+6) LAM ACÚSTICO',
            color: 'Negro',
            ancho: 900,
            alto: 1100,
            cantidad: 1,
            valorUnitario: 520000,
          },
        ],
      },
    ],
  },
  {
    id: 39,
    numero: 'COT-0039',
    fecha: '2025-04-10',
    hora: '09:10',
    aceptada: true,
    cliente: 'Ana Torres',
    direccion: 'Las Condes 789, Santiago',
    telefono: '+56 9 6543 2109',
    correo: 'ana@mail.com',
    transporte: 50000,
    manoObra: 100000,
    margenGlobal: 30,
    propuestas: [
      {
        id: 3,
        descuento: 50000,
        items: [
          {
            id: 1,
            tipo: 'Marco fijo',
            cristal: '20mm (5+10+5) Satén',
            color: 'Blanco',
            ancho: 1200,
            alto: 1400,
            cantidad: 1,
            valorUnitario: 2100500,
          },
        ],
      },
    ],
  },
  {
    id: 38,
    numero: 'COT-0038',
    fecha: '2025-04-09',
    hora: '14:45',
    aceptada: false,
    cliente: 'Luis Ramírez',
    direccion: 'Ñuñoa 321, Santiago',
    telefono: '+56 9 5432 1098',
    correo: 'luis@mail.com',
    transporte: 50000,
    manoObra: 100000,
    margenGlobal: 30,
    propuestas: [
      {
        id: 4,
        descuento: 0,
        items: [
          {
            id: 1,
            tipo: 'Corredera chica',
            cristal: '20mm (5+10+5) Incoloro',
            color: 'Blanco',
            ancho: 1000,
            alto: 800,
            cantidad: 1,
            valorUnitario: 670000,
          },
        ],
      },
    ],
  },
  {
    id: 37,
    numero: 'COT-0037',
    fecha: '2025-04-08',
    hora: '11:00',
    aceptada: true,
    cliente: 'Carla Muñoz',
    direccion: 'Providencia 987, Santiago',
    telefono: '+56 9 4321 0987',
    correo: 'carla@mail.com',
    transporte: 50000,
    manoObra: 100000,
    margenGlobal: 30,
    propuestas: [
      {
        id: 5,
        descuento: 0,
        items: [
          {
            id: 1,
            tipo: 'Marco fijo',
            cristal: '20mm (5+10+5) Incoloro',
            color: 'Blanco',
            ancho: 1300,
            alto: 1200,
            cantidad: 1,
            valorUnitario: 1530200,
          },
        ],
      },
    ],
  },
]);

const buildNumero = (id: number) => `COT-${String(id).padStart(4, '0')}`;

const calculatePropuestaSubtotal = (propuesta: Propuesta) =>
  propuesta.items.reduce(
    (sum, item) => sum + item.valorUnitario * item.cantidad,
    0
  );

const calculatePropuestaTotal = (propuesta: Propuesta, transporte: number, manoObra: number) => {
  const subtotal = calculatePropuestaSubtotal(propuesta);
  const descuentoMonto = propuesta.descuento || 0;
  return Math.max(subtotal - descuentoMonto, 0) + transporte + manoObra;
};

const calculateCotizacionTotal = (cotizacion: Cotizacion) =>
  cotizacion.propuestas.reduce(
    (sum, propuesta) =>
      sum + calculatePropuestaTotal(propuesta, cotizacion.transporte, cotizacion.manoObra),
    0
  );

const getCotizacionById = (id: number) =>
  cotizaciones.value.find((cotizacion) => cotizacion.id === id) || null;

const saveCotizacion = (data: Cotizacion) => {
  const existingIndex = cotizaciones.value.findIndex((c) => c.id === data.id);

  if (existingIndex >= 0) {
    cotizaciones.value[existingIndex] = { ...data };
    return data.id;
  }

  const nextId = Math.max(...cotizaciones.value.map((c) => c.id), 0) + 1;
  const newCotizacion: Cotizacion = {
    ...data,
    id: nextId,
    numero: data.numero || buildNumero(nextId),
  };

  cotizaciones.value.unshift(newCotizacion);
  return newCotizacion.id;
};

const setAceptada = (id: number, aceptada: boolean) => {
  const cotizacion = getCotizacionById(id);
  if (!cotizacion) {
    return;
  }
  cotizacion.aceptada = aceptada;
};

const createBlankCotizacion = () => {
  const now = new Date();
  const fecha = now.toISOString().slice(0, 10);
  const hora = now.toTimeString().slice(0, 5);

  return {
    id: 0,
    numero: '',
    fecha,
    hora,
    aceptada: false,
    cliente: '',
    direccion: '',
    telefono: '',
    correo: '',
    transporte: 50000,
    manoObra: 100000,
    margenGlobal: 30,
    propuestas: [
      {
        id: 1,
        descuento: 0,
        items: [
          {
            id: 1,
            tipo: 'Marco fijo',
            cristal: '20mm (5+10+5) Incoloro',
            color: 'Blanco',
            ancho: 1000,
            alto: 1000,
            cantidad: 1,
            valorUnitario: 350000,
          },
        ],
      },
    ],
  } satisfies Cotizacion;
};

export function useCotizaciones() {
  return {
    cotizaciones,
    calculatePropuestaSubtotal,
    calculatePropuestaTotal,
    calculateCotizacionTotal,
    getCotizacionById,
    saveCotizacion,
    setAceptada,
    createBlankCotizacion,
  };
}
