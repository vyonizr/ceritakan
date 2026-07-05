import React from 'react'
import Link from 'next/link'

const Footer: React.FC = () => (
  <footer className='text-center text-gray-400'>
    © {new Date().getFullYear()} Ceritakan. Sebagian konten berasal dari{' '}
    <Link
      href='https://www.instagram.com/kartueksplorasa/'
      target='_blank'
      rel='noreferrer noopener'
    >
      Eksplorasa™ - The Game
    </Link>
    .
  </footer>
)

export default Footer
