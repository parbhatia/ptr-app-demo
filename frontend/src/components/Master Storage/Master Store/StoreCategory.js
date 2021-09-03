import AppBar from "@material-ui/core/AppBar"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import { makeStyles, useTheme } from "@material-ui/core/styles"
import Tab from "@material-ui/core/Tab"
import Tabs from "@material-ui/core/Tabs"
import Typography from "@material-ui/core/Typography"
import ClearIcon from "@material-ui/icons/Clear"
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd"
import PropTypes from "prop-types"
import React, { useState } from "react"
import Div100vh from "react-div-100vh"
import useSWR from "swr"
import LinearLoading from "../../LoadingComponents/LinearLoading"
import {
  updateBulkCheckboxHelper,
  updateBulkUNCheckboxHelper,
} from "../../../helpers/masterstore"
import StoreCheckboxList from "./StoreCheckbox"
import useError from "../../../Hooks/useError"
import axios from "axios"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  gridContainer: {
    height: "inherit",
  },
  title: {
    padding: "4px",
  },
  tab: {
    minWidth: 10,
  },
  onlyItems: {
    height: "calc(100% - 70px)",
    overflow: "auto",
    "overflow-y": "auto",
  },
  button: {
    width: "100%",
  },
  inheritMinHeight: {
    height: "inherit",
  },
  tabs: {
    overflow: "visible",
  },
}))

//Renders a single Master Store Category
const StoreCategoryItem = ({ item, draggableCategory, fetchUrl }) => {
  const classes = useStyles()
  const [open, setOpen] = useState(true)
  const localFetchurl = `${fetchUrl}/${item.id}/storecheckbox`
  const { data, mutate } = useSWR(localFetchurl, async () => {
    //get dragagble categories of master store
    const { data } = await axios.get(localFetchurl)
    const itemsWithCheckedParam = data.items.map((item) => ({
      ...item,
      checked: false,
      items: item.items.map((sub) => ({ ...sub, checked: false })),
    }))
    return {
      items: itemsWithCheckedParam,
    }
  })
  const [notify] = useError()

  return (
    <Grid
      container
      direction="column"
      justify="space-between"
      alignItems="stretch"
      className={classes.inheritMinHeight}
    >
      {!data ? (
        <LinearLoading />
      ) : (
        <>
          <Grid className={classes.onlyItems} item>
            <ListItem
              onClick={() => {
                setOpen(!open)
              }}
              divider
            >
              <ListItemText
                primary={
                  <Typography
                    className={classes.title}
                    variant="h4"
                    component="h4"
                  >
                    {item.name}
                  </Typography>
                }
              ></ListItemText>
            </ListItem>

            <StoreCheckboxList
              key={`${item.id}tabpanel`}
              // setData={setData}
              mutateStoreCategory={mutate}
              items={data.items}
            ></StoreCheckboxList>
          </Grid>

          <Grid style={{ position: "sticky" }} item>
            <Box display="flex" justifyContent="center">
              <Box pr={1} width="100%">
                <Button
                  className={classes.button}
                  size="large"
                  variant="outlined"
                  startIcon={<PlaylistAddIcon fontSize="large" />}
                  onClick={async () => {
                    //find items and subitems that are checked
                    const filteredItems = data.items.filter(
                      (ch) => ch.checked && !ch.used,
                    )
                    //only proceed if we have atleast one item checked
                    if (filteredItems.length !== 0) {
                      const filteredItemsAndSubs = filteredItems.map((ch) => ({
                        ...ch,
                        items: ch.items.filter((sub) => sub.checked),
                      }))
                      try {
                        await draggableCategory.bulkInsert(filteredItemsAndSubs)
                        //bulk update my state
                        const numNewItems = await updateBulkCheckboxHelper({
                          bulkData: filteredItemsAndSubs,
                          url: `${localFetchurl}/bulkupdate`,
                          mutate,
                        })
                        notify(`Added ${numNewItems} Items`, "success")
                      } catch (e) {
                        console.log("Unsuccessful Addition!")
                        notify(`Unsuccessful Addition`, "error")
                      }
                    }
                  }}
                >
                  Add
                </Button>
              </Box>
              <Box pl={1} width="100%">
                <Button
                  className={classes.button}
                  size="large"
                  variant="outlined"
                  startIcon={<ClearIcon fontSize="large" />}
                  onClick={async () => {
                    //find items and subitems that are checked
                    const filteredItems = data.items.filter((ch) => ch.used)
                    //only proceed if we have atleast one item checked
                    if (filteredItems.length !== 0) {
                      const filteredItemsAndSubs = filteredItems.map((ch) => ({
                        ...ch,
                        items: ch.items.filter((sub) => sub.used),
                      }))
                      try {
                        //bulk update my state
                        await updateBulkUNCheckboxHelper({
                          bulkData: filteredItemsAndSubs,
                          url: `${localFetchurl}/bulkupdate`,
                          mutate,
                        })
                      } catch (e) {
                        console.log("Unsuccessful Addition!")
                      }
                    }
                  }}
                >
                  Clear
                </Button>
              </Box>
            </Box>
          </Grid>
        </>
      )}
    </Grid>
  )
}

function TabPanel(props) {
  const { children, value, index, ...other } = props
  const theme = useTheme()
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      <Div100vh
        style={{
          height: `calc(100rvh -  ${theme.spacing(1)}px - ${
            theme.mixins.toolbar.minHeight
          }px - ${theme.mixins.toolbar.minHeight}px)`,
        }}
      >
        {value === index && <>{children}</>}
      </Div100vh>
    </Typography>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  }
}

// Is controlled by Draggable Category, but rendered by StoreDisplayWrapper
// Renders all Store Categories in Tabs
// Draggable Category provides a function we can use to add single item, or bulk add to it
// passed in DraggableCategory's id
// parent refers to Local Inspection Store, and is given it's id from Inspection Context by Store Display Wrapper
export default function StoreCategoryList({
  draggableCategory,
  parent,
  inspectionId,
}) {
  const classes = useStyles()
  const [value, setValue] = useState(0)
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  const fetchUrl = `/api/inspection/${inspectionId}/store/${parent.id}/storecategory`
  const { data } = useSWR(fetchUrl, async () => {
    //get store categories of store
    const { data } = await axios.get(fetchUrl)
    return {
      items: data.items,
    }
  })

  return (
    <>
      {!data ? (
        <LinearLoading />
      ) : (
        <div className={classes.root}>
          {/* {console.log("store categories", data)} */}

          <AppBar elevation={0} position="sticky" color="inherit">
            <Tabs
              value={value}
              className={classes.tabs}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="on"
              aria-label="scrollable auto tabs example"
            >
              {data.items.map((category, index) => (
                <Tab
                  wrapped
                  key={category.id}
                  label={category.name}
                  className={classes.tab}
                  {...a11yProps(index)}
                />
              ))}
            </Tabs>
          </AppBar>

          {data.items.map((item, index) => (
            <TabPanel key={index} value={value} index={index}>
              <StoreCategoryItem
                fetchUrl={fetchUrl}
                draggableCategory={draggableCategory}
                item={item}
              ></StoreCategoryItem>
            </TabPanel>
          ))}
        </div>
      )}
    </>
  )
}
