import { requireOwner } from '@/lib/auth-guard'
import { prisma } from '@/lib/prisma'
import QRCodeGenerator from '@/components/dashboard/QRCodeGenerator'

export default async function QRCodePage() {
  const session = await requireOwner()

  // Get user's restaurant
  const restaurant = await prisma.restaurant.findFirst({
    where: { ownerId: session.user.id },
    select: {
      id: true,
      name: true,
      subdomain: true,
    },
  })

  if (!restaurant) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">QR Kod Oluştur</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Önce bir restoran oluşturmanız gerekiyor.
          </p>
        </div>
      </div>
    )
  }

  // Generate public URL
  const baseDomain = process.env.BASE_DOMAIN || 'example.com'
  const publicUrl = `https://${restaurant.subdomain}.${baseDomain}`

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">QR Kod Oluştur</h1>
      <p className="text-gray-600 mb-6">
        Müşterilerinizin menünüze erişmesi için QR kod oluşturun.
      </p>
      <QRCodeGenerator
        restaurantName={restaurant.name}
        subdomain={restaurant.subdomain}
        publicUrl={publicUrl}
      />
    </div>
  )
}

