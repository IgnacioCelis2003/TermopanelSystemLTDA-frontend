import { apiRequest } from './api';

export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  role: UserRole;
  email: string;
  nombre: string;
  apellidos: string;
}

type BackendUser = {
  ID: number;
  role: UserRole;
  email: string;
  nombre: string;
  apellidos: string;
};

type GetUsersResponse = {
  usuarios: BackendUser[];
};

export type CreateUserPayload = {
  role: UserRole;
  email: string;
  password: string;
  nombre: string;
  apellidos: string;
};

export type UpdateUserPayload = {
  id: number;
  role: UserRole;
  email: string;
  nombre: string;
  apellidos: string;
};

type UserMutationResponse = {
  message: string;
  Email?: string;
  Role?: UserRole;
  Nombre?: string;
  Apellidos?: string;
};

type DeleteUserResponse = {
  message: string;
};

const normalizeUser = (user: BackendUser): User => ({
  id: user.ID,
  role: user.role,
  email: user.email,
  nombre: user.nombre,
  apellidos: user.apellidos,
});

export const userService = {
  async getUsers(): Promise<User[]> {
    const response = await apiRequest<GetUsersResponse>('/api/admin/usuarios', {
      method: 'GET',
    });

    return response.usuarios.map(normalizeUser);
  },

  createUser(payload: CreateUserPayload) {
    return apiRequest<UserMutationResponse>('/api/admin/crear-usuario', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateUser(payload: UpdateUserPayload) {
    return apiRequest<UserMutationResponse>('/api/admin/actualizar-usuario', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  deleteUser(id: number) {
    return apiRequest<DeleteUserResponse>('/api/admin/eliminar-usuario', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  },
};