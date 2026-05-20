import { createRouter, createWebHistory } from 'vue-router';
import Login from './app/views/Login.vue';
import Layout from './app/components/Layout.vue';
import Historial from './app/views/Historial.vue';
import Cotizar from './app/views/Cotizar.vue';
import Pagos from './app/views/Pagos.vue';
import DisenoPDF from './app/views/DisenoPDF.vue';
import Precios from './app/views/Precios.vue';
import Dashboard from './app/views/Dashboard.vue';
import { useSession, type UserRole } from './app/state/session';
import AdministracionUsuarios from './app/views/AdministracionUsuarios.vue';

const defaultRouteByRole = (role: UserRole | null) => (role === 'admin' ? '/dashboard' : '/historial');

const routes = [
  {
    path: '/login',
    component: Login,
    meta: { guestOnly: true },
  },
  {
    path: '/',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/historial' },
      { path: 'historial', component: Historial },
      { path: 'cotizar', component: Cotizar },
      { path: 'pagos', component: Pagos },
      { path: 'dashboard', component: Dashboard, meta: { roles: ['admin'] } },
      { path: 'diseno-pdf', component: DisenoPDF, meta: { roles: ['admin'] } },
      { path: 'precios', component: Precios, meta: { roles: ['admin'] } },
      {
        path: 'administracion-usuarios',
        component: AdministracionUsuarios,
        meta: { roles: ['admin'] },
      },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/historial' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const session = useSession();
  const hasValidSession = session.ensureValidSession();
  const requiredRoles = to.meta.roles as UserRole[] | undefined;

  if (to.meta.guestOnly && hasValidSession) {
    return defaultRouteByRole(session.role.value);
  }

  if (to.meta.requiresAuth && !hasValidSession) {
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    };
  }

  if (requiredRoles?.length && (!session.role.value || !requiredRoles.includes(session.role.value))) {
    return defaultRouteByRole(session.role.value);
  }

  return true;
});

export default router;
