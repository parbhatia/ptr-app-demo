import Hidden from "@material-ui/core/Hidden"
import IconButton from "@material-ui/core/IconButton"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import ListItemText from "@material-ui/core/ListItemText"

const useStyles = makeStyles((theme) => ({
  listItemIcon: {
    "min-width": "0",
  },
  iconButton: {
    padding: "5px",
  },
}))

export default function DraggableMenu({ editItem, deleteItem, hidden = true }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const classes = useStyles()
  return (
    <Hidden smUp={hidden}>
      <ListItemIcon
        classes={{
          root: classes.listItemIcon,
        }}
      >
        <IconButton
          classes={{
            root: classes.iconButton,
          }}
          // edge="end"
          aria-label="openmenu"
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
      </ListItemIcon>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={async () => {
            editItem()
            handleClose()
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Edit" />
        </MenuItem>
        <MenuItem
          onClick={async () => {
            //we must first set DraggableMenu state as Null, since
            //   a deleteItem will unmount this DraggableMenu immediately
            //  thus, first set state, then proceed with getting yourself deleted
            await handleClose()
            await deleteItem()
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
      </Menu>
    </Hidden>
  )
}
