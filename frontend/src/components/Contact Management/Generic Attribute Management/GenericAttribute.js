import Box from "@material-ui/core/Box"
import Chip from "@material-ui/core/Chip"
import IconButton from "@material-ui/core/IconButton"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined"
import DoneIcon from "@material-ui/icons/Done"
import EditIcon from "@material-ui/icons/Edit"
import RestoreIcon from "@material-ui/icons/Restore"
import React, { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import capitalize from "../../../utils/capitalize"
import useToggle from "../../../Hooks/useToggle"
import ValidatorMachine from "../../InspectionForm/Validation"
import IconMachine from "../../Misc/IconMachine"
import AttributeInputField from "./AttributeInputField"
import useConfirmationDialog from "../../../Hooks/useConfirmationDialog"
import CallDialog from "../../Misc/DialogHOC"
import Button from "@material-ui/core/Button"

const useStyles = makeStyles(() => ({
  chip: {
    display: "inline-flex",
    "vertical-align": "top",
  },
}))

export default function GenericAttribute({
  id,
  value,
  attributeType,
  handleEdit,
  handleRemove,
  viewOnly = false,
}) {
  const classes = useStyles()
  const { errors, control, handleSubmit } = useForm()
  const [confirm, dialog] = useConfirmationDialog()
  const onEditSubmit = async (data) => {
    const attributeValue = data.attributeValue
    if (attributeValue !== "") {
      const attributeId = await handleEdit({
        attributeId: id,
        attributeValue,
      })
      if (attributeId === id) {
        handleClose()
      }
    } else {
    }
  }
  const [editing, setEditing] = useState(false)
  const [callPrompt, setCallPrompt] = useState(false)
  const [showEditOption, toggleEditOption] = useToggle(false)
  const handleClick = () => {
    setEditing(true)
    toggleEditOption()
  }
  const handleClose = () => {
    setEditing(false)
  }
  return (
    <>
      {!editing ? (
        <Box className={classes.chip} p={1}>
          <CallDialog
            fullScreen={false}
            dialogTitle="Call Number?"
            openDialog={callPrompt}
            setOpenDialog={setCallPrompt}
            closeDialogText="Close"
            disableTitleBarClose
            DialogActionsComponent={
              <Box m={1}>
                <Button onClick={() => window.open(`tel:${value}`)}>Yes</Button>
              </Box>
            }
          >
            <Typography align="center" variant="body1" component="h6">
              {value}
            </Typography>
          </CallDialog>
          <Chip
            label={<Typography noWrap>{value}</Typography>}
            clickable={true}
            onClick={() => {
              if (!viewOnly) {
                return toggleEditOption()
              }
              return attributeType === "phone" ? setCallPrompt(true) : null
            }}
            icon={IconMachine(attributeType, "small")}
            variant="outlined"
            // color="primary"
            onDelete={showEditOption ? handleClick : null}
            deleteIcon={showEditOption ? <EditIcon fontSize="small" /> : null}
          />
        </Box>
      ) : (
        <Box display="inline-flex" scroll="auto" alignItems="center" p={1}>
          <Box>
            <form onSubmit={handleSubmit(onEditSubmit)}>
              <Controller
                render={(props) => (
                  <AttributeInputField
                    controllerProps={props}
                    attributeType={attributeType}
                    errors={errors}
                    placeholder={`Edit ${capitalize(attributeType)}`}
                  />
                )}
                name="attributeValue"
                control={control}
                defaultValue={value}
                {...ValidatorMachine("attributeValue", attributeType, errors)}
              />
            </form>
          </Box>
          {!viewOnly && (
            <>
              <Box>
                {!errors.attributeValue ? (
                  <IconButton
                    size="small"
                    aria-label="finishedit"
                    className={classes.margin}
                    onClick={handleSubmit(onEditSubmit)}
                  >
                    <DoneIcon fontSize="small" />
                  </IconButton>
                ) : (
                  <IconButton
                    size="small"
                    aria-label="finishedit"
                    className={classes.margin}
                    onClick={handleClose}
                  >
                    <RestoreIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
              <Box>
                <IconButton
                  size="small"
                  aria-label="delete"
                  onClick={() =>
                    confirm({
                      type: "delete",
                      action: () => handleRemove({ attributeId: id }),
                    })
                  }
                >
                  <DeleteOutlineOutlinedIcon fontSize="small" />
                </IconButton>
              </Box>
              {dialog}
            </>
          )}
        </Box>
      )}
    </>
  )
}
