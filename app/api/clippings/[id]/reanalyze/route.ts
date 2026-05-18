import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  generateClueReport,
  generateResearchTrail,
  generateStory,
} from '@/lib/anthropic'

const DEFAULT_CLUE_REPORT_PROMPT = `You are an expert genealogist analyzing a newspaper clipping. Extract all genealogical clues from the provided transcription and return a structured JSON object with the following fields:
{
  "people": [{ "name": string, "role": string, "approximate_age": string, "relationship_to_subject": string }],
  "dates": [{ "date": string, "event": string, "certainty": "exact|approximate|inferred" }],
  "places": [{ "name": string, "type": "city|county|state|country|address|landmark", "context": string }],
  "relationships": [{ "person1": string, "person2": string, "relationship": string }],
  "occupations": [{ "person": string, "occupation": string }],
  "events": [{ "type": string, "description": string, "date": string, "location": string }],
  "key_facts": [string],
  "research_value": "high|medium|low",
  "notes": string
}
Be thorough and extract every possible genealogical detail.`

const DEFAULT_RESEARCH_TRAIL_PROMPT = `You are a newspaper genealogy specialist creating a prioritized newspaper research checklist. Every search suggestion must be a NEWSPAPER search only — obituaries, death notices, marriage announcements, birth notices, local news, legal notices, society columns, etc. Do not suggest census records, vital records, court records, or any non-newspaper sources. Return ONLY this JSON structure with no extra text:
{
  "searches": [
    { "priority": 1, "what": "specific newspaper article type to search for", "where": "name of the specific newspaper(s) to search, e.g. 'The Cincinnati Enquirer' or 'local German-language papers'" }
  ],
  "name_variants": [
    { "name": "name as it appears", "try_also": ["variant1", "variant2"] }
  ],
  "nearby_places": ["city or county to also search newspapers from"],
  "tips": ["practical newspaper-specific search tip"]
}
Rules: searches must be ordered by priority (1 = most important), limit to 8 searches max, the "where" field must name only specific newspapers or types of newspapers — never recommend external websites, genealogy platforms, or competing services, nearby_places are surrounding cities/counties whose newspapers should also be searched, tips cover things like name spelling variants in newspaper indexes, date ranges to search, German-language papers for German surnames, etc. Be concise — 1 line per field.`

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

    const { data: clipping, error: fetchError } = await supabase
      .from('clippings')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !clipping) {
      return NextResponse.json({ error: 'Clipping not found' }, { status: 404 })
    }

    const transcription = clipping.transcription || ''
    if (!transcription) {
      return NextResponse.json({ error: 'No transcription available to reanalyze' }, { status: 400 })
    }

    // Fetch AI prompts from DB
    const { data: promptsData } = await supabase.from('ai_prompts').select('name, system_prompt')
    const promptsMap: Record<string, string> = {}
    promptsData?.forEach((p: { name: string; system_prompt: string }) => { promptsMap[p.name] = p.system_prompt })

    const clueReportPrompt = promptsMap['clue_report'] || DEFAULT_CLUE_REPORT_PROMPT
    const researchTrailPrompt = promptsMap['research_trail'] || DEFAULT_RESEARCH_TRAIL_PROMPT

    const storyTypeSlugs: string[] = clipping.selected_story_types || []
    const { data: storyTypesData } = await supabase
      .from('story_types').select('slug, ai_prompt').in('slug', storyTypeSlugs)
    const storyPromptsMap: Record<string, string> = {}
    storyTypesData?.forEach((s: { slug: string; ai_prompt: string }) => { storyPromptsMap[s.slug] = s.ai_prompt })

    const newspaperState = clipping.newspaper_state || ''

    const clueReport = await generateClueReport(
      transcription,
      clueReportPrompt,
      clipping.newspaper_name,
      clipping.newspaper_date,
      clipping.newspaper_page,
      clipping.user_details,
      newspaperState
    )

    const [researchTrail, ...stories] = await Promise.all([
      generateResearchTrail(clueReport, transcription, researchTrailPrompt, newspaperState),
      ...storyTypeSlugs.map((slug) =>
        generateStory(
          transcription,
          clueReport,
          clipping.user_details || '',
          storyPromptsMap[slug] || DEFAULT_STORY_PROMPTS[slug] || '',
          slug,
          newspaperState
        )
      ),
    ])

    const { error: updateError } = await supabase
      .from('clippings')
      .update({
        clue_report: clueReport,
        story_path: { stories },
        research_trail: researchTrail,
      })
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (updateError) {
      return NextResponse.json({ error: 'Failed to save reanalysis' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reanalyze error:', error)
    return NextResponse.json({ error: 'Reanalysis failed. Please try again.' }, { status: 500 })
  }
}
