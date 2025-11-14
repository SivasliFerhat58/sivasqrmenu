import { requireOwner } from '@/lib/auth-guard'

export default async function DashboardPage() {
  const session = await requireOwner()

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">
          Hoş geldiniz, <span className="font-semibold">{session.user.email}</span>
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Restoran yönetim panelinize hoş geldiniz.
        </p>
      </div>
    </div>
  )
}

