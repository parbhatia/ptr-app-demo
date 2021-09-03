import Box from "@material-ui/core/Box"
import ButtonBase from "@material-ui/core/ButtonBase"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import CardHeader from "@material-ui/core/CardHeader"
import LinearProgress from "@material-ui/core/LinearProgress"
import { makeStyles } from "@material-ui/core/styles"
import axios from "axios"
import React from "react"
import { Link, useParams, useRouteMatch } from "react-router-dom"
import useSWR from "swr"
import useInputHook from "../../../Hooks/useInputHook"
import TextField from "../../Misc/ReusableTextField"
import { AbstractSortableList } from "./AbstractSortableComponents"
import {
  addItemWithTextHelper,
  deleteItemHelper,
  updateBoolValueHelper,
  updateOrderHelper,
  updateTextValueHelper,
} from "../../../helpers/CRUDitem"
const useStyles = makeStyles((theme) => ({
  sub: {
    width: "100%",
  },
  pos: {
    marginBottom: 12,
  },
  cat: {},
  catHeader: {
    padding: "6px",
  },
  checkboxes: {
    "flex-direction": "row",
  },
  cardContent: {
    padding: "6px",
  },
  button: {
    width: "100%",
  },
}))

//gets checkboxes and mutates them

export default function Category({ fetchUrl }) {
  const classes = useStyles()
  const { url } = useRouteMatch()
  const { categoryId, categoryName } = useParams()
  const [input, reset, handleInputChange] = useInputHook()
  const localFetchurl = `${fetchUrl}/${categoryId}/mastercheckbox`

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

  const updateBoolValue = (id, boolVal, idx) => {
    updateBoolValueHelper({
      id,
      boolVal,
      idx,
      url: `${localFetchurl}/updatebool`,
      mutate,
    })
  }
  const updateTextValue = (id, text, idx) => {
    updateTextValueHelper({
      id,
      text,
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
          <Card variant="outlined" className={classes.cat}>
            <ButtonBase className={classes.button} component={Link} to={url}>
              <CardHeader
                titleTypographyProps={{ variant: "h5" }}
                title={categoryName}
                subheader={"Category"}
              />
            </ButtonBase>
            <CardContent className={classes.cardContent}>
              <AbstractSortableList
                listInfo={{
                  keyTag: "mastercheckboxlist",
                  listHeader: "Checkboxes",
                }}
                url={url}
                deleteItem={deleteItem}
                updateBoolValue={updateBoolValue}
                updateTextValue={updateTextValue}
                items={data.items}
                onSortEnd={onSortEnd}
                useDragHandle
              />
            </CardContent>
            <Box
              display="flex"
              justifyContent="center"
              m={1}
              p={1}
              bgcolor="background.paper"
            >
              <TextField
                id="Add Checkbox"
                label="Add Checkbox"
                value={input}
                onChange={handleInputChange}
                onKeyPress={async (ev) => {
                  if (ev.key === "Enter" && input !== "") {
                    await addItemWithTextHelper({
                      text: input,
                      url: localFetchurl,
                      mutate,
                      reset,
                    })
                  }
                }}
              />
            </Box>
          </Card>
        </>
      )}
    </div>
  )
}
