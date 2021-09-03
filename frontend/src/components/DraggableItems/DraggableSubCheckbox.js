import Grid from "@material-ui/core/Grid"
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
import React, { useState } from "react"
import { SortableContainer, SortableElement } from "react-sortable-hoc"
import useInputHook from "../../Hooks/useInputHook"
import useConfirmationDialog from "../../Hooks/useConfirmationDialog"
import {
  addSubItemHelper,
  deleteSubItemHelper,
  updateSubOrderHelper,
  updateSubTextValueHelper,
} from "../../helpers/CRUDsubitem"
import TextField from "../Misc/ReusableTextField"
import DraggableMenu from "./DraggableMenu"
import DragHandle from "./DragHandle"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
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

//Renders a single Draggable Subcheckbox
const SortableSubCheckboxItem = SortableElement(
  ({ id, text, idxToDelete, parent, mutateCategory, fetchUrl, confirm }) => {
    const { id: checkboxId, idxToDelete: parentIdx, order_id } = parent
    const classes = useStyles()
    const [input, reset, handleInputChange, setManualEditInput] = useInputHook()
    const [editingText, setEditingText] = useState(false)
    const updateSubitemText = () =>
      updateSubTextValueHelper({
        id,
        text: input,
        idx: idxToDelete,
        parent: { id: checkboxId, idx: parentIdx, order_id },
        url: `${fetchUrl}/updatetext`,
        mutate: mutateCategory,
      })
    const deleteSubItem = () =>
      deleteSubItemHelper({
        id,
        idx: idxToDelete,
        parent: { id: checkboxId, idx: parentIdx, order_id },
        url: fetchUrl,
        mutate: mutateCategory,
      })
    const editingTextField = (
      <TextField
        key={`subch${id}`}
        label="Edit Subitem"
        value={input}
        onChange={handleInputChange}
        color="secondary"
        margin="dense"
        size="small"
        multiline
        // inputProps={{ style: { textTransform: "capitalize" } }}
        onKeyPress={async (ev) => {
          if (ev.key === "Enter" && input !== "") {
            ev.preventDefault()
            await updateSubitemText()
            reset()
            setEditingText(false)
          }
        }}
        onBlur={async (ev) => {
          if (input !== "") {
            await updateSubitemText()
            reset()
            setEditingText(false)
          }
        }}
      />
    )
    return (
      <div>
        <ListItem dense className={classes.listitem}>
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
                  onClick={async (ev) => {
                    if (input !== "") {
                      // ev.preventDefault()
                      await updateSubitemText()
                      reset()
                      setEditingText(false)
                    }
                  }}
                >
                  <DoneIcon />
                </IconButton>
              </ListItemIcon>
            ) : (
              <ListItemIcon
                classes={{
                  root: classes.listItemIcon,
                }}
              >
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => {
                    setManualEditInput(text)
                    setEditingText(true)
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </ListItemIcon>
            )}
          </Hidden>
          {editingText ? editingTextField : <ListItemText primary={text} />}
          <DraggableMenu
            editItem={() => {
              setManualEditInput(text)
              setEditingText(true)
            }}
            deleteItem={() =>
              confirm({ type: "delete", action: deleteSubItem })
            }
          ></DraggableMenu>
          <Hidden xsDown>
            <ListItemIcon
              classes={{
                root: classes.listItemIcon,
              }}
            >
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() =>
                  confirm({ type: "delete", action: deleteSubItem })
                }
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </ListItemIcon>
          </Hidden>
        </ListItem>
      </div>
    )
  },
)

//Handles the rendering of all Draggable Subcheckboxes of a checkbox
// passes along mutate function provided by parent category
const SortableSubCheckboxList = SortableContainer(
  ({ items, parent, mutateCategory, fetchUrl }) => {
    const classes = useStyles()
    const [confirm, confirmationDialog] = useConfirmationDialog()
    const [input, reset, handleInputChange] = useInputHook()
    const addSubItem = () =>
      addSubItemHelper({
        text: input,
        url: fetchUrl,
        parent: {
          id: parent.id,
          idx: parent.idxToDelete,
        },
        mutate: mutateCategory,
        reset,
      })
    let renderList = <div />
    //items have been already reordered
    if (items.length !== 0) {
      renderList = (
        <List disablePadding>
          {items.map((item, i) => (
            <SortableSubCheckboxItem
              key={`draggablesubitem=${item.id}${i}`}
              id={item.id}
              text={item.text}
              idxToDelete={i}
              index={i}
              parent={parent}
              fetchUrl={fetchUrl}
              mutateCategory={mutateCategory}
              confirm={confirm}
            ></SortableSubCheckboxItem>
          ))}
          {confirmationDialog}
        </List>
      )
    }

    return (
      <div>
        {renderList}
        <div className={classes.addbutton}>
          <TextField
            id={`addsubcheckbox${parent.id}`}
            value={input}
            label="Add Subitem"
            size="small"
            inputProps={{
              autoCapitalize: "true",
              spellCheck: true,
            }}
            // color="secondary"
            margin="dense"
            onChange={handleInputChange}
            onKeyPress={async (ev) => {
              if (ev.key === "Enter" && input !== "") {
                await addSubItem()
                // ev.preventDefault()
                reset()
              }
            }}
          />
        </div>
      </div>
    )
  },
)

//if category has no checkboxes, this function will render nothing
export default function DraggableSubCheckboxWrapper({
  items,
  parent,
  mutateCategory,
  fetchUrl,
}) {
  const { id, idxToDelete, order_id } = parent
  const onSortEnd = async ({ oldIndex, newIndex }) => {
    updateSubOrderHelper({
      oldIndex,
      newIndex,
      parent: { id, idx: idxToDelete, order_id },
      url: fetchUrl,
      mutate: mutateCategory,
    })
  }

  return (
    <Grid>
      <SortableSubCheckboxList
        items={items}
        mutateCategory={mutateCategory}
        parent={parent}
        useDragHandle
        useWindowAsScrollContainer
        lockToContainerEdges
        axis="y"
        lockAxis="y"
        transitionDuration={0}
        onSortEnd={onSortEnd}
        fetchUrl={fetchUrl}
      ></SortableSubCheckboxList>
    </Grid>
  )
}
