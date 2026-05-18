import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  href?: string
}

const SCALE = { sm: 0.9, md: 1.2, lg: 1.8 }

export default function Logo({ size = 'md', href = '/' }: LogoProps) {
  const scale = SCALE[size]
  const w = Math.round(320 * scale)
  const h = Math.round(44 * scale)

  const content = (
    <span className="flex items-center gap-2" style={{ width: w, height: h }}>
      {/* Fingerprint / newsprint icon */}
      <svg
        width={Math.round(40 * scale)}
        height={Math.round(40 * scale)}
        viewBox="0 0 190 205"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <style>{`
          .pl { stroke: #2b2b2b; stroke-width: 6; stroke-linecap: round; fill: none; }
          .nt { stroke: #2b2b2b; stroke-width: 2.5; stroke-linecap: round; opacity: 0.75; }
        `}</style>
        <path className="pl" d="M95 5 C45 8 10 42 8 91" />
        <path className="pl" d="M118 8 C58 5 17 45 16 101" />
        <path className="pl" d="M139 18 C72 4 24 45 24 111" />
        <path className="pl" d="M158 35 C92 8 34 49 31 122" />
        <path className="pl" d="M169 58 C115 21 48 48 40 132" />
        <path className="pl" d="M172 83 C137 41 66 45 51 139" />
        <path className="pl" d="M17 121 C18 160 44 188 84 195" />
        <path className="pl" d="M31 139 C36 170 59 186 94 188" />
        <path className="pl" d="M48 151 C58 174 78 180 105 177" />
        <path className="pl" d="M169 111 C163 154 134 184 92 195" />
        <path className="pl" d="M157 132 C145 162 124 177 96 181" />
        <path className="pl" d="M82 151 C66 129 68 100 91 88 C113 76 139 90 142 116 C145 139 129 156 107 158" />
        <path className="pl" d="M94 139 C84 125 87 109 100 102 C115 95 131 105 131 121 C131 136 119 145 104 144" />
        <path className="pl" d="M105 129 C100 121 103 114 110 112 C118 110 124 115 124 123" />
        <line className="nt" x1="20" y1="28" x2="58" y2="28" />
        <line className="nt" x1="70" y1="27" x2="97" y2="27" />
        <line className="nt" x1="112" y1="29" x2="145" y2="29" />
        <line className="nt" x1="10" y1="50" x2="39" y2="50" />
        <line className="nt" x1="52" y1="49" x2="90" y2="49" />
        <line className="nt" x1="104" y1="50" x2="155" y2="50" />
        <line className="nt" x1="6" y1="73" x2="35" y2="73" />
        <line className="nt" x1="49" y1="72" x2="79" y2="72" />
        <line className="nt" x1="93" y1="73" x2="130" y2="73" />
        <line className="nt" x1="143" y1="74" x2="171" y2="74" />
        <line className="nt" x1="13" y1="96" x2="42" y2="96" />
        <line className="nt" x1="56" y1="96" x2="86" y2="96" />
        <line className="nt" x1="150" y1="96" x2="176" y2="96" />
        <line className="nt" x1="24" y1="119" x2="58" y2="119" />
        <line className="nt" x1="139" y1="119" x2="170" y2="119" />
        <line className="nt" x1="33" y1="142" x2="63" y2="142" />
        <line className="nt" x1="136" y1="142" x2="160" y2="142" />
        <line className="nt" x1="49" y1="165" x2="78" y2="165" />
        <line className="nt" x1="113" y1="165" x2="144" y2="165" />
        <line className="nt" x1="66" y1="188" x2="113" y2="188" />
      </svg>

      {/* Wordmark */}
      <span
        className="font-sans font-extrabold leading-none tracking-tight whitespace-nowrap"
        style={{ fontSize: Math.round(18 * scale) }}
      >
        <span className="text-brand-darker">Newspaper</span>
        <span className="text-brand-red"> Detective</span>
      </span>
    </span>
  )

  if (href) {
    return (
      <Link href={href} className="hover:opacity-90 transition-opacity inline-flex">
        {content}
      </Link>
    )
  }

  return content
}
