import { apiRequest } from './api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export type EmpresaImagenTipo = 'logo' | 'header' | 'footer';

export interface Empresa {
  id: number;
  rut: string;
  nombre: string;
  direccion: string;
  telefono: string;
  email_contacto: string;
  nombre_contacto: string;
  logo_url: string;
  footer_url: string;
  header_url: string;
  texto_presentacion: string;
  descuento_aluminio_estandar: number;
  factor_iva_perfil: number;
  empresa_ins: number;
}

type BackendEmpresa = {
  ID?: number;
  id?: number;
  rut: string;
  nombre: string;
  direccion: string;
  telefono: string;
  email_contacto: string;
  nombre_contacto: string;
  logo_url: string;
  footer_url: string;
  header_url: string;
  texto_presentacion: string;
  descuento_aluminio_estandar: number;
  factor_iva_perfil: number;
  empresa_ins: number;
};

type GetEmpresaResponse = {
  empresa: BackendEmpresa;
};

export type UpdateEmpresaPayload = Partial<{
  rut: string;
  nombre: string;
  direccion: string;
  telefono: string;
  email_contacto: string;
  nombre_contacto: string;
  texto_presentacion: string;
  descuento_aluminio_estandar: number;
  factor_iva_perfil: number;
  empresa_ins: number;
}>;

type UpdateEmpresaResponse = {
  message: string;
  empresa: BackendEmpresa;
};

type UploadEmpresaImagenResponse = {
  message: string;
  tipo: EmpresaImagenTipo;
  url: string;
};

const normalizeEmpresa = (empresa: BackendEmpresa): Empresa => ({
  id: empresa.id ?? empresa.ID ?? 0,
  rut: empresa.rut,
  nombre: empresa.nombre,
  direccion: empresa.direccion,
  telefono: empresa.telefono,
  email_contacto: empresa.email_contacto,
  nombre_contacto: empresa.nombre_contacto,
  logo_url: empresa.logo_url,
  footer_url: empresa.footer_url,
  header_url: empresa.header_url,
  texto_presentacion: empresa.texto_presentacion,
  descuento_aluminio_estandar: empresa.descuento_aluminio_estandar,
  factor_iva_perfil: empresa.factor_iva_perfil,
  empresa_ins: empresa.empresa_ins,
});

export const empresaService = {
  async getEmpresa(): Promise<Empresa> {
    const response = await apiRequest<GetEmpresaResponse>('/api/admin/empresa', {
      method: 'GET',
    });

    return normalizeEmpresa(response.empresa);
  },

  async updateEmpresa(payload: UpdateEmpresaPayload): Promise<Empresa> {
    const response = await apiRequest<UpdateEmpresaResponse>(
      '/api/admin/actualizar-empresa',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    );

    return normalizeEmpresa(response.empresa);
  },

  async uploadEmpresaImagen(
    tipo: EmpresaImagenTipo,
    file: File,
  ): Promise<UploadEmpresaImagenResponse> {
    const formData = new FormData();
    formData.append('imagen', file);

    return apiRequest<UploadEmpresaImagenResponse>(
      `/api/admin/empresa/imagen/${tipo}`,
      {
        method: 'POST',
        body: formData,
      },
    );
  },

  getEmpresaImagenUrl(tipo: EmpresaImagenTipo): string {
    return `${API_BASE_URL}/api/empresa/imagen/${tipo}`;
  },

  getEmpresaImagenUrlNoCache(tipo: EmpresaImagenTipo): string {
    return `${API_BASE_URL}/api/empresa/imagen/${tipo}?t=${Date.now()}`;
  },
};