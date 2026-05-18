<template>
  <div class="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
    
    <div class="absolute inset-0 z-0">
      <div 
        v-for="n in 5" 
        :key="n"
        class="absolute border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-[3000ms] ease-in-out"
        :class="[
          isSuccess ? 'scale-[2] opacity-0' : 'scale-100 opacity-30',
          windowClasses[n-1]
        ]"
      ></div>
      <div class="absolute inset-0 bg-gradient-to-tr from-slate-950 via-transparent to-slate-900/50"></div>
    </div>

    <div class="relative z-10 w-full max-w-md px-6">
      
      <Transition name="welcome">
        <div v-if="isSuccess" class="text-center">
          <h2 class="text-5xl font-black text-white mb-2 tracking-tighter">Bienvenido</h2>
          <p class="text-2xl text-orange-400 font-bold uppercase tracking-widest">{{ loggedUserName }}</p>
          <div class="mt-8 flex justify-center">
            <div class="w-12 h-1 bg-orange-500 animate-pulse rounded-full"></div>
          </div>
        </div>
      </Transition>

      <Transition name="form">
        <div 
          v-if="!isSuccess"
          class="p-10 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl bg-slate-900/40"
        >
          <div class="text-center mb-10">
            <h1 class="text-3xl font-black text-white tracking-tight uppercase">Termopanel <span class="text-orange-500">System</span></h1>
            <p class="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest">Sistema de cotizaciones</p>
          </div>

          <div
            v-if="errorMessage"
            class="mb-6 px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-tight flex items-center gap-3"
            style="background-color: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.2); color: #ef4444;"
          >
            <AlertCircle :size="16" />
            {{ errorMessage }}
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Correo Electrónico</label>
              <div class="relative">
                <Mail class="absolute left-4 top-3.5 text-slate-500" :size="18" />
                <input
                  v-model="email"
                  type="email"
                  placeholder="admin@termopanel.cl"
                  class="w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Contraseña</label>
              <div class="relative">
                <Lock class="absolute left-4 top-3.5 text-slate-500" :size="18" />
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  class="w-full pl-12 pr-12 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                  required
                />
                <button
                  type="button"
                  class="absolute right-4 top-3.5 text-slate-500 hover:text-white transition-colors"
                  @click="showPassword = !showPassword"
                >
                  <Eye v-if="!showPassword" :size="18" />
                  <EyeOff v-else :size="18" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              class="w-full py-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-widest text-sm shadow-lg shadow-orange-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <span>Acceder al Sistema</span>
              <ArrowRight :size="18" />
            </button>
          </form>

          <p class="text-center mt-8 text-[10px] text-slate-500 uppercase font-bold tracking-tighter">
            &copy; 2026 Termopanel System Ltda. Todos los derechos reservados.
          </p>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-vue-next';
import { useSession } from '../state/session';

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const errorMessage = ref('');
const isSuccess = ref(false);
const loggedUserName = ref('');

const router = useRouter();
const session = useSession();

// Clases para la animación aleatoria de las ventanas del fondo
const windowClasses = [
  'w-64 h-96 top-10 left-10 animate-float-slow',
  'w-80 h-80 bottom-20 right-10 animate-float-delayed',
  'w-48 h-72 top-1/2 left-1/3 animate-float-reverse',
  'w-96 h-64 -top-20 right-1/4 animate-float-slow',
  'w-40 h-40 bottom-1/4 left-20 animate-float-delayed'
];

const handleSubmit = () => {
  const e = email.value.trim();
  const p = password.value.trim();

  // Validación de credenciales según requerimiento
  if (e === 'admin@termopanel.cl' && p === 'admin123') {
    session.setRole('admin');
    loggedUserName.value = 'Alejandro Gonzalez'; // Nombre del admin según sidebar
    triggerSuccess();
  } else if (e === 'vendedor@termopanel.cl' && p === 'vendedor123') {
    session.setRole('vendedor');
    loggedUserName.value = 'Ana Vendedora'; // Nombre de la vendedora según sidebar
    triggerSuccess();
  } else {
    errorMessage.value = 'Credenciales inválidas. Verifique su correo y contraseña.';
  }
};

const triggerSuccess = () => {
  errorMessage.value = '';
  isSuccess.value = true;
  
  // Animación de bienvenida antes de redirigir
  setTimeout(() => {
    router.push(session.role.value === 'admin' ? '/dashboard' : '/historial');
  }, 2500);
};
</script>

<style scoped>
/* Animaciones de las "Ventanas" de fondo */
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
}

.animate-float-slow { animation: float 12s ease-in-out infinite; }
.animate-float-delayed { animation: float 15s ease-in-out infinite 2s; }
.animate-float-reverse { animation: float 10s ease-in-out infinite reverse; }

/* Transiciones de Elementos */
.form-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.form-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.welcome-enter-active {
  transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  transition-delay: 0.4s;
}
.welcome-enter-from {
  opacity: 0;
  transform: scale(0.8);
  filter: blur(10px);
}
</style>