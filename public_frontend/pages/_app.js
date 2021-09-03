import Router from "next/router"
import NProgress from "nprogress"
import React from "react"
import "tailwindcss/tailwind.css"
import Footer from "../components/Footer"
import "../styles/globals.css"
import "../styles/nprogress.css"
import { pageView } from "../config/ga"

const updateGoogleAnalytics = (url) => {
  pageView(url)
}

Router.events.on("routeChangeStart", () => {
  NProgress.start()
})
Router.events.on("routeChangeComplete", (url) => {
  NProgress.done()
  updateGoogleAnalytics(url)
})
Router.events.off("routeChangeComplete", (url) => {
  updateGoogleAnalytics(url)
})

Router.events.on("routeChangeError", () => NProgress.done())

function MyApp({ Component, pageProps }) {
  return (
    <div className="flex flex-col justify-between min-h-screen bg-company-light">
      <Component {...pageProps} />
      <Footer />
    </div>
  )
}

export default MyApp
