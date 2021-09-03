import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles"
import AutorenewOutlinedIcon from "@material-ui/icons/AutorenewOutlined"
import ErrorOutlineOutlinedIcon from "@material-ui/icons/ErrorOutlineOutlined"
import Alert from "@material-ui/lab/Alert"
import axios from "axios"
import React, { useContext, useEffect, useReducer } from "react"
import useSWR from "swr"
import InspectionContext from "../../Context/InspectionContext"
import createPdf from "../../utils/createPdf"
import PdfFileItem from "../File/PdfFileItem"
import CircularProgressLabeled from "../LoadingComponents/CircularProgressLabeled"

const reducer = (state, action) => {
  switch (action.type) {
    case "setStatus":
      return {
        ...state,
        status: action.status,
      }
    case "loading":
      return {
        ...state,
        loading: true,
      }
    case "notloading":
      return {
        ...state,
        loading: false,
      }
    default:
      return null
  }
}

const useStyles = makeStyles((theme) => ({
  alertIcon: {
    "& .MuiAlert-icon": {
      alignItems: "center",
    },
  },
}))

//tries to fetch pdf file of shareable link, if a file is outdated or nonexistent,
//   it displays 'update pdf' button,
//   if file exists and up to date, it displays the file preview and the same file item functionality
export default function PdfGenerator({
  inspectionId,
  pdfRequest,
  fetchUrl,
  mutateShareableLink,
}) {
  const classes = useStyles()
  const { socket } = useContext(InspectionContext)
  const fetchPdfUrl = `${fetchUrl}/fetchpdf`
  const { data, mutate } = useSWR(fetchPdfUrl, async () => {
    const { data } = await axios.get(fetchPdfUrl)
    // console.log("data", data)
    return data
  })

  const pdfRequestLabel = pdfRequest === "summary" ? "Summary" : "Full Report"
  const [state, dispatch] = useReducer(reducer, {
    status: {
      progress: 0,
      label: "",
    },
    loading: false,
  })
  const cancelTokenSource = axios.CancelToken.source()
  const componentName = `CheckFileExistence${pdfRequest}js`
  useEffect(() => {
    const socketEventname = `${inspectionId}/${componentName}/progress`
    socket.on(socketEventname, (data) => {
      dispatch({ type: "setStatus", status: data })
    })
    return () => {
      socket.off(socketEventname)
      cancelTokenSource.cancel()
    }
  }, [componentName])
  async function generatePdf({ deletePreviousFile }) {
    try {
      dispatch({ type: "loading" })
      const response = await createPdf({
        fetchUrl: `${fetchUrl}/createPdf`,
        pdfRequest,
        componentName,
        ignoreSendBack: true,
        deletePreviousFile,
        cancelTokenSource,
      })
      if (response?.status === 200) {
        //revalidate
        mutate()
        // revalidate shareable link
        mutateShareableLink()
        dispatch({ type: "notloading" })
      } else {
        throw new Error("Could not generate pdf")
      }
    } catch (e) {
      console.log(e)
      dispatch({ type: "notloading" })
    }
  }

  if (!data) {
    //data not fetched
    return null
  } else if (!data.pdf) {
    //pdf not generated
    return (
      <Box>
        <Box m={1}>
          <Alert
            variant="filled"
            className={classes.alertIcon}
            severity="warning"
          >
            No Report Generated
          </Alert>
        </Box>
        <Box p={1} display="flex" alignItems="center" justifyContent="center">
          <Box width="100%">
            <Button
              fullWidth
              disabled={state.loading}
              variant="outlined"
              onClick={async () => {
                await generatePdf({ deletePreviousFile: false })
              }}
              startIcon={<AutorenewOutlinedIcon />}
            >
              Generate {pdfRequestLabel}
            </Button>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="center">
            <CircularProgressLabeled progress={state.status.progress} />
          </Box>
        </Box>
      </Box>
    )
  } else {
    return (
      <>
        <PdfFileItem {...data.pdf} s3ResourceFileType="shareable" />
        {data.pdf.inspection_needing_update || data.pdf.files_need_merge ? (
          <>
            <Box m={1}>
              <Alert
                variant="filled"
                className={classes.alertIcon}
                severity="warning"
              >
                Shared Report is outdated
              </Alert>
            </Box>
            <Box
              p={1}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Box width="100%">
                <Button
                  fullWidth
                  disabled={state.loading}
                  variant="contained"
                  color="secondary"
                  onClick={async () => {
                    await generatePdf({ deletePreviousFile: true })
                  }}
                  startIcon={<ErrorOutlineOutlinedIcon />}
                >
                  Update {pdfRequestLabel}
                </Button>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="center">
                <CircularProgressLabeled progress={state.status.progress} />
              </Box>
            </Box>
          </>
        ) : (
          <Box m={1}>
            <Alert
              variant="filled"
              className={classes.alertIcon}
              severity="success"
            >
              Shared Report is up to date
            </Alert>
          </Box>
        )}
      </>
    )
  }
}
