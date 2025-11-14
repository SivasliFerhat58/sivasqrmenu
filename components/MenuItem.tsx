interface MenuItemProps {
  item: {
    id: string
    name: string
    description: string | null
    price: number
    imageUrl: string | null
    isAvailable: boolean
  }
}

export default function MenuItem({ item }: MenuItemProps) {
  if (!item.isAvailable) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      {item.imageUrl && (
        <div className="relative w-full h-40 sm:h-48 bg-gray-100">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-4 sm:p-5">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
          {item.name}
        </h3>
        {item.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {item.description}
          </p>
        )}
        <p className="text-lg sm:text-xl font-bold text-blue-600">
          {Number(item.price).toFixed(2)} ₺
        </p>
      </div>
    </div>
  )
}

