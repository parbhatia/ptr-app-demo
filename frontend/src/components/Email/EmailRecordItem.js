import AppBar from "@material-ui/core/AppBar"
import Avatar from "@material-ui/core/Avatar"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import Chip from "@material-ui/core/Chip"
import { green, orange, red, yellow } from "@material-ui/core/colors"
import Dialog from "@material-ui/core/Dialog"
import DialogContent from "@material-ui/core/DialogContent"
import Hidden from "@material-ui/core/Hidden"
import IconButton from "@material-ui/core/IconButton"
import Paper from "@material-ui/core/Paper"
import Slide from "@material-ui/core/Slide"
import { makeStyles } from "@material-ui/core/styles"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import CachedIcon from "@material-ui/icons/Cached"
import CheckCircleIcon from "@material-ui/icons/CheckCircle"
import CloseIcon from "@material-ui/icons/Close"
import ErrorIcon from "@material-ui/icons/Error"
import MailOutlineIcon from "@material-ui/icons/MailOutline"
import WarningIcon from "@material-ui/icons/Warning"
import VisibilityIcon from "@material-ui/icons/Visibility"
import ThumbUpIcon from "@material-ui/icons/ThumbUp"
import ThumbDownIcon from "@material-ui/icons/ThumbDown"

import axios from "axios"
import moment from "moment"
import React, { useEffect, useState } from "react"

const useStyles = makeStyles((theme) => ({
  paper: {
    paddingBottom: 50,
  },
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  dialogContent: {
    padding: 0,
  },
  email: {
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(1),
    margin: theme.spacing(0.5),
  },
}))

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function EmailRecordItem({
  id,
  opened,
  bounced,
  complaint,
  subject,
  message_id,
  email_value,
  person_name,
  shareable_link_id,
  time_sent,
  time_delivered,
  time_clicked,
  time_opened,
}) {
  const classes = useStyles()
  const [openDialog, setOpenDialog] = useState(false)
  const [html, setHtml] = useState(null)
  const handleClose = () => setOpenDialog(false)
  let OpenStatus
  if (!opened) {
    OpenStatus = (
      <Chip
        size="small"
        variant="outlined"
        icon={<ThumbDownIcon style={{ color: orange[500] }} />}
        label="Unopened"
      />
    )
  } else {
    OpenStatus = (
      <Chip
        size="small"
        variant="outlined"
        icon={<ThumbUpIcon style={{ color: green[500] }} />}
        label="Opened"
      />
    )
  }
  let Status
  if (bounced) {
    Status = (
      <Chip
        size="small"
        variant="outlined"
        icon={<ErrorIcon style={{ color: red[500] }} />}
        label="Failed"
      />
    )
    OpenStatus = null
  } else if (complaint) {
    Status = (
      <Chip
        size="small"
        variant="outlined"
        icon={<WarningIcon style={{ color: yellow[700] }} />}
        label="Marked as Spam"
      />
    )
  } else if (time_delivered) {
    Status = (
      <Chip
        size="small"
        variant="outlined"
        icon={<CheckCircleIcon style={{ color: green[500] }} />}
        label="Delivered"
      />
    )
  } else {
    Status = (
      <Chip
        size="small"
        variant="outlined"
        icon={<CachedIcon style={{ color: orange[500] }} />}
        label="Pending"
      />
    )
  }
  const cancelTokenSource = axios.CancelToken.source()
  useEffect(() => {
    return () => {
      cancelTokenSource.cancel()
    }
  }, [])
  const fetchEmailPreviewFileUrl = async () => {
    const s3ResourceFileType = "shareable"
    const keyid = `emailsPreview/${message_id}.html`
    try {
      const { data } = await axios.get(
        `/api/requests3resource/streamfile?type=${s3ResourceFileType}&keyid=${keyid}`,
        {
          responseType: "blob",
          cancelToken: cancelTokenSource.token,
        },
      )
      const rawHtml = data
      setHtml(await rawHtml.text())
    } catch (e) {
      cancelTokenSource.cancel()
    }
  }
  const handleOpen = async () => {
    fetchEmailPreviewFileUrl()
    setOpenDialog(true)
  }

  return (
    <>
      <Paper p={1} variant="outlined" className={classes.email}>
        <Box display="flex" flexGrow={1}>
          <Hidden mdDown>
            <Box p={1} mr={1}>
              <Avatar>{person_name.charAt(0).toUpperCase()}</Avatar>
            </Box>
            <Box width="100%" display="flex" flexDirection="column">
              <Box>
                <Typography variant="subtitle1" color="textPrimary">
                  {person_name}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textPrimary">
                  {subject}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Box>
                  <Chip
                    size="small"
                    variant="outlined"
                    icon={<MailOutlineIcon />}
                    label={email_value}
                  />
                </Box>
                <Box pl={0.5}>{Status}</Box>
                <Box pl={0.5}>{OpenStatus}</Box>
              </Box>
              <Box>
                <Typography noWrap variant="caption" color="textSecondary">
                  Sent {moment(time_sent).fromNow()}
                </Typography>

                {opened && time_opened && (
                  <>
                    {" · "}
                    <Typography noWrap variant="caption" color="textSecondary">
                      Opened {moment(time_opened).fromNow()}
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
            <Box display="flex" alignItems="center">
              <IconButton color="inherit" onClick={handleOpen}>
                <VisibilityIcon />
              </IconButton>
            </Box>
          </Hidden>
        </Box>
        <Hidden lgUp>
          <Box overflow="auto" p={1}>
            <Box>
              <Typography variant="body1" color="textPrimary">
                {person_name}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textPrimary">
                {subject}
              </Typography>
            </Box>
            <Box>
              <Chip
                size="small"
                variant="outlined"
                icon={<MailOutlineIcon />}
                label={email_value}
              />
            </Box>
            <Box>{Status}</Box>
            <Box>{OpenStatus}</Box>
            <Box>
              <Typography noWrap variant="caption">
                Sent {moment(time_sent).fromNow()}
              </Typography>
            </Box>
            <Box>
              {opened && time_opened && (
                <Typography noWrap variant="caption">
                  Opened {moment(time_opened).fromNow()}
                </Typography>
              )}
            </Box>
            <Box>
              <Button
                size="small"
                variant="outlined"
                onClick={handleOpen}
                startIcon={<VisibilityIcon />}
              >
                Preview
              </Button>
            </Box>
          </Box>
        </Hidden>
      </Paper>
      <Dialog
        fullScreen
        scroll="paper"
        open={openDialog}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar} color="inherit">
          <Toolbar variant="dense">
            <IconButton
              size="small"
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
            <Typography gutterBottom={false} variant="subtitle1">
              Email Preview
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent className={classes.dialogContent}>
          {html && (
            <iframe
              title="email preview"
              width="100%"
              style={{ height: "90vh" }}
              srcDoc={html}
            ></iframe>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
