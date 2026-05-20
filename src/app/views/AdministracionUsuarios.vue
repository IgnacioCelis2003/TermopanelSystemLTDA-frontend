<template>
  <div class="space-y-6">
    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="editorial-eyebrow">
            Administración
          </p>

          <h1 class="mt-2 text-3xl font-bold text-slate-900">
            Administración de usuarios
          </h1>

          <p class="mt-2 max-w-2xl text-sm text-slate-500">
            Gestiona las cuentas de acceso al sistema. Puedes crear usuarios,
            editar sus datos y eliminar cuentas habilitadas para ello.
          </p>
        </div>

        <el-button
          class="editorial-primary-button"
          size="large"
          round
          @click="openCreateModal"
        >
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
          placeholder="Buscar por nombre, apellido o correo"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <el-select
          v-model="roleFilter"
          clearable
          size="large"
          placeholder="Filtrar por rol"
        >
          <el-option label="Administrador" value="admin" />
          <el-option label="Usuario" value="user" />
        </el-select>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <el-table
        v-loading="loading"
        :data="filteredUsers"
        style="width: 100%"
      >
        <el-table-column label="Nombre" min-width="220">
          <template #default="{ row }">
            <div>
              <p class="font-semibold text-slate-800">
                {{ row.nombre }} {{ row.apellidos }}
              </p>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="email" label="Correo" min-width="240" />

        <el-table-column label="Rol" width="170">
          <template #default="{ row }">
            <el-tag
              :type="row.role === 'admin' ? 'danger' : 'success'"
              effect="light"
            >
              {{ roleLabel(row.role) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Acciones" width="230" fixed="right">
          <template #default="{ row }">
            <div class="flex gap-2">
              <el-button size="small" round @click="openEditModal(row)">
                Editar
              </el-button>

              <el-popconfirm
                title="¿Seguro que deseas eliminar este usuario?"
                confirm-button-text="Eliminar"
                cancel-button-text="Cancelar"
                @confirm="deleteUser(row)"
              >
                <template #reference>
                  <el-button
                    size="small"
                    type="danger"
                    plain
                    round
                    :loading="deletingUserId === row.id"
                    :disabled="cannotDelete(row)"
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
        v-if="!loading && filteredUsers.length === 0"
        description="No se encontraron usuarios"
      />
    </section>

    <el-dialog
      v-model="isModalOpen"
      :title="isEditing ? 'Editar usuario' : 'Crear usuario'"
      width="540px"
      destroy-on-close
      class="editorial-user-dialog"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
      >
        <div class="grid gap-4 md:grid-cols-2">
          <el-form-item label="Nombre" prop="nombre">
            <el-input
              v-model="form.nombre"
              size="large"
              placeholder="Ej: María"
            />
          </el-form-item>

          <el-form-item label="Apellidos" prop="apellidos">
            <el-input
              v-model="form.apellidos"
              size="large"
              placeholder="Ej: González Soto"
            />
          </el-form-item>
        </div>

        <el-form-item label="Correo" prop="email">
          <el-input
            v-model="form.email"
            size="large"
            placeholder="usuario@correo.cl"
          />
        </el-form-item>

        <el-form-item
          v-if="!isEditing"
          label="Contraseña"
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
          <el-select
            v-model="form.role"
            size="large"
            placeholder="Selecciona un rol"
            class="w-full"
          >
            <el-option label="Administrador" value="admin" />
            <el-option label="Usuario" value="user" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="flex justify-end gap-2">
          <el-button round @click="isModalOpen = false">
            Cancelar
          </el-button>

          <el-button
            class="editorial-primary-button"
            round
            :loading="submitting"
            @click="saveUser"
          >
            {{ isEditing ? 'Guardar cambios' : 'Crear usuario' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import { Plus, Search } from '@element-plus/icons-vue';

import { ApiError } from '../services/api';
import {
  userService,
  type CreateUserPayload,
  type UpdateUserPayload,
  type User,
  type UserRole,
} from '../services/userService';
import { useSession } from '../state/session';

const { email: currentUserEmail } = useSession();

const users = ref<User[]>([]);
const loading = ref(false);
const submitting = ref(false);
const deletingUserId = ref<number | null>(null);

const search = ref('');
const roleFilter = ref<UserRole | ''>('');

const isModalOpen = ref(false);
const isEditing = ref(false);
const editingUserId = ref<number | null>(null);
const formRef = ref<FormInstance>();

const form = reactive({
  nombre: '',
  apellidos: '',
  email: '',
  password: '',
  role: 'user' as UserRole,
});

const rules: FormRules = {
  nombre: [
    {
      required: true,
      message: 'Ingresa el nombre',
      trigger: 'blur',
    },
  ],
  apellidos: [
    {
      required: true,
      message: 'Ingresa los apellidos',
      trigger: 'blur',
    },
  ],
  email: [
    {
      required: true,
      message: 'Ingresa el correo',
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

        if (!isEditing.value && value.length < 6) {
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

const roleLabel = (role: UserRole) => {
  return role === 'admin' ? 'Administrador' : 'Usuario';
};

const filteredUsers = computed(() => {
  const term = search.value.trim().toLowerCase();

  return users.value.filter((user) => {
    const fullName = `${user.nombre} ${user.apellidos}`.toLowerCase();

    const matchesSearch =
      !term ||
      fullName.includes(term) ||
      user.email.toLowerCase().includes(term) ||
      roleLabel(user.role).toLowerCase().includes(term);

    const matchesRole = !roleFilter.value || user.role === roleFilter.value;

    return matchesSearch && matchesRole;
  });
});

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiError) {
    const data = error.data;

    if (
      typeof data === 'object' &&
      data !== null &&
      'error' in data &&
      typeof data.error === 'string'
    ) {
      return data.error;
    }

    return error.message || fallback;
  }

  return fallback;
};

const loadUsers = async () => {
  loading.value = true;

  try {
    users.value = await userService.getUsers();
  } catch (error) {
    ElMessage.error(
      getErrorMessage(error, 'No se pudieron cargar los usuarios'),
    );
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  form.nombre = '';
  form.apellidos = '';
  form.email = '';
  form.password = '';
  form.role = 'user';

  editingUserId.value = null;
  formRef.value?.clearValidate();
};

const openCreateModal = () => {
  resetForm();
  isEditing.value = false;
  isModalOpen.value = true;
};

const openEditModal = (user: User) => {
  resetForm();

  isEditing.value = true;
  editingUserId.value = user.id;

  form.nombre = user.nombre;
  form.apellidos = user.apellidos;
  form.email = user.email;
  form.role = user.role;

  isModalOpen.value = true;
};

const saveUser = async () => {
  if (!formRef.value) return;

  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;

  submitting.value = true;

  try {
    if (isEditing.value && editingUserId.value !== null) {
      const payload: UpdateUserPayload = {
        id: editingUserId.value,
        role: form.role,
        email: form.email.trim().toLowerCase(),
        nombre: form.nombre.trim(),
        apellidos: form.apellidos.trim(),
      };

      await userService.updateUser(payload);
      ElMessage.success('Usuario actualizado correctamente');
    } else {
      const payload: CreateUserPayload = {
        role: form.role,
        email: form.email.trim().toLowerCase(),
        password: form.password.trim(),
        nombre: form.nombre.trim(),
        apellidos: form.apellidos.trim(),
      };

      await userService.createUser(payload);
      ElMessage.success('Usuario creado correctamente');
    }

    isModalOpen.value = false;
    await loadUsers();
  } catch (error) {
    ElMessage.error(
      getErrorMessage(
        error,
        isEditing.value
          ? 'No se pudo actualizar el usuario'
          : 'No se pudo crear el usuario',
      ),
    );
  } finally {
    submitting.value = false;
  }
};

const cannotDelete = (user: User) => {
  return user.id === 1 || user.email === currentUserEmail.value;
};

const deleteUser = async (user: User) => {
  if (cannotDelete(user)) {
    ElMessage.warning(
      user.id === 1
        ? 'El usuario protegido no puede eliminarse'
        : 'No puedes eliminar tu propia cuenta',
    );
    return;
  }

  deletingUserId.value = user.id;

  try {
    await userService.deleteUser(user.id);
    ElMessage.success('Usuario eliminado correctamente');
    await loadUsers();
  } catch (error) {
    ElMessage.error(
      getErrorMessage(error, 'No se pudo eliminar el usuario'),
    );
  } finally {
    deletingUserId.value = null;
  }
};

onMounted(() => {
  void loadUsers();
});
</script>