function LoadingState({ label = 'Cargando propiedades...' }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-card">
      <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-border border-t-brand" />
      <p className="mt-4 text-text/80">{label}</p>
    </div>
  )
}

export default LoadingState
