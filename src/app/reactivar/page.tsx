export default function Reactivar() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md bg-white rounded-xl border border-slate-200 p-8 text-center">
        <h1 className="text-xl font-semibold text-slate-900 mb-2">
          Suscripción vencida
        </h1>
        <p className="text-slate-600 text-sm mb-6">
          Tu suscripción expiró. Reactívala para continuar usando el portal.
        </p>
        <button
          onClick={() => window.location.href = '/panel'}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Reactivar
        </button>
      </div>
    </main>
  )
}
