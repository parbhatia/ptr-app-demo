import Head from "next/head"
import Layout from "./Layout"
import { siteMetaTitle } from "../config"

export default function PageLayout({ pageTitle, children }) {
  return (
    <Layout>
      <Head>
        <title>
          {pageTitle === "" ? siteMetaTitle : `${pageTitle} - ${siteMetaTitle}`}
        </title>
      </Head>
      <div className="px-4 mx-auto mt-10 text-lg max-w-7xl sm:mt-12 sm:px-6 md:mt-16 lg:mt-18 lg:px-8 xl:mt-20">
        {children}
      </div>
    </Layout>
  )
}
