import { makeStyles } from "@material-ui/core/styles"
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer"
import { motion } from "framer-motion"
import React from "react"
import Drawer from "@material-ui/core/Drawer"

const useStyles = ({ maxWidth, maxHeight, width, height }) =>
  makeStyles((theme) => ({
    paperRightSide: {
      flexGrow: 1,
      width: `calc(100% - ${theme.spacing(4)}px)`,
      height: `calc(100% - ${theme.spacing(5)}px)`,
      maxWidth: maxWidth,
      padding: theme.spacing(1),
      marginTop: theme.spacing(2),
      marginRight: theme.spacing(2),
      borderRadius: 20,
    },
    paperLeftSide: {
      flexGrow: 1,
      width: width ? width : `calc(100% - ${theme.spacing(4)}px)`,
      //   height: `calc(100% - ${theme.spacing(5)}px)`,
      maxHeight: maxHeight ? maxHeight : `calc(100% - ${theme.spacing(5)}px)`,
      maxWidth: maxWidth,
      padding: theme.spacing(0.5),
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(1),
      borderRadius: 20,
    },
    permanent: {
      position: "relative",
      maxWidth: maxWidth,
      border: 0,
      borderRadius: 0,
    },
  }))

//Renders Swipeable drawer, using custom margins and padding for either a left drawer,
//   or a right drawer. Anchor is "right" or "left", "top", or "bottom"
export default function CustomDrawer({
  children,
  isOpen,
  anchor,
  toggleDrawer,
  maxWidth = 1000,
  maxHeight,
  width,
  height,
  permanent = false,
}) {
  const classes = useStyles({ maxWidth, maxHeight, width, height })()

  //use very fancy object literal instead of switch statement
  const paperPropsSwitch = (anchor) =>
    ({
      right: classes.paperRightSide,
      left: classes.paperLeftSide,
    }[anchor])
  if (permanent) {
    return (
      <Drawer
        variant={"permanent"}
        transitionDuration={{ enter: 200, exit: 200 }}
        anchor={anchor}
        open={isOpen}
        width={maxWidth}
        classes={{
          paper: classes.permanent,
        }}
      >
        <motion.div
          variants={{
            visible: {
              transition: {
                delayChildren: 10000,
              },
            },
          }}
        >
          {children}
        </motion.div>
      </Drawer>
    )
  } else {
    return (
      <SwipeableDrawer
        transitionDuration={{ enter: 200, exit: 200 }}
        anchor={anchor}
        open={isOpen}
        width={maxWidth}
        onClose={toggleDrawer()}
        onOpen={toggleDrawer()}
        classes={{
          paper: paperPropsSwitch(anchor),
        }}
      >
        <motion.div
          variants={{
            visible: {
              transition: {
                delayChildren: 10000,
              },
            },
          }}
        >
          {children}
        </motion.div>
      </SwipeableDrawer>
    )
  }
}
