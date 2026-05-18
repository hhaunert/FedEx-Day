import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  href?: string
}

export default function Logo({ size = 'md', href = '/' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  }

  const content = (
    <span className={`font-serif font-bold ${sizeClasses[size]}`}>
      <span className="text-brand-black">Newspaper</span>
      <span style={{ color: '#fc4040' }}>Archive</span>
    </span>
  )

  if (href) {
    return (
      <Link href={href} className="hover:opacity-90 transition-opacity">
        {content}
      </Link>
    )
  }

  return content
}
