export default function StatusBadge({ status }) {
  const statusConfig = {
    available: {
      label: 'Disponible',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-300',
    },
    sold: {
      label: 'Vendida',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-300',
    },
    rented: {
      label: 'Rentada',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-300',
    },
    pending: {
      label: 'Pendiente',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-300',
    },
    reserved: {
      label: 'Reservada',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800',
      borderColor: 'border-purple-300',
    },
  }

  const config = statusConfig[status] || statusConfig.available

  return (
    <span
      className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
    >
      {config.label}
    </span>
  )
}
