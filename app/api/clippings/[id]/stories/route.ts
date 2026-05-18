import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateStory } from '@/lib/anthropic'

const DEFAULT_STORY_PROMPTS: Record<string, string> = {
  'ancestor-life': 'You are a genealogy storyteller. Based on the newspaper clipping transcription and clue report provided, write a compelling narrative about this ancestor\'s life. Draw on historical context, social norms of the era, and details gleaned from the article to paint a vivid picture of who this person was and what their daily life might have been like. Write in a warm, engaging style that brings the ancestor to life for modern readers.',
  'place-story': 'You are a local historian and genealogy researcher. Based on the newspaper clipping transcription and clue report provided, write a story about the place where this event occurred. Describe what the community was like, the geography, the local culture, and how the place has changed over time. Help the reader understand the world their ancestor inhabited.',
  'historical-context': 'You are a historian specializing in genealogy research. Based on the newspaper clipping transcription and clue report provided, write about the historical context surrounding this clipping. What major events were happening nationally and internationally? How did these broader forces shape the lives of ordinary people like the ancestor in this clipping? Provide rich historical context that helps readers understand the era.',
  'day-in-the-life': 'You are a social historian and genealogy storyteller. Based on the newspaper clipping transcription and clue report provided, reconstruct what a typical day in the life of this ancestor might have looked like. Draw on historical records about daily life, occupations, social customs, and technology of the era to create an immersive, vivid account of ordinary life in this time and place.',
  'timeline': 'You are a genealogy researcher. Based on the newspaper clipping transcription and clue report provided, construct a timeline of key events in this ancestor\'s life. Include the event from the clipping as an anchor point, and extrapolate likely life events based on their age, occupation, and family details mentioned. Format as a clear chronological timeline with dates and descriptions.',
  'evidence': 'You are a professional genealogist specializing in document analysis. Based on the newspaper clipping transcription and clue report provided, analyze this clipping as a piece of genealogical evidence. Assess its reliability, identify direct and indirect evidence, note what it proves versus what it suggests, and explain how it fits into a broader research strategy. Be thorough and methodical.',
  'life-moment': 'You are a genealogy storyteller with a gift for bringing singular moments to life. Based on the newspaper clipping transcription and clue report provided, write a focused, intimate narrative about this specific moment in your ancestor\'s life. What were they feeling? What led up to this moment? What came after? Make this single event feel meaningful and real.',
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { slugs } = await request.json()
    if (!slugs?.length) return NextResponse.json({ error: 'No story types provided' }, { status: 400 })

    const { data: clipping, error: fetchError } = await supabase
      .from('clippings')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !clipping) {
      return NextResponse.json({ error: 'Clipping not found' }, { status: 404 })
    }

    if (!clipping.transcription) {
      return NextResponse.json({ error: 'No transcription available' }, { status: 400 })
    }

    // Fetch story type prompts from DB
    const { data: storyTypesData } = await supabase
      .from('story_types').select('slug, ai_prompt').in('slug', slugs)
    const storyPromptsMap: Record<string, string> = {}
    storyTypesData?.forEach((s: { slug: string; ai_prompt: string }) => { storyPromptsMap[s.slug] = s.ai_prompt })

    // Generate new stories in parallel
    const newStories = await Promise.all(
      slugs.map((slug: string) =>
        generateStory(
          clipping.transcription,
          clipping.clue_report || {},
          clipping.user_details || '',
          storyPromptsMap[slug] || DEFAULT_STORY_PROMPTS[slug] || '',
          slug,
          clipping.newspaper_state || ''
        )
      )
    )

    // Merge with existing stories (replace if slug already exists)
    const existingStories: { slug: string; content: string }[] = clipping.story_path?.stories || []
    const existingSlugs = new Set(newStories.map((s) => s.slug))
    const merged = [
      ...existingStories.filter((s) => !existingSlugs.has(s.slug)),
      ...newStories,
    ]

    const updatedSlugs = Array.from(new Set([
      ...(clipping.selected_story_types || []),
      ...slugs,
    ]))

    const { error: updateError } = await supabase
      .from('clippings')
      .update({
        story_path: { stories: merged },
        selected_story_types: updatedSlugs,
      })
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (updateError) {
      return NextResponse.json({ error: 'Failed to save stories' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Add stories error:', error)
    return NextResponse.json({ error: 'Failed to generate stories. Please try again.' }, { status: 500 })
  }
}
