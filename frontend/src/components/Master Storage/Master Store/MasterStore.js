import AppBar from "@material-ui/core/AppBar"
import Box from "@material-ui/core/Box"
import Grid from "@material-ui/core/Grid"
import List from "@material-ui/core/List"
import { makeStyles, useTheme } from "@material-ui/core/styles"
import Tab from "@material-ui/core/Tab"
import Tabs from "@material-ui/core/Tabs"
import axios from "axios"
import React from "react"
import Div100vh from "react-div-100vh"
import { Link, Route, Switch, useRouteMatch } from "react-router-dom"
import { SortableContainer } from "react-sortable-hoc"
import useSWR from "swr"
import DraggableCategory from "../../DraggableItems/DraggableCategory"
import useInputHook from "../../../Hooks/useInputHook"
import LinearLoading from "../../LoadingComponents/LinearLoading"
import TextField from "../../Misc/ReusableTextField"
import PageTransition from "../../Motion/PageTransition"
import PageNotFound from "../../Misc/PageNotFound"
import { AbstractSortableItem } from "../Master Page Store/AbstractSortableComponents"
import {
  addItemHelper,
  deleteItemHelper,
  updateNameValueHelper,
  updateOrderHelper,
} from "../../../helpers/CRUDitem"
import useConfirmationDialog from "../../../Hooks/useConfirmationDialog"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    position: "relative",
  },
  fullHeight: {
    "min-height": "inherit",
  },
  inheritMinHeight: {
    "min-height": "inherit",
  },
}))

function FullHeight({ children }) {
  const classes = useStyles()
  const theme = useTheme()
  return (
    <Div100vh
      style={{
        minHeight: `calc(100rvh -  ${theme.spacing(5)}px - ${
          theme.mixins.toolbar.minHeight
        }px - ${theme.mixins.toolbar.minHeight}px)`,
      }}
    >
      <Box className={classes.inheritMinHeight} p={2}>
        {children}
      </Box>
    </Div100vh>
  )
}

const SortableCategoryList = SortableContainer(
  ({ items, deleteItem, updateTextValue }) => {
    const classes = useStyles()
    const [confirm, confirmationDialog] = useConfirmationDialog()
    return (
      <div>
        <Grid
          container
          direction="column"
          justify="space-between"
          alignItems="stretch"
          className={classes.fullHeight}
        >
          <List>
            {items.map((item, idx) => (
              <AbstractSortableItem
                key={`sortablecategorylistitem-${item.id}${idx}`}
                idxToDelete={idx}
                item={item}
                index={idx}
                deleteItem={(props) => {
                  confirm({ type: "delete", action: deleteItem, props: props })
                }}
                updateTextValue={updateTextValue}
                disabled={false}
                defaultEditing={true}
              />
            ))}
          </List>
          {confirmationDialog}
        </Grid>
      </div>
    )
  },
)

// Handles the storage of Master Store Items. Gives ability to add/remove/edit/drag checkboxes/subcheckboxes of a store
//  It re-uses Draggable Category/Checkbox/Subcheckbox components for code reuse
//  Receives all draggable categories of master store, and renders them in different tabs
//  Tells DraggableCategory to not render store local to Inspection, since inspection has no context to Master Store
export default function MasterStore({ parent }) {
  const classes = useStyles()
  const { path, url } = useRouteMatch()
  // const [value, setValue] = useState(0);
  const matchedDragCategories = useRouteMatch(
    `${path}/:draggableCategoryName/:draggableCategoryId`,
  )
  const matchedEditTab = useRouteMatch(path)
  //controlled tab value
  let tabValue = null
  if (matchedDragCategories?.isExact) {
    tabValue = matchedDragCategories.url
  } else if (matchedEditTab?.isExact) {
    tabValue = matchedEditTab.url
  }

  const fetchUrl = `/api/masterstore/${parent.id}/draggablecategory/ofmasterstore`
  const [input, reset, handleInputChange] = useInputHook()

  const { data, mutate } = useSWR(fetchUrl, async () => {
    const { data } = await axios.get(fetchUrl)
    return {
      items: data.items,
      parent: data.parent,
    }
  })

  const onSortEnd = ({ oldIndex, newIndex }) => {
    updateOrderHelper({
      oldIndex,
      newIndex,
      url: fetchUrl,
      mutate,
    })
  }

  const deleteItem = (id, idx) => {
    deleteItemHelper({ id, idx, url: fetchUrl, mutate })
  }

  const updateTextValue = (id, text, idx) => {
    updateNameValueHelper({
      id,
      name: text,
      idx,
      url: `${fetchUrl}/updatetext`,
      mutate,
    })
  }

  return (
    <PageTransition className={classes.root}>
      {!data ? (
        <LinearLoading />
      ) : (
        <>
          <AppBar elevation={0} position="sticky" color="inherit">
            <Tabs
              value={tabValue}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="on"
              aria-label="scrollable auto tabs example"
            >
              <Tab
                wrapped
                label={"Edit"}
                component={Link}
                to={url}
                value={url}
              />
              {data.items.map((item) => (
                <Tab
                  wrapped
                  key={item.id}
                  label={item.name}
                  component={Link}
                  to={`${url}/${item.name}/${item.id}`}
                  value={`${url}/${item.name}/${item.id}`}
                />
              ))}
            </Tabs>
          </AppBar>
          <Switch>
            <Route exact path={`${path}`}>
              <FullHeight>
                <Grid
                  container
                  direction="column"
                  justify="space-between"
                  alignItems="stretch"
                  className={classes.fullHeight}
                >
                  <Grid item>
                    <SortableCategoryList
                      items={data.items}
                      onSortEnd={onSortEnd}
                      deleteItem={deleteItem}
                      updateTextValue={updateTextValue}
                      useDragHandle
                      useWindowAsScrollContainer
                      axis="y"
                      lockAxis="y"
                      lockToContainerEdges
                      transitionDuration={0}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      id="Add Category"
                      label="Add Category"
                      value={input}
                      onChange={handleInputChange}
                      onKeyPress={async (ev) => {
                        if (ev.key === "Enter" && input !== "") {
                          await addItemHelper({
                            text: input,
                            url: fetchUrl,
                            mutate,
                            parent,
                            reset,
                          })
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </FullHeight>
            </Route>
            <Route
              exact
              path={`${path}/:draggableCategoryName/:draggableCategoryId`}
              render={() => (
                <DraggableCategory
                  fetchUrl={fetchUrl}
                  displaySpeedDial={false}
                ></DraggableCategory>
              )}
            />
            <Route path="*" render={() => <PageNotFound />} />
          </Switch>
        </>
      )}
    </PageTransition>
  )
}
