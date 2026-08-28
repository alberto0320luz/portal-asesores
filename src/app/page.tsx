import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-slate-900 mb-3">
          Portal de Asesores
        </h1>
        <p className="text-slate-500 mb-8">
          Administra tu cartera de clientes y pólizas
        </p>
        <Link
          href="/login"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-7 py-3 rounded-lg transition-colors"
        >
          Entrar
        </Link>
      </div>
    </main>
  )
}
