import { requireOwner } from '@/lib/auth-guard'
import AnalyticsDashboard from '@/components/dashboard/AnalyticsDashboard'

export default async function AnalyticsPage() {
  await requireOwner()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">İstatistikler</h1>
        <p className="text-gray-600 mt-1">
          Menü görüntülenme istatistikleriniz
        </p>
      </div>
      <AnalyticsDashboard />
    </div>
  )
}

