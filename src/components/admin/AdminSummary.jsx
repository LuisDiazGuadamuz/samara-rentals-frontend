export default function AdminSummary({ counts }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="card p-6">
        <div className="text-sm uppercase tracking-[0.2em] text-text/70">Usuarios</div>
        <div className="mt-4 text-3xl font-heading text-text">{counts.users}</div>
      </div>
      <div className="card p-6">
        <div className="text-sm uppercase tracking-[0.2em] text-text/70">Agentes</div>
        <div className="mt-4 text-3xl font-heading text-text">{counts.agents}</div>
      </div>
      <div className="card p-6">
        <div className="text-sm uppercase tracking-[0.2em] text-text/70">Propiedades</div>
        <div className="mt-4 text-3xl font-heading text-text">{counts.properties}</div>
      </div>
      <div className="card p-6">
        <div className="text-sm uppercase tracking-[0.2em] text-text/70">Solicitudes</div>
        <div className="mt-4 text-3xl font-heading text-text">{counts.inquiries}</div>
      </div>
    </div>
  )
}
