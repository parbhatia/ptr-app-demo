import AppBar from "@material-ui/core/AppBar"
import Box from "@material-ui/core/Box"
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
import LazyLoading from "../LoadingComponents/LazyLoading"
import PhotosCategoryManager from "../Photos/CategoryManager"
import PageNotFound from "../Misc/PageNotFound"
import Category from "./Category"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}))

const pretty = (t) => t.replace(/\s/g, " ")

export default function Subsection() {
  const classes = useStyles()
  const { path, url } = useRouteMatch()
  const matchedSubsections = useRouteMatch(`${path}/Subsection/:subsectionId`)
  const matchedDragCategories = useRouteMatch(
    `${path}/:draggableCategoryName/:draggableCategoryId`,
  )
  const matchedPhotos = useRouteMatch(`${path}/Photos`)
  const { inspectionId, pageId } = useParams()
  const fetchUrl = `/api/inspection/${inspectionId}/page/${pageId}/subsection`
  const { data } = useSWR(`${fetchUrl}`, async () => {
    const { data } = await axios.get(fetchUrl)
    return {
      subsections: data.subsections,
      draggableCategories: data.draggableCategories,
    }
  })

  //controlled tab value
  let tabValue = null
  if (matchedSubsections?.isExact) {
    tabValue = matchedSubsections.url
  } else if (matchedDragCategories?.isExact) {
    tabValue = matchedDragCategories.url
  } else if (matchedPhotos?.isExact) {
    tabValue = matchedPhotos.url
  }

  return (
    <div className={classes.root}>
      {!data ? (
        <LazyLoading />
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
              {data.subsections.map((e) => (
                <Tab
                  key={`tab-${e.id}`}
                  wrapped
                  label={pretty(e.name)}
                  component={Link}
                  to={`${url}/Subsection/${e.id}`}
                  value={`${url}/Subsection/${e.id}`}
                />
              ))}
              {data.draggableCategories.map((c) => (
                <Tab
                  key={`tabdc-${c.id}`}
                  wrapped
                  label={pretty(c.name)}
                  component={Link}
                  to={`${url}/${pretty(c.name)}/${c.id}`}
                  value={`${url}/${pretty(c.name)}/${c.id}`}
                />
              ))}
              <Tab
                key={`page-photos`}
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
              path={`${path}/Subsection/:subsectionId`}
              render={() => (
                <Box className={classes.inheritMinHeight} p={2}>
                  <Category />
                </Box>
              )}
            />

            <Route
              exact
              path={`${path}/:draggableCategoryName/:draggableCategoryId`}
              render={() => (
                <DraggableCategory
                  fetchUrl={`/api/inspection/${inspectionId}/page/${pageId}/draggablecategory`}
                ></DraggableCategory>
              )}
            />

            <Route
              exact
              path={`${path}/Photos`}
              render={() => (
                <PhotosCategoryManager type="reference" pageId={pageId} />
              )}
            />

            <Route
              exact
              path={path}
              render={() => (
                <Redirect
                  replace
                  to={
                    data.subsections[0]
                      ? `${url}/Subsection/${data.subsections[0].id}`
                      : data.draggableCategories[0]
                      ? `${url}/${pretty(data.draggableCategories[0].name)}/${
                          data.draggableCategories[0].id
                        }`
                      : url
                  }
                />
              )}
            />
            <Route exact path={`${url}*`} render={() => <PageNotFound />} />
          </Switch>
        </>
      )}
    </div>
  )
}
