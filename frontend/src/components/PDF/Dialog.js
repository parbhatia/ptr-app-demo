import AppBar from "@material-ui/core/AppBar"
import Box from "@material-ui/core/Box"
import Chip from "@material-ui/core/Chip"
import Dialog from "@material-ui/core/Dialog"
import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"
import Slide from "@material-ui/core/Slide"
import { makeStyles } from "@material-ui/core/styles"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import AspectRatioIcon from "@material-ui/icons/AspectRatio"
import CloseIcon from "@material-ui/icons/Close"
import LaptopIcon from "@material-ui/icons/Laptop"
import PhoneAndroidIcon from "@material-ui/icons/PhoneAndroid"
import TvIcon from "@material-ui/icons/Tv"
import ViewCarouselOutlinedIcon from "@material-ui/icons/ViewCarouselOutlined"
import ToggleButton from "@material-ui/lab/ToggleButton"
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup"
import React, { useEffect, useReducer, useState } from "react"
import useWindowSize from "../../Hooks/useWindowSize"
import PDF from "./PDF"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}))

const chooseDefaultWidths = (width) =>
  ({
    large: 1000,
    medium: 500,
    small: 300,
  }[width])

const reducer = (state, action) => {
  switch (action.type) {
    case "updateInitialContainerWidth":
      return {
        ...state,
        userWidth: action.initialWidth,
      }
    case "handleUserWidth":
      return {
        ...state,
        userChoice: action.userChoice,
        userWidth: action.userWidth,
      }
    default:
      throw new Error("Unexpected action")
  }
}

export default function PDFPreview({
  open,
  handleDialogClose,
  pdfName,
  ...rest
}) {
  const classes = useStyles()
  const { width: windowWidth, height: windowHeight } = useWindowSize()
  //keep track of windowWidth, so we can update container width
  const [containerWidth, setContainerWidth] = useState(windowWidth)

  //get container width
  useEffect(() => {
    setContainerWidth(windowWidth)
    //set initial width
    dispatch({
      type: "updateInitialContainerWidth",
      initialWidth: windowWidth,
    })
  }, [windowWidth])

  //bounds width requested by user
  const dynamicWidth = (requestedWidth) => {
    if (requestedWidth > containerWidth) {
      return state.userWidth
    } else {
      return requestedWidth
    }
  }
  const initialState = {
    //userWidth is updated whenever we get container width
    userWidth: chooseDefaultWidths("small"),
    userChoice: "custom",
  }
  const [state, dispatch] = useReducer(reducer, initialState)

  //saves user choice, as well as userWidth which we bound
  const handleUserWidth = (e, userChoice) => {
    // on unclicking an option, userChoice is null, so we need to parse it properly
    if (userChoice === "custom") {
      dispatch({
        type: "handleUserWidth",
        userChoice: "custom",
        userWidth: containerWidth,
      })
    } else if (userChoice) {
      dispatch({
        type: "handleUserWidth",
        userChoice: userChoice,
        userWidth: dynamicWidth(chooseDefaultWidths(userChoice)),
      })
    }
  }

  const toggleContainer = (
    <Grid container justify="center" alignItems="center">
      <ToggleButtonGroup
        value={state.userChoice}
        exclusive
        onChange={handleUserWidth}
        aria-label="text alignment"
      >
        <ToggleButton size="small" value={"custom"} aria-label="custom">
          <AspectRatioIcon fontSize="small" />
        </ToggleButton>
        <ToggleButton size="small" value={"carousel"} aria-label="carousel">
          <ViewCarouselOutlinedIcon fontSize="small" />
        </ToggleButton>
        {chooseDefaultWidths("large") <= containerWidth ? (
          <ToggleButton
            size="small"
            value={"large"}
            disabled={chooseDefaultWidths("large") > containerWidth}
            aria-label="tv"
          >
            <TvIcon fontSize="small" />
          </ToggleButton>
        ) : null}
        {chooseDefaultWidths("medium") <= containerWidth ? (
          <ToggleButton
            size="small"
            value={"medium"}
            disabled={chooseDefaultWidths("medium") > containerWidth}
            aria-label="laptop"
          >
            <LaptopIcon fontSize="small" />
          </ToggleButton>
        ) : null}
        {chooseDefaultWidths("small") <= containerWidth ? (
          <ToggleButton
            size="small"
            value={"small"}
            disabled={chooseDefaultWidths("small") > containerWidth}
            aria-label="phone"
          >
            <PhoneAndroidIcon fontSize="small" />
          </ToggleButton>
        ) : null}
      </ToggleButtonGroup>
    </Grid>
  )

  return (
    <Dialog
      fullScreen
      scroll="paper"
      open={open}
      onClose={handleDialogClose}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar} color="inherit">
        <Toolbar variant="dense">
          <IconButton
            size="small"
            edge="start"
            color="inherit"
            onClick={handleDialogClose}
            aria-label="close"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          <Box display="flex" alignItems="center">
            <Typography
              gutterBottom={false}
              variant="subtitle1"
              className={classes.title}
            >
              {pdfName}
            </Typography>
            <Box ml={2}>
              <Chip size="small" variant="outlined" label={"PDF"} />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <PDF
        {...rest}
        pdfName={pdfName}
        userChoice={state.userChoice}
        userWidth={state.userWidth}
        windowHeight={windowHeight}
        dialogActions={toggleContainer}
      />
    </Dialog>
  )
}
