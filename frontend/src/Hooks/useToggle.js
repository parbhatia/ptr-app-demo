import { useState, useCallback } from "react"

export default function useToggle(initialValue) {
  const [toggleValue, setToggleValue] = useState(initialValue)
  const toggler = useCallback(() => setToggleValue(!toggleValue), [toggleValue])

  return [toggleValue, toggler]
}
