import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import sharp from 'sharp'
import { randomUUID } from 'crypto'
import { requireOwner } from '@/lib/auth-guard'
import { prisma } from '@/lib/prisma'
import { IMAGE_SIZES } from '@/utils/imageSizes'
import { logger } from '@/lib/logger'
import {
  uploadToCloudinary,
  isCloudinaryEnabled,
} from '@/lib/cloudinary'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png']

export async function POST(request: NextRequest) {
  try {
    const session = await requireOwner()

    // Get user's restaurant
    const restaurant = await prisma.restaurant.findFirst({
      where: { ownerId: session.user.id },
    })

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type - only JPG and PNG
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG and PNG are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit.' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename using UUID
    const uuid = randomUUID()
    const extension = file.type === 'image/jpeg' || file.type === 'image/jpg' ? 'jpg' : 'png'
    const publicId = `${restaurant.id}/${uuid}`

    let imageUrls: Record<string, string> = {}

    // Use Cloudinary if configured, otherwise fall back to local storage
    if (isCloudinaryEnabled()) {
      try {
        // Upload to Cloudinary
        const folder = `restaurants/${restaurant.id}/products`
        imageUrls = await uploadToCloudinary(buffer, folder, uuid)
        
        logger.debug('Image uploaded to Cloudinary:', imageUrls)
      } catch (cloudinaryError) {
        logger.error('Cloudinary upload failed, falling back to local storage:', cloudinaryError)
        // Fall through to local storage
      }
    }

    // Fallback to local storage if Cloudinary is not configured or failed
    if (!isCloudinaryEnabled() || Object.keys(imageUrls).length === 0) {
      // Check if we're in a serverless environment (Vercel, etc.)
      const isServerless = process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME

      if (isServerless) {
        return NextResponse.json(
          { error: 'File uploads require Cloudinary configuration in serverless environments' },
          { status: 500 }
        )
      }

      // Local storage fallback
      const productsDir = join(
        process.cwd(),
        'public',
        'uploads',
        restaurant.id,
        'products'
      )

      try {
        await mkdir(productsDir, { recursive: true })
      } catch (error) {
        // Directory might already exist
      }

      const filename = `${uuid}.${extension}`
      const image = sharp(buffer)

      // Generate all image sizes
      const resizePromises = Object.entries(IMAGE_SIZES).map(
        async ([size, width]) => {
          const sizeFilename = `${uuid}-${size}.${extension}`
          const sizePath = join(productsDir, sizeFilename)

          await image
            .clone()
            .resize(width, null, {
              withoutEnlargement: true,
              fit: 'inside',
            })
            .toFile(sizePath)

          // Store public URL
          imageUrls[size] = `/uploads/${restaurant.id}/products/${sizeFilename}`
        }
      )

      // Also save original
      const originalPath = join(productsDir, filename)
      await image.toFile(originalPath)
      imageUrls.original = `/uploads/${restaurant.id}/products/${filename}`

      // Wait for all resizes to complete
      await Promise.all(resizePromises)
    }

    // Return all image URLs
    return NextResponse.json(
      {
        imageUrl: imageUrls.large || imageUrls.original, // Default to large for backward compatibility
        urls: imageUrls,
      },
      { status: 200 }
    )
  } catch (error) {
    logger.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
