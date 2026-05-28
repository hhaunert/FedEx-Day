import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { extractChurchRecords, pageImageUrl } from '@/lib/church-records'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const pageIds: number[] = body.page_ids ?? []

    if (pageIds.length === 0) {
      return NextResponse.json({ error: 'page_ids required' }, { status: 400 })
    }

    const supabase = createClient()
    const results: { pageId: number; count: number; skipped: boolean }[] = []

    for (const pageId of pageIds) {
      const { count } = await supabase
        .from('church_records')
        .select('*', { count: 'exact', head: true })
        .eq('source_page_id', pageId)

      if (count && count > 0) {
        results.push({ pageId, count, skipped: true })
        continue
      }

      const url = pageImageUrl(pageId)
      const imgRes = await fetch(url)
      if (!imgRes.ok) {
        console.warn(`Failed to fetch page ${pageId}: ${imgRes.status}`)
        results.push({ pageId, count: 0, skipped: false })
        continue
      }

      const buffer = await imgRes.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')

      const records = await extractChurchRecords(base64)

      if (records.length === 0) {
        results.push({ pageId, count: 0, skipped: false })
        continue
      }

      const rows = records.map(r => ({
        ...r,
        source_page_id: pageId,
        source_image_url: url,
      }))

      const { error } = await supabase.from('church_records').insert(rows)
      if (error) {
        console.error(`Insert error for page ${pageId}:`, error)
        results.push({ pageId, count: 0, skipped: false })
      } else {
        results.push({ pageId, count: records.length, skipped: false })
      }
    }

    const totalInserted = results
      .filter(r => !r.skipped)
      .reduce((sum, r) => sum + r.count, 0)

    return NextResponse.json({ results, totalInserted })
  } catch (error) {
    console.error('Ingest error:', error)
    return NextResponse.json({ error: 'Ingest failed' }, { status: 500 })
  }
}
