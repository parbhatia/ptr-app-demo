import Box from "@material-ui/core/Box"
import Drawer from "@material-ui/core/Drawer"
import IconButton from "@material-ui/core/IconButton"
import { makeStyles } from "@material-ui/core/styles"
import Tab from "@material-ui/core/Tab"
import Tabs from "@material-ui/core/Tabs"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import CloseIcon from "@material-ui/icons/Close"
import ShareIcon from "@material-ui/icons/Share"
import React, { useContext } from "react"
import InspectionContext from "../../Context/InspectionContext"
import ShareableLinkItem from "./ShareableLinkItem"

const maxWidth = 1000

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    maxWidth: maxWidth,
    width: "100%",
  },
  title: {
    flex: 1,
  },
}))

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  }
}

const ShareableDrawer = ({ open, closeDrawer }) => {
  const classes = useStyles()
  const [tabValue, setTabValue] = React.useState(0)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }
  const {
    inspectionId,
    inspectionInfo: { unique_id },
    shareableLinks,
  } = useContext(InspectionContext)

  return (
    <Drawer
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor={"right"}
      open={open}
      width={maxWidth}
      onClose={closeDrawer}
      // variant="persistent"
    >
      <Toolbar variant="dense" className={classes.toolbar}>
        <Box display="flex" justifyContent="center" mr={1}>
          <ShareIcon fontSize="small" />
        </Box>
        <Typography gutterBottom={false} variant="h6" className={classes.title}>
          Share
        </Typography>
        <IconButton
          edge="start"
          // size="small"
          color="inherit"
          onClick={closeDrawer}
          aria-label="close"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Toolbar>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Summary" {...a11yProps(0)} />
        <Tab label="Full" {...a11yProps(1)} />
      </Tabs>
      {shareableLinks.map((s, i) => (
        <TabPanel key={`shlink-${i}`} value={tabValue} index={i}>
          <ShareableLinkItem
            id={shareableLinks[tabValue].id}
            type={shareableLinks[tabValue].type}
            inspectionUniqueId={unique_id}
            inspectionId={inspectionId}
          />
        </TabPanel>
      ))}
    </Drawer>
  )
}

export default ShareableDrawer
