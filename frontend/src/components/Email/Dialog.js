import AppBar from "@material-ui/core/AppBar"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import IconButton from "@material-ui/core/IconButton"
import Slide from "@material-ui/core/Slide"
import { makeStyles } from "@material-ui/core/styles"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import CloseIcon from "@material-ui/icons/Close"
import SendOutlinedIcon from "@material-ui/icons/SendOutlined"
import React, { useState } from "react"
import Compose from "./Compose"

const useStyles = makeStyles((theme) => ({
  title: {
    flex: 1,
  },
  content: {
    padding: 0,
  },
  button: {
    margin: theme.spacing(1),
  },
  appBar: {
    position: "relative",
  },
}))

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

// - handles logic for merging pdf
export default function EmailDialog(props) {
  const classes = useStyles()
  const [openEmail, setOpenEmail] = useState(false)
  const handleCloseEmail = () => setOpenEmail(false)
  const handleOpenEmail = () => setOpenEmail(true)
  return (
    <>
      <Button
        fullWidth
        size="large"
        variant="outlined"
        onClick={handleOpenEmail}
        startIcon={<SendOutlinedIcon />}
      >
        Send Email
      </Button>
      <Dialog
        fullScreen
        scroll="paper"
        open={openEmail}
        onClose={handleCloseEmail}
        TransitionComponent={Transition}
      >
        <AppBar elevation={0} color="inherit" className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseEmail}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography
              gutterBottom={false}
              variant="h6"
              className={classes.title}
            >
              New Email
            </Typography>
          </Toolbar>
        </AppBar>
        <Compose {...props} handleClose={handleCloseEmail} />
      </Dialog>
    </>
  )
}
