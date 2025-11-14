/**
 * Subdomain validation and utilities
 */

// Subdomain regex: lowercase letters, numbers, and hyphens only
export const SUBDOMAIN_REGEX = /^[a-z0-9-]+$/

// Reserved subdomains that cannot be used
export const RESERVED_SUBDOMAINS = [
  'www',
  'api',
  'admin',
  'dashboard',
  'app',
  'mail',
  'ftp',
  'localhost',
  'test',
  'staging',
  'dev',
  'www',
]

/**
 * Validates subdomain format
 */
export function validateSubdomain(subdomain: string): {
  valid: boolean
  error?: string
} {
  if (!subdomain || subdomain.length === 0) {
    return { valid: false, error: 'Subdomain is required' }
  }

  if (subdomain.length < 3) {
    return { valid: false, error: 'Subdomain must be at least 3 characters' }
  }

  if (subdomain.length > 63) {
    return { valid: false, error: 'Subdomain must be less than 63 characters' }
  }

  if (!SUBDOMAIN_REGEX.test(subdomain)) {
    return {
      valid: false,
      error: 'Subdomain can only contain lowercase letters, numbers, and hyphens',
    }
  }

  if (subdomain.startsWith('-') || subdomain.endsWith('-')) {
    return {
      valid: false,
      error: 'Subdomain cannot start or end with a hyphen',
    }
  }

  if (RESERVED_SUBDOMAINS.includes(subdomain.toLowerCase())) {
    return {
      valid: false,
      error: 'This subdomain is reserved and cannot be used',
    }
  }

  return { valid: true }
}

/**
 * Extracts subdomain from host header
 * Example: "myrestaurant.example.com" -> "myrestaurant"
 * Example: "myrestaurant.example.com:3000" -> "myrestaurant"
 */
export function extractSubdomainFromHost(host: string, baseDomain?: string): string | null {
  if (!host) return null

  // Remove port if present
  const hostWithoutPort = host.split(':')[0]

  // If baseDomain is provided, extract subdomain
  if (baseDomain) {
    // Remove port from baseDomain for pattern matching
    const baseDomainWithoutPort = baseDomain.split(':')[0]
    
    // Special handling for localhost subdomains (e.g., restoran1.localhost)
    if (baseDomainWithoutPort === 'localhost' || baseDomainWithoutPort.includes('localhost')) {
      const parts = hostWithoutPort.split('.')
      // restoran1.localhost -> restoran1
      if (parts.length === 2 && parts[1] === 'localhost') {
        return parts[0]
      }
      // restoran1.localhost:3000 -> restoran1
      if (parts.length >= 2 && parts[parts.length - 1] === 'localhost') {
        return parts[0]
      }
    }
    
    // Try pattern matching: subdomain.baseDomain
    const baseDomainPattern = new RegExp(`^(.+)\\.${baseDomainWithoutPort.replace(/\./g, '\\.')}$`)
    const match = hostWithoutPort.match(baseDomainPattern)
    if (match && match[1]) {
      return match[1]
    }
    
    // If host matches baseDomain exactly, it's the main domain (no subdomain)
    if (hostWithoutPort === baseDomainWithoutPort) {
      return null
    }
  }

  // Default: assume subdomain is the first part before the first dot
  // This works for patterns like: subdomain.example.com
  const parts = hostWithoutPort.split('.')
  if (parts.length >= 2) {
    // For localhost, check if it's a subdomain pattern
    if (parts[parts.length - 1] === 'localhost' && parts.length >= 2) {
      return parts[0]
    }
    // For other domains, need at least 3 parts (subdomain.domain.tld)
    if (parts.length > 2) {
      return parts[0]
    }
  }

  // For localhost or IP addresses without subdomain, return null
  if (hostWithoutPort === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(hostWithoutPort)) {
    return null
  }

  return null
}

/**
 * Normalizes subdomain (lowercase, trim)
 */
export function normalizeSubdomain(subdomain: string): string {
  return subdomain.toLowerCase().trim()
}

