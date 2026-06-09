import { MdEmail, MdPhone } from 'react-icons/md'

export default function AgentCard({ agent }) {
  if (!agent) return null

  const photoUrl = agent.photo && String(agent.photo).trim() ? agent.photo : null
  const agentName = agent.name || 'Agente'
  const agentEmail = agent.email || ''
  const agentPhone = agent.phone || ''

  return (
    <div className="rounded-2xl border border-samara-stone/70 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-samara-charcoal">Agente Encargado</h3>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        {/* Foto */}
        <div className="flex-shrink-0">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={agentName}
              className="h-20 w-20 rounded-full border-2 border-samara-gold object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-samara-stone/50 bg-samara-ivory text-samara-ash">
              <span className="text-xl font-semibold">{agentName.charAt(0)}</span>
            </div>
          )}
        </div>

        {/* Información */}
        <div className="flex-1">
          <p className="text-lg font-semibold text-samara-charcoal">{agentName}</p>

          {agentEmail && (
            <div className="mt-2 flex items-center gap-2 text-sm text-samara-ash">
              <MdEmail className="h-4 w-4" aria-hidden="true" />
              <a href={`mailto:${agentEmail}`} className="hover:text-samara-gold hover:underline">
                {agentEmail}
              </a>
            </div>
          )}

          {agentPhone && (
            <div className="mt-1 flex items-center gap-2 text-sm text-samara-ash">
              <MdPhone className="h-4 w-4" aria-hidden="true" />
              <a href={`tel:${agentPhone}`} className="hover:text-samara-gold hover:underline">
                {agentPhone}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Botones de contacto */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        {agentEmail && (
          <a
            href={`mailto:${agentEmail}`}
            className="flex-1 rounded-full border border-samara-charcoal px-4 py-2 text-center text-sm font-semibold text-samara-charcoal transition hover:bg-samara-charcoal hover:text-white"
          >
            Enviar correo
          </a>
        )}
        {agentPhone && (
          <a
            href={`tel:${agentPhone}`}
            className="flex-1 rounded-full bg-samara-gold px-4 py-2 text-center text-sm font-semibold text-samara-charcoal transition hover:bg-samara-ash hover:text-white"
          >
            Llamar
          </a>
        )}
      </div>
    </div>
  )
}
