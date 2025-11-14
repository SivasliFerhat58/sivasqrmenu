/**
 * Image size configurations for product images
 * Used for generating different sizes of uploaded images
 */

export const IMAGE_SIZES = {
  small: 300,
  medium: 600,
  large: 1000,
} as const

export type ImageSize = keyof typeof IMAGE_SIZES

/**
 * Get image size in pixels
 */
export function getImageSize(size: ImageSize): number {
  return IMAGE_SIZES[size]
}

/**
 * Get all image sizes
 */
export function getAllImageSizes(): typeof IMAGE_SIZES {
  return IMAGE_SIZES
}

