import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 48,
    fontFamily: 'Helvetica',
  },
  redBar: {
    backgroundColor: '#fc4040',
    height: 4,
    marginBottom: 20,
  },
  brandName: {
    fontSize: 10,
    color: '#747578',
    letterSpacing: 1,
    marginBottom: 6,
  },
  reportTitle: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#212122',
    marginBottom: 4,
  },
  citation: {
    fontSize: 10,
    color: '#747578',
    marginBottom: 24,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#d7d8d9',
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#fc4040',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  body: {
    fontSize: 10,
    color: '#555658',
    lineHeight: 1.7,
    marginBottom: 6,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bulletDot: {
    fontSize: 10,
    color: '#fc4040',
    width: 14,
  },
  bulletText: {
    fontSize: 10,
    color: '#555658',
    flex: 1,
    lineHeight: 1.6,
  },
  searchItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  searchBadge: {
    width: 20,
    height: 20,
    backgroundColor: '#fc4040',
    borderRadius: 10,
    marginRight: 10,
    marginTop: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBadgeText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
  },
  searchWhat: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#212122',
  },
  searchWhere: {
    fontSize: 10,
    color: '#555658',
    marginTop: 1,
  },
  pill: {
    fontSize: 9,
    color: '#555658',
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#d7d8d9',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 4,
  },
  storyBody: {
    fontSize: 11,
    color: '#212122',
    lineHeight: 1.8,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#efeff0',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 8,
    color: '#9d9fa2',
  },
  clippingImage: {
    width: '100%',
    maxHeight: 280,
    objectFit: 'contain',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#d7d8d9',
  },
  section: {
    marginBottom: 22,
  },
  pillWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
})

const STORY_NAMES: Record<string, string> = {
  'ancestor-life': 'The Ancestor Life Story',
  'place-story': 'The Place Story',
  'historical-context': 'The Historical Context Story',
  'day-in-the-life': 'The Day in the Life Story',
  'timeline': 'The Timeline Story',
  'evidence': 'The Evidence Story',
  'life-moment': 'The Life Moment Story',
}

function safe(val: unknown): string {
  if (typeof val === 'string') return val
  if (val == null) return ''
  return String(val)
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: clipping, error } = await supabase
      .from('clippings')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (error || !clipping) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const clueReport = clipping.clue_report || {}
    const storyPath = clipping.story_path || {}
    const rt = clipping.research_trail || {}
    const stories: Array<{ slug: string; content: string }> = storyPath.stories || []

    const citation = [clipping.newspaper_name, clipping.newspaper_date, clipping.newspaper_page]
      .filter(Boolean).join(' · ')

    const searches: Array<{ priority: number; what: string; where: string }> =
      rt.searches || rt.next_searches?.map((s: { record_type: string; repository: string }, i: number) => ({
        priority: i + 1, what: s.record_type, where: s.repository,
      })) || []

    const nameVariants: Array<{ name?: string; original?: string; try_also?: string[]; variants?: string[] }> = rt.name_variants || []
    const nearbyPlaces: string[] = rt.nearby_places || rt.surrounding_areas?.map((a: { location: string }) => a.location) || []
    const tips: string[] = rt.tips || rt.time_period_tips || rt.quick_wins || []

    const doc = (
      <Document>
        {/* Page 1: Clipping + Clue Report */}
        <Page size="A4" style={styles.page}>
          <View style={styles.redBar} />
          <Text style={styles.brandName}>NEWSPAPERARCHIVE · NEWSPAPER DETECTIVE</Text>
          <Text style={styles.reportTitle}>Newspaper Detective Report</Text>
          {citation ? <Text style={styles.citation}>{citation}</Text> : null}
          <View style={styles.divider} />

          {clipping.image_url ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>CLIPPING</Text>
              <Image src={clipping.image_url} style={styles.clippingImage} />
            </View>
          ) : null}

          {clipping.transcription ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>TRANSCRIPTION</Text>
              <Text style={styles.body}>{safe(clipping.transcription)}</Text>
            </View>
          ) : null}

          {clueReport.key_facts && clueReport.key_facts.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>KEY FACTS</Text>
              {clueReport.key_facts.map((fact: string, i: number) => (
                <View key={i} style={styles.bulletRow}>
                  <Text style={styles.bulletDot}>→ </Text>
                  <Text style={styles.bulletText}>{safe(fact)}</Text>
                </View>
              ))}
            </View>
          ) : null}

          {clueReport.people && clueReport.people.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>PEOPLE</Text>
              {clueReport.people.map((p: { name: string; role?: string }, i: number) => (
                <View key={i} style={styles.bulletRow}>
                  <Text style={styles.bulletDot}>· </Text>
                  <Text style={styles.bulletText}>
                    {safe(p.name)}{p.role ? ` — ${safe(p.role)}` : ''}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          <View style={styles.footer} fixed>
            <Text style={styles.footerText}>Newspaper Detective · NewspaperArchive</Text>
            <Text style={styles.footerText}>Clue Report</Text>
          </View>
        </Page>

        {/* Page 2: Research Trail */}
        <Page size="A4" style={styles.page}>
          <View style={styles.redBar} />
          <Text style={styles.brandName}>NEWSPAPERARCHIVE · NEWSPAPER DETECTIVE</Text>
          <Text style={styles.reportTitle}>Research Trail</Text>
          {citation ? <Text style={styles.citation}>{citation}</Text> : null}
          <View style={styles.divider} />

          {searches.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>WHERE TO SEARCH NEXT</Text>
              {searches.map((s, i) => (
                <View key={i} style={styles.searchItem}>
                  <View style={styles.searchBadge}>
                    <Text style={styles.searchBadgeText}>{s.priority || i + 1}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.searchWhat}>{safe(s.what)}</Text>
                    <Text style={styles.searchWhere}>{safe(s.where)}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : null}

          {nameVariants.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>NAME VARIANTS TO TRY</Text>
              {nameVariants.map((v, i) => {
                const name = v.name || v.original || ''
                const alts = v.try_also || v.variants || []
                return (
                  <View key={i} style={{ marginBottom: 6 }}>
                    <Text style={{ ...styles.body, fontFamily: 'Helvetica-Bold', color: '#212122', marginBottom: 2 }}>
                      {safe(name)}
                    </Text>
                    <View style={styles.pillWrap}>
                      {alts.map((alt: string, ai: number) => (
                        <Text key={ai} style={styles.pill}>{safe(alt)}</Text>
                      ))}
                    </View>
                  </View>
                )
              })}
            </View>
          ) : null}

          {nearbyPlaces.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>NEARBY PLACES TO ALSO SEARCH</Text>
              <View style={styles.pillWrap}>
                {nearbyPlaces.map((place: string, i: number) => (
                  <Text key={i} style={styles.pill}>{safe(place)}</Text>
                ))}
              </View>
            </View>
          ) : null}

          {tips.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>RESEARCH TIPS</Text>
              {tips.map((tip: string, i: number) => (
                <View key={i} style={styles.bulletRow}>
                  <Text style={styles.bulletDot}>→ </Text>
                  <Text style={styles.bulletText}>{safe(tip)}</Text>
                </View>
              ))}
            </View>
          ) : null}

          <View style={styles.footer} fixed>
            <Text style={styles.footerText}>Newspaper Detective · NewspaperArchive</Text>
            <Text style={styles.footerText}>Research Trail</Text>
          </View>
        </Page>

        {/* Story pages */}
        {stories.map((story) => (
          <Page key={story.slug} size="A4" style={styles.page}>
            <View style={styles.redBar} />
            <Text style={styles.brandName}>NEWSPAPERARCHIVE · NEWSPAPER DETECTIVE</Text>
            <Text style={styles.reportTitle}>{STORY_NAMES[story.slug] || story.slug}</Text>
            {citation ? <Text style={styles.citation}>{citation}</Text> : null}
            <View style={styles.divider} />
            <Text style={styles.storyBody}>{safe(story.content)}</Text>
            <View style={styles.footer} fixed>
              <Text style={styles.footerText}>Newspaper Detective · NewspaperArchive</Text>
              <Text style={styles.footerText}>{STORY_NAMES[story.slug] || story.slug}</Text>
            </View>
          </Page>
        ))}
      </Document>
    )

    const pdfBuffer = await renderToBuffer(doc)

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="newspaper-detective-report.pdf"',
      },
    })
  } catch (error) {
    console.error('PDF error:', error)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}
