import { MenuCategory as MenuCategoryType } from '@prisma/client'
import MenuItem from './MenuItem'

interface MenuCategoryProps {
  category: MenuCategoryType & {
    menuItems: Array<{
      id: string
      name: string
      description: string | null
      price: number
      imageUrl: string | null
      isAvailable: boolean
    }>
  }
}

export default function MenuCategory({ category }: MenuCategoryProps) {
  // Filter out unavailable items (should already be filtered in query, but double-check)
  const availableItems = category.menuItems.filter((item) => item.isAvailable)

  if (availableItems.length === 0) {
    return null
  }

  return (
    <section>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
        {category.name}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {availableItems.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}

