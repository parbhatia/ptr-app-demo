const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL
const legacyS3PhotosDomain = process.env.NEXT_PUBLIC_S3_PHOTOS_RESOURCE_URL
const MAIN_DOMAIN = process.env.NEXT_PUBLIC_PTR_MAIN_DOMAIN
const APP_SUBDOMAIN = process.env.NEXT_PUBLIC_PTR_APP_SUBDOMAIN
const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID

const fallBackCoverPhoto = `${CDN_URL}/assets/coverPhoto.jpg`
const siteMetaTitle = "Home Inspection Services"
const siteMetaDescription = "Home Inspection Services description"
const siteMetaKeywords = "home inspection, home inspections"
const siteMetaAuthor = "HOME INSPECTOR"

export {
    CDN_URL,
    fallBackCoverPhoto,
    legacyS3PhotosDomain,
    MAIN_DOMAIN,
    APP_SUBDOMAIN,
    GA_ID,
    siteMetaTitle,
    siteMetaDescription,
    siteMetaKeywords,
    siteMetaAuthor
}