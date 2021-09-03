import { makeStyles } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import React from "react"
const useStyles = makeStyles({})

const TextFieldComponent = (props) => {
  const {
    autoFocus = false,
    variant = "outlined",
    fullWidth = true,
    multiline = false,
    margin = "normal",
    color,
    InputProps,
    children,
  } = props
  const classes = useStyles()
  return (
    <TextField
      styles={{
        "box-shadow": "red",
      }}
      {...props}
      autoFocus={autoFocus}
      variant={variant}
      fullWidth={fullWidth}
      multiline={multiline}
      margin={margin}
      color={color}
      InputProps={InputProps ? { ...InputProps, classes } : { classes }}
    >
      {children}
    </TextField>
  )
}

export default TextFieldComponent
