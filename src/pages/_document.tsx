import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document'

import {
  SITE_TITLE,
  SITE_URL,
  SITE_DESCRIPTION,
  OG_IMAGE_URL,
} from 'src/common/constants'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang='id'>
        <Head>
          <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <meta name='description' content={SITE_DESCRIPTION} />
          <meta name='keywords' content='card game' />
          <link rel='manifest' href='/manifest.json' />
          <link
            href='/favicon-16x16.png'
            rel='icon'
            type='image/png'
            sizes='16x16'
          />
          <link
            href='/favicon-32x32.png'
            rel='icon'
            type='image/png'
            sizes='32x32'
          />
          <link rel='apple-touch-icon' href='/apple-icon.png'></link>
          <link rel='icon' href='/favicon.ico' />
          <meta name='theme-color' content='#4e7abd' />

          <meta property='og:type' content='website' />
          <meta property='og:url' content={SITE_URL} />
          <meta property='og:title' content={SITE_TITLE} />
          <meta property='og:description' content={SITE_DESCRIPTION} />
          <meta property='og:image' content={OG_IMAGE_URL} />

          <meta property='twitter:card' content='summary_large_image' />
          <meta property='twitter:url' content={SITE_URL} />
          <meta property='twitter:title' content={SITE_TITLE} />
          <meta property='twitter:description' content={SITE_DESCRIPTION} />
          <meta property='twitter:image' content={OG_IMAGE_URL} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
