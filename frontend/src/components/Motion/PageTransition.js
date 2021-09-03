import { motion } from "framer-motion"
import React from "react"
import { pageTransitions, pageVariations } from "./variants"

const TransitionWrapper = ({ children }) => {
  return (
    <motion.div
      style={{ position: "absolute", width: "100%" }}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariations}
      transition={pageTransitions}
    >
      {children}
    </motion.div>
  )
}

export default TransitionWrapper
