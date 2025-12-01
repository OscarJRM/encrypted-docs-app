import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Switch } from "@/app/components/ui/switch";
import { Edit, Trash2, Key } from "lucide-react";
import { User, isRole, roleVariant } from "../types";

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
}

export function UsersTable({
  users,
  onEdit,
  onDelete,
  onToggleActive,
}: UsersTableProps) {
  return (
    <div className="rounded-md border" style={{ borderColor: "var(--border)" }}>
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Usuario
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Correo
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Cédula
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Rol
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Permisos
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Clave PDF
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Estado
            </th>
            <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
            >
              <td className="p-4 align-middle font-medium">{user.nombre}</td>
              <td className="p-4 align-middle text-muted-foreground">
                {user.email}
              </td>
              {/* ✅ MOSTRAR CÉDULA */}
              <td className="p-4 align-middle text-muted-foreground">
                {user.cedula || (
                  <span className="text-xs italic opacity-50">Sin cédula</span>
                )}
              </td>
              <td className="p-4 align-middle">
                <Badge
                  variant={
                    isRole(user.rol) ? roleVariant[user.rol] : "outline"
                  }
                >
                  {user.rol}
                </Badge>
              </td>

              <td className="p-4 align-middle">
                <div className="flex gap-1.5">
                  {user.permisoLectura && (
                    <Badge className="text-xs bg-transparent !border !border-[var(--palette-info)] text-[var(--palette-info)]">
                      Lectura
                    </Badge>
                  )}
                  {user.permisoEscritura && (
                    <Badge className="text-xs bg-transparent !border !border-[var(--palette-warning)] text-[var(--palette-warning)]">
                      Escritura
                    </Badge>
                  )}
                </div>
              </td>
              <td className="p-4 align-middle">
                {user.clavePDF ? (
                  <span className="flex items-center gap-1 text-(--palette-success) text-xs font-medium">
                    <Key className="w-3 h-3" />
                    Configurada
                  </span>
                ) : (
                  <span className="text-muted-foreground text-xs">
                    Sin configurar
                  </span>
                )}
              </td>
              <td className="p-4 align-middle">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={user.activo}
                    onCheckedChange={() => onToggleActive(user.id)}
                  />
                  <span className="text-xs font-medium text-muted-foreground">
                    {user.activo ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </td>
              <td className="p-4 align-middle text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 text-(--palette-info) hover:text-(--palette-info) hover:bg-(--palette-info)/10"
                    onClick={() => onEdit(user)}
                  >
                    <Edit className="size-3.5" />
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-(--palette-danger) hover:text-(--palette-danger) hover:bg-(--palette-danger)/10"
                    onClick={() => onDelete(user.id)}
                    title="Eliminar"
                  >
                    <Trash2 className="size-4" />
                    <span className="sr-only">Eliminar</span>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}