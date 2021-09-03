import Box from "@material-ui/core/Box"
import IconButton from "@material-ui/core/IconButton"
import InputBase from "@material-ui/core/InputBase"
import Paper from "@material-ui/core/Paper"
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined"
import HttpsIcon from "@material-ui/icons/Https"
import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { green } from "@material-ui/core/colors"
import OpenInNewIcon from "@material-ui/icons/OpenInNew"

function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea")
  textArea.value = text

  // Avoid scrolling to bottom
  textArea.style.top = "0"
  textArea.style.left = "0"
  textArea.style.position = "fixed"

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    var successful = document.execCommand("copy")
    var msg = successful ? "successful" : "unsuccessful"
    console.log("Fallback: Copying text command was " + msg)
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err)
  }

  document.body.removeChild(textArea)
}
function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text)
    return
  }
  navigator.clipboard.writeText(text).then(
    function () {
      console.log("Async: Copying to clipboard was successful!")
    },
    function (err) {
      console.error("Async: Could not copy text: ", err)
    },
  )
}

const useStyles = makeStyles((theme) => ({
  url: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
}))

export default function ShareableLinkUrl({ shareableUrl, allowCopy = true }) {
  const classes = useStyles()
  return (
    <Box p={1} mt={1}>
      <Paper variant="outlined" component="form" className={classes.url}>
        <IconButton className={classes.iconButton} aria-label="menu">
          <HttpsIcon style={{ color: green[500] }} />
        </IconButton>
        <InputBase
          className={classes.input}
          readOnly
          defaultValue={shareableUrl}
        />
        {allowCopy && (
          <IconButton
            className={classes.iconButton}
            aria-label="menu"
            onClick={() => {
              copyTextToClipboard(shareableUrl)
            }}
          >
            <FileCopyOutlinedIcon />
          </IconButton>
        )}
        <Box>
          <IconButton
            href={shareableUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <OpenInNewIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  )
}
