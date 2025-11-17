'use client'

import { useEffect } from 'react'

export default function PWAHead() {
  useEffect(() => {
    // Add manifest link
    if (typeof document !== 'undefined') {
      const manifestLink = document.createElement('link')
      manifestLink.rel = 'manifest'
      manifestLink.href = '/manifest.json'
      document.head.appendChild(manifestLink)

      // Add apple touch icon
      const appleIcon = document.createElement('link')
      appleIcon.rel = 'apple-touch-icon'
      appleIcon.href = '/icon-192.png'
      document.head.appendChild(appleIcon)

      // Add meta tags
      const metaTags = [
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'mobile-web-app-capable', content: 'yes' },
      ]

      metaTags.forEach((tag) => {
        const meta = document.createElement('meta')
        meta.name = tag.name
        meta.content = tag.content
        document.head.appendChild(meta)
      })

      return () => {
        // Cleanup if needed
      }
    }
  }, [])

  return null
}

