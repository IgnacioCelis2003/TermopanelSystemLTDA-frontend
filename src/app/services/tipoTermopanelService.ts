import { apiRequest } from './api';

export interface TipoTermopanel {
  id: number;
  nombre: string;
  factor: number;
  libre: boolean;
  especial: boolean;
}

type BackendTipoTermopanel = {
  ID?: number;
  id?: number;
  nombre: string;
  factor: number;
  libre: boolean;
  especial: boolean;
};

type GetTiposTermopanelResponse = {
  tipos_termopanel: BackendTipoTermopanel[];
};

type GetTipoTermopanelResponse = {
  tipo_termopanel: BackendTipoTermopanel;
};

export type CreateTipoTermopanelPayload = {
  nombre: string;
  factor: number;
  libre: boolean;
  especial: boolean;
};

export type UpdateTipoTermopanelPayload = {
  id: number;
  nombre?: string;
  factor?: number;
  libre?: boolean;
  especial?: boolean;
};

type TipoTermopanelMutationResponse = {
  message: string;
  id?: number;
  nombre?: string;
  factor?: number;
  libre?: boolean;
  especial?: boolean;
};

type DeleteTipoTermopanelResponse = {
  message: string;
};

const normalizeTipoTermopanel = (
  tipo: BackendTipoTermopanel,
): TipoTermopanel => ({
  id: tipo.id ?? tipo.ID ?? 0,
  nombre: tipo.nombre,
  factor: tipo.factor,
  libre: tipo.libre,
  especial: tipo.especial,
});

export const tipoTermopanelService = {
  async getTiposTermopanel(): Promise<TipoTermopanel[]> {
    const response = await apiRequest<GetTiposTermopanelResponse>(
      '/api/admin/tipos-termopanel',
      {
        method: 'GET',
      },
    );

    return response.tipos_termopanel.map(normalizeTipoTermopanel);
  },

  async getTipoTermopanel(id: number): Promise<TipoTermopanel> {
    const response = await apiRequest<GetTipoTermopanelResponse>(
      '/api/admin/tipo-termopanel',
      {
        method: 'POST',
        body: JSON.stringify({ id }),
      },
    );

    return normalizeTipoTermopanel(response.tipo_termopanel);
  },

  createTipoTermopanel(payload: CreateTipoTermopanelPayload) {
    return apiRequest<TipoTermopanelMutationResponse>(
      '/api/admin/crear-tipo-termopanel',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    );
  },

  updateTipoTermopanel(payload: UpdateTipoTermopanelPayload) {
    return apiRequest<TipoTermopanelMutationResponse>(
      '/api/admin/actualizar-tipo-termopanel',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    );
  },

  deleteTipoTermopanel(id: number) {
    return apiRequest<DeleteTipoTermopanelResponse>(
      '/api/admin/eliminar-tipo-termopanel',
      {
        method: 'POST',
        body: JSON.stringify({ id }),
      },
    );
  },
};