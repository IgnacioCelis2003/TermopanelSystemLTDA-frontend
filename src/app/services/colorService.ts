import { apiRequest } from './api';

export interface Color {
  id: number;
  nombre: string;
}

type BackendColor = {
  ID?: number;
  id?: number;
  nombre: string;
};

type GetColorsResponse = {
  colors?: BackendColor[];
  colores?: BackendColor[];
};

export type CreateColorPayload = {
  nombre: string;
};

type ColorMutationResponse = {
  message: string;
  id?: number;
  nombre?: string;
};

type DeleteColorResponse = {
  message: string;
};

const normalizeColor = (color: BackendColor): Color => ({
  id: color.id ?? color.ID ?? 0,
  nombre: color.nombre,
});

export const colorService = {
  async getColors(): Promise<Color[]> {
    const response = await apiRequest<GetColorsResponse>('/api/admin/colores', {
      method: 'GET',
    });

    return (response.colors ?? response.colores ?? []).map(normalizeColor);
  },

  createColor(payload: CreateColorPayload) {
    return apiRequest<ColorMutationResponse>('/api/admin/crear-color', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  deleteColor(id: number) {
    return apiRequest<DeleteColorResponse>('/api/admin/eliminar-color', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  },
};