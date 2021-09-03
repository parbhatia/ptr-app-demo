import {
  closestCenter,
  DndContext,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable"
import Box from "@material-ui/core/Box"
import ReorderIcon from "@material-ui/icons/Reorder"
import ViewAgendaIcon from "@material-ui/icons/ViewAgenda"
import ViewColumnIcon from "@material-ui/icons/ViewColumn"
import ViewComfyIcon from "@material-ui/icons/ViewComfy"
import ViewModuleIcon from "@material-ui/icons/ViewModule"
import ToggleButton from "@material-ui/lab/ToggleButton"
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup"
import React, { useEffect, useReducer, useState } from "react"
import useWindowSize from "../../Hooks/useWindowSize"
import SortableItem from "./SortablePhoto"
import useConfirmationDialog from "../../Hooks/useConfirmationDialog"

function Grid({ children, columns, orderingDisabled }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: orderingDisabled
          ? `repeat(${columns}, 1fr)`
          : `repeat(6, 1fr)`,
        gridGap: 10,
        padding: 10,
        gridAutoFlow: "row dense",
        width: orderingDisabled ? "100%" : "auto",
        scrollBehavior: "smooth",
      }}
    >
      {children}
    </div>
  )
}

const cutOffWidths = (width) =>
  ({
    large: 1575,
    medium: 1015,
    small: 530,
  }[width])

const reducer = (state, action) => {
  switch (action.type) {
    case "handleUserWidth":
      return {
        ...state,
        userChoice: action.userChoice,
        userWidth: action.userWidth,
      }
    case "handleGrid":
      return {
        ...state,
        userChoice: action.userChoice,
        userWidth: action.userWidth,
        gridColumns: action.gridColumns,
      }
    default:
      throw new Error("Unexpected action")
  }
}

const SortablePhotosContainer = ({
  photos,
  orderInfo,
  ordering,
  setOrdering,
  orderingDisabled,
  ...rest
}) => {
  const { width: windowWidth } = useWindowSize()
  const [containerWidth, setContainerWidth] = useState(windowWidth)
  const [confirm, confirmationDialog] = useConfirmationDialog()

  const dynamicWidth = (columns) => {
    // we use a grid-gap of 10px, and we need to subtract that from each image's width
    return containerWidth / columns
  }

  const applyDefaultUserOptionsSingle = () => {
    dispatch({
      type: "handleGrid",
      userChoice: "single",
      gridColumns: 1,
      userWidth: dynamicWidth(1),
    })
  }
  const applyDefaultUserOptions = () => {
    dispatch({
      type: "handleGrid",
      userChoice: "default",
      gridColumns: 2,
      userWidth: dynamicWidth(2),
    })
  }

  //get container width
  useEffect(() => {
    setContainerWidth(windowWidth)
    setOrdering(false)
    //set initial width
    if (containerWidth > cutOffWidths("small")) {
      applyDefaultUserOptions()
    } else {
      applyDefaultUserOptionsSingle()
    }
  }, [windowWidth])

  const initialState = {
    //userWidth is updated whenever we get container width
    userWidth: 0,
    userChoice: "default",
    gridColumns: 2,
  }
  const [state, dispatch] = useReducer(reducer, initialState)

  //saves user choice, as well as userWidth which we bound
  const handleUserWidth = (e, userChoice) => {
    // on unclicking an option, userChoice is null, so we need to parse it properly
    if (ordering && userChoice) {
      setOrdering(false)
    }
    if (userChoice === "ordering") {
      setOrdering(true)
      dispatch({
        type: "handleGrid",
        userChoice: "ordering",
        gridColumns: 6,
        userWidth: dynamicWidth(6),
      })
    } else if (userChoice === "single") {
      applyDefaultUserOptionsSingle()
    } else if (userChoice === "default") {
      applyDefaultUserOptions()
    } else if (userChoice === "grid-large") {
      dispatch({
        type: "handleGrid",
        userChoice: "grid-large",
        gridColumns: 4,
        userWidth: dynamicWidth(4),
      })
    } else if (userChoice === "grid-small") {
      dispatch({
        type: "handleGrid",
        userChoice: "grid-small",
        gridColumns: 6,
        userWidth: dynamicWidth(6),
      })
    }
  }
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(MouseSensor),
  )

  const { setNodeRef } = useDroppable({
    id: "unique-id",
  })

  async function handleDragEnd(event) {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = orderInfo.indexOf(active.id)
      const newIndex = orderInfo.indexOf(over.id)
      await rest.helpers.onSortEnd({ oldIndex, newIndex })
    }
  }

  const toggleContainer = (
    <Box display="flex" width="100%" justifyContent="center">
      <ToggleButtonGroup
        value={state.userChoice}
        exclusive
        onChange={handleUserWidth}
        aria-label="text alignment"
      >
        <ToggleButton size="small" value={"ordering"} aria-label="ordering">
          <ReorderIcon fontSize="small" /> {" Reorder "}
        </ToggleButton>
        <ToggleButton size="small" value={"single"} aria-label="single">
          <ViewAgendaIcon fontSize="small" />
        </ToggleButton>
        {containerWidth > cutOffWidths("small") && (
          <ToggleButton size="small" value={"default"} aria-label="default">
            <ViewColumnIcon fontSize="small" />
          </ToggleButton>
        )}
        {containerWidth > cutOffWidths("medium") && (
          <ToggleButton size="small" value={"grid-large"} aria-label="grid">
            <ViewModuleIcon fontSize="small" />
          </ToggleButton>
        )}
        {containerWidth > cutOffWidths("large") && (
          <ToggleButton size="small" value={"grid-small"} aria-label="grid">
            <ViewComfyIcon fontSize="small" />
          </ToggleButton>
        )}
      </ToggleButtonGroup>
    </Box>
  )

  return (
    <Box>
      {toggleContainer}
      <Box display="flex" justifyContent="center" ref={setNodeRef}>
        <DndContext
          sensors={sensors}
          autoScroll={true}
          collisionDetection={closestCenter}
          // modifiers={[restrictToParentElement, createSnapModifierForGrid()]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={orderInfo} strategy={rectSortingStrategy}>
            <Grid
              orderingDisabled={orderingDisabled}
              columns={state.gridColumns}
            >
              {orderInfo.map((item, index) => (
                <SortableItem
                  userWidth={state.userWidth}
                  photo={photos[index]}
                  key={item}
                  id={item}
                  disabled={orderingDisabled}
                  orderingDisabled={orderingDisabled}
                  confirm={confirm}
                  {...rest}
                />
              ))}
              {confirmationDialog}
            </Grid>
          </SortableContext>
        </DndContext>
      </Box>
    </Box>
  )
}

export default SortablePhotosContainer
