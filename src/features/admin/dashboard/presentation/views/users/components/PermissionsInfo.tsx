import { FileText } from "lucide-react";

export function PermissionsInfo() {
  return (
    <div className="mt-6 p-4 rounded-lg flex items-start gap-3 bg-card/50 border border-border/50">
      <FileText className="w-5 h-5 shrink-0 text-(--palette-info)" />
      <div className="space-y-2 text-sm">
        <p className="font-semibold text-foreground">
          Información sobre permisos
        </p>
        <ul className="space-y-1 text-muted-foreground">
          <li>
            • <strong className="text-foreground">Permiso de Lectura:</strong>{" "}
            Permite al usuario visualizar documentos PDF en el visor de la
            aplicación
          </li>
          <li>
            •{" "}
            <strong className="text-foreground">Permiso de Escritura:</strong>{" "}
            Permite al usuario editar y modificar documentos PDF físicos
          </li>
          <li>
            • <strong className="text-foreground">Clave PDF:</strong> Cada
            usuario puede configurar su propia clave para proteger los PDF que
            genere
          </li>
        </ul>
      </div>
    </div>
  );
}