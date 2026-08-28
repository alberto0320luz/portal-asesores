'use client'
export default function PendienteVerificacion() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md bg-white rounded-xl border border-slate-200 p-8 text-center">
        <h1 className="text-xl font-semibold text-slate-900 mb-2">
          Pendiente de verificación
        </h1>
        <p className="text-slate-600 text-sm">
          Tu cuenta está en proceso de verificación. Te enviaremos un correo cuando esté lista.
        </p>
      </div>
    </main>
  )
}
