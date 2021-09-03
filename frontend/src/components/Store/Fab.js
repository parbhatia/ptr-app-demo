import Fab from "@material-ui/core/Fab"
import { makeStyles } from "@material-ui/core/styles"
import LibraryAddCheckOutlinedIcon from "@material-ui/icons/LibraryAddCheckOutlined"
import React from "react"
import { motion } from "framer-motion"

const useStyles = makeStyles((theme) => ({
  storeFab: {
    position: "fixed",
    bottom: theme.spacing(13),
    right: theme.spacing(1.5),
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}))

//Receives functions from parent to toggle renders of Fabs
export default function FloatingActionButtonZoom({ toggleStore }) {
  const classes = useStyles()
  return (
    <motion.div
      className={classes.storeFab}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.8 }}
    >
      <Fab
        variant="extended"
        size="medium"
        disableRipple
        aria-label="Add"
        onClick={() => toggleStore()}
        // className={classes.storeFab}
        color="primary"
      >
        <LibraryAddCheckOutlinedIcon className={classes.extendedIcon} />
        Store
      </Fab>
    </motion.div>
  )
}
