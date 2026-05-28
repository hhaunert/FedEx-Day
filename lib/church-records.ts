import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const IIIF_BASE = 'https://cdm16998.contentdm.oclc.org/iiif/2'
const COLLECTION = 'p16998coll55'

export interface ChurchRecord {
  record_number: string
  date_of_death: string
  time_of_death: string
  name: string
  age_raw: string
  age_years: number | null
  age_months: number | null
  age_days: number | null
  survivors: string
  burial_date: string
  pastor: string
  raw_text: string
}

export function pageImageUrl(pageId: number): string {
  return `${IIIF_BASE}/${COLLECTION}:${pageId}/full/full/0/default.jpg`
}

export async function extractChurchRecords(imageBase64: string): Promise<ChurchRecord[]> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'image',
          source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 },
        },
        {
          type: 'text',
          text: `This is a page from a German Evangelical church death register (Sterberegister) from Cincinnati, Ohio, 1872–1934. The handwriting is Kurrent script and the language is German.

Extract every numbered death record visible on this page. For each record, return a JSON object:

{
  "record_number": "the No. XX number as written",
  "date_of_death": "the date as written",
  "time_of_death": "the time as written, or empty string if absent",
  "name": "the full name of the deceased as written",
  "age_raw": "the complete age description as written (e.g. '28 Jahren 8 Monaten und 25 Tagen')",
  "age_years": integer or null,
  "age_months": integer or null,
  "age_days": integer or null,
  "survivors": "the surviving family description as written",
  "burial_date": "the burial date as written",
  "pastor": "the pastor's name as written",
  "raw_text": "the complete verbatim text of this record entry"
}

Keep all text exactly as written in German — do not translate. Return ONLY a valid JSON array with no markdown or extra text.`,
        },
      ],
    }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : '[]'
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  try {
    return JSON.parse(cleaned)
  } catch {
    const match = cleaned.match(/\[[\s\S]*\]/)
    if (match) {
      try { return JSON.parse(match[0]) } catch { /* fall through */ }
    }
    return []
  }
}
