import React from "react"
import Paper from "@material-ui/core/Paper"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  minimalSpacing: {
    padding: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
}))
const StyledPaper = ({ children, className, minimalSpacing }) => {
  const classes = useStyles()
  return (
    <Paper
      variant="outlined"
      square
      className={
        minimalSpacing
          ? `${className} ${classes.minimalSpacing}`
          : `${className} ${classes.paper}`
      }
    >
      {children}
    </Paper>
  )
}

export default StyledPaper
