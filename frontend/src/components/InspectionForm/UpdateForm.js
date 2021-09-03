import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import SaveIcon from "@material-ui/icons/Save"
import axios from "axios"
import React, { useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import InspectionPersonManager from "../Contact Management/Persons/InspectionPersonManager"
import InspectionContext from "../../Context/InspectionContext"
import UpdateInspectionStatus from "../Inspection/UpdateInspectionStatus"
import StyledContainer from "../StyledContainers/StyledContainer"
import ReusableForm from "./ReusableForm"
async function onInspectionUpdate({
  setInspectionInfo,
  values,
  inspectionId,
  notify,
}) {
  try {
    const { data } = await axios.patch(`/api/inspection/${inspectionId}`, {
      info: values,
      inspectionId: inspectionId,
    })
    //data is an info object, so use spread operator to override info key
    setInspectionInfo((oldInfo) => ({ ...oldInfo, ...data }))

    notify("Inspection Updated", "success")
  } catch (e) {
    notify("Could Not Update Inspection", "error")
  }
}

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}))

const UpdateForm = ({ inspectionId, notify }) => {
  const classes = useStyles()
  const {
    inspectionInfo: { info },
    setInspectionInfo,
  } = useContext(InspectionContext)

  const { control, errors, handleSubmit, formState, reset } = useForm({
    defaultValues: info,
    mode: "onChange",
  })

  //reset dirty fields
  useEffect(() => {
    reset(info, {
      dirtyFields: false, // dirtyFields will be reset
      errors: true, // anything with true will not be reset
      dirty: true,
      isSubmitted: true,
      touched: true,
      isValid: true,
      submitCount: true,
    })
  }, [info])

  //This onsubmit updates existing Inspection
  const onSubmit = async (data) => {
    await onInspectionUpdate({
      setInspectionInfo,
      values: { ...info, ...data },
      inspectionId,
      notify,
    })
  }
  const dirtyFields = formState.dirtyFields
  const clean =
    Object.keys(dirtyFields).length === 0 && dirtyFields.constructor === Object

  return (
    <StyledContainer>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        m={1}
        bgcolor="background.paper"
      >
        <Box
          alignItems="center"
          justifyContent="center"
          display="flex"
          width="100%"
        >
          <Box pl={1} flexGrow={1}>
            <Typography variant="h6" gutterBottom>
              Property Information
            </Typography>
          </Box>

          <Box pb={1}>
            <Button
              size="large"
              autoFocus
              variant="outlined"
              disabled={clean}
              className={classes.button}
              onClick={handleSubmit(onSubmit)}
              startIcon={<SaveIcon />}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
        <Box width="100%">
          <ReusableForm
            inspectionId={inspectionId}
            formControl={{
              control,
              errors,
              handleSubmit,
            }}
          />
        </Box>
        <Box width="100%">
          <InspectionPersonManager
            fetchUrl={`/api/inspection/${inspectionId}/people`}
            inspectionId={inspectionId}
            displayAttributes
          />
        </Box>
        <Box width="100%" mt={2} display="flex" flexWrap="wrap">
          <Box pl={1} flexGrow={1}>
            <Typography variant="h6" gutterBottom>
              Inspection Progress
            </Typography>
          </Box>
          <Box display="flex" alignSelf="center">
            <UpdateInspectionStatus inspectionId={inspectionId} />
          </Box>
        </Box>
      </Box>
    </StyledContainer>
  )
}

export default UpdateForm
