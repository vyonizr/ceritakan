import React from 'react'
import Link from 'next/link'

const Footer: React.FC = () => (
  <footer className='text-center'>
    © {new Date().getFullYear()} Ceritakan. Beberapa konten berasal dari{' '}
    <Link href='https://www.instagram.com/kartueksplorasa/' passHref>
      <a target='_blank' rel='noreferrer noopener'>
        Eksplorasa™ - The Game
      </a>
    </Link>
    .
  </footer>
)

export default Footer
