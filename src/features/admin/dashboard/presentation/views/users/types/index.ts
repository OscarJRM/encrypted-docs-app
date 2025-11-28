export interface User {
    id: string;
    nombre: string;
    email: string;
    rol: string;
    permisoLectura: boolean;
    permisoEscritura: boolean;
    clavePDF?: string;
    activo: boolean;
  }
  
  export const allowedRoles = ["Administrador", "Gestor", "Usuario"] as const;
  
  export type Role = (typeof allowedRoles)[number];
  
  export const roleVariant: Record<
    Role,
    "destructive" | "secondary" | "success" | "outline"
  > = {
    Administrador: "destructive",
    Gestor: "secondary",
    Usuario: "success",
  };
  
  export function isRole(value: string): value is Role {
    return allowedRoles.includes(value as Role);
  }
  
  export interface UserFormData {
    nombre: string;
    email: string;
    rol: string;
    permisoLectura: boolean;
    permisoEscritura: boolean;
    clavePDF: string;
  }