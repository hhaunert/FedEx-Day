import { NextRequest, NextResponse } from 'next/server'
import { extractNewspaperInfo } from '@/lib/anthropic'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get('image') as File | null

    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const buffer = await imageFile.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const mediaType = imageFile.type || 'image/jpeg'

    const info = await extractNewspaperInfo(base64, mediaType)

    return NextResponse.json(info)
  } catch (error) {
    console.error('Extract error:', error)
    return NextResponse.json(
      { error: 'Failed to extract newspaper info' },
      { status: 500 }
    )
  }
}
