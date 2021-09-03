import Box from "@material-ui/core/Box"
import FormLabel from "@material-ui/core/FormLabel"
import IconButton from "@material-ui/core/IconButton"
import { makeStyles } from "@material-ui/core/styles"
import AddIcon from "@material-ui/icons/Add"
import axios from "axios"
import produce from "immer"
import React, { memo } from "react"
import { useParams } from "react-router-dom"
import useSWR from "swr"
import useInputHook from "../../Hooks/useInputHook"
import TextField from "../Misc/ReusableTextField"
import CheckboxComponent from "./CheckboxComponent"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    display: "inline-flex",
    backgroundColor: theme.palette.action.hover,
    border: `1px solid ${theme.palette.action.hover}`,
    "border-radius": "10px",
    padding: "0.9rem",
  },
  textField: {
    margin: 0,
  },
  paper: {
    color: theme.palette.text.primary,
    fontWeight: 600,
    fontSize: 22,
    padding: "3px",
  },
  contents: {
    display: "contents",
  },
  header: {
    marginRight: "1rem",
    borderBottom: `2px solid ${theme.palette.secondary.main}`,
  },
}))

const addCheckboxItem = async (
  text,
  categoryId,
  url,
  mutate,
  reset,
  inspectionId,
) => {
  try {
    const { data } = await axios.post(url, {
      text,
      categoryId,
      inspectionId,
    })
    const ob = { ...data }
    if (ob.text === text)
      mutate((data) => {
        return produce(data, (draftState) => {
          draftState.checkboxes.push(ob)
        })
      }, true)
    reset()
  } catch (e) {}
}

//Called by Category to render all checkboxes of a subsection's category
// Responsible for adding checkboxes
function CheckBoxList({ category }) {
  const { inspectionId, pageId, subsectionId } = useParams()
  const fetchUrl = `/api/inspection/${inspectionId}/page/${pageId}/subsection/${subsectionId}/category/${category.id}/checkbox`
  const classes = useStyles()
  const [input, reset, handleInputChange] = useInputHook()
  const { data, mutate } = useSWR(fetchUrl, async () => {
    const { data } = await axios.get(fetchUrl)
    return { checkboxes: data.checkboxes, category: category }
  })

  const addCheckbox = async () =>
    addCheckboxItem(input, category.id, fetchUrl, mutate, reset, inspectionId)

  return (
    <Box
      className={classes.root}
      flexWrap="wrap"
      display="flex"
      alignItems="center"
    >
      {!data ? null : (
        <>
          <Box className={classes.header}>
            <FormLabel
              focused={false}
              className={classes.paper}
              component="label"
            >
              {category.name}:
            </FormLabel>
          </Box>
          <Box className={classes.contents}>
            {data.checkboxes.map((ch, index) => (
              <CheckboxComponent
                key={`checkbox-component-list-${ch.id}`}
                checkbox={{
                  id: ch.id,
                  boolVal: ch.used,
                  text: ch.text,
                  categoryId: ch.category_id,
                  idxToUpdate: index,
                }}
                fetchUrl={fetchUrl}
                mutateCheckboxList={mutate}
              />
            ))}
          </Box>
          <Box pl={2} display="flex" alignItems="center">
            <Box>
              <IconButton
                size="small"
                aria-label="add"
                className={classes.margin}
                onClick={async () => {
                  if (input !== "") {
                    await addCheckbox()
                  }
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box>
              <TextField
                value={input}
                className={classes.textField}
                fullWidth={false}
                autoFocus={false}
                variant="standard"
                placeholder="Add Item"
                onChange={handleInputChange}
                onKeyPress={async (ev) => {
                  if (ev.key === "Enter" && input !== "") {
                    ev.preventDefault()
                    await addCheckbox()
                  }
                }}
              />
            </Box>
          </Box>
        </>
      )}
    </Box>
  )
}

export default memo(CheckBoxList)
