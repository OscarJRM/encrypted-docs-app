export default function UserPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Inicio</h1>
        <p className="text-muted-foreground">
          Bienvenido a tu panel personal.
        </p>
      </div>
      <div className="rounded-lg border border-dashed p-6">
        <p className="text-sm text-muted-foreground">
          Selecciona una opción del menú lateral para comenzar.
        </p>
      </div>
    </section>
  );
}
