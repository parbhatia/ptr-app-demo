import AppBar from "@material-ui/core/AppBar"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import IconButton from "@material-ui/core/IconButton"
import Paper from "@material-ui/core/Paper"
import Slide from "@material-ui/core/Slide"
import Step from "@material-ui/core/Step"
import StepContent from "@material-ui/core/StepContent"
import StepLabel from "@material-ui/core/StepLabel"
import Stepper from "@material-ui/core/Stepper"
import { makeStyles } from "@material-ui/core/styles"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import CloseIcon from "@material-ui/icons/Close"
import React, { useState } from "react"
import InspectionPersonManager from "../Contact Management/Persons/InspectionPersonManager"
import InspectionTemplatePicker from "./InspectionTemplatePicker"
import { useForm } from "react-hook-form"
import ReusableForm from "./ReusableForm"
import axios from "axios"
import { mutate as mutateGlobal } from "swr"

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  stepper: {
    padding: 0,
  },
}))

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

async function onInspectionSubmit({
  values,
  pageStoreId,
  notify,
  setNewInspectionId,
  nextStep,
}) {
  try {
    const { data } = await axios.post("/api/inspection", {
      pageStoreId,
      ...values,
    })
    const inspectionData = { ...data }
    setNewInspectionId(inspectionData.id)
    nextStep()
    notify("Inspection Created", "success")
  } catch (e) {
    console.log(e)
    notify("Could Not Create Inspection", "error")
  }
}

//Receives open, close dialog handlers
const CreateNewInspection = ({
  open,
  handleClose,
  notify,
  mutateInspections,
}) => {
  const classes = useStyles()
  const scroll = "paper"

  const [activeStep, setActiveStep] = React.useState(0)
  const steps = [
    "Select Inspection Template",
    "Add Inspection Details",
    "Add Contacts",
  ]
  const handleNext = async () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }
  const handleReset = () => {
    setActiveStep(0)
  }

  const closeDialog = () => {
    mutateInspections()
    mutateGlobal("/api/overview")
    handleReset()
    handleClose()
  }

  //control form
  const { control, errors, handleSubmit } = useForm({
    defaultValues: {},
  })

  const [selectedTemplateId, setSelectedTemplateId] = useState(null)
  const [newInspectionId, setNewInspectionId] = useState(null)

  const onSubmit = async (data) => {
    await onInspectionSubmit({
      values: data,
      pageStoreId: selectedTemplateId,
      notify,
      setNewInspectionId,
      nextStep: handleNext,
    })
  }

  function stepActionInfo(step) {
    switch (step) {
      case 0:
        return {
          next: handleNext,
          backDisabled: true,
          label: "Next",
        }
      case 1:
        return {
          next: handleSubmit(onSubmit),
          backDisabled: false,
          label: "Create Inspection",
        }
      case 2:
        return {
          next: closeDialog,
          backDisabled: true,
          label: "Finish",
        }
      default:
        return null
    }
  }

  const stepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <InspectionTemplatePicker
            nextStep={handleNext}
            selectedTemplateId={selectedTemplateId}
            setSelectedTemplateId={setSelectedTemplateId}
          />
        )
      case 1:
        return (
          <ReusableForm
            formControl={{
              control,
              errors,
              handleSubmit,
            }}
          />
        )
      case 2:
        return (
          <>
            {!newInspectionId ? null : (
              <Box p={1}>
                <InspectionPersonManager
                  fetchUrl={`/api/inspection/${newInspectionId}/people`}
                  inspectionId={newInspectionId}
                  displayAttributes
                />
              </Box>
            )}
          </>
        )
      default:
        return null
    }
  }

  return (
    <Dialog
      fullScreen
      scroll={scroll}
      open={open}
      onClose={closeDialog}
      TransitionComponent={Transition}
    >
      <AppBar elevation={0} color="inherit" className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={closeDialog}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography
            gutterBottom={false}
            variant="h6"
            className={classes.title}
          >
            Create Inspection
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogContent dividers={scroll === "paper"}>
        <Stepper
          className={classes.stepper}
          activeStep={activeStep}
          orientation="vertical"
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                <div className={classes.actionsContainer}>
                  <div>{stepContent(index)}</div>
                </div>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} className={classes.resetContainer}>
            <Typography>All steps completed - you&apos;re finished</Typography>
            <Button onClick={handleReset} className={classes.button}>
              Reset
            </Button>
          </Paper>
        )}
      </DialogContent>
      <DialogActions>
        {!stepActionInfo(activeStep).backDisabled && (
          <Button
            autoFocus
            color="inherit"
            variant="outlined"
            type={"submit"}
            onClick={handleBack}
          >
            Back
          </Button>
        )}
        <Button
          autoFocus
          color="inherit"
          variant="outlined"
          type={"submit"}
          onClick={async () => await stepActionInfo(activeStep).next()}
        >
          {stepActionInfo(activeStep).label}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateNewInspection
