import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import { makeStyles, withStyles } from "@material-ui/core/styles"
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined"
import axios from "axios"
import React, { useState } from "react"
import {
  Redirect,
  Route,
  Switch,
  useParams,
  useRouteMatch,
} from "react-router-dom"
import useSWR from "swr"
import useRenderMenuBar from "../../Hooks/useRenderMenuBar"
import InspectionForm from "../InspectionForm/InspectionForm"
import LazyLoading from "../LoadingComponents/LazyLoading"
import PageNotFound from "../Misc/PageNotFound"
import Dialog from "../PDF/Dialog"
import PhotosCategoryManager from "../Photos/CategoryManager"
import ShareableDrawer from "../Share/ShareableDrawer"
import Subsection from "./Subsection"
import SummaryComponent from "./SummaryComponent"

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
))

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  list: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  label: {
    justifyContent: "start",
    paddingLeft: "1rem",
  },
  appbar: {
    "border-bottom": "0",
  },
  contentContainer: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    overflow: "auto",
  },
}))

export default function Page({ inspectionInfo }) {
  const { path, url } = useRouteMatch()
  const { inspectionId } = useParams()
  const [openShare, setOpenShare] = useState(false)
  const fetchUrl = `/api/inspection/${inspectionId}/page`
  const classes = useStyles()
  const [summaryPageId, setSummaryPageId] = useState(null)
  const [pdfPreviewType, setPdfPreviewType] = useState("Summary")
  const [openPreview, setOpenPreview] = useState(false)
  const [loading, setLoading] = useState(true)
  const handleDialogClose = () => {
    setOpenPreview(false)
    handlePdfPreviewClose()
  }

  const { data } = useSWR(fetchUrl, async () => {
    const { data } = await axios.get(fetchUrl)
    const summaryPageId = data.pages.filter((p) => p.name === "Summary")[0].id
    setSummaryPageId(summaryPageId)
    await updateMenuBar({ data, summaryPageId })
    return {
      pages: data.pages,
    }
  })

  const {
    DrawerComponent,
    AppBarComponent,
    setHeaderItems,
    setSideItems,
    setActions,
    anchorElPdfPreview,
    handlePdfPreviewClose,
  } = useRenderMenuBar({
    inspectionId,
    address: inspectionInfo.info.address,
    city: inspectionInfo.info.city,
    postalcode: inspectionInfo.info.postalcode,
    titleMatchPath: "/Inspection/:id/:pageName",
  })

  async function updateMenuBar({ data, summaryPageId }) {
    let newHeaderItems = [
      {
        label: "Summary",
        url: `${url}/Summary/${summaryPageId}`,
        startIcon: "summaryPage",
      },
      {
        label: "Photos",
        url: `${url}/Photos`,
        startIcon: "photos",
      },
      {
        menu: true,
        label: "Share",
        startIcon: "share",
        action: () => setOpenShare(true),
      },
    ]
    let newSideItems = []
    let newInspectionActions = []

    //handle menu stuff
    newInspectionActions.push({
      label: `Edit Inspection`,
      url: `${url}/Edit Inspection`,
      startIcon: "edit",
    })
    newSideItems.push({
      label: `Summary`,
      url: `${url}/Summary/${summaryPageId}`,
      startIcon: "summaryPage",
    })
    data.pages.map(
      (e, index) =>
        e.name !== "Summary" &&
        newSideItems.push({
          label: `${e.name}`,
          url: `${url}/${e.name}/${e.id}`,
          startIcon: "page",
        }),
    )
    //add inspection actions
    newInspectionActions.push({
      label: `Photos`,
      url: `${url}/Photos`,
      startIcon: "photos",
    })
    newInspectionActions.push({
      menu: true,
      label: `Share`,
      startIcon: "share",
      action: () => setOpenShare(true),
    })
    newInspectionActions.push({
      menu: true,
      label: `Preview Summary`,
      startIcon: "preview",
      action: () => {
        setOpenPreview(true)
        setPdfPreviewType("Summary")
      },
    })
    newInspectionActions.push({
      menu: true,
      label: `Preview Full`,
      startIcon: "preview",
      action: () => {
        setOpenPreview(true)
        setPdfPreviewType("Full")
      },
    })

    setHeaderItems(newHeaderItems)
    setSideItems(newSideItems)
    setActions(newInspectionActions)
    setLoading(false)
  }

  return (
    <div className={classes.root}>
      {loading ? (
        <LazyLoading />
      ) : (
        <>
          <StyledMenu
            id="customized-menu"
            anchorEl={anchorElPdfPreview}
            // keepMounted
            open={Boolean(anchorElPdfPreview)}
            onClose={handlePdfPreviewClose}
          >
            <MenuItem
              onClick={() => {
                setOpenPreview(true)
                setPdfPreviewType("Summary")
              }}
            >
              <ListItemIcon>
                <FileCopyOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Summary" />
            </MenuItem>
            <MenuItem
              onClick={() => {
                setOpenPreview(true)
                setPdfPreviewType("Full")
              }}
            >
              <ListItemIcon>
                <FileCopyOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Full Report" />
            </MenuItem>
          </StyledMenu>
          {AppBarComponent}
          {data ? (
            <div className={classes.contentContainer}>
              {DrawerComponent}
              {/* <MenuBar
                headerItems={headerItems}
                sideItems={sideItems}
                globalItems={globalRoutesList}
                actions={inspectionActions}
                inspectionInfoCard={
                  <Box pl={2} pr={2} mt={1}>
                    <Box flexGrow={1}>
                      <Typography variant="body1" component="h6">
                        {inspectionInfo.info.address}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      component="p"
                    >
                      {inspectionInfo.info.city}{" "}
                      {inspectionInfo.info.postalcode}
                    </Typography>
                  </Box>
                }
                titleMatchPath="/Inspection/:id/:pageName"
                updateInspectionStatus={
                  <UpdateInspectionStatus inspectionId={inspectionId} />
                }
                pdfPreviewButton={
                  <Button
                    ref={divRef}
                    size="large"
                    color="inherit"
                    aria-label="open drawer"
                    startIcon={IconMachine("preview")}
                    onClick={handlePdfPreviewClick}
                  >
                    Preview
                  </Button>
                }
              /> */}
              <div className={classes.content}>
                <ShareableDrawer
                  open={openShare}
                  closeDrawer={() => setOpenShare(false)}
                />
                <Switch>
                  <Route
                    exact
                    path={`${path}`}
                    render={() => (
                      <Redirect
                        replace
                        to={`${url}/Summary/${summaryPageId}`}
                      />
                    )}
                  />
                  <Route
                    exact
                    path={`${path}/Summary`}
                    render={() => (
                      <Redirect
                        replace
                        to={`${url}/Summary/${summaryPageId}`}
                      />
                    )}
                  />
                  <Route
                    path={`${path}/Summary/:pageId`}
                    render={() => <SummaryComponent />}
                  />
                  <Route
                    path={`${path}/:pageName/:pageId`}
                    render={() => <Subsection />}
                  />
                  <Route
                    path={`${path}/Edit Inspection`}
                    render={() => (
                      <InspectionForm
                        inspectionId={inspectionId}
                        request={"updateExisting"}
                      />
                    )}
                  />
                  <Route
                    path={`${path}/Photos`}
                    render={() => (
                      <PhotosCategoryManager
                        type="inspection"
                        inspectionId={inspectionId}
                      />
                    )}
                  />
                </Switch>
              </div>
            </div>
          ) : (
            <Route exact path="*" render={() => <PageNotFound />} />
          )}
          <Dialog
            open={openPreview}
            handleDialogClose={handleDialogClose}
            action="create"
            fetchUrl={`/api/inspection/${inspectionId}/createpdf`}
            inspectionId={inspectionId}
            pdfRequest={pdfPreviewType.toLowerCase()}
            pdfName={pdfPreviewType + " Report"}
          />
        </>
      )}
    </div>
  )
}
