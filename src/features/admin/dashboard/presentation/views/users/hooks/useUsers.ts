import { useState } from "react";
import { User, UserFormData } from "../types";

const initialUsers: User[] = [
  {
    id: "1",
    nombre: "Juan Pérez",
    email: "juan.perez@uta.edu.ec",
    rol: "Administrador",
    permisoLectura: true,
    permisoEscritura: true,
    clavePDF: "****",
    activo: true,
  },
  {
    id: "2",
    nombre: "María González",
    email: "maria.gonzalez@uta.edu.ec",
    rol: "Usuario",
    permisoLectura: true,
    permisoEscritura: false,
    clavePDF: "****",
    activo: true,
  },
];

export function useUsers() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    nombre: "",
    email: "",
    rol: "Usuario",
    permisoLectura: true,
    permisoEscritura: false,
    clavePDF: "",
  });

  const openNewDialog = () => {
    setEditingUser(null);
    setShowPassword(false);
    setFormData({
      nombre: "",
      email: "",
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
      rol: user.rol,
      permisoLectura: user.permisoLectura,
      permisoEscritura: user.permisoEscritura,
      clavePDF: user.clavePDF || "",
    });
    setDialogOpen(true);
  };

  const saveUser = () => {
    if (!formData.nombre || !formData.email) {
      alert("Complete todos los campos obligatorios");
      return;
    }

    if (!formData.email.endsWith("@uta.edu.ec")) {
      alert("Debe usar un correo institucional (@uta.edu.ec)");
      return;
    }

    if (editingUser) {
      setUsers(
        users.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u))
      );
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        ...formData,
        activo: true,
      };
      setUsers([...users, newUser]);
    }

    setDialogOpen(false);
  };

  const deleteUser = (id: string) => {
    if (confirm("¿Está seguro de eliminar este usuario?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const toggleActive = (id: string) => {
    setUsers(
      users.map((u) => (u.id === id ? { ...u, activo: !u.activo } : u))
    );
  };

  return {
    users,
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
  };
}