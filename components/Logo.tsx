import Link from 'next/link'
import Image from 'next/image'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  href?: string
}

export default function Logo({ size = 'md', href = '/' }: LogoProps) {
  const dimensions = {
    sm: { width: 150, height: 24 },
    md: { width: 200, height: 31 },
    lg: { width: 300, height: 47 },
  }

  const { width, height } = dimensions[size]

  const content = (
    <Image
      src="/main-logo.svg"
      alt="NewspaperArchive"
      width={width}
      height={height}
      priority
    />
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
