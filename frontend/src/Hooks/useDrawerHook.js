import { useState } from "react"

//Handles state of which side to display drawer
const useDrawerHook = (anchorText) => {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  })
  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return
    }
    setState({ ...state, [anchorText]: !state[anchorText] })
  }
  return [anchorText, state[anchorText], toggleDrawer]
}

export default useDrawerHook
