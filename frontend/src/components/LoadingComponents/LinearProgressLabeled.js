import React from "react"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import LinearProgress from "@material-ui/core/LinearProgress"
import { makeStyles } from "@material-ui/core/styles"
const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  root: {
    height: 5,
    borderRadius: 5,
  },
  bar: {
    borderRadius: 5,
  },
}))

export default function LinearProgressWithLabel({ progress, label }) {
  const classes = useStyles()
  //onnly show progress bar if there is any progress remaining
  if (progress === 100 || progress === 0) {
    return null
  } else
    return (
      <>
        <Typography align="center" variant="h5">
          {label}
        </Typography>
        <Box ml={10} mr={10} p={1} display="flex" alignItems="center">
          <Box width="100%">
            <LinearProgress
              className={`${classes.root} ${classes.bar}`}
              variant="determinate"
              color="secondary"
              value={progress}
            />
          </Box>
        </Box>
      </>
    )
}
