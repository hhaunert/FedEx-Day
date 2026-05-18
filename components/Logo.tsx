import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  href?: string
}

export default function Logo({ size = 'md', href = '/' }: LogoProps) {
  const dimensions = {
    sm: { width: 225, height: 36 },
    md: { width: 300, height: 50 },
    lg: { width: 450, height: 74 },
  }

  const { width, height } = dimensions[size]

  const content = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/main-logo.svg"
      alt="NewspaperArchive"
      width={width}
      height={height}
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
