import { useEffect, useState } from "react"
import { useRouteMatch } from "react-router-dom"

//renders title given a react router route path
const useMenuBarTitle = (path) => {
  const match = useRouteMatch({
    path,
    strict: true,
    sensitive: false,
  })
  //seperately match "/" path, this is awkward, but it's literally the only way to
  //   to have 'Home' displayed in MenuBar
  const homeMatch = useRouteMatch({
    path: "/",
    strict: true,
    sensitive: false,
  })
  const [title, setTitle] = useState("")
  useEffect(() => {
    if (match) {
      setTitle(match.params.pageName)
    } else if (homeMatch?.isExact) {
      setTitle("Home")
    }
  }, [match, homeMatch])
  return title
}

export default useMenuBarTitle
