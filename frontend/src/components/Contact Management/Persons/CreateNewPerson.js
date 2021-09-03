import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup"
import { makeStyles } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import PersonAddIcon from "@material-ui/icons/PersonAdd"
import React, { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import useError from "../../../Hooks/useError"
import ValidatorMachine from "../../InspectionForm/Validation"
import CreatePersonDialog from "../../Misc/DialogHOC"
import Typography from "@material-ui/core/Typography"

const useStyles = makeStyles((theme) => ({
  expanded: {},
  content: {
    "&$expanded": {
      marginBottom: 0,
    },
  },
  details: {
    display: "block",
  },
}))

const CreateNewPerson = ({ addPerson }) => {
  const classes = useStyles()
  const [notify] = useError()
  const [personType, setPersonType] = useState("client")
  const [openCreatePersonDialog, setOpenCreatePersonDialog] = useState(false)
  const { control, reset, errors, handleSubmit } = useForm()
  const onSubmit = async (values) => {
    try {
      const person = await addPerson({
        personName: values.personName,
        personType,
      })

      if (person.name === values.personName) {
        notify("Contact Created", "success")
        reset()
        setOpenCreatePersonDialog(false)
      } else {
        throw Error("Unsuccessful")
      }
    } catch (e) {
      console.log(e)
      notify("Contact Creation Unsuccessful!", "error")
    }
  }

  const handleRadioChange = (event) => {
    setPersonType(event.target.value)
  }

  return (
    <>
      <Button
        fullWidth
        size="large"
        variant="outlined"
        startIcon={<PersonAddIcon />}
        onClick={() => setOpenCreatePersonDialog(true)}
      >
        Create New Person
      </Button>
      <CreatePersonDialog
        fullScreen={false}
        dialogTitle="New Person"
        openDialog={openCreatePersonDialog}
        setOpenDialog={setOpenCreatePersonDialog}
        closeDialogText="Discard"
        DialogActionsComponent={
          <Box m={1}>
            <Button
              autoFocus
              className={classes.button}
              type={"submit"}
              onClick={handleSubmit(onSubmit)}
            >
              Create
            </Button>
          </Box>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            render={(props) => {
              const { ref, ...rest } = props
              return (
                <TextField
                  {...rest}
                  inputRef={ref}
                  label="Name"
                  helperText={
                    errors.personName ? errors.personName.message : null
                  }
                  error={errors.personName !== undefined}
                  variant="outlined"
                  fullWidth
                />
              )
            }}
            name="personName"
            control={control}
            defaultValue=""
            {...ValidatorMachine("personName", "name", errors)}
          />
        </form>
        <RadioGroup
          row
          width="100%"
          aria-label="quiz"
          name="quiz"
          value={personType}
          onChange={handleRadioChange}
        >
          <FormControlLabel
            value="client"
            labelPlacement="end"
            control={<Radio />}
            label={<Typography variant="overline">Client</Typography>}
          />
          <FormControlLabel
            value="realtor"
            labelPlacement="end"
            control={<Radio />}
            label={<Typography variant="overline">Realtor</Typography>}
          />
        </RadioGroup>
      </CreatePersonDialog>
    </>
  )
}

export default CreateNewPerson
