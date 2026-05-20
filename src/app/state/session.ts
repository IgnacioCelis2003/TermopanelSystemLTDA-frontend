import { computed, ref } from 'vue';

export type UserRole = 'admin' | 'user';

type JwtClaims = {
  id?: number;
  email?: string;
  role?: string;
  nombre?: string;
  apellidos?: string;
  exp?: number;
  iat?: number;
};

const STORAGE_TOKEN_KEY = 'termopanel.token';
const STORAGE_ROLE_KEY = 'termopanel.role';
const STORAGE_EMAIL_KEY = 'termopanel.email';
const STORAGE_NAME_KEY = 'termopanel.nombre';
const STORAGE_LASTNAME_KEY = 'termopanel.apellidos';

const token = ref('');
const role = ref<UserRole | null>(null);
const email = ref('');
const nombre = ref('');
const apellidos = ref('');

const canUseStorage =
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const decodeBase64Url = (value: string) => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  return decodeURIComponent(
    atob(padded)
      .split('')
      .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
      .join(''),
  );
};

const decodeJwtPayload = (jwt: string): JwtClaims | null => {
  try {
    const [, payload] = jwt.split('.');
    if (!payload) {
      return null;
    }
    return JSON.parse(decodeBase64Url(payload)) as JwtClaims;
  } catch {
    return null;
  }
};

const isValidRole = (value: unknown): value is UserRole => value === 'admin' || value === 'user';

const isTokenExpired = (jwt: string) => {
  const claims = decodeJwtPayload(jwt);
  if (!claims?.exp) {
    return true;
  }
  return claims.exp * 1000 <= Date.now();
};

const persistSession = () => {
  if (!canUseStorage) {
    return;
  }

  if (!token.value || !role.value) {
    window.localStorage.removeItem(STORAGE_TOKEN_KEY);
    window.localStorage.removeItem(STORAGE_ROLE_KEY);
    window.localStorage.removeItem(STORAGE_EMAIL_KEY);
    window.localStorage.removeItem(STORAGE_NAME_KEY);
    window.localStorage.removeItem(STORAGE_LASTNAME_KEY);
    return;
  }

  window.localStorage.setItem(STORAGE_TOKEN_KEY, token.value);
  window.localStorage.setItem(STORAGE_ROLE_KEY, role.value);
  window.localStorage.setItem(STORAGE_EMAIL_KEY, email.value);
  window.localStorage.setItem(STORAGE_NAME_KEY, nombre.value);
  window.localStorage.setItem(STORAGE_LASTNAME_KEY, apellidos.value);
};

const clearSessionState = () => {
  token.value = '';
  role.value = null;
  email.value = '';
  nombre.value = '';
  apellidos.value = '';
  persistSession();
};

const hydrateFromToken = (jwt: string) => {
  const claims = decodeJwtPayload(jwt);

  if (!claims || !isValidRole(claims.role) || isTokenExpired(jwt)) {
    clearSessionState();
    return false;
  }

  token.value = jwt;
  role.value = claims.role;
  email.value = claims.email ?? '';
  nombre.value = claims.nombre ?? '';
  apellidos.value = claims.apellidos ?? '';
  persistSession();
  return true;
};

const loadFromStorage = () => {
  if (!canUseStorage) {
    return;
  }

  const storedToken = window.localStorage.getItem(STORAGE_TOKEN_KEY);
  if (!storedToken) {
    clearSessionState();
    return;
  }

  hydrateFromToken(storedToken);
};

if (canUseStorage) {
  loadFromStorage();
}

const isAuthenticated = computed(() => Boolean(token.value) && !isTokenExpired(token.value));
const fullName = computed(() => [nombre.value, apellidos.value].filter(Boolean).join(' ').trim());

export function useSession() {
  const setSessionFromToken = (jwt: string) => hydrateFromToken(jwt);

  const ensureValidSession = () => {
    if (!token.value || isTokenExpired(token.value)) {
      clearSessionState();
      return false;
    }
    return true;
  };

  const logout = () => {
    clearSessionState();
  };

  return {
    token,
    role,
    email,
    nombre,
    apellidos,
    fullName,
    isAuthenticated,
    setSessionFromToken,
    ensureValidSession,
    logout,
  };
}
