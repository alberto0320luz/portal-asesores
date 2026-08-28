import { createClient } from '@/lib/supabase/server'
import { LogOut } from 'lucide-react'
import Link from 'next/link'

export default async function PanelPage() {
  const supabase = await createClient()

  // ── Obtener usuario autenticado ──
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null // El middleware ya redirigió, esto no debería pasar
  }

  // ── Obtener datos del asesor ──
  const { data: asesor, error: errorAsesor } = await supabase
    .from('asesores')
    .select(`
      id,
      nombre,
      email,
      telefono,
      rol,
      cedula_agente,
      promotoras:promotora_id (
        nombre,
        ghl_location_id
      )
    `)
    .eq('id', user.id)
    .single()

  // ── Obtener suscripción ──
  const { data: suscripcion } = await supabase
    .from('suscripciones')
    .select('estatus, trial_termina_en, plan')
    .eq('asesor_id', user.id)
    .single()

  // ── Obtener estadísticas rápidas ──
  const { count: totalPolizas } = await supabase
    .from('polizas')
    .select('id', { count: 'exact', head: true })
    .eq('asesor_id', user.id)

  const { count: clientesUnicos } = await supabase
    .from('polizas')
    .select('cliente_id', { count: 'exact', head: true })
    .eq('asesor_id', user.id)
    .neq('cliente_id', null)

  // ── Mapeo de estado ──
  const estadoSubscripcion = {
    trial: { label: 'Prueba', color: 'bg-blue-100 text-blue-700' },
    activa: { label: 'Activa', color: 'bg-emerald-100 text-emerald-700' },
    vencida: { label: 'Vencida', color: 'bg-red-100 text-red-700' },
    cancelada: { label: 'Cancelada', color: 'bg-gray-100 text-gray-700' },
  }

  const estadoActual =
    estadoSubscripcion[suscripcion?.estatus as keyof typeof estadoSubscripcion] ||
    estadoSubscripcion.trial

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Portal de Asesores
            </h1>
            <p className="text-slate-500 text-sm">
     {asesor?.promotoras?.[0]?.nombre || 'Promotora'}

            </p>
          </div>
          <Link
            href="/api/logout"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900
                       px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Salir
          </Link>
        </div>
      </header>

      {/* Contenido */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Card de bienvenida */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Bienvenido, {asesor?.nombre}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Datos del asesor */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-3">
                Información del asesor
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-slate-600">
                  Cédula: <span className="font-medium text-slate-900">{asesor?.cedula_agente || '-'}</span>
                </p>
                <p className="text-slate-600">
                  Correo: <span className="font-medium text-slate-900">{asesor?.email}</span>
                </p>
                <p className="text-slate-600">
                  Teléfono: <span className="font-medium text-slate-900">{asesor?.telefono || '-'}</span>
                </p>
                <p className="text-slate-600">
                  Rol: <span className="font-medium text-slate-900 uppercase">{asesor?.rol}</span>
                </p>
              </div>
            </div>

            {/* Suscripción */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-3">
                Suscripción
              </h3>
              <div className="space-y-3">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${estadoActual.color}`}>
                    {estadoActual.label}
                  </span>
                </div>
                <p className="text-sm text-slate-600">
                  Plan: <span className="font-medium text-slate-900 capitalize">{suscripcion?.plan || '-'}</span>
                </p>
                {suscripcion?.trial_termina_en && (
                  <p className="text-sm text-slate-600">
                    Prueba hasta:{' '}
                    <span className="font-medium text-slate-900">
                      {new Date(suscripcion.trial_termina_en).toLocaleDateString('es-MX')}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <p className="text-slate-500 text-sm font-medium mb-2">Pólizas</p>
            <p className="text-3xl font-semibold text-slate-900">{totalPolizas || 0}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <p className="text-slate-500 text-sm font-medium mb-2">Clientes únicos</p>
            <p className="text-3xl font-semibold text-slate-900">{clientesUnicos || 0}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <p className="text-slate-500 text-sm font-medium mb-2">Estado</p>
            <p className="text-3xl font-semibold text-emerald-600">✓</p>
          </div>
        </div>

      </div>
    </main>
  )
}
