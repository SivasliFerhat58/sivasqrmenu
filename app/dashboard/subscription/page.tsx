import { requireOwner } from '@/lib/auth-guard'

export default async function SubscriptionPage() {
  await requireOwner()

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Abonelik</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Abonelik yönetimi yakında eklenecek.</p>
      </div>
    </div>
  )
}

