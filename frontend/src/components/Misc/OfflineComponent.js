import { makeStyles } from "@material-ui/core/styles"
import React from "react"
import PageTransition from "../Motion/PageTransition"
import Box from "@material-ui/core/Box"
import WifiOffIcon from "@material-ui/icons/WifiOff"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import { Link } from "react-router-dom"

const useStyles = makeStyles((theme) => ({
  root: {
    height: `calc(100vh - ${theme.spacing(3)}px - ${
      theme.mixins.toolbar.minHeight
    }px)`,
    width: "100%",
  },
  icon: {
    fontSize: "10em",
    color: "grey",
  },
}))

const defaultMessage =
  "When your network becomes available, this page will automatically refresh."

export default function OfflineComponent({ message = defaultMessage }) {
  const classes = useStyles()
  return (
    <Box display="flex">
      <PageTransition>
        <Box display="flex" justifyContent="center">
          <Box
            flexDirection="column"
            display="flex"
            alignItems="center"
            justifyContent="center"
            className={classes.root}
          >
            <Box>
              <WifiOffIcon className={classes.icon} />
            </Box>
            <Box>
              <Typography variant="h5" gutterBottom>
                You're Offline
              </Typography>
            </Box>
            <Box>
              <Typography align="center" variant="body1" gutterBottom>
                {message}
              </Typography>
            </Box>
            <Box>
              <Button component={Link} to={"/"}>
                Retry Connection
              </Button>
            </Box>
          </Box>
        </Box>
      </PageTransition>
    </Box>
  )
}
