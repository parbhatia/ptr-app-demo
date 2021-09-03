import { useState } from "react"

//custom input hook, allows reset!
const useInputChange = (defaultInput) => {
  const [input, setInput] = useState(!defaultInput ? "" : defaultInput)
  const handleInputChange = (e) => setInput(e.currentTarget.value)
  const reset = (e) => setInput("")
  const setManualEditInput = (t) => setInput(t)
  return [input, reset, handleInputChange, setManualEditInput]
}

export default useInputChange
