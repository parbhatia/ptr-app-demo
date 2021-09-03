import Badge from "@material-ui/core/Badge"
import Box from "@material-ui/core/Box"
import { green, red } from "@material-ui/core/colors"
import Divider from "@material-ui/core/Divider"
import Paper from "@material-ui/core/Paper"
import { makeStyles } from "@material-ui/core/styles"
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined"
import CreateIcon from "@material-ui/icons/Create"
import CropIcon from "@material-ui/icons/Crop"
import DeleteIcon from "@material-ui/icons/Delete"
import HistoryIcon from "@material-ui/icons/History"
import SaveIcon from "@material-ui/icons/Save"
import StarIcon from "@material-ui/icons/Star"
import TextFieldsIcon from "@material-ui/icons/TextFields"
import ToggleButton from "@material-ui/lab/ToggleButton"
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup"
import React, { useEffect, useState } from "react"

const useStyles = ({ unsaved }) =>
  makeStyles((theme) => ({
    cancelButton: {
      color: unsaved ? red[500] : "inherit",
    },
    saveButton: {
      color: unsaved ? green[500] : "inherit",
    },
    paper: {
      display: "flex",
      flexWrap: "wrap",
      overflow: "auto",
    },
    toggleGroupRoot: {
      width: "100%",
    },
    grouped: {
      margin: theme.spacing(0.5),
      border: "none",
      "&:not(:first-child)": {
        borderRadius: theme.shape.borderRadius,
      },
      "&:first-child": {
        borderRadius: theme.shape.borderRadius,
      },
    },
  }))

const CustomActionsToolbar = ({
  unsaved,
  versionid,
  handler,
  orderingDisabled,
  disableSetCoverphoto,
  type,
}) => {
  const classes = useStyles({ unsaved })()
  const [actionType, setActionType] = useState(null)
  const resetActionType = () => {
    setActionType(null)
  }
  const handleEdit = async (event, type) => {
    if (type === "save") {
      //save previous action
      await handler[actionType].save()
      resetActionType()
    } else if (type === "cancel") {
      //cancel previous action
      await handler[actionType].finish()
      resetActionType()
    } else if (
      type === "deleteVersion" ||
      type === "delete" ||
      type === "setCoverPhoto"
    ) {
      await handler[type].initiate()
      resetActionType()
    } else if (type !== null) {
      //finish previous action
      if (actionType) {
        await handler[actionType].finish()
      }
      //initiate new action
      await handler[type].initiate()
      setActionType(type)
    } else {
      //type is null, meaning we have clicked same button
      await handler[actionType].finish()
      setActionType(type)
    }
  }
  const deleleteVersionAllowed = versionid.length !== 0
  useEffect(() => {
    if (!orderingDisabled && actionType) {
      handler[actionType].finish()
      resetActionType()
    }
  }, [orderingDisabled])

  return (
    <Paper elevation={0} className={classes.paper}>
      <Box flexGrow={1}>
        <ToggleButtonGroup
          classes={{
            grouped: classes.grouped,
            root: classes.toggleGroupRoot,
          }}
          size="small"
          value={actionType}
          exclusive
          onChange={handleEdit}
          aria-label="choose action"
        >
          <ToggleButton value="marker" aria-label="edit">
            <CreateIcon />
          </ToggleButton>
          <ToggleButton value="crop" aria-label="crop">
            <CropIcon />
          </ToggleButton>
          <ToggleButton value="caption" aria-label="caption">
            <TextFieldsIcon />
          </ToggleButton>
          <ToggleButton
            disabled={!deleleteVersionAllowed}
            value="deleteVersion"
            aria-label="deleteversion"
          >
            <Badge color="secondary" badgeContent={versionid.length}>
              <HistoryIcon />
            </Badge>
          </ToggleButton>
          <ToggleButton value="delete" aria-label="delete">
            <DeleteIcon className={classes.cancelButton} />
          </ToggleButton>
          {type === "default" && !disableSetCoverphoto && (
            <ToggleButton value="setCoverPhoto" aria-label="setCoverPhoto">
              <StarIcon />
            </ToggleButton>
          )}
        </ToggleButtonGroup>
      </Box>
      <Divider flexItem orientation="vertical" className={classes.divider} />
      <Box>
        <ToggleButtonGroup
          classes={{
            grouped: classes.grouped,
            root: classes.toggleGroupRoot,
          }}
          size="small"
          value={actionType}
          exclusive
          onChange={handleEdit}
          aria-label="choose action"
        >
          <ToggleButton
            className={classes.saveButton}
            disabled={actionType === null}
            value="save"
            aria-label="save"
          >
            <SaveIcon className={classes.saveButton} />
          </ToggleButton>
          <ToggleButton
            disabled={actionType === null}
            value="cancel"
            aria-label="cancel"
          >
            <CancelOutlinedIcon className={classes.cancelButton} />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Paper>
  )
}

export default CustomActionsToolbar
