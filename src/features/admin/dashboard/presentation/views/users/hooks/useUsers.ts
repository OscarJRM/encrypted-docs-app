// src/features/admin/dashboard/presentation/views/users/hooks/useUsers.ts
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usersApi } from "@/app/api/users.api";
import { User, UserFormData } from "../types";

export function useUsers() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    nombre: "",
    email: "",
    cedula: "",
    rol: "Usuario",
    permisoLectura: true,
    permisoEscritura: false,
    clavePDF: "",
  });

  // Cargar usuarios del backend al iniciar
  useEffect(() => {
    if (session?.user) {
      fetchUsers();
    }
  }, [session]);

  // Función para obtener usuarios del backend
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = (session?.user as any)?.accessToken;
      const data = await usersApi.getAll(token);
      
      // Adaptar datos del backend a tu estructura
      const adaptedUsers: User[] = data.map((user) => ({
        id: user.id,
        nombre: user.name,
        email: user.email,
        cedula: user.cedula,
        rol: user.role === 'admin' ? 'Administrador' : 'Usuario',
        permisoLectura: true,
        permisoEscritura: user.role === 'admin',
        clavePDF: "****",
        activo: true,
      }));
      
      setUsers(adaptedUsers);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const openNewDialog = () => {
    setEditingUser(null);
    setShowPassword(false);
    setFormData({
      nombre: "",
      email: "",
      cedula: "",
      rol: "Usuario",
      permisoLectura: true,
      permisoEscritura: false,
      clavePDF: "",
    });
    setDialogOpen(true);
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setShowPassword(false);
    setFormData({
      nombre: user.nombre,
      email: user.email,
      cedula: user.cedula || "",
      rol: user.rol,
      permisoLectura: user.permisoLectura,
      permisoEscritura: user.permisoEscritura,
      clavePDF: "",
    });
    setDialogOpen(true);
  };

  const saveUser = async () => {
    // Validaciones básicas
    if (!formData.nombre || !formData.email) {
      alert("Complete todos los campos obligatorios");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Por favor, ingrese un correo electrónico válido");
      return;
    }
    
    // Validaciones específicas para CREACIÓN
    if (!editingUser) {
      // Cédula obligatoria en creación
      if (!formData.cedula || formData.cedula.trim() === "") {
        alert("La cédula es obligatoria para crear un nuevo usuario");
        return;
      }
  
      // Validar formato de cédula (10 dígitos)
      if (!/^\d{10}$/.test(formData.cedula)) {
        alert("La cédula debe tener exactamente 10 dígitos");
        return;
      }
  
      // Contraseña obligatoria en creación
      if (!formData.clavePDF) {
        alert("La contraseña es obligatoria para crear un nuevo usuario");
        return;
      }
  
      // Validar longitud mínima de contraseña
      if (formData.clavePDF.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres");
        return;
      }
    } else {
      // En EDICIÓN, validar contraseña solo si se ingresó
      if (formData.clavePDF && formData.clavePDF.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres");
        return;
      }
  
      // Validar formato de cédula solo si se ingresó
      if (formData.cedula && formData.cedula.trim() !== "" && !/^\d{10}$/.test(formData.cedula)) {
        alert("La cédula debe tener exactamente 10 dígitos");
        return;
      }
    }
  
    setLoading(true);
    setError(null);
  
    try {
      if (editingUser) {
        // ✅ ACTUALIZAR usuario existente
        const updateData: any = {};
  
        if (formData.nombre) updateData.name = formData.nombre;
        if (formData.email) updateData.email = formData.email;
        if (formData.cedula) updateData.cedula = formData.cedula;
        if (formData.clavePDF) updateData.password = formData.clavePDF;
        
        updateData.role = formData.rol === 'Administrador' ? 'admin' : 'user';
        
        const token = (session?.user as any)?.accessToken;
        await usersApi.update(editingUser.id, updateData, token);
        
        alert('Usuario actualizado correctamente');
      } else {
        // ✅ CREAR nuevo usuario
        const createData = {
          name: formData.nombre,
          email: formData.email,
          cedula: formData.cedula!,
          password: formData.clavePDF!,
          role: formData.rol === 'Administrador' ? 'admin' : 'user',
        };
  
        const token = (session?.user as any)?.accessToken;
        await usersApi.create(createData, token);
        
        alert('Usuario creado correctamente');
      }
  
      // ✅ RECARGAR TODOS LOS USUARIOS DESDE EL BACKEND
      // Esto garantiza que los datos mostrados sean exactamente los del backend
      await fetchUsers();
      
      setDialogOpen(false);
    } catch (err) {
      console.error('Error al guardar usuario:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar usuario';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("¿Está seguro de eliminar este usuario?")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = (session?.user as any)?.accessToken;
      await usersApi.delete(id, token);
      setUsers(users.filter((u) => u.id !== id));
      alert('Usuario eliminado correctamente');
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar usuario';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = (id: string) => {
    // Esta funcionalidad depende de si tu backend soporta activar/desactivar
    // Por ahora solo lo hacemos local
    setUsers(
      users.map((u) => (u.id === id ? { ...u, activo: !u.activo } : u))
    );
  };

  return {
    users,
    loading,
    error,
    dialogOpen,
    setDialogOpen,
    editingUser,
    showPassword,
    setShowPassword,
    formData,
    setFormData,
    openNewDialog,
    openEditDialog,
    saveUser,
    deleteUser,
    toggleActive,
    fetchUsers,
  };
}