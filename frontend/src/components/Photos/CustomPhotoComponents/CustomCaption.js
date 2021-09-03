import React from "react"
import TextField from "@material-ui/core/TextField"
import Autocomplete from "@material-ui/lab/Autocomplete"
import useSWR from "swr"
import axios from "axios"
import { PHOTO_CAPTION_MAX_LENGTH } from "../../../config"

const CustomCaption = ({
  input,
  caption,
  editingCaption,
  handleInputChange,
  setManualEditInput,
}) => {
  const fetchUrl = "/api/masterphotocaptionstore/fetchCaptions"
  const { data: captions } = useSWR(fetchUrl, async () => {
    const { data } = await axios.get(fetchUrl)
    return data.checkboxes
  })
  return editingCaption || caption ? (
    <Autocomplete
      freeSolo
      size="small"
      id="free-solo-photo-caption"
      disableClearable
      loading={!captions}
      options={captions ? captions.map((option) => option.text) : []}
      onInputChange={(event, newInputValue, reason) => {
        if (reason === "input") {
          handleInputChange(event)
        } else if (reason === "reset") {
          if (newInputValue !== "") {
            setManualEditInput(newInputValue)
          }
        }
      }}
      inputValue={input}
      disabled={!editingCaption}
      renderInput={(params) => (
        <TextField
          {...params}
          // label="Add Caption"
          margin="normal"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            type: "search",
            inputProps: {
              ...params.inputProps,
              maxLength: PHOTO_CAPTION_MAX_LENGTH,
              autoCapitalize: "true",
              spellCheck: true,
            },
          }}
        />
      )}
    />
  ) : null
}

export default CustomCaption
