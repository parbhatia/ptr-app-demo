import { motion } from "framer-motion"
import React from "react"
import { Link } from "react-router-dom"
import IconMachine from "../Misc/IconMachine"
import Button from "../Misc/ReusableButtonLink"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles((theme) => ({
  label: {
    justifyContent: "start",
  },
}))

export const SideItemGenerator = ({
  title,
  item,
  animate = true,
  size = "large",
}) => {
  const classes = useStyles()
  return (
    <AnimatedSideItem animate={animate}>
      <Button
        size={size}
        color={title === item.label ? "secondary" : "inherit"}
        aria-label="open drawer"
        edge="start"
        variant={title === item.label ? "outlined" : "text"}
        fullWidth
        className={classes.label}
        component={item.menu ? "button" : Link}
        to={item.menu ? null : item.url}
        startIcon={IconMachine(item.startIcon)}
        onClick={item.action ? item.action : null}
      >
        {item.label}
      </Button>
    </AnimatedSideItem>
  )
}

export const AnimatedSideItem = ({ animate = true, children }) =>
  animate ? (
    <motion.div
      initial={{
        opacity: 0,
        y: 0,
        x: -100,
      }}
      animate={{
        opacity: 1,
        y: 0,
        x: 0,
      }}
      transition={{
        duration: 0.3,
      }}
    >
      {children}
    </motion.div>
  ) : (
    <>{children}</>
  )
