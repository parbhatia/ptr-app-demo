import { motion } from "framer-motion"
import React from "react"
import { subsectionVariations, subsectionTransitions } from "./variants"

const TransitionWrapper = ({ children }) => {
  return (
    <motion.div
      style={{ position: "absolute", width: "100%" }}
      initial="out"
      animate="in"
      exit="out"
      variants={subsectionVariations}
      transition={subsectionTransitions}
    >
      {children}
    </motion.div>
  )
}

export default TransitionWrapper
