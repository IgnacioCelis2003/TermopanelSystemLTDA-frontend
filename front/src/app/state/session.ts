import { ref, watch } from 'vue';

export type UserRole = 'vendedor' | 'admin';

type LoginPayload = {
  email: string;
  role: UserRole;
};

const STORAGE_ROLE_KEY = 'termopanel.role';
const STORAGE_AUTH_KEY = 'termopanel.auth';
const STORAGE_EMAIL_KEY = 'termopanel.email';

const role = ref<UserRole>('vendedor');
const isAuthenticated = ref(false);
const email = ref('');

const canUseStorage =
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const loadFromStorage = () => {
  if (!canUseStorage) {
    return;
  }

  const storedRole = window.localStorage.getItem(STORAGE_ROLE_KEY);
  const storedAuth = window.localStorage.getItem(STORAGE_AUTH_KEY);
  const storedEmail = window.localStorage.getItem(STORAGE_EMAIL_KEY);

  if (storedRole === 'admin' || storedRole === 'vendedor') {
    role.value = storedRole;
  }

  if (storedAuth === 'true') {
    isAuthenticated.value = true;
  }

  if (storedEmail) {
    email.value = storedEmail;
  }
};

const persistToStorage = () => {
  if (!canUseStorage) {
    return;
  }

  window.localStorage.setItem(STORAGE_ROLE_KEY, role.value);
  window.localStorage.setItem(STORAGE_AUTH_KEY, String(isAuthenticated.value));
  window.localStorage.setItem(STORAGE_EMAIL_KEY, email.value);
};

if (canUseStorage) {
  loadFromStorage();
  watch([role, isAuthenticated, email], persistToStorage);
}

export function useSession() {
  const setRole = (value: UserRole) => {
    role.value = value;
  };

  const login = ({ email: nextEmail, role: nextRole }: LoginPayload) => {
    role.value = nextRole;
    email.value = nextEmail;
    isAuthenticated.value = true;
  };

  const logout = () => {
    isAuthenticated.value = false;
    email.value = '';
  };

  return { role, isAuthenticated, email, setRole, login, logout };
}
