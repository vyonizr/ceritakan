import React from 'react'
import Link from 'next/link'

const Footer: React.FC = () => (
  <footer className='text-center absolute bottom-7'>
    © {new Date().getFullYear()}{' '}
    <Link href='https://vyonizr.com/' passHref>
      <a>vyonizr</a>
    </Link>
    <br></br>Contents provided by{' '}
    <Link href='https://www.instagram.com/kartueksplorasa/' passHref>
      <a>Eksplorasa™ - The Game</a>
    </Link>
    .
  </footer>
)

export default Footer
