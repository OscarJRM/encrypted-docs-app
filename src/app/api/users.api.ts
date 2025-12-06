// src/app/api/users.api.ts
// Use relative path to leverage Next.js rewrites and avoid CORS
const API_URL = '/backend-api';

export interface User {
  id: string;
  email: string;
  name: string;
  cedula?: string;
  role?: string;
  created_at?: string;
}

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
  cedula?: string;
  role?: string;
}

export interface UpdateUserDto {
  email?: string;
  name?: string;
  password?: string;
  cedula?: string;
  role?: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

// Función auxiliar para manejar errores
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  return {} as T;
};

// Función para obtener headers con autenticación
const getAuthHeaders = (token?: string) => {
  if (typeof window === 'undefined' && !token) return { 'Content-Type': 'application/json' };
  
  const finalToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  return {
    'Content-Type': 'application/json',
    ...(finalToken && { 'Authorization': `Bearer ${finalToken}` }),
  };
};

// Servicio de usuarios
export const usersApi = {
  /**
   * GET /users - Obtener todos los usuarios (masked)
   */
  getAll: async (token?: string): Promise<User[]> => {
    const response = await fetch( `${API_URL}/users`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    return handleResponse<User[]>(response);
  },

  /**
   * GET /users/:id - Obtener un usuario por ID (clear text for admin)
   */
  getById: async (id: string, token?: string): Promise<User> => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    return handleResponse<User>(response);
  },

  /**
   * POST /users - Crear un nuevo usuario
   */
  create: async (data: CreateUserDto, token?: string): Promise<User> => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });

    return handleResponse<User>(response);
  },

  /**
   * PATCH /users/:id - Actualizar un usuario
   */
  update: async (id: string, data: UpdateUserDto, token?: string): Promise<User> => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });

    return handleResponse<User>(response);
  },

  /**
   * DELETE /users/:id - Eliminar un usuario
   */
  delete: async (id: string, token?: string): Promise<void> => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });

    return handleResponse<void>(response);
  },
};