import Box from "@material-ui/core/Box"
import Checkbox from "@material-ui/core/Checkbox"
import Divider from "@material-ui/core/Divider"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import FormGroup from "@material-ui/core/FormGroup"
import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import { makeStyles } from "@material-ui/core/styles"
import ToggleSwitch from "@material-ui/core/Switch"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import DeleteIcon from "@material-ui/icons/Delete"
import DragHandleIcon from "@material-ui/icons/DragHandle"
import EditIcon from "@material-ui/icons/Edit"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc"
import urlParser from "../../../utils/urlParser"
import useConfirmationDialog from "../../../Hooks/useConfirmationDialog"
import useToggle from "../../../Hooks/useToggle"

const useStyles = makeStyles((theme) => ({}))

const DragHandle = SortableHandle(() => <DragHandleIcon />)

const AbstractSortableItem = SortableElement(
  ({
    url,
    item,
    deleteItem,
    updateBoolValue,
    updateTextValue,
    idxToDelete,
    editing,
    isCheckbox,
    defaultEditing,
  }) => {
    const [editingText, setEditingText] = useState(false)
    const [manualEditInput, setManualEditInput] = useState("")

    const editingTextField = (
      <TextField
        key={`${item.id},${url}`}
        name="manualEditInput"
        value={manualEditInput}
        placeholder=""
        fullWidth
        variant="outlined"
        onChange={(ee) => setManualEditInput(ee.target.value)}
        onKeyPress={(ev) => {
          if (ev.key === "Enter") {
            updateTextValue(item.id, manualEditInput, idxToDelete)
            ev.preventDefault()
            setEditingText(false)
          }
        }}
        onBlur={() => {
          updateTextValue(item.id, manualEditInput, idxToDelete)
          setEditingText(false)
        }}
      />
    )
    //used for always displaying drag handle, edit and delete buttons
    if (defaultEditing) {
      return (
        <ListItem>
          <>
            <ListItemIcon>
              <DragHandle />
            </ListItemIcon>

            <ListItemIcon>
              <IconButton
                edge="end"
                aria-label="editing"
                onClick={async () => {
                  await setManualEditInput(item.name)
                  setEditingText(true)
                }}
              >
                <EditIcon />
              </IconButton>
            </ListItemIcon>
            {editingText ? (
              editingTextField
            ) : (
              <ListItemText primary={item.name} />
            )}

            <IconButton
              edge="end"
              onClick={async () => await deleteItem(item.id, idxToDelete)}
            >
              <DeleteIcon />
            </IconButton>
          </>
        </ListItem>
      )
    }
    if (!isCheckbox) {
      if (editing)
        return (
          <ListItem>
            <>
              <ListItemIcon>
                <DragHandle />
              </ListItemIcon>

              <ListItemIcon>
                <IconButton
                  edge="end"
                  aria-label="editing"
                  onClick={async () => {
                    await setManualEditInput(item.name)
                    setEditingText(true)
                  }}
                >
                  <EditIcon />
                </IconButton>
              </ListItemIcon>
              {editingText ? (
                editingTextField
              ) : (
                <ListItemText primary={item.name} />
              )}

              <IconButton
                edge="end"
                onClick={async () => await deleteItem(item.id, idxToDelete)}
              >
                <DeleteIcon />
              </IconButton>
            </>
          </ListItem>
        )
      else
        return (
          <ListItem
            button
            component={Link}
            to={`${url}/${urlParser(item.name)}/${item.id}`}
          >
            <ListItemText primary={item.name} />
          </ListItem>
        )
    }
    //is checkbox and editing
    if (editing)
      return (
        <ListItem dense>
          <>
            <ListItemIcon>
              <DragHandle />
            </ListItemIcon>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={item.used || false}
                tabIndex={-1}
                disableRipple
                onClick={async () =>
                  await updateBoolValue(item.id, !item.used, idxToDelete)
                }
              />
            </ListItemIcon>
            <ListItemIcon>
              <IconButton
                edge="end"
                aria-label="editing"
                onClick={async () => {
                  await setManualEditInput(item.text)
                  setEditingText(true)
                }}
              >
                <EditIcon />
              </IconButton>
            </ListItemIcon>
            {editingText ? (
              editingTextField
            ) : (
              <ListItemText primary={item.text} />
            )}

            <IconButton
              edge="end"
              aria-label="comments"
              onClick={async () => await deleteItem(item.id, idxToDelete)}
            >
              <DeleteIcon />
            </IconButton>
          </>
        </ListItem>
      )
    //checkbox and not editing
    else
      return (
        <ListItem dense>
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={item.used || false}
              tabIndex={-1}
              disableRipple
            />
          </ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      )
  },
)

const AbstractSortableList = SortableContainer(
  ({ listInfo, url, items, deleteItem, updateBoolValue, updateTextValue }) => {
    const [editing, toggleEditing] = useToggle(false)
    const [confirm, confirmationDialog] = useConfirmationDialog()
    const classes = useStyles()
    //use a confirmation wrapper function to wrap delete function, since delete function uses props, this way we just forward any props we get to inner delete function
    const confirmDeleteWrapper = (props) =>
      confirm({ type: "delete", action: deleteItem, props: props })
    return (
      <div>
        <Grid container direction="row" justify="center" alignItems="stretch">
          <Box component="span" m={2}>
            <Typography variant="h5">{listInfo.listHeader}</Typography>
          </Box>

          <FormGroup row>
            <FormControlLabel
              control={
                <ToggleSwitch
                  checked={editing}
                  onChange={() => toggleEditing()}
                  name="checkedB"
                  color="primary"
                />
              }
              label={`Edit`}
            />
          </FormGroup>
        </Grid>
        <List
          key={`${listInfo.keyTag}-${editing}`}
          component="nav"
          aria-labelledby={listInfo.keyTag}
          className={classes.list}
        >
          <Divider />
          {items.map((item, idx) => (
            <AbstractSortableItem
              key={
                listInfo.keyTag === "mastercheckboxlist"
                  ? `${listInfo.keyTag}-${item.text}${idx}`
                  : `${listInfo.keyTag}-${item.name}${idx}`
              }
              idxToDelete={idx}
              index={idx}
              item={item}
              url={url}
              editing={editing}
              deleteItem={confirmDeleteWrapper}
              updateBoolValue={updateBoolValue}
              updateTextValue={updateTextValue}
              disabled={!editing}
              isCheckbox={listInfo.keyTag === "mastercheckboxlist"}
            />
          ))}
        </List>
        {confirmationDialog}
      </div>
    )
  },
)

export { AbstractSortableList, AbstractSortableItem }
