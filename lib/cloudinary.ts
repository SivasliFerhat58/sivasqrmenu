/**
 * Cloudinary configuration and utilities
 * Falls back to local storage if Cloudinary is not configured
 */

import { v2 as cloudinary } from 'cloudinary'
import sharp from 'sharp'
import { IMAGE_SIZES } from '@/utils/imageSizes'

// Configure Cloudinary
const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

/**
 * Upload image to Cloudinary with multiple sizes
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
  publicId: string
): Promise<Record<string, string>> {
  if (!isCloudinaryConfigured) {
    throw new Error('Cloudinary is not configured')
  }

  const imageUrls: Record<string, string> = {}

  // Convert Buffer to data URI format for Cloudinary (TypeScript compatibility)
  const bufferToDataUri = (buf: Buffer, mimeType: string = 'image/png'): string => {
    return `data:${mimeType};base64,${buf.toString('base64')}`
  }

  // Upload original image
  const originalResult = await cloudinary.uploader.upload(bufferToDataUri(buffer), {
    folder: `${folder}/original`,
    public_id: publicId,
    resource_type: 'image',
    overwrite: true,
  })
  imageUrls.original = originalResult.secure_url

  // Upload resized versions
  const resizePromises = Object.entries(IMAGE_SIZES).map(async ([size, width]) => {
    // Resize image with sharp before uploading
    const resizedBuffer = await sharp(buffer)
      .resize(width, null, {
        withoutEnlargement: true,
        fit: 'inside',
      })
      .toBuffer()

    const result = await cloudinary.uploader.upload(bufferToDataUri(resizedBuffer), {
      folder: `${folder}/${size}`,
      public_id: `${publicId}-${size}`,
      resource_type: 'image',
      overwrite: true,
    })

    imageUrls[size] = result.secure_url
  })

  await Promise.all(resizePromises)

  return imageUrls
}

/**
 * Check if Cloudinary is configured
 */
export function isCloudinaryEnabled(): boolean {
  return isCloudinaryConfigured === true
}

