import { apiRequest } from './api';

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  message: string;
  token: string;
};

export const authService = {
  login(payload: LoginRequest) {
    return apiRequest<LoginResponse>('/api/login', {
      method: 'POST',
      auth: false,
      body: JSON.stringify(payload),
    });
  },
};
