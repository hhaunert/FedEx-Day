'use client'

import { useState } from 'react'

const FAQS = [
  {
    q: 'What is Newspaper Detective?',
    a: 'Upload a photo of any newspaper clipping and our AI generates three research reports: a Clue Report (people, dates, places), a Research Trail (where to search next), and a Story Path (ancestor narratives in 7 formats).',
  },
  {
    q: 'What file formats do you accept?',
    a: 'JPG, PNG, and WebP images up to 10MB.',
  },
  {
    q: "What's in the Clue Report?",
    a: 'A structured breakdown of everyone named in the clipping, key dates, locations, relationships, and a research value rating.',
  },
  {
    q: 'What is the Research Trail?',
    a: 'Actionable next steps — specific newspapers and archives to search, name spelling variants to try, and nearby places that may hold related records.',
  },
  {
    q: 'What is Story Path?',
    a: 'Seven narrative formats that turn the raw clues into written stories about your ancestor — from a day-in-the-life account to a historical context essay.',
  },
  {
    q: 'How many story formats can I choose?',
    a: 'You can generate all 7 story types for any clipping.',
  },
  {
    q: 'Can I download my results?',
    a: 'Yes — use Build Your PDF to select which sections to include and download a custom report.',
  },
  {
    q: 'Can I edit the clipping details?',
    a: 'Yes, you can correct the newspaper name, date, page, and state after the AI extracts them.',
  },
  {
    q: 'Is my clipping data private?',
    a: 'Your clippings are only visible to you when signed in.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div className="text-center mb-12">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-darker mb-4">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="divide-y divide-brand-gray-border border-t border-brand-gray-border">
        {FAQS.map((faq, i) => (
          <div key={i}>
            <button
              className="w-full flex items-center justify-between py-5 text-left gap-4"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span className="font-semibold text-brand-darker">{faq.q}</span>
              <svg
                className={`w-5 h-5 text-brand-gray-mid flex-shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {open === i && (
              <p className="pb-5 text-brand-gray-dark leading-relaxed">{faq.a}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
