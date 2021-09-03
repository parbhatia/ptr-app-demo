/* eslint-disable no-use-before-define */
import React from "react"
import TextField from "@material-ui/core/TextField"
import Autocomplete from "@material-ui/lab/Autocomplete"
import parse from "autosuggest-highlight/parse"
import match from "autosuggest-highlight/match"
import useSWR from "swr"
import HistoryIcon from "@material-ui/icons/History"
import Box from "@material-ui/core/Box"
import axios from "axios"

export default function AutoCompleteItems({
  fetchUrl,
  size = "medium",
  addItem,
  label = "",
}) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [inputValue, setInputValue] = React.useState("")
  const searchFetchUrl = `${fetchUrl}/search?search=${searchQuery}`
  const { data, mutate } = useSWR(searchFetchUrl, async () => {
    const { data } = await axios.get(searchFetchUrl)
    setOpen(true)
    return data
  })

  React.useEffect(() => {
    mutate()
  }, [searchQuery])

  const highlightStyle = {
    fontWeight: 700,
    // backgroundColor: "lightyellow",
    padding: "5px 2px",
  }

  return (
    <Autocomplete
      id={`${fetchUrl}-autocomplete`}
      open={open}
      value={null}
      size={size}
      freeSolo
      style={{ width: "100%" }}
      getOptionSelected={(option, value) => option.text === value.text}
      options={data ? data.checkboxes : []}
      getOptionLabel={(option) => (option.text ? option.text : option)}
      filterOptions={(options, state) => {
        return options
      }}
      loading={!data}
      inputValue={inputValue}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            label={label}
            variant="outlined"
            margin="normal"
            inputProps={{
              ...params.inputProps,
              autoCapitalize: "true",
              spellCheck: true,
            }}
          />
        )
      }}
      onChange={async (ev, option, reason) => {
        if (reason === "create-option") {
          await addItem(option)
          setInputValue("")
          setSearchQuery("")
          setOpen(false)
        } else if (reason === "select-option") {
          setInputValue(option.text)
          setOpen(false)
        }
      }}
      onInputChange={(event, newInputValue, reason) => {
        if (reason === "input") {
          setInputValue(newInputValue)
          setSearchQuery(newInputValue)
        }
      }}
      renderOption={(option, { inputValue }) => {
        const matches = match(option.text, inputValue)
        const parts = parse(option.text, matches)
        // console.log(matches, parts)

        return (
          <Box display="flex" alignItems="center" justifyContent="center">
            <Box display="flex" alignItems="center" pr={1}>
              <HistoryIcon />
            </Box>
            <Box>
              {parts.map((part, index) => (
                <span key={index} style={part.highlight ? highlightStyle : {}}>
                  {part.text}
                </span>
              ))}
            </Box>
          </Box>
        )
      }}
    />
  )
}
