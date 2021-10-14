import React from 'react'
import Link from 'next/link'

const Footer: React.FC = () => (
  <footer className='text-center self-start mt-8'>
    © {new Date().getFullYear()}{' '}
    <Link href='https://vyonizr.com/' passHref>
      <a>vyonizr</a>
    </Link>
    . Some contents originated from{' '}
    <Link href='https://www.instagram.com/kartueksplorasa/' passHref>
      <a>Eksplorasa™ - The Game</a>
    </Link>
    .
  </footer>
)

export default Footer
