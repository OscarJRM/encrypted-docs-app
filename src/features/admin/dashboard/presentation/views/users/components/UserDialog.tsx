// src/features/admin/dashboard/presentation/views/users/components/UserDialog.tsx
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Switch } from "@/app/components/ui/switch";
import { Shield, Key, Eye, EyeOff } from "lucide-react";
import { User, UserFormData } from "../types";

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingUser: User | null;
  formData: UserFormData;
  setFormData: (data: UserFormData) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  onSave: () => void;
}

export function UserDialog({
  open,
  onOpenChange,
  editingUser,
  formData,
  setFormData,
  showPassword,
  setShowPassword,
  onSave,
}: UserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-(--bg-light) border-border">
        <DialogHeader>
          <DialogTitle style={{ color: "var(--text)" }}>
            {editingUser ? "Editar Usuario" : "Nuevo Usuario"}
          </DialogTitle>
          <DialogDescription style={{ color: "var(--text-muted)" }}>
            Complete la información del usuario y configure sus permisos
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre" style={{ color: "var(--text)" }}>
                Nombre Completo *
              </Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                placeholder="Juan Pérez"
                style={{
                  backgroundColor: "var(--bg)",
                  borderColor: "var(--border)",
                  color: "var(--text)",
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" style={{ color: "var(--text)" }}>
              Correo Electrónico *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="usuario@ejemplo.com"
                style={{
                  backgroundColor: "var(--bg)",
                  borderColor: "var(--border)",
                  color: "var(--text)",
                }}
              />
            </div>
          </div>

          {/* Campo de Cédula - Obligatorio en creación, opcional en edición */}
          <div className="space-y-2">
            <Label htmlFor="cedula" style={{ color: "var(--text)" }}>
              Cédula {!editingUser && "*"}
            </Label>
            <Input
              id="cedula"
              value={formData.cedula || ""}
              onChange={(e) =>
                setFormData({ ...formData, cedula: e.target.value })
              }
              placeholder="1234567890"
              maxLength={10}
              style={{
                backgroundColor: "var(--bg)",
                borderColor: "var(--border)",
                color: "var(--text)",
              }}
            />
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {!editingUser && "Campo obligatorio para nuevos usuarios"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rol" style={{ color: "var(--text)" }}>
              Rol
            </Label>
            <select
              id="rol"
              value={formData.rol}
              onChange={(e) =>
                setFormData({ ...formData, rol: e.target.value })
              }
              className="w-full px-3 py-2 rounded-md border bg-black text-white"
            >
              <option value="Usuario">Usuario</option>
              <option value="Administrador">Administrador</option>
              <option value="Gestor">Gestor</option>
            </select>
          </div>

          <div
            className="p-4 rounded-lg space-y-4"
            style={{
              backgroundColor: "var(--bg)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" style={{ color: "var(--primary)" }} />
              <h3 className="font-semibold" style={{ color: "var(--text)" }}>
                Permisos sobre documentos PDF
              </h3>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label style={{ color: "var(--text)" }}>
                  Permiso de Lectura
                </Label>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Permite visualizar documentos PDF
                </p>
              </div>
              <Switch
                checked={formData.permisoLectura}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, permisoLectura: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label style={{ color: "var(--text)" }}>
                  Permiso de Escritura
                </Label>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Permite editar y modificar documentos PDF
                </p>
              </div>
              <Switch
                checked={formData.permisoEscritura}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, permisoEscritura: checked })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="clavePDF"
              className="flex items-center gap-2"
              style={{ color: "var(--text)" }}>
              <Key className="w-4 h-4" />
              Contraseña {!editingUser && "*"}
            </Label>
            <div className="relative">
              <Input
                id="clavePDF"
                type={showPassword ? "text" : "password"}
                value={formData.clavePDF}
                onChange={(e) =>
                  setFormData({ ...formData, clavePDF: e.target.value })
                }
                placeholder={
                  editingUser
                    ? "Dejar vacío para mantener la actual"
                    : "Mínimo 6 caracteres"
                }
                className="pr-10"
                style={{
                  backgroundColor: "var(--bg)",
                  borderColor: "var(--border)",
                  color: "var(--text)",
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff
                    className="h-4 w-4"
                    style={{ color: "var(--text-muted)" }}
                  />
                ) : (
                  <Eye
                    className="h-4 w-4"
                    style={{ color: "var(--text-muted)" }}
                  />
                )}
                <span className="sr-only">
                  {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                </span>
              </Button>
            </div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {editingUser
                ? "Dejar vacío para no cambiar la contraseña actual"
                : "Campo obligatorio - Mínimo 6 caracteres"}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            style={{ borderColor: "var(--border)", color: "var(--text)" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={onSave}
            className="bg-[color:var(--primary)] hover:bg-[color:var(--primary)]/90 text-[color:var(--bg-dark)]"
          >
            {editingUser ? "Actualizar" : "Crear"} Usuario
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}