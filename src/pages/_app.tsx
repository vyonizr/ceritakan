import { useEffect } from 'react'
import { ThemeProvider } from 'next-themes'
import 'normalize.css'
import 'src/styles/tailwind.css'
import 'src/styles/globals.css'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }, [])

  return (
    <ThemeProvider attribute='class'>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
export default MyApp
