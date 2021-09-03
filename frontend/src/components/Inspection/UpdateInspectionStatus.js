import Chip from "@material-ui/core/Chip"
import { green, orange } from "@material-ui/core/colors"
import CachedIcon from "@material-ui/icons/Cached"
import CheckCircleIcon from "@material-ui/icons/CheckCircle"
import axios from "axios"
import React from "react"
import useSWR, { mutate as mutateGlobal } from "swr"
import Typography from "@material-ui/core/Typography"

const UpdateInspectionStatus = ({ inspectionId, size = "medium" }) => {
  const fetchUrl = `/api/inspection/${inspectionId}/inspectionStatus`
  const { data, mutate } = useSWR(
    fetchUrl,
    async () => {
      const { data } = await axios.get(fetchUrl)
      return data.status.inspection_status
    },
    { revalidateOnFocus: false },
  )
  if (!data) {
    return null
  }
  const inProgress = data === "in_progress"
  const inspectionProgress = inProgress ? "In Progress" : "Complete"

  const inspectionProgressIcon = inProgress ? (
    <CachedIcon style={{ color: orange[500] }} />
  ) : (
    <CheckCircleIcon style={{ color: green[500] }} />
  )
  const toggleInspectionStatus = async () => {
    try {
      await axios.patch(fetchUrl)
      //revalidate
      mutate()
      mutateGlobal("/api/overview")
    } catch (e) {
      console.log("Error updating inspection status", e)
    }
  }
  return (
    <Chip
      variant="outlined"
      size={size}
      icon={inspectionProgressIcon}
      label={<Typography variant="overline">{inspectionProgress}</Typography>}
      // label={inspectionProgress}
      onClick={async () => {
        await toggleInspectionStatus()
      }}
    />
  )
}

export default UpdateInspectionStatus
