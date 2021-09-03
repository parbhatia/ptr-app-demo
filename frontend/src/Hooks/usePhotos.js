import { useState } from "react"
import encapsulateHelpers from "../helpers/photos"
import useGetPhotos from "./useGetPhotos"

// const useGetInspectionData = (categoryType) => {
//   const { inspectionId, inspectionInfo } = useContext(InspectionContext)
//   if (categoryType === "master_reference") {
//     return [null, "master_reference"]
//   } else {
//     return [inspectionId, inspectionInfo.unique_id]
//   }
// }

const usePhotos = ({ photoCategory, fetchUrl }) => {
  const [open, setOpen] = useState(false)
  const closeUploadDashboard = () => {
    setOpen(false)
  }
  const openUploadDashboard = () => {
    setOpen(true)
  }
  // const [inspectionId, uniqueId] = useGetInspectionData(photoCategory.type)
  fetchUrl = `${fetchUrl}/${photoCategory.id}/photo`
  const [photosInfo, mutatePhotos] = useGetPhotos({
    fetchUrl,
    photoCategory,
  })
  const uniqueFilenamePrepend = photoCategory.type + "-"

  const {
    deletePhoto,
    onSortEnd,
    updateCaption,
    saveMarkedFile,
    deletePhotoVersion,
    setCoverPhoto,
  } = encapsulateHelpers({
    photosInfo,
    mutatePhotos,
    fetchUrl,
  })

  return [
    photosInfo,
    uniqueFilenamePrepend,
    fetchUrl, //for upload
    mutatePhotos, //for revalidation
    {
      deletePhoto,
      onSortEnd,
      updateCaption,
      saveMarkedFile,
      deletePhotoVersion,
      setCoverPhoto,
    },
    open,
    closeUploadDashboard,
    openUploadDashboard,
  ]
}

export default usePhotos
