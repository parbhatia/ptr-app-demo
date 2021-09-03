import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import LinearProgress from "@material-ui/core/LinearProgress"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: 5,
    borderRadius: 5,
  },
  bar: {
    borderRadius: 5,
  },
}))

export default function LinearIndeterminate() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <LinearProgress
        className={`${classes.root} ${classes.bar}`}
        color="secondary"
      />
    </div>
  )
}
