import { GA_ID } from "./index"

const inDevMode = process.env.NODE_ENV === "development"

export const pageView = (url) => {
  if (inDevMode) {
    return
  }
  window.gtag("config", GA_ID, {
    page_path: url,
  })
}

// log specific events happening.
export const event = ({ action, category, label, value }) => {
  if (inDevMode) {
    return
  }
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}
