import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import sharp from 'sharp'
import { requireOwner } from '@/lib/auth-guard'
import { prisma } from '@/lib/prisma'

// TODO: Replace with S3/Cloudinary in production
// This is a temporary local storage solution

const THUMBNAIL_SIZES = {
  small: 150,
  medium: 400,
  large: 800,
}

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
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG and PNG are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit.' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create restaurant-specific uploads directory
    const restaurantUploadsDir = join(
      process.cwd(),
      'public',
      'uploads',
      restaurant.id
    )

    try {
      await mkdir(restaurantUploadsDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.type === 'image/jpeg' || file.type === 'image/jpg' ? 'jpg' : 'png'
    const baseFilename = `${timestamp}-${randomString}`
    const filename = `${baseFilename}.${extension}`

    // Process image with sharp
    const image = sharp(buffer)

    // Get image metadata
    const metadata = await image.metadata()

    // Save original image
    const originalPath = join(restaurantUploadsDir, filename)
    await image.toFile(originalPath)

    // Generate thumbnails
    const thumbnailPromises = Object.entries(THUMBNAIL_SIZES).map(
      async ([size, width]) => {
        const thumbnailFilename = `${baseFilename}-${size}.${extension}`
        const thumbnailPath = join(restaurantUploadsDir, thumbnailFilename)

        await image
          .resize(width, null, {
            withoutEnlargement: true,
            fit: 'inside',
          })
          .toFile(thumbnailPath)

        return { size, filename: thumbnailFilename }
      }
    )

    await Promise.all(thumbnailPromises)

    // Return public URL (original image)
    const imageUrl = `/uploads/${restaurant.id}/${filename}`

    return NextResponse.json({ imageUrl }, { status: 200 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
