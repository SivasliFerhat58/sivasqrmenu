import { requireOwner } from '@/lib/auth-guard'
import MenuCategoryForm from '@/components/dashboard/MenuCategoryForm'

export default async function NewMenuCategoryPage() {
  await requireOwner()

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Yeni Kategori</h1>
      <MenuCategoryForm />
    </div>
  )
}

