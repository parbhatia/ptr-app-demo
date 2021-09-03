import Checkbox from "@material-ui/core/Checkbox"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import { makeStyles } from "@material-ui/core/styles"
import produce from "immer"
import React, { memo } from "react"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  listItemIcon: {
    "min-width": "0",
  },
  nested: {
    paddingLeft: theme.spacing(6),
    border: 0,
    marginBottom: theme.spacing(0.5),
    background: theme.palette.action.hover,
  },
}))

//Renders a single Master Store Checkbox's Subcheckbox
const Item = memo(
  ({ item, i, parentIdx, parentChecked, parentUsed, mutateStoreCategory }) => {
    const classes = useStyles()
    return (
      <ListItem
        className={classes.nested}
        role={undefined}
        dense
        divider
        disabled={!parentChecked || parentUsed}
        onClick={() =>
          mutateStoreCategory(
            (data) =>
              produce(data, (draftState) => {
                draftState.items[parentIdx].items[i].checked =
                  !draftState.items[parentIdx].items[i].checked
              }),
            false,
          )
        }
        button
      >
        <ListItemIcon
          classes={{
            root: classes.listItemIcon,
          }}
        >
          <Checkbox
            edge="start"
            tabIndex={-1}
            disableRipple
            key={item.id}
            onClick={() =>
              mutateStoreCategory(
                (data) =>
                  produce(data, (draftState) => {
                    draftState.items[parentIdx].items[i].checked =
                      !draftState.items[parentIdx].items[i].checked
                  }),
                false,
              )
            }
            checked={item.checked || item.used}
            disabled={!parentChecked || parentUsed || item.used}
            value={item.text}
          />
        </ListItemIcon>
        <ListItemText primary={item.text} />
      </ListItem>
    )
  },
)

//Is called by StoreCheckbox, to render all Master Store Checkbox's Subcheckboxes
//if category has no checkboxes, this function will render nothing
function StoreSubcheckboxList({
  mutateStoreCategory,
  items,
  parentIdx,
  parentChecked,
  parentUsed,
}) {
  return (
    <>
      {items.map((item, i) => (
        <div key={`${item.id}subitem`}>
          <Item
            item={item}
            i={i}
            parentIdx={parentIdx}
            parentChecked={parentChecked}
            parentUsed={parentUsed}
            mutateStoreCategory={mutateStoreCategory}
          />
        </div>
      ))}
    </>
  )
}

export default memo(StoreSubcheckboxList)
