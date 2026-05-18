import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function extractNewspaperInfo(imageBase64: string, mediaType: string = 'image/jpeg', filename: string = '') {
  const filenameHint = filename
    ? `The image filename is: "${filename}". NewspaperArchive filenames often encode the publication name, date, and page — use those details first, then verify with the image.`
    : ''

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
              data: imageBase64,
            },
          },
          {
            type: 'text',
            text: `Analyze this newspaper clipping. ${filenameHint}

Return ONLY a valid JSON object with exactly these four fields:
{
  "newspaper_name": "Full name of the newspaper (e.g. 'Greensburg New Era')",
  "date": "Publication date (e.g. 'May 9, 1912')",
  "page": "Page number (e.g. 'Page 1')",
  "suggested_title": "A concise title for this analysis based on the article subject and type — include the main person's name and article type (e.g. 'R.P. Hamilton Obituary, 1912' or 'Smith-Jones Wedding, 1905' or 'Mill Street Fire, March 1898'). Never leave this empty — use the most prominent name or topic you can see."
}

Use empty string "" only for newspaper_name, date, and page if truly unknown. suggested_title must always have a value.`,
          },
        ],
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''

  try {
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(cleaned)
  } catch {
    return { newspaper_name: '', date: '', page: '', suggested_title: '' }
  }
}

export async function transcribeClipping(imageBase64: string, mediaType: string = 'image/jpeg') {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
              data: imageBase64,
            },
          },
          {
            type: 'text',
            text: 'Transcribe all text in this newspaper clipping verbatim. Return only the transcription text, nothing else.',
          },
        ],
      },
    ],
  })

  return response.content[0].type === 'text' ? response.content[0].text : ''
}

export async function generateClueReport(
  transcription: string,
  systemPrompt: string,
  newspaperName?: string,
  newspaperDate?: string,
  newspaperPage?: string,
  userDetails?: string,
  newspaperState?: string
) {
  const contextInfo = [
    newspaperName && `Newspaper: ${newspaperName}`,
    newspaperState && `State: ${newspaperState}`,
    newspaperDate && `Date: ${newspaperDate}`,
    newspaperPage && `Page: ${newspaperPage}`,
    userDetails && `Additional known details: ${userDetails}`,
  ]
    .filter(Boolean)
    .join('\n')

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `${contextInfo ? contextInfo + '\n\n' : ''}Newspaper Clipping Transcription:\n\n${transcription}\n\nReturn ONLY a valid JSON object with no additional text or markdown.`,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}'

  try {
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(cleaned)
  } catch {
    return { raw: text }
  }
}

export async function generateResearchTrail(
  clueReport: object,
  transcription: string,
  systemPrompt: string,
  newspaperState?: string
) {
  const stateContext = newspaperState ? `\n\nState: ${newspaperState} — focus newspaper searches on ${newspaperState} publications and nearby state papers.` : ''
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8096,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `Clue Report:\n${JSON.stringify(clueReport, null, 2)}\n\nNewspaper Clipping Transcription:\n${transcription}${stateContext}\n\nReturn ONLY a valid JSON object with no additional text or markdown.`,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}'

  try {
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(cleaned)
  } catch {
    // Try to extract partial JSON
    const match = text.match(/\{[\s\S]*\}/)
    if (match) {
      try { return JSON.parse(match[0]) } catch { /* fall through */ }
    }
    return { raw: text }
  }
}

export async function generateStory(
  transcription: string,
  clueReport: object,
  userDetails: string,
  storyPrompt: string,
  storyType: string,
  newspaperState?: string
) {
  const stateContext = newspaperState ? `\nPublication state: ${newspaperState}` : ''
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: storyPrompt,
    messages: [
      {
        role: 'user',
        content: `Clue Report:\n${JSON.stringify(clueReport, null, 2)}\n\nNewspaper Clipping Transcription:\n${transcription}\n\nAdditional known details from researcher:\n${userDetails || 'None provided'}${stateContext}\n\nIMPORTANT: Write no more than 150-200 words total. Be vivid and concise.`,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''

  return {
    slug: storyType,
    content: text,
  }
}

export default anthropic
