import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"
import React from "react"
import FileList from "../../File/FileList"
import FileUploadDashboard from "../../File/FileUploadDashboard"
import useFiles from "../../../Hooks/useFiles"
import encapsulateHelpers from "../../../helpers/masterfilestore"

const s3ResourceFileType = "private"

const Manager = ({ masterFileStoreId }) => {
  const [
    files,
    uploadUrl,
    revalidateFiles,
    helpers,
    open,
    closeUploadDashboard,
    openUploadDashboard,
  ] = useFiles({
    fetchUrl: `/api/masterfilestore/${masterFileStoreId}/masterfile`,
    encapsulateHelpers,
  })

  const DashboardComponent = (
    <FileUploadDashboard
      open={open}
      openUploadDashboard={openUploadDashboard}
      closeUploadDashboard={closeUploadDashboard}
      label="Add Files"
      fileType="files"
      uploadUrl={uploadUrl}
      uniqueFilenamePrepend=""
      revalidateFiles={revalidateFiles}
      chooseFromMyFiles={false}
    />
  )
  if (!files) {
    return null
  }
  return (
    <Box>
      {files.length === 0 ? (
        <Box
          p={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          height="85vh"
        >
          <Box>
            <Typography variant="h4" gutterBottom>
              No Files Added
            </Typography>
          </Box>
          {DashboardComponent}
        </Box>
      ) : (
        <>
          {DashboardComponent}
          <FileList
            files={files}
            helpers={helpers}
            s3ResourceFileType={s3ResourceFileType}
          />
        </>
      )}
    </Box>
  )
}

export default Manager
