import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import IconButton from "@material-ui/core/IconButton"
import Slide from "@material-ui/core/Slide"
import CloseIcon from "@material-ui/icons/Close"
import React from "react"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const DialogHOC = ({
  dialogTitle,
  closeDialogText = "Finish",
  openDialog,
  setOpenDialog,
  keepMounted = false,
  manualHandleClose = null,
  children,
  fullScreen = true,
  onExited = null,
  disableDefaultAction = false,
  disableTitleBarClose = false,
  DialogActionsComponent,
  DialogHeaderComponent,
}) => {
  const handleClose = () => {
    manualHandleClose ? manualHandleClose() : setOpenDialog(false)
  }

  return (
    <Dialog
      maxWidth="xl"
      fullScreen={fullScreen}
      open={openDialog}
      onExited={onExited}
      keepMounted={keepMounted}
      onClose={handleClose}
      TransitionComponent={Transition}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {DialogHeaderComponent ? (
        DialogHeaderComponent
      ) : (
        <Box pl={1} display="flex" alignItems="center">
          {!disableTitleBarClose && (
            <Box>
              <IconButton
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          )}

          <Box>
            <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
          </Box>
        </Box>
      )}

      <DialogContent>{children}</DialogContent>
      <DialogActions>
        {!disableDefaultAction && (
          <Button onClick={handleClose}>{closeDialogText}</Button>
        )}

        {DialogActionsComponent}
      </DialogActions>
    </Dialog>
  )
}

export default DialogHOC
