'use client'

import { useState } from 'react'

interface Story {
  slug: string
  content: string
}

interface StoryPathData {
  stories?: Story[]
}

const STORY_NAMES: Record<string, string> = {
  'ancestor-life': 'The Ancestor Life Story',
  'place-story': 'The Place Story',
  'historical-context': 'The Historical Context Story',
  'day-in-the-life': 'The "Day in the Life" Story',
  'timeline': 'The Timeline Story',
  'evidence': 'The Evidence Story',
  'life-moment': 'The Life Moment Story',
}

function renderInline(text: string): React.ReactNode {
  // Handle **bold** and *italic*
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-brand-darker">{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    return part
  })
}

function StoryContent({ content }: { content: string }) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let bulletBuffer: string[] = []
  let numberedBuffer: string[] = []
  let timelineBuffer: { year: string; text: string }[] = []

  const flushBullets = (key: string) => {
    if (bulletBuffer.length) {
      elements.push(
        <ul key={key} className="space-y-1.5 my-3">
          {bulletBuffer.map((item, i) => (
            <li key={i} className="flex gap-2 text-brand-gray-dark">
              <span className="text-brand-red mt-1.5 flex-shrink-0">
                <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3" /></svg>
              </span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      )
      bulletBuffer = []
    }
  }

  const flushNumbered = (key: string) => {
    if (numberedBuffer.length) {
      elements.push(
        <ol key={key} className="space-y-1.5 my-3 list-none">
          {numberedBuffer.map((item, i) => (
            <li key={i} className="flex gap-3 text-brand-gray-dark">
              <span className="text-brand-red font-semibold text-sm flex-shrink-0 w-5 text-right mt-0.5">{i + 1}.</span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ol>
      )
      numberedBuffer = []
    }
  }

  const flushTimeline = (key: string) => {
    if (timelineBuffer.length) {
      elements.push(
        <div key={key} className="my-4 space-y-3">
          {timelineBuffer.map((entry, i) => (
            <div key={i} className="flex gap-4 items-start">
              <span className="text-brand-red font-mono font-semibold text-sm flex-shrink-0 bg-red-50 border border-brand-red/20 rounded px-2 py-0.5 mt-0.5">
                {entry.year}
              </span>
              <span className="text-brand-gray-dark">{renderInline(entry.text)}</span>
            </div>
          ))}
        </div>
      )
      timelineBuffer = []
    }
  }

  lines.forEach((line, i) => {
    const trimmed = line.trim()
    const key = `line-${i}`

    if (!trimmed) {
      flushBullets(key + '-b')
      flushNumbered(key + '-n')
      flushTimeline(key + '-t')
      return
    }

    // Headings — strip # symbols and render as styled text
    const h1Match = trimmed.match(/^#{1}\s+(.+)/)
    const h2Match = trimmed.match(/^#{2}\s+(.+)/)
    const h3Match = trimmed.match(/^#{3,}\s+(.+)/)
    if (h1Match || h2Match || h3Match) {
      flushBullets(key + '-b')
      flushNumbered(key + '-n')
      flushTimeline(key + '-t')
      const text = (h1Match || h2Match || h3Match)![1]
      elements.push(
        <h3 key={key} className="font-serif text-lg font-bold text-brand-darker mt-5 mb-2">
          {text}
        </h3>
      )
      return
    }

    // Timeline entries: "1850 –" or "1850-" or "**1850**"
    const timelineMatch = trimmed.match(/^\*?\*?(\d{4})\*?\*?\s*[–\-—:]\s*(.+)/)
    if (timelineMatch) {
      flushBullets(key + '-b')
      flushNumbered(key + '-n')
      timelineBuffer.push({ year: timelineMatch[1], text: timelineMatch[2] })
      return
    }

    // Bullet list
    const bulletMatch = trimmed.match(/^[-*•]\s+(.+)/)
    if (bulletMatch) {
      flushNumbered(key + '-n')
      flushTimeline(key + '-t')
      bulletBuffer.push(bulletMatch[1])
      return
    }

    // Numbered list
    const numberedMatch = trimmed.match(/^\d+[.)]\s+(.+)/)
    if (numberedMatch) {
      flushBullets(key + '-b')
      flushTimeline(key + '-t')
      numberedBuffer.push(numberedMatch[1])
      return
    }

    // Regular paragraph
    flushBullets(key + '-b')
    flushNumbered(key + '-n')
    flushTimeline(key + '-t')
    elements.push(
      <p key={key} className="text-brand-gray-dark leading-relaxed my-2">
        {renderInline(trimmed)}
      </p>
    )
  })

  // Flush any remaining
  flushBullets('end-b')
  flushNumbered('end-n')
  flushTimeline('end-t')

  return <>{elements}</>
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    // Strip markdown for plain text copy
    const plain = text
      .replace(/#{1,6}\s+/g, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/^[-*•]\s+/gm, '• ')
    await navigator.clipboard.writeText(plain)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1 text-xs text-brand-gray-mid hover:text-brand-red transition-colors ml-auto"
      title="Copy story"
    >
      {copied ? (
        <><svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><span className="text-green-600">Copied!</span></>
      ) : (
        <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copy</>
      )}
    </button>
  )
}

export default function StoryPath({ data }: { data: StoryPathData }) {
  const stories = data?.stories || []

  if (stories.length === 0) {
    return <p className="text-brand-gray-mid text-sm italic">No stories were generated for this clipping.</p>
  }

  return (
    <div className="space-y-10">
      {stories.map((story, index) => (
        <div key={story.slug}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 rounded-full bg-brand-red text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
              {index + 1}
            </div>
            <h3 className="font-serif text-xl font-bold text-brand-darker">
              {STORY_NAMES[story.slug] || story.slug}
            </h3>
            <CopyButton text={story.content} />
          </div>
          <div className="pl-10">
            <StoryContent content={story.content} />
          </div>
          {index < stories.length - 1 && <hr className="newspaper-rule-thin mt-8" />}
        </div>
      ))}
    </div>
  )
}
