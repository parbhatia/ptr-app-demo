import { useState } from "react"
const useAnchorMenu = () => {
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  return {
    handleMenu,
    handleClose,
    open,
    anchorEl,
  }
}

export default useAnchorMenu
