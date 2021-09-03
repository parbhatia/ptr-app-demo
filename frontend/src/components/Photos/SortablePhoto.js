import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import React from "react"
import PhotoItem from "./PhotoItem"

const SortablePhoto = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.id,
    disabled: props.orderingDisabled,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // touchAction: props.orderingDisabled ? "auto" : "none",
    // WebkitUserSelect: "none",
    // WebkitTouchCallout: "none",
    // userSelect: "none",
    // KhtmlUserSelect: "none",
    // OUserSelect: "none",
    // MozUserSelect: "-moz-none",
    //remove blue selection border in mobile browsers
    // outline: "none",
  }

  return (
    <PhotoItem
      ref={setNodeRef}
      faded={isDragging}
      style={style}
      {...props}
      {...attributes}
      {...listeners}
    />
  )
}

export default SortablePhoto
