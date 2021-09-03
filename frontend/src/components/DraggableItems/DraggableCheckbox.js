import Badge from "@material-ui/core/Badge"
import Collapse from "@material-ui/core/Collapse"
import Hidden from "@material-ui/core/Hidden"
import IconButton from "@material-ui/core/IconButton"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import { makeStyles } from "@material-ui/core/styles"
import DeleteIcon from "@material-ui/icons/Delete"
import DoneIcon from "@material-ui/icons/Done"
import EditIcon from "@material-ui/icons/Edit"
import ExpandLess from "@material-ui/icons/ExpandLess"
import ExpandMore from "@material-ui/icons/ExpandMore"
import React, { useState } from "react"
import { SortableContainer, SortableElement } from "react-sortable-hoc"
import useInputHook from "../../Hooks/useInputHook"
import useConfirmationDialog from "../../Hooks/useConfirmationDialog"
import { deleteItemHelper, updateTextValueHelper } from "../../helpers/CRUDitem"
import TextField from "../Misc/ReusableTextField"
import DraggableMenu from "./DraggableMenu"
import DraggableSubCheckboxWrapper from "./DraggableSubCheckbox"
import DragHandle from "./DragHandle"

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(8),
  },
  listItemIcon: {
    "min-width": "0",
  },
  dragIcon: {
    "min-width": "0",
  },
  iconButton: {
    padding: "5px",
  },
  listitem: {
    border: 0,
    marginBottom: theme.spacing(1),
    background: theme.palette.action.hover,
  },
}))

//Renders a single Draggable Checkbox, and renders all Draggable Subcheckboxes of a single checkbox
const SortableCheckboxItem = SortableElement(
  ({
    item,
    idxToDelete,
    mutateCategory,
    fetchUrl,
    disableSubcheckboxes,
    draggableCheckboxMaxlength,
    confirm,
  }) => {
    const classes = useStyles()
    const [open, setOpen] = useState(false)
    const [editingText, setEditingText] = useState(false)
    const [input, reset, handleInputChange, setManualEditInput] = useInputHook()
    const deleteItem = () =>
      deleteItemHelper({
        id: item.id,
        idx: idxToDelete,
        url: fetchUrl,
        mutate: mutateCategory,
      })
    const updateText = () =>
      updateTextValueHelper({
        id: item.id,
        text: input,
        idx: idxToDelete,
        url: `${fetchUrl}/updatetext`,
        mutate: mutateCategory,
      })
    const editingTextField = (
      <TextField
        key={`${item.id}`}
        label="Edit Item"
        value={input}
        multiline
        color="secondary"
        onChange={handleInputChange}
        inputProps={{
          autoCapitalize: "true",
          spellCheck: true,
          maxLength: draggableCheckboxMaxlength,
        }}
        onKeyPress={async (ev) => {
          if (ev.key === "Enter" && input !== "") {
            await updateText()
            // ev.preventDefault()
            reset()
            setEditingText(false)
          }
        }}
        onBlur={async (ev) => {
          if (input !== "") {
            await updateText()
            reset()
            setEditingText(false)
          }
        }}
      />
    )
    return (
      <div>
        <ListItem className={classes.listitem} divider>
          <ListItemIcon className={classes.dragIcon}>
            <IconButton edge="start">
              <DragHandle />
            </IconButton>
          </ListItemIcon>
          <Hidden xsDown>
            {editingText ? (
              <ListItemIcon>
                <IconButton
                  aria-label="finishededit"
                  onClick={async () => {
                    if (input !== "") {
                      await updateText()
                      // ev.preventDefault()
                      reset()
                      setEditingText(false)
                    }
                  }}
                >
                  <DoneIcon />
                </IconButton>
              </ListItemIcon>
            ) : (
              <ListItemIcon>
                <IconButton
                  aria-label="editing"
                  onClick={(e) => {
                    setManualEditInput(item.text)
                    setEditingText(true)
                  }}
                >
                  <Badge badgeContent={item.items.length} color="primary">
                    <EditIcon />
                  </Badge>
                </IconButton>
              </ListItemIcon>
            )}
          </Hidden>
          {editingText ? (
            editingTextField
          ) : (
            <ListItemText primary={item.text} />
          )}
          {!disableSubcheckboxes && (
            <ListItemIcon
              classes={{
                root: classes.listItemIcon,
              }}
            >
              <IconButton
                aria-label="open"
                onClick={() => {
                  setOpen(!open)
                }}
              >
                {open ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </ListItemIcon>
          )}
          <Hidden xsDown>
            <ListItemIcon
              classes={{
                root: classes.listItemIcon,
              }}
            >
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => confirm({ type: "delete", action: deleteItem })}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemIcon>
          </Hidden>
          <DraggableMenu
            editItem={() => {
              setManualEditInput(item.text)
              setEditingText(true)
            }}
            deleteItem={() => confirm({ type: "delete", action: deleteItem })}
          />
        </ListItem>
        {!disableSubcheckboxes && (
          <Collapse in={open} timeout="auto">
            <div className={classes.nested}>
              <DraggableSubCheckboxWrapper
                key={`item=${item.id}`}
                mutateCategory={mutateCategory}
                parent={{
                  id: item.id,
                  info: item.info,
                  idxToDelete: idxToDelete,
                  order_id: item.order_id,
                }}
                fetchUrl={`${fetchUrl}/${item.id}/draggablesubcheckbox`}
                items={item.items}
              />
            </div>
          </Collapse>
        )}
      </div>
    )
  },
)

//Handles the rendering of all Draggable Checkboxes of a category
// passes along mutate function provided by parent category
const SortableCheckboxList = SortableContainer(
  ({
    items,
    mutateCategory,
    fetchUrl,
    disableSubcheckboxes,
    draggableCheckboxMaxlength,
  }) => {
    const [confirm, confirmationDialog] = useConfirmationDialog()
    return (
      <List
        // key={`draggable-checkbox-list${editing}`}
        component="nav"
        aria-labelledby="nested-list-subheader"
        disablePadding
      >
        {items.map((item, i) => (
          <SortableCheckboxItem
            mutateCategory={mutateCategory}
            fetchUrl={fetchUrl}
            disableSubcheckboxes={disableSubcheckboxes}
            draggableCheckboxMaxlength={draggableCheckboxMaxlength}
            key={`item=${item.id}`}
            item={item}
            idxToDelete={i}
            index={i}
            confirm={confirm}
          />
        ))}
        {confirmationDialog}
      </List>
    )
  },
)

export default SortableCheckboxList
