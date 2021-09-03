import React, { useState } from "react"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import capitalize from "../utils/capitalize"

// Custom hook to confirm actions with the least amount of dev modification
// The hook exports a function to set action, open/closes a dialog automatically, and provides helper text based on action type provided, so long as an action is set

// To use this hook properly, do the following:
// 1. provide an action type, and function to call when confirming
// 2. if the function action contains props, make sure to forward those props to action, by creating a wrapper function around action function, and just forward the props to action function
// 3. render the dialog provided by the hook

// Notes: confirm() is not async, it simply copies an action function to state. but, the commit confirmation is/should be async, since it executes the action

// Example usage where action function takes no props: onClick={() => confirm({type: "delete", action: deleteItemFunc})}
// example usage where action function takes props: deleteItem={(props) => confirm({type: "delete", action: deleteItemFunc, props: props})} -> props in this case can be {id, name} of an item

export default function useConfirmationDialog() {
  const [action, setAction] = useState(null)
  const [open, setOpen] = useState(false) //we use this for 'optimmistic' update, storing seperate open state for dialog allows us to process action, while closing the dialog at the same time, instead of waiting for action to complete
  const closeConfirmation = () => {
    setAction(null)
    setOpen(false)
  }
  const confirm = (action) => {
    setAction(action)
    setOpen(true)
  }
  const commitConfirmation = async () => {
    setOpen(false)
    await action.action(action.props)
    closeConfirmation()
  }
  const actionTypeString = action ? action.type : ""
  const actionText = `Are you sure you want to ${actionTypeString}?`

  const dialog = (
    <Dialog
      open={open}
      onClose={closeConfirmation}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {actionText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeConfirmation}>Discard</Button>
        <Button onClick={commitConfirmation} color="secondary" autoFocus>
          {capitalize(actionTypeString)}
        </Button>
      </DialogActions>
    </Dialog>
  )
  return [confirm, dialog]
}
