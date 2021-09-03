import { SortableHandle } from "react-sortable-hoc"
import DragHandleIcon from "@material-ui/icons/DragHandle"
import React, { memo } from "react"

const DragHandle = memo(
  SortableHandle(() => <DragHandleIcon fontSize="inherit" />)
)

export default DragHandle
