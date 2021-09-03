import AppBar from "@material-ui/core/AppBar"
import { makeStyles } from "@material-ui/core/styles"
import Tab from "@material-ui/core/Tab"
import Tabs from "@material-ui/core/Tabs"
import axios from "axios"
import React from "react"
import {
  Link,
  Redirect,
  Route,
  Switch,
  useParams,
  useRouteMatch,
} from "react-router-dom"
import useSWR from "swr"
import DraggableCategory from "../DraggableItems/DraggableCategory"
import LinearLoading from "../LoadingComponents/LinearLoading"
import PhotoCategoryManager from "../Photos/CategoryManager"
import PageNotFound from "../Misc/PageNotFound"

const pretty = (t) => t.replace(/\s/g, " ")

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    // backgroundColor: theme.palette.background.paper,
    position: "relative",
  },
}))

export default function SummaryComponent() {
  const classes = useStyles()
  const { path, url } = useRouteMatch()
  const matchedDragCategories = useRouteMatch(
    `${path}/:draggableCategoryName/:draggableCategoryId`,
  )
  const matchedPhotos = useRouteMatch(`${path}/Photos`)
  const { inspectionId, pageId } = useParams()
  const fetchUrl = `/api/inspection/${inspectionId}/page/${pageId}/draggablecategory`

  const { data } = useSWR(fetchUrl, async () => {
    const { data } = await axios.get(fetchUrl)
    return {
      draggableCategories: data.draggableCategories,
    }
  })

  //controlled tab value
  let tabValue = null
  if (matchedDragCategories?.isExact) {
    tabValue = matchedDragCategories.url
  } else if (matchedPhotos?.isExact) {
    tabValue = matchedPhotos.url
  }

  return (
    <div className={classes.root}>
      {!data ? (
        <LinearLoading />
      ) : (
        <>
          <AppBar elevation={0} position="sticky" color="inherit">
            <Tabs
              value={tabValue ? tabValue : false}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="on"
              aria-label="scrollable auto tabs example"
            >
              {data.draggableCategories.map((cat) => (
                <Tab
                  key={`dcat${cat.id}`}
                  wrapped
                  label={cat.name}
                  component={Link}
                  to={`${url}/${pretty(cat.name)}/${cat.id}`}
                  value={`${url}/${pretty(cat.name)}/${cat.id}`}
                />
              ))}
              <Tab
                key={`dcat-summaryphotos`}
                wrapped
                label={"Photos"}
                component={Link}
                to={`${url}/Photos`}
                value={`${url}/Photos`}
              />
            </Tabs>
          </AppBar>

          <Switch>
            <Route
              exact
              path={`${path}/:draggableCategoryName/:draggableCategoryId`}
              render={() => (
                <DraggableCategory fetchUrl={fetchUrl}></DraggableCategory>
              )}
            />
            <Route
              exact
              path={`${path}/Photos`}
              render={() => (
                <PhotoCategoryManager type="reference" pageId={pageId} />
              )}
            />
            <Route
              exact
              path={`${path}`}
              render={() => (
                <Redirect
                  replace
                  to={
                    data.draggableCategories[0]
                      ? `${url}/${pretty(data.draggableCategories[0].name)}/${
                          data.draggableCategories[0].id
                        }`
                      : url
                  }
                />
              )}
            />
            <Route path="*" render={() => <PageNotFound />} />
          </Switch>
        </>
      )}
    </div>
  )
}
