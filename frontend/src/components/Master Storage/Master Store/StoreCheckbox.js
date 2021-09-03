import Checkbox from "@material-ui/core/Checkbox"
import Grid from "@material-ui/core/Grid"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import { makeStyles } from "@material-ui/core/styles"
import produce from "immer"
import React, { memo } from "react"
import StoreSubcheckboxList from "./StoreSubcheckbox"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  nested: {
    paddingLeft: theme.spacing(7),
  },
  listItemIcon: {
    "min-width": "0",
  },
  button: {
    margin: theme.spacing(1),
  },
  deleteicon: {
    color: "black",
  },
  clearicon: {
    color: "black",
  },
  listitem: {
    border: 0,
    marginBottom: theme.spacing(0.5),
    background: theme.palette.action.hover,
  },
}))

//Renders a single Master Store Category's Checkbox
const Item = memo(
  ({ item, mutateStoreCategory, i }) => {
    const classes = useStyles()
    return (
      <ListItem
        dense
        className={classes.listitem}
        role={undefined}
        button
        divider
        disabled={item.used}
        onClick={() => {
          mutateStoreCategory(
            (data) =>
              produce(data, (draftState) => {
                if (draftState.items[i].checked) {
                  //uncheck all subitems
                  draftState.items[i].items = draftState.items[i].items.map(
                    (sub) => ({
                      ...sub,
                      checked: false,
                    }),
                  )
                }
                draftState.items[i].checked = !draftState.items[i].checked
              }),
            false,
          )
        }}
      >
        <ListItemIcon
          classes={{
            root: classes.listItemIcon,
          }}
        >
          <Checkbox
            edge="start"
            checked={item.checked || item.used}
            tabIndex={-1}
            disableRipple
            disabled={item.used}
            value={item.text}
            onClick={() => {
              mutateStoreCategory(
                (data) =>
                  produce(data, (draftState) => {
                    if (draftState.items[i].checked) {
                      //uncheck all subitems
                      draftState.items[i].items = draftState.items[i].items.map(
                        (sub) => ({
                          ...sub,
                          checked: false,
                        }),
                      )
                    }
                    draftState.items[i].checked = !draftState.items[i].checked
                  }),
                false,
              )
            }}
          />
        </ListItemIcon>
        <ListItemText primary={item.text} />
      </ListItem>
    )
  },
  (p, n) =>
    p.item.checked === n.item.checked &&
    p.item.saved === n.item.saved &&
    p.item.used === n.item.used,
)

//Is called by StoreCategory to render all of Master Store Category Checkboxes, as well as each Checkbox's Subcheckboxes
function StoreCheckboxList({ items, mutateStoreCategory }) {
  return (
    <Grid>
      <List disablePadding>
        {items.map((item, i) => (
          <div key={`${item.id}stch`}>
            {/* {console.log(item)} */}
            <Item item={item} mutateStoreCategory={mutateStoreCategory} i={i} />
            {item.items.length > 0 && (
              <List disablePadding>
                <StoreSubcheckboxList
                  // setData={setData}
                  mutateStoreCategory={mutateStoreCategory}
                  items={item.items}
                  parentIdx={i}
                  parentChecked={item.checked}
                  parentUsed={item.used}
                ></StoreSubcheckboxList>
              </List>
            )}
          </div>
        ))}
      </List>
    </Grid>
  )
}

export default memo(StoreCheckboxList)
