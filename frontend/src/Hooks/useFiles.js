import useGetFiles from "./useGetFiles"
import { useState } from "react"

//encapsulate helpers are decorated with provided parameters
// this allows File Managers to use their own helper files
const useFiles = ({
  fetchUrl,
  encapsulateHelpers,
  handleAdditionalRevalidation,
  //the following functions are only used by FileManager to copy Files from Master Files
  shareableLinkFetchUrl,
}) => {
  const [open, setOpen] = useState(false)
  const closeUploadDashboard = () => {
    setOpen(false)
  }
  const openUploadDashboard = () => {
    setOpen(true)
  }
  const [files, mutateFiles] = useGetFiles({ fetchUrl })
  const helpers = encapsulateHelpers({
    mutateFiles,
    fetchUrl,
    handleAdditionalRevalidation,
    shareableLinkFetchUrl,
  })
  return [
    files,
    fetchUrl, //for upload
    mutateFiles, //for revalidation,
    helpers,
    open,
    closeUploadDashboard,
    openUploadDashboard,
  ]
}

export default useFiles
