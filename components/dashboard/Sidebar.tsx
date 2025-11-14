'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Menu,
  FolderTree,
  Package,
  CreditCard,
  Settings,
} from 'lucide-react'

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/menu-categories', label: 'Kategoriler', icon: FolderTree },
  { href: '/dashboard/menu-items', label: 'Ürünler', icon: Package },
  { href: '/dashboard/subscription', label: 'Abonelik', icon: CreditCard },
  { href: '/dashboard/settings', label: 'Ayarlar', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">QR Menu</h1>
        <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors ${
                isActive ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-600' : ''
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

