import {Head, Html, Main, NextScript} from 'next/document'
import {FC} from 'react'

const Document: FC = () => (
  <Html lang="en">
    <Head>
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
    </Head>
    <body className="font-regular font-sans" style={{margin: 0}}>
      <Main />
      <NextScript />
    </body>
  </Html>
)

export default Document
