import Box from "@material-ui/core/Box"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import IconButton from "@material-ui/core/IconButton"
import { makeStyles, useTheme } from "@material-ui/core/styles"
import GetAppIcon from "@material-ui/icons/GetApp"
import axios from "axios"
import saveAs from "file-saver"
import PropTypes from "prop-types"
import React, { useContext, useEffect, useReducer } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import InspectionContext from "../../Context/InspectionContext"
import createPdf from "../../utils/createPdf"
import fetchPdf from "../../utils/fetchPdf"
import LinearProgressLabelled from "../LoadingComponents/LinearProgressLabeled"
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

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
    case "gettingPdf":
      return {
        ...state,
        loading: true,
      }
    case "pdfGenerated":
      return {
        ...state,
        pdf: action.pdf,
        loading: false,
        generated: true,
      }
    case "initiatePageNumbering":
      return {
        ...state,
        numPages: action.numPages,
      }
    case "resetState":
      return action.state
    default:
      throw new Error("Unexpected action")
  }
}

const initialState = {
  pdf: null,
  numPages: 1,
  pageNumber: 1,
  generated: false,
  loading: false,
  status: {
    progress: 0,
    label: "",
  },
}

//receives pdfRequest prop, which is either "full" or "summary"
//receives action prop, which is either "create" or "fetch"
export default function PDFPreview({
  action,
  fetchUrl,
  pdfName,
  pdfRequest,
  inspectionId,
  userWidth,
  userChoice,
  windowHeight,
  dialogActions,
}) {
  const classes = useStyles()
  const theme = useTheme()
  const { socket } = useContext(InspectionContext)
  const cancelTokenSource = axios.CancelToken.source()
  const [state, dispatch] = useReducer(reducer, initialState)
  const componentName = `PDF${pdfRequest}js`

  useEffect(() => {
    //only establish socket connection if we're creating pdf
    const socketEventname = `${inspectionId}/${componentName}/progress`
    if (action === "create") {
      if (!state.pdf) {
        handleCreatePdf()
      }
      socket.on(socketEventname, (data) => {
        dispatch({ type: "setStatus", status: data })
      })
    } else {
      handleFetchPdf()
    }
    return () => {
      if (action === "create") {
        socket.off(socketEventname)
      }
      //abort any axios requests (any in progress pipes)
      cancelTokenSource.cancel()
    }
  }, [])

  function onDocumentLoadSuccess({ numPages }) {
    dispatch({ type: "initiatePageNumbering", numPages: numPages })
  }

  async function handleCreatePdf() {
    try {
      dispatch({ type: "gettingPdf" })

      //convert pdfFile to BLOB
      const PDFBlob = await createPdf({
        fetchUrl,
        pdfRequest,
        inspectionId,
        componentName,
        ignoreSendBack: false,
        cancelTokenSource,
      })

      dispatch({
        type: "pdfGenerated",
        pdf: PDFBlob,
      })
    } catch (e) {
      console.log("error generating pdf", e)
    }
  }

  async function handleFetchPdf() {
    try {
      dispatch({ type: "gettingPdf" })
      //convert pdfFile to BLOB

      const PDFBlob = await fetchPdf({
        fetchUrl,
        cancelTokenSource,
      })

      dispatch({
        type: "pdfGenerated",
        pdf: PDFBlob,
      })
    } catch (e) {
      console.log("Error generating pdf", e)
      dispatch({ type: "resetState", state: initialState })
    }
  }

  return (
    <>
      <DialogContent className={classes.dialogContent}>
        <Box>
          <LinearProgressLabelled
            label={state.status.label}
            progress={state.status.progress}
          />
          <Document
            file={state.pdf}
            className={userChoice === "carousel" ? "pdf_document_carousel" : ""}
            noData={null}
            loading={null}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            {Array.from(new Array(state.numPages), (el, index) => (
              <React.Fragment key={`page_${index + 1}`}>
                <Page
                  loading={""}
                  renderTextLayer={false}
                  className="pdf_page"
                  width={userChoice !== "carousel" ? userWidth - 15 : null}
                  height={
                    userChoice !== "carousel"
                      ? null
                      : windowHeight - theme.spacing(18)
                  }
                  pageNumber={index + 1}
                  renderAnnotationLayer={false}
                />
              </React.Fragment>
            ))}
          </Document>
        </Box>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        {dialogActions}
        <Box mr={1}>
          <IconButton
            color="inherit"
            size="small"
            onClick={() => saveAs(state.pdf, `${pdfName}.pdf`)}
            aria-label="close"
          >
            <GetAppIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogActions>
    </>
  )
}

PDFPreview.propTypes = {
  action: PropTypes.oneOf(["create", "fetch"]),
}
