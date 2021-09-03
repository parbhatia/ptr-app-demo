import Box from "@material-ui/core/Box"
import Chip from "@material-ui/core/Chip"
import { green } from "@material-ui/core/colors"
import IconButton from "@material-ui/core/IconButton"
import Paper from "@material-ui/core/Paper"
import { makeStyles } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import AddOutlinedIcon from "@material-ui/icons/AddOutlined"
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline"
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined"
import DoneIcon from "@material-ui/icons/Done"
import VisibilityIcon from "@material-ui/icons/Visibility"
import moment from "moment"
import React, { useState } from "react"
import DraggableMenu from "../DraggableItems/DraggableMenu"
import useInputHook from "../../Hooks/useInputHook"
import Dialog from "../PDF/Dialog"
import humanFileSize from "../../utils/humanFileSize"

const useStyles = makeStyles((theme) => ({
  file: {
    width: "100%",
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(1),
    margin: theme.spacing(0.5),
  },
}))

export default function FileItem({
  id,
  name,
  keyid,
  extension,
  size,
  time_created,
  confirm,
  helpers,
  s3ResourceFileType,
  selectFilesMode = false,
}) {
  const classes = useStyles()
  const [openPreview, setOpenPreview] = useState(false)
  const handleDialogClose = () => setOpenPreview(false)
  const [editing, setEditing] = useState(false)
  const [input, reset, handleInputChange, setManualEditInput] =
    useInputHook(name)
  const [tempStateFileAdded, setTempStateFileAdded] = useState(false)
  return (
    <Paper variant="outlined" className={classes.file}>
      <Box display="flex" alignItems="center">
        <Box display="flex" flexGrow={1}>
          <Box display="flex" alignItems="center" p={1} pr={2}>
            <DescriptionOutlinedIcon fontSize="large" />
          </Box>
          <Box>
            {editing ? (
              <TextField
                name="manualInput"
                //   variant="outlined"
                fullWidth
                value={input}
                // size="small"
                margin="none"
                placeholder="Edit Template"
                inputProps={{
                  maxLength: 60,
                }}
                onChange={handleInputChange}
              />
            ) : (
              <Box display="flex" alignItems="center">
                <Typography gutterBottom={false} variant="subtitle1">
                  {name}
                </Typography>
                <Box ml={2}>
                  <Chip
                    size="small"
                    variant="outlined"
                    label={extension.toUpperCase()}
                  />
                </Box>
              </Box>
            )}
            <Typography
              gutterBottom={false}
              variant="caption"
              color="textSecondary"
            >
              {humanFileSize(size, true)} - Created{" "}
              {moment(time_created).fromNow()}
            </Typography>
          </Box>
        </Box>
        {selectFilesMode ? (
          <Box pl={1}>
            {!tempStateFileAdded ? (
              <IconButton
                //   size="small"
                aria-label="edit"
                onClick={async () => {
                  const data = await helpers.copyFromMasterFile({
                    id,
                    name,
                    keyid,
                    extension,
                    size,
                  })
                  //so we can display file has been added, in a temp state
                  if (data) {
                    setTempStateFileAdded(true)
                  }
                }}
              >
                <AddOutlinedIcon />
              </IconButton>
            ) : (
              <IconButton aria-label="edit">
                <CheckCircleOutlineIcon style={{ color: green[500] }} />
              </IconButton>
            )}
          </Box>
        ) : (
          <>
            {!editing ? (
              <DraggableMenu
                editItem={async () => {
                  setManualEditInput(name)
                  setEditing(true)
                }}
                deleteItem={() =>
                  confirm({
                    type: "delete",
                    action: async () => helpers.deleteFile({ id }),
                  })
                }
                hidden={false}
              />
            ) : (
              <Box pl={1}>
                <IconButton
                  //   size="small"
                  aria-label="finishedit"
                  onClick={async () => {
                    if (input !== "") {
                      await helpers.updateFileName({ id, name: input })
                      reset()
                      setEditing(false)
                    } else {
                      setEditing(false)
                    }
                  }}
                >
                  <DoneIcon />
                </IconButton>
              </Box>
            )}

            <Box>
              <IconButton color="inherit" onClick={() => setOpenPreview(true)}>
                <VisibilityIcon />
              </IconButton>
            </Box>
          </>
        )}
        <Dialog
          open={openPreview}
          handleDialogClose={handleDialogClose}
          action="fetch"
          fetchUrl={`/api/requests3resource/streamfile?type=${s3ResourceFileType}&keyid=${keyid}`}
          pdfName={name}
        />
      </Box>
    </Paper>
  )
}
