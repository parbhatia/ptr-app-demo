import Head from "next/head"
import React from "react"
import Navbar from "./Navbar"
import {
  siteMetaTitle,
  siteMetaDescription,
  siteMetaKeywords,
  siteMetaAuthor,
} from "../config"

export default function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <div className="w-full p-5 md:mx-auto md:px-50 md:container">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="og:title" content={siteMetaTitle} />
          <meta name="description" content={siteMetaDescription} />
          <meta name="keywords" content={siteMetaKeywords} />
          <meta name="author" content={siteMetaAuthor}></meta>
        </Head>

        <div className="flex flex-col justify-between animate-fade-in">
          <main>{children}</main>
        </div>
      </div>
    </div>
  )
}
