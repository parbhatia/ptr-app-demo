import React from "react"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"

const ButtonLink = React.forwardRef((props, ref) => {
  const { children, color = "inherit", variant = "text" } = props
  return (
    <Box pl={1}>
      <Button {...props} color={color} ref={ref} variant={variant}>
        {children}
      </Button>
    </Box>
  )
})

export default ButtonLink
