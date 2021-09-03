const pageVariations = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  in: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
    y: -20,
  },
  out: {
    opacity: 0,
  },
}
const pageTransitions = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
}

const subsectionVariations = {
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    scale: 0.9,
  },
}
const subsectionTransitions = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
}

const categoryVariations = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  in: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
    y: -20,
  },
  out: {
    opacity: 0,
  },
}
const categoryTransitions = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
}

// const pageTransitions = {
//   type: "spring",
//   stiffness: 80,
// }

export {
  categoryVariations,
  categoryTransitions,
  subsectionVariations,
  subsectionTransitions,
  pageVariations,
  pageTransitions,
}
