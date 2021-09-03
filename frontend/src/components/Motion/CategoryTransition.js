import { motion } from "framer-motion"

import React from "react"
import { categoryVariations, categoryTransitions } from "./variants"
import Div100vh from "react-div-100vh"
import { useTheme } from "@material-ui/core/styles"

const spring = {
  type: "spring",
  damping: 500,
  stiffness: 200,
  velocity: 2,
  mass: 0.15,
}

const TransitionWrapper = ({ children, noDiv100 = false }) => {
  const theme = useTheme()

  const initialAnim = {
    x: "50%",
    opacity: 0,
  }

  return (
    <motion.div
      style={{
        overflowX: !noDiv100 ? "hidden" : "show",
        margin: 0,
        padding: 0,
      }}
    >
      <motion.div
        transition={spring}
        animate={{
          x: 0,
          opacity: 1,
        }}
        initial={initialAnim}
      >
        {!noDiv100 ? (
          <Div100vh
            style={{
              minHeight: `calc(100rvh  - ${theme.spacing(6)}px - ${
                theme.mixins.toolbar.minHeight
              }px - ${theme.mixins.toolbar.minHeight}px) `,
            }}
          >
            {children}
          </Div100vh>
        ) : (
          children
        )}
      </motion.div>
    </motion.div>
  )
}

export default TransitionWrapper
