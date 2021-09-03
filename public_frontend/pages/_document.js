import React from "react"
import Document, { Html, Head, Main, NextScript } from "next/document"
import { GA_ID } from "../config"

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
        <Head>
          <link
            rel="stylesheet preload"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
            as="style"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
