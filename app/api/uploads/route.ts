import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import sharp from 'sharp'
import { randomUUID } from 'crypto'
import { requireOwner } from '@/lib/auth-guard'
import { prisma } from '@/lib/prisma'
import { IMAGE_SIZES } from '@/utils/imageSizes'

// TODO: Replace with S3/Cloudinary in production
// This is a temporary local storage solution

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

    // Create restaurant-specific uploads directory: public/uploads/<restaurantId>/products/
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

    // Generate unique filename using UUID
    const uuid = randomUUID()
    const extension = file.type === 'image/jpeg' || file.type === 'image/jpg' ? 'jpg' : 'png'
    const filename = `${uuid}.${extension}`

    // Process image with sharp
    const image = sharp(buffer)

    // Generate all image sizes
    const imageUrls: Record<string, string> = {}

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

    // Also save original (optional - can be removed if not needed)
    const originalPath = join(productsDir, filename)
    await image.toFile(originalPath)
    imageUrls.original = `/uploads/${restaurant.id}/products/${filename}`

    // Wait for all resizes to complete
    await Promise.all(resizePromises)

    // Return all image URLs
    return NextResponse.json(
      {
        imageUrl: imageUrls.large, // Default to large for backward compatibility
        urls: imageUrls,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
