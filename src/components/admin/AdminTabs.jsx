export default function AdminTabs({ activeTab, onSelect }) {
  const tabs = [
    { key: 'summary', label: 'Resumen' },
    { key: 'users', label: 'Usuarios' },
    { key: 'agents', label: 'Agentes' },
    { key: 'properties', label: 'Propiedades' },
    { key: 'inquiries', label: 'Solicitudes' }
  ]

  return (
    <div className="flex flex-wrap gap-2 rounded-3xl border border-border bg-card p-2 shadow-sm">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onSelect(tab.key)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            activeTab === tab.key
              ? 'bg-soft-black text-white shadow-sm'
              : 'text-text/70 hover:bg-border/40'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
