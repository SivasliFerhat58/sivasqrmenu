'use client'

import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface DailyView {
  date: string
  count: number
}

interface TopCategory {
  id: string
  name: string
  itemCount: number
}

interface AnalyticsData {
  dailyViews: DailyView[]
  topCategories: TopCategory[]
  totalViews: number
  viewsToday: number
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics/views?days=30')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch analytics')
        }
        return res.json()
      })
      .then((data) => {
        // Validate data structure
        if (data && typeof data === 'object') {
          setData({
            dailyViews: Array.isArray(data.dailyViews) ? data.dailyViews : [],
            topCategories: Array.isArray(data.topCategories) ? data.topCategories : [],
            totalViews: typeof data.totalViews === 'number' ? data.totalViews : 0,
            viewsToday: typeof data.viewsToday === 'number' ? data.viewsToday : 0,
          })
        } else {
          setData({
            dailyViews: [],
            topCategories: [],
            totalViews: 0,
            viewsToday: 0,
          })
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching analytics:', err)
        setData({
          dailyViews: [],
          topCategories: [],
          totalViews: 0,
          viewsToday: 0,
        })
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">Veri yüklenemedi</p>
        </CardContent>
      </Card>
    )
  }

  // Format dates for display - ensure dailyViews is an array
  const formattedDailyViews = (data.dailyViews || []).map((view) => ({
    ...view,
    date: new Date(view.date).toLocaleDateString('tr-TR', {
      month: 'short',
      day: 'numeric',
    }),
  }))

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Toplam Görüntülenme</CardTitle>
            <CardDescription>Son 30 gün</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.totalViews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Bugün</CardTitle>
            <CardDescription>Günlük görüntülenme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.viewsToday}</div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Views Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Günlük Görüntülenme</CardTitle>
          <CardDescription>Son 30 gün</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={formattedDailyViews}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Categories */}
      <Card>
        <CardHeader>
          <CardTitle>En Çok Ürün İçeren Kategoriler</CardTitle>
          <CardDescription>Top 5 kategori</CardDescription>
        </CardHeader>
        <CardContent>
          {!data.topCategories || data.topCategories.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Henüz kategori yok</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.topCategories}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="itemCount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

