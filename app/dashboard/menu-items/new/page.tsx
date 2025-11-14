import { requireOwner } from '@/lib/auth-guard'
import MenuItemForm from '@/components/dashboard/MenuItemForm'

export default async function NewMenuItemPage() {
  await requireOwner()

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Yeni Ürün</h1>
      <MenuItemForm />
    </div>
  )
}

