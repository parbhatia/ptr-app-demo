import Box from "@material-ui/core/Box"
import ButtonBase from "@material-ui/core/ButtonBase"
import Card from "@material-ui/core/Card"
import CardHeader from "@material-ui/core/CardHeader"
import LinearProgress from "@material-ui/core/LinearProgress"
import { makeStyles } from "@material-ui/core/styles"
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
import useInputHook from "../../../Hooks/useInputHook"
import TextField from "../../Misc/ReusableTextField"
import PageNotFound from "../../Misc/PageNotFound"
import { AbstractSortableList } from "./AbstractSortableComponents"
import {
  addItemHelper,
  deleteItemHelper,
  updateNameValueHelper,
  updateOrderHelper,
} from "../../../helpers/CRUDitem"
import Page from "./Page"

const useStyles = makeStyles((theme) => ({
  item: {
    width: "100%",
  },
  pos: {
    marginBottom: 12,
  },
  cardContent: {
    padding: "6px",
  },
  button: {
    width: "100%",
  },
}))

//Handles Master Pages, by re-using Draggable Checkbox/Subcheckbox component
//parent object passed should have id: master_page_store_id
export default function MasterPageCreator() {
  const classes = useStyles()
  const { templateId } = useParams()
  const { url, path } = useRouteMatch()
  const [input, reset, handleInputChange] = useInputHook()

  const fetchUrl = `/api/masterpagestore/${templateId}/masterpage`
  const { data, mutate } = useSWR(fetchUrl, async () => {
    const { data } = await axios.get(fetchUrl)
    return {
      items: data.items,
      parent: data.parent,
    }
  })

  const onSortEnd = async ({ oldIndex, newIndex }) => {
    await updateOrderHelper({ oldIndex, newIndex, url: fetchUrl, mutate })
  }
  const deleteItem = async (id, idx) => {
    await deleteItemHelper({ id, idx, url: fetchUrl, mutate })
  }

  const updateTextValue = async (id, text, idx) => {
    await updateNameValueHelper({
      id,
      name: text,
      idx,
      url: `${fetchUrl}/updatetext`,
      mutate,
    })
  }
  const addItem = async () =>
    await addItemHelper({ text: input, url: fetchUrl, mutate, reset })

  return (
    <>
      {!data ? (
        <div style={{ margin: 50 }}>
          <LinearProgress />
        </div>
      ) : (
        <div className={classes.root}>
          <Card variant="outlined">
            {/* <ButtonBase className={classes.button} component={Link} to={url}>
              <CardHeader
                titleTypographyProps={{ variant: "h4" }}
                title={"All Pages"}
                subheader={"Page"}
              />
            </ButtonBase> */}

            <Switch>
              <Route
                exact
                path={path}
                render={() => (
                  <>
                    <AbstractSortableList
                      listInfo={{
                        keyTag: "masterpagenlist",
                        listHeader: "Pages",
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
                        id="Add Page"
                        label="Add Page"
                        value={input}
                        onChange={handleInputChange}
                        onKeyPress={async (ev) => {
                          if (ev.key === "Enter" && input !== "") {
                            await addItem()
                          }
                        }}
                      />
                    </Box>
                  </>
                )}
              />
              <Route
                path={`${path}/:pageName/:pageId`}
                render={() => (
                  <>
                    <ButtonBase
                      component={Link}
                      to={url}
                      className={classes.button}
                    >
                      <CardHeader
                        titleTypographyProps={{ variant: "h5" }}
                        title={"Pages"}
                      />
                    </ButtonBase>
                    <Page fetchUrl={fetchUrl} />
                  </>
                )}
              />
              <Route
                path={`${path}/:pageName`}
                render={() => <Redirect replace to={url} />}
              />
              <Route path="*" render={() => <PageNotFound />} />
            </Switch>
          </Card>
        </div>
      )}
    </>
  )
}
