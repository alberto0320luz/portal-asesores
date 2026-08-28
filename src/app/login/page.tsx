'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Mail, Loader2, CheckCircle2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [cargando, setCargando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')

  async function enviarEnlace(e: React.FormEvent) {
    e.preventDefault()
    setCargando(true)
    setError('')

    const supabase = createClient()
    const { error: errorAuth } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setCargando(false)

    if (errorAuth) {
      setError('No pudimos enviar el enlace. Revisa tu correo e intenta de nuevo.')
      return
    }

    setEnviado(true)
  }

  // ── Pantalla de confirmación ──
  if (enviado) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-4" />

          <h1 className="text-xl font-semibold text-slate-900 mb-2">
            Revisa tu correo
          </h1>

          <p className="text-slate-600 text-sm leading-relaxed">
            Enviamos un enlace de acceso a<br />
            <span className="font-medium text-slate-900">{email}</span>
          </p>

          <p className="text-slate-500 text-xs mt-4 leading-relaxed">
            El enlace expira en una hora.<br />
            Si no lo ves, revisa tu carpeta de spam.
          </p>

          <button
            onClick={() => { setEnviado(false); setEmail('') }}
            className="mt-6 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Usar otro correo
          </button>
        </div>
      </main>
    )
  }

  // ── Formulario ──
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-slate-900">
            Portal de Asesores
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Ingresa con tu correo registrado
          </p>
        </div>

        <form
          onSubmit={enviarEnlace}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
        >
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Correo electrónico
          </label>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@promotora.mx"
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg
                         text-slate-900 placeholder:text-slate-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         focus:border-transparent"
            />
          </div>

          {error && (
            <p className="mt-3 text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300
                       text-white font-medium py-2.5 rounded-lg transition-colors
                       flex items-center justify-center gap-2"
          >
            {cargando ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar enlace de acceso'
            )}
          </button>

          <p className="text-xs text-slate-500 text-center mt-5 leading-relaxed">
            Te enviaremos un enlace seguro.<br />
            No necesitas contraseña.
          </p>
        </form>

      </div>
    </main>
  )
}
