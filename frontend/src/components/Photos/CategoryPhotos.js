import { useTheme } from "@material-ui/core/styles"
import React, { useState } from "react"
import Div100vh from "react-div-100vh"
import usePhotos from "../../Hooks/usePhotos"
import FileUploadDashboard from "../File/FileUploadDashboard"
import LinearLoading from "../LoadingComponents/LinearLoading"
import EmptyListSkeleton from "../Misc/EmptyListSkeleton"
import SortablePhotosContainer from "./SortablePhotosContainer"

export default function CategoryPhotos({
  photoCategory,
  fetchUrl,
  disableSetCoverphoto,
}) {
  const [ordering, setOrdering] = useState(false)
  const theme = useTheme()

  const [
    photosInfo,
    uniqueFilenamePrepend,
    uploadUrl,
    revalidateFiles,
    helpers,
    open,
    closeUploadDashboard,
    openUploadDashboard,
  ] = usePhotos({
    fetchUrl,
    photoCategory,
  })

  const DashboardComponent = (
    <FileUploadDashboard
      open={open}
      openUploadDashboard={openUploadDashboard}
      closeUploadDashboard={closeUploadDashboard}
      label="Add Photos"
      fileType="images"
      uploadUrl={uploadUrl}
      uniqueFilenamePrepend={uniqueFilenamePrepend}
      revalidateFiles={revalidateFiles}
      chooseFromMyFiles={false}
    />
  )
  return (
    <>
      {!photosInfo ? (
        <LinearLoading />
      ) : (
        <>
          {photosInfo.photos.length === 0 ? (
            <Div100vh
              style={{
                minHeight: `calc(100rvh  - ${theme.spacing(6)}px - ${
                  theme.mixins.toolbar.minHeight
                }px - ${theme.mixins.toolbar.minHeight}px) `,
              }}
            >
              <EmptyListSkeleton
                itemLabel="Photos"
                CustomAddItemsComponent={DashboardComponent}
              />
            </Div100vh>
          ) : (
            <>
              {DashboardComponent}
              <SortablePhotosContainer
                photos={photosInfo.photos}
                orderInfo={photosInfo.orderInfo}
                ordering={ordering}
                setOrdering={setOrdering}
                orderingDisabled={!ordering}
                helpers={helpers}
                disableSetCoverphoto={disableSetCoverphoto}
              />
            </>
          )}
        </>
      )}
    </>
  )
}
