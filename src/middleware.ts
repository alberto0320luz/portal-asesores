import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresca la sesión y obtiene el usuario actual
  const { data: { user } } = await supabase.auth.getUser()

  const ruta = request.nextUrl.pathname

  const esPublica =
    ruta === '/' ||
    ruta.startsWith('/login') ||
    ruta.startsWith('/auth') ||
    ruta.startsWith('/invitacion')

  // ──── 1. Sin sesión intentando protegida → login ────
  if (!user && !esPublica) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // ──── 2. Con sesión intentando login → panel ────
  if (user && ruta.startsWith('/login')) {
    const url = request.nextUrl.clone()
    url.pathname = '/panel'
    return NextResponse.redirect(url)
  }

  // ──── 3. Con sesión en zona protegida → validar asesor ────
  if (user && !esPublica) {
    const { data: asesor, error } = await supabase
      .from('asesores')
      .select('id, verificado_estatus')
      .eq('id', user.id)
      .single()

    // No existe como asesor → rechazo
    if (error || !asesor) {
      const url = request.nextUrl.clone()
      url.pathname = '/no-autorizado'
      return NextResponse.redirect(url)
    }

    // Existe pero está pendiente de verificación
    if (asesor.verificado_estatus === 'pendiente') {
      const url = request.nextUrl.clone()
      url.pathname = '/pendiente-verificacion'
      return NextResponse.redirect(url)
    }

    // ──── 4. Validar suscripción ────
    const { data: suscripcion, error: errSub } = await supabase
      .from('suscripciones')
      .select('estatus, trial_termina_en')
      .eq('asesor_id', user.id)
      .single()

    if (errSub || !suscripcion) {
      const url = request.nextUrl.clone()
      url.pathname = '/sin-suscripcion'
      return NextResponse.redirect(url)
    }

    // Suscripción: trial, activa, o vencida
    if (suscripcion.estatus === 'vencida' || suscripcion.estatus === 'cancelada') {
      const url = request.nextUrl.clone()
      url.pathname = '/reactivar'
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
