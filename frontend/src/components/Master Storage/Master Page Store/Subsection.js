import Box from "@material-ui/core/Box"
import ButtonBase from "@material-ui/core/ButtonBase"
import CardContent from "@material-ui/core/CardContent"
import CardHeader from "@material-ui/core/CardHeader"
import LinearProgress from "@material-ui/core/LinearProgress"
import { makeStyles } from "@material-ui/core/styles"
import axios from "axios"
import React from "react"
import { Link, Route, Switch, useParams, useRouteMatch } from "react-router-dom"
import useSWR from "swr"
import useInputHook from "../../../Hooks/useInputHook"
import TextField from "../../Misc/ReusableTextField"
import { AbstractSortableList } from "./AbstractSortableComponents"
import Category from "./Category"
import {
  addItemHelper,
  deleteItemHelper,
  updateNameValueHelper,
  updateOrderHelper,
} from "../../../helpers/CRUDitem"

const useStyles = makeStyles((theme) => ({
  page: {
    width: "100%",
  },
  sub: {
    width: "100%",
  },
  cardContent: {
    padding: "6px",
  },
  button: {
    width: "100%",
  },
}))

export default function Subsection({ fetchUrl }) {
  const classes = useStyles()
  const { url, path } = useRouteMatch()
  const { subsectionName, subsectionId } = useParams()
  const [input, reset, handleInputChange] = useInputHook()
  const localFetchurl = `${fetchUrl}/${subsectionId}/mastercategory`

  const { data, mutate } = useSWR(localFetchurl, async () => {
    const { data } = await axios.get(localFetchurl)
    return {
      items: data.items,
      parent: data.parent,
    }
  })

  const onSortEnd = ({ oldIndex, newIndex }) => {
    updateOrderHelper({
      oldIndex,
      newIndex,
      url: localFetchurl,
      mutate,
    })
  }
  const deleteItem = (id, idx) => {
    deleteItemHelper({ id, idx, url: localFetchurl, mutate })
  }

  const updateTextValue = (id, text, idx) => {
    updateNameValueHelper({
      id,
      name: text,
      idx,
      url: `${localFetchurl}/updatetext`,
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
          <ButtonBase className={classes.button} component={Link} to={url}>
            <CardHeader
              titleTypographyProps={{ variant: "h5" }}
              title={subsectionName}
              subheader={"Subsection"}
            />
          </ButtonBase>
          <Switch>
            <Route
              exact
              path={url}
              render={() => (
                <CardContent className={classes.cardContent}>
                  <AbstractSortableList
                    listInfo={{
                      keyTag: "mastercategorylist",
                      listHeader: "Categories",
                    }}
                    url={url}
                    deleteItem={deleteItem}
                    updateBoolValue={null}
                    updateTextValue={updateTextValue}
                    items={data.items}
                    onSortEnd={onSortEnd}
                    useDragHandle
                  />
                  <Box
                    display="flex"
                    justifyContent="center"
                    m={1}
                    p={1}
                    bgcolor="background.paper"
                  >
                    <TextField
                      id="Add Category"
                      label="Add Category"
                      value={input}
                      onChange={handleInputChange}
                      onKeyPress={async (ev) => {
                        if (ev.key === "Enter" && input !== "") {
                          await addItemHelper({
                            text: input,
                            url: localFetchurl,
                            mutate,
                            reset,
                          })
                        }
                      }}
                    />
                  </Box>
                </CardContent>
              )}
            />
            <Route
              exact
              path={`${path}/:categoryName/:categoryId`}
              render={() => (
                <CardContent className={classes.cardContent}>
                  <Category fetchUrl={localFetchurl} />
                </CardContent>
              )}
            />
          </Switch>
        </>
      )}
    </div>
  )
}
