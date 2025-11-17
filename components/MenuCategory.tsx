'use client'

import { useState } from 'react'
import { MenuCategory as MenuCategoryType } from '@prisma/client'
import MenuItem from './MenuItem'
import { ChevronDown } from 'lucide-react'

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
  const [isOpen, setIsOpen] = useState(true) // Varsayılan olarak açık

  // Filter out unavailable items (should already be filtered in query, but double-check)
  const availableItems = category.menuItems.filter((item) => item.isAvailable)

  if (availableItems.length === 0) {
    return null
  }

  return (
    <section className="bg-white rounded-lg shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 text-left"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          {category.name}
        </h2>
        <ChevronDown
          className={`w-5 h-5 sm:w-6 sm:h-6 text-gray-600 transition-transform duration-200 flex-shrink-0 ml-4 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pt-2">
            {availableItems.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

