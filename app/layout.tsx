import type { Metadata } from 'next'
import './globals.css'
import BugEasterEgg from '@/components/BugEasterEgg'
import FlyingPigEasterEgg from '@/components/FlyingPigEasterEgg'

export const metadata: Metadata = {
  title: 'Newspaper Detective | NewspaperArchive',
  description: 'AI-powered analysis of newspaper clippings for genealogy research. Uncover the stories hidden in your family history.',
  keywords: 'genealogy, newspaper clippings, family history, ancestor research, AI analysis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white antialiased">
        {children}
        <BugEasterEgg />
        <FlyingPigEasterEgg />
      </body>
    </html>
  )
}
