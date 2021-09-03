import Box from "@material-ui/core/Box"
import Grid from "@material-ui/core/Grid"
import { makeStyles, useTheme } from "@material-ui/core/styles"
import axios from "axios"
import React from "react"
import Div100vh from "react-div-100vh"
import { useParams } from "react-router-dom"
import useSWR from "swr"
import TextField from "../Misc/ReusableTextField"
import AutoCompleteItems from "../AutoCompleteItems"
import useInputHook from "../../Hooks/useInputHook"
import {
  addBulkItemHelper,
  addItemWithTextHelper,
  updateOrderHelper,
} from "../../helpers/CRUDitem"
import StoreDisplayWrapper from "../Store/StoreDisplayWrapper"
import SortableCheckboxList from "./DraggableCheckbox"
import EmptyListSkeleton from "../Misc/EmptyListSkeleton"

const useStyles = makeStyles((theme) => ({
  fullHeight: {
    "min-height": "inherit",
  },
  relativeCard: {
    height: "100%",
    width: "100%",
  },
  sortableListContainer: {
    width: "100%",
  },
}))

// Renders the Draggable Checkboxes of a given Draggable Category, and gives the child components function to mutate its state
// Component lets StoreDisplayWrapper be a wrapper, but will only render Store if it is being used inside Inspection Component
//parent prop is single category
export default function DraggableCategory({
  fetchUrl,
  displaySpeedDial = true,
  disableAutocomplete = false,
  disableSubcheckboxes = false,
  draggableCheckboxMaxlength = 524288,
}) {
  const classes = useStyles()
  const theme = useTheme()
  const { draggableCategoryId } = useParams()
  const [input, reset, handleInputChange, _] = useInputHook()
  const { data, mutate } = useSWR(
    `${fetchUrl}/${draggableCategoryId}`,
    async () => {
      const { data } = await axios.get(
        `${fetchUrl}/${draggableCategoryId}/draggablecheckbox`,
      )
      return {
        items: data.items,
        parent: data.parent,
      }
    },
  )

  const bulkInsert = async (bulkData) => {
    await addBulkItemHelper({
      bulkData,
      parent: { id: draggableCategoryId },
      url: `${fetchUrl}/${draggableCategoryId}/draggablecheckbox/bulkinsert`,
      mutate,
    })
  }

  const onSortEnd = async ({ oldIndex, newIndex }) => {
    await updateOrderHelper({
      oldIndex,
      newIndex,
      url: `${fetchUrl}/${draggableCategoryId}/draggablecheckbox`,
      mutate,
    })
  }

  const addItem = async (input) =>
    await addItemWithTextHelper({
      text: input,
      url: `${fetchUrl}/${draggableCategoryId}/draggablecheckbox`,
      mutate,
      parent: { id: draggableCategoryId },
      reset: () => {},
    })

  return (
    <Div100vh
      style={{
        minHeight: `calc(100rvh  - ${theme.spacing(6)}px - ${
          theme.mixins.toolbar.minHeight
        }px - ${theme.mixins.toolbar.minHeight}px) `,
      }}
    >
      <Box className={classes.fullHeight} p={2}>
        {!data ? null : (
          <>
            <StoreDisplayWrapper
              displaySpeedDial={displaySpeedDial}
              draggableCategory={{
                id: draggableCategoryId,
                bulkInsert: bulkInsert,
              }}
            >
              <Grid
                container
                direction="column"
                justify="space-between"
                alignItems="stretch"
                className={classes.fullHeight}
              >
                {data.items.length === 0 ? (
                  <Grid item>
                    <EmptyListSkeleton />
                  </Grid>
                ) : (
                  <Grid item className={classes.sortableListContainer}>
                    <SortableCheckboxList
                      items={data.items}
                      mutateCategory={mutate}
                      fetchUrl={`${fetchUrl}/${draggableCategoryId}/draggablecheckbox`}
                      disableSubcheckboxes={disableSubcheckboxes}
                      draggableCheckboxMaxlength={draggableCheckboxMaxlength}
                      onSortEnd={onSortEnd}
                      useDragHandle
                      axis="y"
                      lockAxis="y"
                      useWindowAsScrollContainer
                      lockToContainerEdges
                      transitionDuration={0}
                    />
                  </Grid>
                )}
                <Grid item>
                  <div className={classes.addbutton}>
                    {disableAutocomplete ? (
                      <TextField
                        value={input}
                        label="Add Item"
                        inputProps={{
                          autoCapitalize: "true",
                          spellCheck: true,
                          maxLength: draggableCheckboxMaxlength,
                        }}
                        // color="secondary"
                        onChange={handleInputChange}
                        onKeyPress={async (ev) => {
                          if (ev.key === "Enter" && input !== "") {
                            await addItem(input)
                            // ev.preventDefault()
                            reset()
                          }
                        }}
                      />
                    ) : (
                      <AutoCompleteItems
                        label="Add Item"
                        fetchUrl={`${fetchUrl}/${draggableCategoryId}/draggablecheckbox`}
                        addItem={addItem}
                      />
                    )}
                  </div>
                </Grid>
              </Grid>
            </StoreDisplayWrapper>
          </>
        )}
      </Box>
    </Div100vh>
  )
}
