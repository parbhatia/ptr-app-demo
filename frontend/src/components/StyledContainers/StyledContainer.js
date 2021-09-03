import React from "react"
import Container from "@material-ui/core/Container"
import StyledPaper from "./StyledPaper"

const StyledContainer = ({ children, size = "md", className, ...rest }) => {
  return (
    <Container disableGutters maxWidth={size}>
      <StyledPaper className={className} {...rest}>
        {children}
      </StyledPaper>
    </Container>
  )
}

export default StyledContainer
