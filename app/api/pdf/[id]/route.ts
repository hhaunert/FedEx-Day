import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { renderToBuffer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import React from 'react'

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#fc4040',
    borderBottomStyle: 'solid',
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#212122',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: '#747578',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#fc4040',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  body: {
    fontSize: 10,
    color: '#555658',
    lineHeight: 1.6,
  },
  label: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#212122',
    marginRight: 4,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#fafafa',
    padding: 10,
    borderRadius: 4,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#212122',
    marginBottom: 2,
  },
  bullet: {
    fontSize: 10,
    color: '#555658',
    marginBottom: 3,
    paddingLeft: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#9d9fa2',
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

function safeText(val: unknown): string {
  if (typeof val === 'string') return val
  if (val === null || val === undefined) return ''
  return String(val)
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: clipping, error } = await supabase
      .from('clippings')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (error || !clipping) {
      return NextResponse.json({ error: 'Clipping not found' }, { status: 404 })
    }

    const clueReport = clipping.clue_report || {}
    const storyPath = clipping.story_path || {}
    const researchTrail = clipping.research_trail || {}
    const stories: Array<{ slug: string; content: string }> = storyPath.stories || []

    const doc = React.createElement(
      Document,
      null,
      React.createElement(
        Page,
        { size: 'A4', style: styles.page },

        // Header
        React.createElement(
          View,
          { style: styles.header },
          React.createElement(Text, { style: styles.title }, 'Newspaper Detective Report'),
          React.createElement(
            Text,
            { style: styles.subtitle },
            [
              clipping.newspaper_name,
              clipping.newspaper_date,
              clipping.newspaper_page,
            ]
              .filter(Boolean)
              .join(' · ')
          )
        ),

        // Transcription
        clipping.transcription
          ? React.createElement(
              View,
              { style: styles.section },
              React.createElement(Text, { style: styles.sectionTitle }, 'Transcription'),
              React.createElement(Text, { style: styles.body }, safeText(clipping.transcription))
            )
          : null,

        // Clue Report
        React.createElement(
          View,
          { style: styles.section },
          React.createElement(Text, { style: styles.sectionTitle }, 'Clue Report'),

          clueReport.people && clueReport.people.length > 0
            ? React.createElement(
                View,
                null,
                React.createElement(Text, { style: { ...styles.label, marginBottom: 4 } }, 'People:'),
                ...clueReport.people.map((p: { name: string; role?: string }) =>
                  React.createElement(
                    Text,
                    { style: styles.bullet },
                    `• ${safeText(p.name)}${p.role ? ` (${safeText(p.role)})` : ''}`
                  )
                )
              )
            : null,

          clueReport.key_facts && clueReport.key_facts.length > 0
            ? React.createElement(
                View,
                { style: { marginTop: 8 } },
                React.createElement(Text, { style: { ...styles.label, marginBottom: 4 } }, 'Key Facts:'),
                ...clueReport.key_facts.map((fact: string) =>
                  React.createElement(Text, { style: styles.bullet }, `• ${safeText(fact)}`)
                )
              )
            : null
        )
      ),

      // Story pages
      ...stories.map((story) =>
        React.createElement(
          Page,
          { size: 'A4', style: styles.page },
          React.createElement(
            View,
            { style: styles.header },
            React.createElement(
              Text,
              { style: styles.title },
              STORY_NAMES[story.slug] || story.slug
            )
          ),
          React.createElement(
            View,
            { style: styles.section },
            React.createElement(Text, { style: styles.body }, safeText(story.content))
          ),
          React.createElement(
            Text,
            { style: styles.footer },
            `Generated by Newspaper Detective · NewspaperArchive`
          )
        )
      ),

      // Research Trail page
      React.createElement(
        Page,
        { size: 'A4', style: styles.page },
        React.createElement(
          View,
          { style: styles.header },
          React.createElement(Text, { style: styles.title }, 'Research Trail')
        ),

        researchTrail.quick_wins && researchTrail.quick_wins.length > 0
          ? React.createElement(
              View,
              { style: styles.section },
              React.createElement(Text, { style: styles.sectionTitle }, 'Quick Wins'),
              ...researchTrail.quick_wins.map((win: string) =>
                React.createElement(Text, { style: styles.bullet }, `✓ ${safeText(win)}`)
              )
            )
          : null,

        researchTrail.next_searches && researchTrail.next_searches.length > 0
          ? React.createElement(
              View,
              { style: styles.section },
              React.createElement(Text, { style: styles.sectionTitle }, 'Next Searches'),
              ...researchTrail.next_searches.map((s: { record_type: string; repository: string; search_terms: string; why: string }) =>
                React.createElement(
                  View,
                  { style: styles.card },
                  React.createElement(Text, { style: styles.cardTitle }, safeText(s.record_type)),
                  React.createElement(Text, { style: styles.body }, `Where: ${safeText(s.repository)}`),
                  React.createElement(Text, { style: styles.body }, `Search for: ${safeText(s.search_terms)}`),
                  React.createElement(Text, { style: { ...styles.body, fontStyle: 'italic', marginTop: 2 } }, safeText(s.why))
                )
              )
            )
          : null,

        React.createElement(
          Text,
          { style: styles.footer },
          `Generated by Newspaper Detective · NewspaperArchive · ${new Date().toLocaleDateString()}`
        )
      )
    )

    const pdfBuffer = await renderToBuffer(doc)
    const uint8Array = new Uint8Array(pdfBuffer)

    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="newspaper-detective-${params.id}.pdf"`,
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}
