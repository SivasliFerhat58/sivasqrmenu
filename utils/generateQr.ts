import QRCode from 'qrcode'

/**
 * Generates QR code as PNG buffer
 */
export async function generateQrCodePNG(url: string, size: number = 512): Promise<Buffer> {
  try {
    const buffer = await QRCode.toBuffer(url, {
      type: 'png',
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
    return buffer
  } catch (error) {
    console.error('Error generating QR code PNG:', error)
    throw new Error('Failed to generate QR code PNG')
  }
}

/**
 * Generates QR code as SVG string
 */
export async function generateQrCodeSVG(url: string, size: number = 512): Promise<string> {
  try {
    const svg = await QRCode.toString(url, {
      type: 'svg',
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
    return svg
  } catch (error) {
    console.error('Error generating QR code SVG:', error)
    throw new Error('Failed to generate QR code SVG')
  }
}

/**
 * Generates QR code as data URL (for inline display)
 */
export async function generateQrCodeDataURL(url: string, size: number = 512): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(url, {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
    return dataUrl
  } catch (error) {
    console.error('Error generating QR code data URL:', error)
    throw new Error('Failed to generate QR code data URL')
  }
}

