import React from "react"
import Skeleton from "@material-ui/lab/Skeleton"

const CustomSkeleton = ({ height, width }) => (
  <Skeleton width={width} variant="rect" height={height} />
)

export default CustomSkeleton
