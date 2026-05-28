import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') ?? ''
  const supabase = createClient()

  let query = supabase
    .from('church_records')
    .select('id, record_number, date_of_death, time_of_death, name, age_raw, age_years, age_months, age_days, survivors, burial_date, pastor, source_page_id, source_image_url')
    .order('source_page_id', { ascending: true })
    .order('record_number', { ascending: true })

  if (q.trim()) {
    query = query.or(
      `name.ilike.%${q}%,date_of_death.ilike.%${q}%,survivors.ilike.%${q}%,burial_date.ilike.%${q}%,record_number.ilike.%${q}%`
    )
  }

  const { data, error } = await query.limit(200)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ records: data ?? [] })
}
