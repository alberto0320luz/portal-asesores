export default function NoAutorizado() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md bg-white rounded-xl border border-slate-200 p-8 text-center">
        <h1 className="text-xl font-semibold text-slate-900 mb-2">
          Cuenta no autorizada
        </h1>
        <p className="text-slate-600 text-sm">
          No tienes acceso al portal. Contacta a tu director.
        </p>
      </div>
    </main>
  )
}
