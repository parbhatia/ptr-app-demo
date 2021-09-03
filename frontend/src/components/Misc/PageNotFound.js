import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import React from "react"
import { Link } from "react-router-dom"

export default function PageNotFound() {
  return (
    <>
      <Box>
        <Typography variant="h5" component="h2">
          Page Not Found :(
        </Typography>
      </Box>
      <Box>
        <Typography color="textSecondary">
          Maybe the page you are looking for has been removed, or you typed in
          the wrong URL
        </Typography>
      </Box>
      <Box>
        <Button component={Link} to="/" size="small">
          Go Home
        </Button>
      </Box>
    </>
  )
}
