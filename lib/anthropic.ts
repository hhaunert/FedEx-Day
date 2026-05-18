import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function extractNewspaperInfo(imageBase64: string, mediaType: string = 'image/jpeg', filename: string = '') {
  const filenameHint = filename
    ? `The image filename is: "${filename}". NewspaperArchive filenames often encode the publication name, date, and page — extract those details from the filename first, then verify or supplement with what you can see in the image.`
    : ''

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
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
            text: `Analyze this newspaper clipping and extract publication details. ${filenameHint}

Return ONLY a valid JSON object with no additional text or markdown:
{
  "newspaper_name": "Full name of the newspaper publication (e.g. 'Greensburg New Era')",
  "date": "Publication date (e.g. 'May 9, 1912')",
  "page": "Page number (e.g. '1' or 'Page 1')",
  "transcription": "Full verbatim transcription of all article text in the clipping"
}

If any field cannot be determined from either the filename or the image, use an empty string "".`,
          },
        ],
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''

  try {
    // Strip markdown code blocks if present
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(cleaned)
  } catch {
    return {
      newspaper_name: '',
      date: '',
      page: '',
      transcription: text,
    }
  }
}

export async function generateClueReport(
  transcription: string,
  systemPrompt: string,
  newspaperName?: string,
  newspaperDate?: string,
  newspaperPage?: string,
  userDetails?: string
) {
  const contextInfo = [
    newspaperName && `Newspaper: ${newspaperName}`,
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
  systemPrompt: string
) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8096,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `Clue Report:\n${JSON.stringify(clueReport, null, 2)}\n\nNewspaper Clipping Transcription:\n${transcription}\n\nReturn ONLY a valid JSON object with no additional text or markdown.`,
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
  storyType: string
) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: storyPrompt,
    messages: [
      {
        role: 'user',
        content: `Clue Report:\n${JSON.stringify(clueReport, null, 2)}\n\nNewspaper Clipping Transcription:\n${transcription}\n\nAdditional known details from researcher:\n${userDetails || 'None provided'}`,
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
