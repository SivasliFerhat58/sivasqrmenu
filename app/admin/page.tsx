import { requireAdmin } from '@/lib/auth-guard'
import CreateRestaurantForm from '@/components/admin/CreateRestaurantForm'
import CreateUserForm from '@/components/admin/CreateUserForm'

export default async function AdminPage() {
  const session = await requireAdmin()

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Hoş geldiniz, {session.user.email}
        </h2>
        <p className="text-gray-600">
          Yeni restoran ve kullanıcı oluşturabilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Restaurant Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Yeni Restoran Oluştur
          </h3>
          <CreateRestaurantForm />
        </div>

        {/* Create User Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Yeni Kullanıcı (OWNER) Oluştur
          </h3>
          <CreateUserForm />
        </div>
      </div>
    </div>
  )
}

