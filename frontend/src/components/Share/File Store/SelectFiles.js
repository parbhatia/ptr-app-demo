import Box from "@material-ui/core/Box"
import React from "react"
import FileItem from "../../File/FileItem"
import UploadDashboard from "../../File/FileUploadDashboard"
import useGetFiles from "../../../Hooks/useGetFiles"

//Responsible for Adding files using Upload Dashboard, and choosing from Master Files
const MasterFilesCopier = ({
  helpers,
  masterFileStoreId,
  open,
  openUploadDashboard,
  closeUploadDashboard,
  uploadUrl,
  revalidateFiles,
}) => {
  const [masterFiles] = useGetFiles({
    fetchUrl: `/api/masterfilestore/${masterFileStoreId}/masterfile`,
  })

  const chooseFromMyFiles = (
    <Box p={1} width="100%">
      {masterFiles?.map((file) => (
        <FileItem key={file.id} {...file} selectFilesMode helpers={helpers} />
      ))}
    </Box>
  )

  return (
    <UploadDashboard
      open={open}
      openUploadDashboard={openUploadDashboard}
      closeUploadDashboard={closeUploadDashboard}
      label="Add Files"
      fileType="file"
      uploadUrl={uploadUrl}
      revalidateFiles={revalidateFiles}
      chooseFromMyFiles={chooseFromMyFiles}
    />
  )
}

export default MasterFilesCopier
