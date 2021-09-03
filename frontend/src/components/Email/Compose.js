import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import Icon from "@material-ui/core/Icon"
import { makeStyles } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import axios from "axios"
import React, { useState, useContext, useEffect, useReducer } from "react"
import { Controller, useForm } from "react-hook-form"
import useSWR from "swr"
import { useAuthDataContext } from "../Auth/AuthDataProvider"
import PeopleAndEmails from "../Contact Management/PeopleAndEmails"
import InspectionPersonManager from "../Contact Management/Persons/InspectionPersonManager"
import InspectionContext from "../../Context/InspectionContext"
import useError from "../../Hooks/useError"
import LinearProgressLabelled from "../LoadingComponents/LinearProgressLabeled"
import ShareableLinkUrl from "../Share/ShareableLinkUrl"
import StyledContainer from "../StyledContainers/StyledContainer"

const useStyles = makeStyles((theme) => ({
  dialogActions: {
    padding: 0,
  },
  dialogContent: {
    padding: 0,
  },
}))

const reducer = (state, action) => {
  switch (action.type) {
    case "setStatus":
      return {
        ...state,
        status: action.status,
      }
    default:
      return null
  }
}

// - handles logic for merging pdf
export default function Compose({ shareableUrl, fetchUrl, handleClose }) {
  const classes = useStyles()
  const { user } = useAuthDataContext()
  const [sending, setSending] = useState(false)
  const { inspectionId, inspectionInfo, socket } = useContext(InspectionContext)
  const [state, dispatch] = useReducer(reducer, {
    status: {
      progress: 0,
      label: "",
    },
  })
  //lazy fetching, child components will only fetch on open
  const { data: personsAndEmailsData } = useSWR(
    `/api/inspection/${inspectionId}/people/getPersonsAndEmails`,
  )
  const defaultValues = {
    shareableUrl,
    message: "",
    subject: "",
    to: [],
  }
  const { control, reset, errors, handleSubmit } = useForm({
    defaultValues,
    mode: "onBlur",
    shouldUnregister: false,
  })
  useEffect(() => {
    const socketEventname = `${inspectionId}/email/progress`
    socket.on(socketEventname, (data) => {
      dispatch({ type: "setStatus", status: data })
    })
    return () => {
      socket.off(socketEventname)
    }
  }, [])

  //autogenerate subject based on inspection address
  const autogenerateEmailField = async () => {
    const { data } = await axios.post("/api/subject", {
      // pdfRequest: inspectionType,
      address: inspectionInfo.info.address,
    })
    const { subject, message } = data
    // reset form with defaultValues, but replace subject field with retrieved subject
    reset({
      ...defaultValues,
      subject,
      message,
    })
  }

  useEffect(() => {
    autogenerateEmailField()
  }, [])

  const [notify] = useError()
  const onSubmit = async (values) => {
    setSending(true)
    try {
      //send pdfInfo and emailInfo in a bundle
      const dataBundle = {
        userInfo: {
          ...user,
        },
        emailInfo: { ...values },
      }
      // console.log(dataBundle)
      const response = await axios.post(`${fetchUrl}/sendemail`, {
        ...dataBundle,
      })
      if (response.status === 200) {
        notify("Email Sent!", "success")
        handleClose()
      } else {
        throw Error("Unsuccessful")
      }
    } catch (e) {
      console.log(e)
      notify("Email Unsuccessful!", "error")
      setSending(false)
    }
  }
  if (!personsAndEmailsData) {
    return null
  }
  return (
    <>
      <DialogContent className={classes.dialogContent}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <StyledContainer>
            <ShareableLinkUrl shareableUrl={shareableUrl} allowCopy={false} />
            <Box width="100%">
              <InspectionPersonManager
                fetchUrl={`/api/inspection/${inspectionId}/people`}
                inspectionId={inspectionId}
                displayAttributes
              />
            </Box>
            <Box mt={2}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box p={1}>
                  <PeopleAndEmails
                    personsAndEmailsData={personsAndEmailsData}
                    inspectionId={inspectionId}
                    control={control}
                    errors={errors}
                    fieldName="to"
                    required
                  />
                </Box>
                <Box p={1}>
                  <Controller
                    render={(props) => {
                      const { ref, ...rest } = props
                      return (
                        <TextField
                          {...rest}
                          inputRef={ref}
                          // placeholder="Subject"
                          label="Subject"
                          helperText={
                            errors.subject ? errors.subject.message : null
                          }
                          error={errors.subject !== undefined}
                          variant="outlined"
                          fullWidth
                        />
                      )
                    }}
                    name="subject"
                    control={control}
                    rules={{
                      required: "Required Field",
                      minLength: {
                        value: 10,
                        message: "Subject is too small",
                      },
                    }}
                  />
                </Box>
                <Box p={1}>
                  <Controller
                    render={(props) => {
                      const { ref, ...rest } = props
                      return (
                        <TextField
                          {...rest}
                          inputRef={ref}
                          // placeholder="Message"
                          label="Message"
                          multiline
                          helperText={
                            errors.message ? errors.message.message : null
                          }
                          error={errors.message !== undefined}
                          variant="outlined"
                          fullWidth
                        />
                      )
                    }}
                    name="message"
                    control={control}
                    rules={{
                      minLength: {
                        value: 20,
                        message: "Message is too small",
                      },
                    }}
                  />
                </Box>
              </form>
            </Box>
          </StyledContainer>
        </Box>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Box
          width="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          p={1}
        >
          <Box flexGrow={1}>
            <LinearProgressLabelled
              label={state.status.label}
              progress={state.status.progress}
            />
          </Box>
          <Box m={1}>
            <Button
              autoFocus
              disabled={sending}
              className={classes.button}
              endIcon={<Icon>send</Icon>}
              color="inherit"
              variant="outlined"
              type={"submit"}
              onClick={handleSubmit(onSubmit)}
            >
              Send
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </>
  )
}
