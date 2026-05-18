import { createRouter, createWebHistory } from 'vue-router';
import Login from './app/views/Login.vue';
import Layout from './app/components/Layout.vue';
import Historial from './app/views/Historial.vue';
import Cotizar from './app/views/Cotizar.vue';
import Pagos from './app/views/Pagos.vue';
import DisenoPDF from './app/views/DisenoPDF.vue';
import Precios from './app/views/Precios.vue';
import Dashboard from './app/views/Dashboard.vue';
import { useSession } from './app/state/session';
import AdministracionUsuarios from './app/views/AdministracionUsuarios.vue';

const routes = [
  { path: '/login', component: Login },
  {
    path: '/',
    component: Layout,
    children: [
      { path: '', redirect: '/historial' },
      { path: 'historial', component: Historial },
      { path: 'cotizar', component: Cotizar },
      { path: 'pagos', component: Pagos },
      { path: 'diseno-pdf', component: DisenoPDF },
      { path: 'precios', component: Precios },
      { path: 'dashboard', component: Dashboard },
      { path: 'administracion-usuarios', component: AdministracionUsuarios },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/historial' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const { isAuthenticated } = useSession();

  if (!isAuthenticated.value) {
    return '/login';
  }

  return true;
});

export default router;
