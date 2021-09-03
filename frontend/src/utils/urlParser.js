//replaces "/" characters in url with "-". this is needed for breadcrumbs to parse urls correctly
const urlParser = (url) =>
  url.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "")

export default urlParser
