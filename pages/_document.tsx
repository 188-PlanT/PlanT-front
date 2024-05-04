import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <body>
        <Main />
        <div id='modal-root' />
        <NextScript />
      </body>
    </Html>
  )
}