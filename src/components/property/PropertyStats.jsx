import { MdBed, MdBathtub, MdSquareFoot, MdHome } from 'react-icons/md'

export default function PropertyStats({ bedrooms, bathrooms, area, type }) {
  const stats = [
    {
      icon: MdBed,
      label: 'Habitaciones',
      value: bedrooms ?? 'N/A',
    },
    {
      icon: MdBathtub,
      label: 'Baños',
      value: bathrooms ?? 'N/A',
    },
    {
      icon: MdSquareFoot,
      label: 'Área',
      value: area ? `${area} m²` : 'N/A',
    },
    {
      icon: MdHome,
      label: 'Tipo',
      value: type ?? 'N/A',
    },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="flex items-center gap-3 rounded-xl border border-samara-stone/50 bg-samara-ivory p-4 transition hover:border-samara-gold hover:bg-white"
          >
            <Icon className="h-6 w-6 flex-shrink-0 text-samara-gold" aria-hidden="true" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-samara-ash">{stat.label}</p>
              <p className="mt-1 text-base font-semibold text-samara-charcoal">{stat.value}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
