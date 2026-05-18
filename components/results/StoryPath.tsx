'use client'

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

interface StoryPathProps {
  data: StoryPathData
}

export default function StoryPath({ data }: StoryPathProps) {
  const stories = data?.stories || []

  if (stories.length === 0) {
    return (
      <p className="text-brand-gray-mid text-sm italic">No stories were generated for this clipping.</p>
    )
  }

  return (
    <div className="space-y-8">
      {stories.map((story, index) => (
        <div key={story.slug} className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-brand-red text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
              {index + 1}
            </div>
            <h3 className="font-serif text-xl font-bold text-brand-darker">
              {STORY_NAMES[story.slug] || story.slug}
            </h3>
          </div>
          <div className="pl-10">
            <div className="prose prose-sm max-w-none text-brand-gray-dark leading-relaxed">
              {story.content.split('\n').map((paragraph, i) => {
                if (!paragraph.trim()) return null

                // Check if it looks like a timeline entry or list item
                if (paragraph.match(/^\d{4}[-–]/)) {
                  return (
                    <div key={i} className="flex gap-3 my-2">
                      <span className="text-brand-red font-mono text-sm flex-shrink-0 mt-0.5">
                        {paragraph.split(/[-–]/)[0]}
                      </span>
                      <span>{paragraph.split(/[-–]/).slice(1).join('–')}</span>
                    </div>
                  )
                }

                return <p key={i} className="my-2">{paragraph}</p>
              })}
            </div>
          </div>
          {index < stories.length - 1 && (
            <hr className="newspaper-rule-thin mt-6" />
          )}
        </div>
      ))}
    </div>
  )
}
