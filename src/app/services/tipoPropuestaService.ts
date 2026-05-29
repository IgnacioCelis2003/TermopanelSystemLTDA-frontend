import { apiRequest } from './api';

export interface TipoPropuesta {
  id: number;
  material: string;
}

type BackendTipoPropuesta = {
  ID?: number;
  id?: number;
  material: string;
};

type GetTiposPropuestaResponse = {
  tipos_propuesta: BackendTipoPropuesta[];
};

type GetTipoPropuestaResponse = {
  tipo_propuesta: BackendTipoPropuesta;
};

export type CreateTipoPropuestaPayload = {
  material: string;
};

export type UpdateTipoPropuestaPayload = {
  id: number;
  material: string;
};

type TipoPropuestaMutationResponse = {
  message: string;
  id?: number;
  material?: string;
};

type DeleteTipoPropuestaResponse = {
  message: string;
};

const normalizeTipoPropuesta = (
  tipo: BackendTipoPropuesta,
): TipoPropuesta => ({
  id: tipo.id ?? tipo.ID ?? 0,
  material: tipo.material,
});

export const tipoPropuestaService = {
  async getTiposPropuesta(): Promise<TipoPropuesta[]> {
    const response = await apiRequest<GetTiposPropuestaResponse>(
      '/api/admin/tipos-propuesta',
      {
        method: 'GET',
      },
    );

    return response.tipos_propuesta.map(normalizeTipoPropuesta);
  },

  async getTipoPropuesta(id: number): Promise<TipoPropuesta> {
    const response = await apiRequest<GetTipoPropuestaResponse>(
      '/api/admin/tipo-propuesta',
      {
        method: 'POST',
        body: JSON.stringify({ id }),
      },
    );

    return normalizeTipoPropuesta(response.tipo_propuesta);
  },

  createTipoPropuesta(payload: CreateTipoPropuestaPayload) {
    return apiRequest<TipoPropuestaMutationResponse>(
      '/api/admin/crear-tipo-propuesta',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    );
  },

  updateTipoPropuesta(payload: UpdateTipoPropuestaPayload) {
    return apiRequest<TipoPropuestaMutationResponse>(
      '/api/admin/actualizar-tipo-propuesta',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    );
  },

  deleteTipoPropuesta(id: number) {
    return apiRequest<DeleteTipoPropuestaResponse>(
      '/api/admin/eliminar-tipo-propuesta',
      {
        method: 'POST',
        body: JSON.stringify({ id }),
      },
    );
  },
};