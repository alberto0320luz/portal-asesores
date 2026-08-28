import { createClient } from '@supabase/supabase-js'

/**
 * ⚠️ CLIENTE ADMINISTRATIVO — SALTA TODAS LAS POLÍTICAS RLS
 *
 * Usar ÚNICAMENTE en:
 *   - Route Handlers (src/app/api/...)
 *   - Server Actions
 *   - Webhooks (Stripe, GHL)
 *   - Tareas programadas (cron)
 *
 * 🔴 NUNCA importar desde un archivo con "use client"
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
