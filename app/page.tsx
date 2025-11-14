import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-gray-900">QR Menu</h1>
          <p className="text-xl text-gray-600">Dijital Menü Yönetim Sistemi</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hoş Geldiniz</CardTitle>
            <CardDescription>
              Restoran menünüzü dijitalleştirin ve QR kod ile müşterilerinize sunun
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/signin" className="flex-1">
                <Button className="w-full" size="lg">
                  Giriş Yap
                </Button>
              </Link>
              <Link href="/dashboard" className="flex-1">
                <Button variant="outline" className="w-full" size="lg">
                  Dashboard
                </Button>
              </Link>
            </div>
            <div className="text-center text-sm text-gray-500">
              <p>Yeni kullanıcı oluşturmak için admin paneline erişin</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">QR Kod</h3>
            <p className="text-sm text-gray-600">
              Menünüze hızlı erişim için QR kod oluşturun
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">Kolay Yönetim</h3>
            <p className="text-sm text-gray-600">
              Kategoriler ve ürünleri kolayca yönetin
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">Analitik</h3>
            <p className="text-sm text-gray-600">
              Menü görüntülenmelerini takip edin
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
