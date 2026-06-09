import { MdWarning } from 'react-icons/md'

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirmar', onConfirm, onCancel }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <MdWarning className="h-6 w-6 text-orange-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-heading text-text">{title}</h3>
            <p className="mt-2 text-sm text-text/70">{message}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end border-t border-border pt-4">
          <button type="button" onClick={onCancel} className="btn-ghost">
            Cancelar
          </button>
          <button type="button" onClick={onConfirm} className="btn-primary">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
