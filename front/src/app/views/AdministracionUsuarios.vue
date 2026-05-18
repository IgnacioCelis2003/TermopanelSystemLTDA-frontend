<template>
  <div class="space-y-6">
    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
            Administración
          </p>
          <h1 class="mt-2 text-3xl font-bold text-slate-900">
            Administración de usuarios
          </h1>
          <p class="mt-2 max-w-2xl text-sm text-slate-500">
            Crea, edita y elimina usuarios del sistema. Puedes administrar cuentas de
            vendedores y administradores.
          </p>
        </div>

        <el-button type="primary" size="large" round @click="openCreateModal">
          <el-icon class="mr-1"><Plus /></el-icon>
          Nuevo usuario
        </el-button>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="grid gap-4 md:grid-cols-3">
        <el-input
          v-model="search"
          clearable
          size="large"
          placeholder="Buscar por nombre, correo o rol"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <el-select v-model="roleFilter" clearable size="large" placeholder="Filtrar por rol">
          <el-option label="Administrador" value="admin" />
          <el-option label="Vendedor" value="vendedor" />
        </el-select>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <el-table :data="filteredUsers" style="width: 100%">
        <el-table-column prop="name" label="Nombre" min-width="180" />

        <el-table-column prop="email" label="Correo" min-width="220" />

        <el-table-column label="Rol" width="160">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : 'success'" effect="light">
              {{ roleLabel(row.role) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Acciones" width="220" fixed="right">
          <template #default="{ row }">
            <div class="flex gap-2">
              <el-button size="small" round @click="openEditModal(row)">
                Editar
              </el-button>

              <el-popconfirm
                title="¿Seguro que deseas eliminar este usuario?"
                confirm-button-text="Eliminar"
                cancel-button-text="Cancelar"
                @confirm="deleteUser(row.id)"
              >
                <template #reference>
                  <el-button
                    size="small"
                    type="danger"
                    plain
                    round
                    :disabled="row.email === currentUserEmail"
                  >
                    Eliminar
                  </el-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-empty
        v-if="filteredUsers.length === 0"
        description="No se encontraron usuarios con los filtros aplicados"
      />
    </section>

    <el-dialog
      v-model="isModalOpen"
      :title="isEditing ? 'Editar usuario' : 'Crear usuario'"
      width="520px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
      >
        <el-form-item label="Nombre del usuario" prop="name">
          <el-input
            v-model="form.name"
            size="large"
            placeholder="Ej: María González"
          />
        </el-form-item>

        <el-form-item label="Correo" prop="email">
          <el-input
            v-model="form.email"
            size="large"
            placeholder="usuario@correo.cl"
          />
        </el-form-item>

        <el-form-item
          :label="isEditing ? 'Nueva contraseña opcional' : 'Contraseña'"
          prop="password"
        >
          <el-input
            v-model="form.password"
            size="large"
            type="password"
            show-password
            placeholder="Define una contraseña"
          />
        </el-form-item>

        <el-form-item label="Rol" prop="role">
          <el-select v-model="form.role" size="large" placeholder="Selecciona un rol">
            <el-option label="Administrador" value="admin" />
            <el-option label="Vendedor" value="vendedor" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="flex justify-end gap-2">
          <el-button round @click="isModalOpen = false">
            Cancelar
          </el-button>
          <el-button type="primary" round @click="saveUser">
            {{ isEditing ? 'Guardar cambios' : 'Crear usuario' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import { Plus, Search } from '@element-plus/icons-vue';

type UserRole = 'admin' | 'vendedor';
type UserStatus = 'activo' | 'inactivo';

interface MockUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
}

const STORAGE_KEY = 'mockup_users';

const defaultUsers: MockUser[] = [
  {
    id: 1,
    name: 'Administrador principal',
    email: 'admin@termopanel.cl',
    password: 'admin123',
    role: 'admin',
    status: 'activo',
  },
  {
    id: 2,
    name: 'Vendedor demo',
    email: 'vendedor@termopanel.cl',
    password: 'vendedor123',
    role: 'vendedor',
    status: 'activo',
  },
];

const loadUsers = (): MockUser[] => {
  const savedUsers = localStorage.getItem(STORAGE_KEY);

  if (!savedUsers) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
    return [...defaultUsers];
  }

  try {
    return JSON.parse(savedUsers) as MockUser[];
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
    return [...defaultUsers];
  }
};

const users = ref<MockUser[]>(loadUsers());

const persistUsers = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users.value));
};

const search = ref('');
const roleFilter = ref<UserRole | ''>('');
const statusFilter = ref<UserStatus | ''>('');

const currentUserEmail = localStorage.getItem('session_email') ?? '';

const isModalOpen = ref(false);
const isEditing = ref(false);
const editingUserId = ref<number | null>(null);
const formRef = ref<FormInstance>();

const form = reactive({
  name: '',
  email: '',
  password: '',
  role: 'vendedor' as UserRole,
  status: 'activo' as UserStatus,
});

const rules: FormRules = {
  name: [
    {
      required: true,
      message: 'Ingresa el nombre del usuario',
      trigger: 'blur',
    },
  ],
  email: [
    {
      required: true,
      message: 'Ingresa el correo del usuario',
      trigger: 'blur',
    },
    {
      type: 'email',
      message: 'Ingresa un correo válido',
      trigger: ['blur', 'change'],
    },
  ],
  password: [
    {
      validator: (_rule, value, callback) => {
        if (!isEditing.value && !value) {
          callback(new Error('Ingresa una contraseña'));
          return;
        }

        if (value && value.length < 6) {
          callback(new Error('La contraseña debe tener al menos 6 caracteres'));
          return;
        }

        callback();
      },
      trigger: 'blur',
    },
  ],
  role: [
    {
      required: true,
      message: 'Selecciona un rol',
      trigger: 'change',
    },
  ],
};

const filteredUsers = computed(() => {
  const term = search.value.trim().toLowerCase();

  return users.value.filter((user) => {
    const matchesSearch =
      !term ||
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      roleLabel(user.role).toLowerCase().includes(term);

    const matchesRole = !roleFilter.value || user.role === roleFilter.value;
    const matchesStatus = !statusFilter.value || user.status === statusFilter.value;

    return matchesSearch && matchesRole && matchesStatus;
  });
});

const roleLabel = (role: UserRole) => {
  return role === 'admin' ? 'Administrador' : 'Vendedor';
};

const resetForm = () => {
  form.name = '';
  form.email = '';
  form.password = '';
  form.role = 'vendedor';
  form.status = 'activo';
  editingUserId.value = null;
};

const openCreateModal = () => {
  resetForm();
  isEditing.value = false;
  isModalOpen.value = true;
};

const openEditModal = (user: MockUser) => {
  isEditing.value = true;
  editingUserId.value = user.id;

  form.name = user.name;
  form.email = user.email;
  form.password = '';
  form.role = user.role;
  form.status = user.status;

  isModalOpen.value = true;
};

const saveUser = async () => {
  if (!formRef.value) return;

  await formRef.value.validate((valid) => {
    if (!valid) return;

    const normalizedEmail = form.email.trim().toLowerCase();

    const emailAlreadyExists = users.value.some((user) => {
      return user.email.toLowerCase() === normalizedEmail && user.id !== editingUserId.value;
    });

    if (emailAlreadyExists) {
      ElMessage.error('Ya existe un usuario con ese correo');
      return;
    }

    if (isEditing.value && editingUserId.value !== null) {
      const user = users.value.find((item) => item.id === editingUserId.value);

      if (!user) return;

      user.name = form.name.trim();
      user.email = normalizedEmail;
      user.role = form.role;
      user.status = form.status;

      if (form.password.trim()) {
        user.password = form.password.trim();
      }

      persistUsers();
      ElMessage.success('Usuario actualizado correctamente');
      isModalOpen.value = false;
      return;
    }

    const newUser: MockUser = {
      id: Date.now(),
      name: form.name.trim(),
      email: normalizedEmail,
      password: form.password.trim(),
      role: form.role,
      status: form.status,
    };

    users.value.push(newUser);
    persistUsers();
    ElMessage.success('Usuario creado correctamente');
    isModalOpen.value = false;
  });
};

const deleteUser = (userId: number) => {
  const user = users.value.find((item) => item.id === userId);

  if (!user) return;

  if (user.email === currentUserEmail) {
    ElMessage.warning('No puedes eliminar el usuario con el que iniciaste sesión');
    return;
  }

  users.value = users.value.filter((item) => item.id !== userId);
  persistUsers();
  ElMessage.success('Usuario eliminado correctamente');
};
</script>