import { useEffect } from 'react'
import 'normalize.css'
import 'src/styles/tailwind.css'
import 'src/styles/globals.css'
import type { AppProps } from 'next/app'
import TagManager from 'react-gtm-module'

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    TagManager.initialize({ gtmId: 'G-Z4ZDV08XWZ' })
  }, [])

  return <Component {...pageProps} />
}
export default MyApp
