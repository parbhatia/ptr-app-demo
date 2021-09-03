import AppBar from "@material-ui/core/AppBar"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import Hidden from "@material-ui/core/Hidden"
import IconButton from "@material-ui/core/IconButton"
import { makeStyles } from "@material-ui/core/styles"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto"
import CloseIcon from "@material-ui/icons/Close"
import CloudDownloadOutlinedIcon from "@material-ui/icons/CloudDownloadOutlined"
import CreateNewFolderOutlinedIcon from "@material-ui/icons/CreateNewFolderOutlined"
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size"
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type"
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation"
import FilePondPluginImagePreview from "filepond-plugin-image-preview"
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css"
import "filepond/dist/filepond.min.css"
import React, { useRef, useState } from "react"
import { FilePond, registerPlugin } from "react-filepond"
import { generateRandomFileName } from "../../utils/randomGenerators"
import LoadingBar from "../LoadingComponents/LinearLoading"
import DialogHOC from "../Misc/DialogHOC"

// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
)

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}))

const imageTypesArray = ["image/png", "image/jpeg", "image/heic"]
const fileTypesArray = ["application/pdf"]

const FileUploadDashboard = ({
  fileType,
  chooseFromMyFiles = null,
  uniqueFilenamePrepend = "",
  open,
  openUploadDashboard,
  closeUploadDashboard,
  label,
  uploadUrl,
  revalidateFiles,
}) => {
  const classes = useStyles()
  const [loading, setLoading] = useState(false)
  const [displayCustom, setDisplayCustom] = useState(false)
  const [files, setFiles] = React.useState([])
  const [resize, setResize] = React.useState(true)
  const pondRef = useRef(null)
  const handleFinishAllUploads = () => {
    setLoading(false)
    closeUploadDashboard()
    revalidateFiles()
  }
  return (
    <Box
      p={1}
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
    >
      <Button
        variant="outlined"
        onClick={openUploadDashboard}
        startIcon={
          fileType === "images" ? (
            <AddAPhotoIcon />
          ) : (
            <CreateNewFolderOutlinedIcon />
          )
        }
      >
        {label}
      </Button>
      <DialogHOC
        fullScreen
        openDialog={open}
        manualHandleClose={closeUploadDashboard}
        closeDialogText="Close"
        onExited={() => setFiles([])}
        disableTitleBarClose
        DialogActionsComponent={
          <Box m={1}>
            <Button
              variant="outlined"
              disabled={files.length === 0}
              onClick={async () => {
                setLoading(true)
                await pondRef.current.processFiles()
              }}
              startIcon={<CloudDownloadOutlinedIcon />}
            >
              Upload
            </Button>
          </Box>
        }
        DialogHeaderComponent={
          <>
            <AppBar className={classes.appBar} color="inherit">
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={closeUploadDashboard}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
                <Typography
                  gutterBottom={false}
                  variant="h6"
                  className={classes.title}
                >
                  {label}
                </Typography>
                {chooseFromMyFiles ? (
                  <>
                    <Hidden smDown>
                      <Box p={1}>
                        <Button
                          variant="outlined"
                          onClick={() => setDisplayCustom(true)}
                          startIcon={<CreateNewFolderOutlinedIcon />}
                        >
                          My Files
                        </Button>
                      </Box>
                      <Box p={1}>
                        <Button
                          variant="outlined"
                          onClick={() => setDisplayCustom(false)}
                          startIcon={<CloudDownloadOutlinedIcon />}
                        >
                          Upload Files
                        </Button>
                      </Box>
                    </Hidden>
                    <Hidden mdUp>
                      <Box p={1}>
                        <IconButton
                          variant="outlined"
                          onClick={() => setDisplayCustom(true)}
                        >
                          <CreateNewFolderOutlinedIcon />
                        </IconButton>
                      </Box>
                      <Box p={1}>
                        <IconButton
                          variant="outlined"
                          onClick={() => setDisplayCustom(false)}
                        >
                          <CloudDownloadOutlinedIcon />
                        </IconButton>
                      </Box>
                    </Hidden>
                  </>
                ) : null}
              </Toolbar>
            </AppBar>
            {loading && <LoadingBar />}
          </>
        }
      >
        <Box>
          {displayCustom ? (
            <Box>{chooseFromMyFiles}</Box>
          ) : (
            <FilePond
              files={files}
              ref={pondRef}
              allowMultiple={true}
              allowProcess={false}
              allowReplace={false}
              allowReorder={false}
              maxFiles={50}
              maxParallelUploads={15}
              instantUpload={false}
              itemInsertLocation="after"
              maxFileSize={"10MB"}
              allowRevert={false}
              acceptedFileTypes={
                fileType === "images" ? imageTypesArray : fileTypesArray
              }
              imagePreviewMaxFileSize={"10MB"}
              imagePreviewMaxInstantPreviewFileSize={50000000}
              server={{
                url: uploadUrl,
                process: {
                  url: "/",
                  headers: { resize: resize },
                },
              }}
              name="files"
              labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
              onprocessfiles={handleFinishAllUploads}
              onupdatefiles={(fileItems) => {
                fileItems.map((file) =>
                  file.setMetadata(
                    "uniqueFileName",
                    `${uniqueFilenamePrepend}${generateRandomFileName()}.${
                      file.fileExtension
                    }`,
                  ),
                )
                setFiles(fileItems)
              }}
            />
          )}
          {/* <button
              onClick={() => {
                console.log("files is", files)
                console.log(
                  files.map((file) => ({
                    file: file.file,
                    fileSize: file.fileSize,
                    fileName: file.filename,
                    filenameWithoutExtension: file.filenameWithoutExtension,
                    fileExtension: file.fileExtension,
                    metaData: file.getMetadata(),
                    origin: file.origin,
                  })),
                )
              }}
            >
              get files info
            </button> */}
        </Box>
      </DialogHOC>
    </Box>
  )
}

export default FileUploadDashboard
