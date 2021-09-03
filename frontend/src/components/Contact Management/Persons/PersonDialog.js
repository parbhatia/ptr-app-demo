import Avatar from "@material-ui/core/Avatar"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import ButtonBase from "@material-ui/core/ButtonBase"
import IconButton from "@material-ui/core/IconButton"
import { makeStyles } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import DoneIcon from "@material-ui/icons/Done"
import EditIcon from "@material-ui/icons/Edit"
import RestoreIcon from "@material-ui/icons/Restore"
import React, { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import useToggle from "../../../Hooks/useToggle"
import ValidatorMachine from "../../InspectionForm/Validation"
import StyledPaper from "../../StyledContainers/StyledPaper"
import AttributeManager from "../Generic Attribute Management/Manager"
import EditPersonDialog from "../../Misc/DialogHOC"

const useStyles = makeStyles((theme) => ({
  paper: {
    background: theme.palette.action.hover,
  },
  nameButton: {
    "&:hover": {
      background: theme.palette.primary.main,
    },
  },
}))

export default function PersonDialog({
  id,
  name,
  handleRemove,
  handleEdit,
  openDialog,

  setOpenDialog,
}) {
  const handleClose = () => {
    setOpenDialog(false)
  }
  const classes = useStyles()
  const { errors, control, handleSubmit } = useForm()
  const onEditSubmit = async (data) => {
    await handleEdit({ personId: id, personName: data.personName })
    handleCloseEdit()
  }
  const [editing, setEditing] = useState(false)
  const [showEditOption, toggleEditOption] = useToggle(false)
  const handleClick = () => {
    setEditing(true)
    toggleEditOption()
  }
  const handleCloseEdit = () => {
    setEditing(false)
  }
  return (
    <EditPersonDialog
      fullScreen={false}
      dialogTitle="Edit Person"
      openDialog={openDialog}
      setOpenDialog={setOpenDialog}
      closeDialogText="Discard"
      disableDefaultAction
      DialogActionsComponent={
        <Box m={1}>
          {handleRemove && (
            <Button
              onClick={() => handleRemove({ personId: id })}
              color="secondary"
              disableRipple
            >
              Remove From Inspection
            </Button>
          )}
          <Button onClick={handleClose}>Done</Button>
        </Box>
      }
    >
      <StyledPaper className={classes.paper}>
        <Box pb={0} display="flex" alignItems="center">
          <Box flexGrow={1} flexDirection="column">
            <Box display="flex" alignItems="center">
              <Box p={1}>
                <Avatar>{name.charAt(0).toUpperCase()}</Avatar>
              </Box>
              {!editing ? (
                <ButtonBase
                  disableRipple
                  disableTouchRipple
                  onClick={() => toggleEditOption()}
                >
                  <Box className={classes.nameButton} borderRadius={15} p={1}>
                    <Typography>{name}</Typography>
                  </Box>
                </ButtonBase>
              ) : (
                <Box display="flex" alignItems="center" p={1}>
                  <Box>
                    <form onSubmit={handleSubmit(onEditSubmit)}>
                      <Controller
                        render={(props) => {
                          const { ref, ...rest } = props
                          return (
                            <TextField
                              {...rest}
                              inputRef={ref}
                              placeholder="Person"
                              size="small"
                              helperText={
                                errors.personName
                                  ? errors.personName.message
                                  : null
                              }
                              error={errors.personName !== undefined}
                              fullWidth
                            />
                          )
                        }}
                        name="personName"
                        label="Name"
                        control={control}
                        defaultValue={name}
                        {...ValidatorMachine(
                          "personName",
                          "requiredAlphabetic",
                          errors,
                        )}
                      />
                    </form>
                  </Box>
                  {!errors.personName ? (
                    <Box>
                      <IconButton
                        size="small"
                        aria-label="finishedit"
                        onClick={handleSubmit(onEditSubmit)}
                      >
                        <DoneIcon />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box>
                      <IconButton
                        size="small"
                        aria-label="finishedit"
                        onClick={handleCloseEdit}
                      >
                        <RestoreIcon />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              )}
              {showEditOption ? (
                <Box p={1}>
                  <IconButton
                    size="small"
                    aria-label="edit"
                    className={classes.margin}
                    onClick={handleClick}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>
              ) : null}
            </Box>
          </Box>
        </Box>
        <Box overflow="auto">
          <AttributeManager personId={id} attributeType="email" />
        </Box>
        <Box overflow="auto">
          <AttributeManager personId={id} attributeType="phone" />
        </Box>
      </StyledPaper>
    </EditPersonDialog>
  )
}
