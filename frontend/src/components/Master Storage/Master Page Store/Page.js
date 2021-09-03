import Box from "@material-ui/core/Box"
import ButtonBase from "@material-ui/core/ButtonBase"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import CardHeader from "@material-ui/core/CardHeader"
import Grid from "@material-ui/core/Grid"
import LinearProgress from "@material-ui/core/LinearProgress"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import { makeStyles } from "@material-ui/core/styles"
import axios from "axios"
import React from "react"
import { Link, Route, Switch, useParams, useRouteMatch } from "react-router-dom"
import useSWR from "swr"
import DraggableCategory from "../../DraggableItems/DraggableCategory"
import useInputHook from "../../../Hooks/useInputHook"
import TextField from "../../Misc/ReusableTextField"
import { AbstractSortableList } from "./AbstractSortableComponents"
import {
  addItemHelper,
  deleteItemHelper,
  updateNameValueHelper,
  updateOrderHelper,
} from "../../../helpers/CRUDitem"
import Subsection from "./Subsection"

const useStyles = makeStyles((theme) => ({
  page: {
    width: "100%",
  },
  sub: {
    width: "100%",
  },
  button: {
    width: "100%",
  },
  cardContent: {
    // padding: "6px",
  },
}))

export default function Page({ fetchUrl }) {
  const { url, path } = useRouteMatch()
  const { pageName, pageId } = useParams()
  const classes = useStyles()
  const [input, reset, handleInputChange] = useInputHook()

  const localFetchUrl = `${fetchUrl}/${pageId}/mastersubsection`

  const { data, mutate } = useSWR(localFetchUrl, async () => {
    const { data } = await axios.get(localFetchUrl)
    return {
      items: data.items,
      draggableCategories: data.draggable_categories,
      parent: data.parent,
    }
  })

  const onSortEnd = ({ oldIndex, newIndex }) => {
    updateOrderHelper({
      oldIndex,
      newIndex,
      url: localFetchUrl,
      mutate,
    })
  }
  const deleteItem = (id, idx) => {
    deleteItemHelper({
      id,
      idx,
      url: localFetchUrl,
      mutate,
    })
  }

  const updateTextValue = (id, text, idx) => {
    updateNameValueHelper({
      id,
      name: text,
      idx,
      url: `${localFetchUrl}/updatetext`,
      mutate,
    })
  }

  return (
    <div>
      {!data ? (
        <div style={{ margin: 50 }}>
          <LinearProgress />
        </div>
      ) : (
        <>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="flex-start"
          >
            <Card variant="outlined" className={classes.sub}>
              <ButtonBase className={classes.button} component={Link} to={url}>
                <CardHeader
                  titleTypographyProps={{ variant: "h4" }}
                  title={pageName}
                  subheader={"Page"}
                />
              </ButtonBase>
              <Switch>
                <Route
                  exact
                  path={url}
                  render={() => (
                    <>
                      <CardContent className={classes.cardContent}>
                        <AbstractSortableList
                          listInfo={{
                            keyTag: "mastersubsectionlist",
                            listHeader: "Subsections",
                          }}
                          url={url}
                          deleteItem={deleteItem}
                          updateBoolValue={null}
                          updateTextValue={updateTextValue}
                          items={data.items}
                          onSortEnd={onSortEnd}
                          useDragHandle
                        />
                        <TextField
                          id="Add Subsection"
                          label="Add Subsection"
                          value={input}
                          onChange={handleInputChange}
                          onKeyPress={(ev) => {
                            if (ev.key === "Enter" && input !== "") {
                              addItemHelper({
                                text: input,
                                url: localFetchUrl,
                                mutate,
                                reset,
                              })
                            }
                          }}
                        />
                      </CardContent>
                      <Box p={1}>
                        {data.draggableCategories.map((dcat) => (
                          <ListItem
                            key={dcat.id}
                            button
                            component={Link}
                            to={`${url}/DraggableCategory/${dcat.name}/${dcat.id}`}
                          >
                            <ListItemText primary={dcat.name} />
                          </ListItem>
                        ))}
                      </Box>
                    </>
                  )}
                />

                {data.draggableCategories.map((dcat) => (
                  <Route
                    key={dcat.id}
                    path={`${path}/DraggableCategory/:draggableCategoryName/:draggableCategoryId`}
                    render={() => (
                      <>
                        <ButtonBase
                          component={Link}
                          to={url}
                          className={classes.button}
                        >
                          <CardHeader
                            titleTypographyProps={{ variant: "h5" }}
                            title={dcat.name}
                            subheader={"Subsection"}
                          />
                        </ButtonBase>
                        <DraggableCategory
                          fetchUrl={`${fetchUrl}/${pageId}/draggablecategory`}
                          displaySpeedDial={false}
                        />
                      </>
                    )}
                  />
                ))}
                <Route
                  path={`${path}/:subsectionName/:subsectionId`}
                  render={() => (
                    <CardContent className={classes.cardContent}>
                      <Subsection fetchUrl={localFetchUrl} />
                    </CardContent>
                  )}
                />
              </Switch>
            </Card>
          </Grid>
        </>
      )}
    </div>
  )
}
