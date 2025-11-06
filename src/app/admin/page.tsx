export default function AdminPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Panel de administración</h1>
        <p className="text-muted-foreground">
          Bienvenido a la sección administrativa de la aplicación.
        </p>
      </div>
      <div className="rounded-lg border border-dashed p-6">
        <p className="text-sm text-muted-foreground">
          Usa el menú lateral para navegar entre las distintas secciones del panel.
        </p>
      </div>
    </section>
  );
}
