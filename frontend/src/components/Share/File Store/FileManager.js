import Box from "@material-ui/core/Box"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import PropTypes from "prop-types"
import React from "react"
import FileList from "../../File/FileList"
import useFiles from "../../../Hooks/useFiles"
import encapsulateHelpers from "../../../helpers/filestore"
import SelectFiles from "./SelectFiles"

const useStyles = makeStyles((theme) => ({
  root: {
    border: `1px solid ${theme.palette.action.disabledBackground}`,
    borderRadius: 5,
  },
}))

const s3ResourceFileType = "shareable"

const Manager = ({
  header,
  caption,
  fetchUrl,
  fileType,
  masterFileStoreId,
  mutateShareableLink,
}) => {
  const classes = useStyles()
  const handleAdditionalRevalidation = () => {
    mutateShareableLink()
  }
  //fetch certain types of files, not all files of shareable link id
  const localFetchUrl = `${fetchUrl}/${fileType}/file`
  const [
    files,
    uploadUrl,
    revalidateFiles,
    helpers,
    open,
    closeUploadDashboard,
    openUploadDashboard,
  ] = useFiles({
    fetchUrl: localFetchUrl,
    encapsulateHelpers,
    handleAdditionalRevalidation,
    shareableLinkFetchUrl: fetchUrl,
  })

  return (
    <Box p={1} m={1} className={classes.root}>
      <Box display="flex" alignItems="center" justifyContent="center">
        <Box p={1} flexGrow={1}>
          <Typography variant="h6">{header}</Typography>
          <Typography variant="caption">{caption}</Typography>
        </Box>
        <Box>
          <SelectFiles
            helpers={helpers}
            masterFileStoreId={masterFileStoreId}
            //props given to let child override Upload Dashboard with custom props
            open={open}
            openUploadDashboard={openUploadDashboard}
            closeUploadDashboard={closeUploadDashboard}
            uploadUrl={uploadUrl}
            revalidateFiles={revalidateFiles}
          />
        </Box>
      </Box>

      {!files ? null : (
        <FileList
          files={files}
          helpers={helpers}
          s3ResourceFileType={s3ResourceFileType}
        />
      )}
    </Box>
  )
}

Manager.propTypes = {
  fileType: PropTypes.oneOf(["attachment", "merge_with_pdf"]),
}

export default Manager
