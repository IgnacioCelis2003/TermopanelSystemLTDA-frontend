const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const TOKEN_STORAGE_KEY = 'termopanel.token';

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

type RequestOptions = RequestInit & {
  auth?: boolean;
};

const getStoredToken = () => {
  if (typeof window === 'undefined') {
    return '';
  }
  return window.localStorage.getItem(TOKEN_STORAGE_KEY) ?? '';
};

const clearStoredSession = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  window.localStorage.removeItem('termopanel.role');
  window.localStorage.removeItem('termopanel.email');
  window.localStorage.removeItem('termopanel.nombre');
  window.localStorage.removeItem('termopanel.apellidos');
};

const parseResponseBody = async (response: Response) => {
  const contentType = response.headers.get('content-type') ?? '';

  if (response.status === 204) {
    return null;
  }

  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true, headers, ...rest } = options;
  const token = getStoredToken();

  const requestHeaders = new Headers(headers);
  requestHeaders.set('Content-Type', 'application/json');

  if (auth && token) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: requestHeaders,
  });

  const data = await parseResponseBody(response);

  if (!response.ok) {
    if (response.status === 401) {
      clearStoredSession();

      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }

    const message =
      typeof data === 'object' && data !== null && 'error' in data
        ? String((data as { error?: unknown }).error)
        : `Error HTTP ${response.status}`;

    throw new ApiError(message, response.status, data);
  }

  return data as T;
}
