import Avatar from "@material-ui/core/Avatar"
import Chip from "@material-ui/core/Chip"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import ListItemText from "@material-ui/core/ListItemText"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import Autocomplete from "@material-ui/lab/Autocomplete"
import React from "react"
import { Controller } from "react-hook-form"
import { mutate } from "swr"
import axios from "axios"

//Displays persons and emails of an inspection
export default function PeopleAndEmails({
  personsAndEmailsData: { personsAndEmails },
  control,
  errors,
  inspectionId,
  fieldName,
  required = false,
}) {
  return (
    <Controller
      render={(props) => (
        <Autocomplete
          id={`/api/inspection/${inspectionId}/people/getPersonsAndEmails/${fieldName}`}
          {...props}
          onOpen={() => {
            //fetch data
            mutate(
              `/api/inspection/${inspectionId}/people/getPersonsAndEmails`,
              async () => {
                const { data } = await axios.get(
                  `/api/inspection/${inspectionId}/people/getPersonsAndEmails`,
                )
                return data.personsAndEmails
              },
            )
          }}
          multiple
          autoComplete
          filterSelectedOptions
          noOptionsText={"No Emails found"}
          loading={!personsAndEmails}
          loadingText={`Loading People`}
          options={personsAndEmails ? personsAndEmails : []}
          getOptionSelected={(option, value) => {
            // unique key will be combination of all three fields
            return (
              option.email === value.email &&
              option.name === value.name &&
              option.id === value.id
            )
          }}
          getOptionLabel={(option) => option.name}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option.email}
                // size="small"
                {...getTagProps({ index })}
              />
            ))
          }
          renderOption={(option, { selected }) => (
            <>
              <ListItemAvatar>
                <Avatar>{option.name.charAt(0).toUpperCase()}</Avatar>
              </ListItemAvatar>

              <ListItemText
                disableTypography={false}
                primary={option.name}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      color="textPrimary"
                    >
                      {option.email}
                    </Typography>
                  </React.Fragment>
                }
              />
            </>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label={fieldName[0].toUpperCase() + fieldName.slice(1)}
              InputLabelProps={{
                shrink: true,
              }}
              helperText={errors[fieldName] ? errors[fieldName].message : null}
              error={errors[fieldName] !== undefined}
              variant="outlined"
            />
          )}
          onChange={(_, data) => props.onChange(data)}
        />
      )}
      name={fieldName}
      control={control}
      error={errors[fieldName] !== undefined}
      helperText={errors[fieldName] ? errors[fieldName].message : ""}
      rules={
        required
          ? {
              required: "Required Field",
              validate: (value) => {
                if (value.length >= 1) return true
                else {
                  return "Required Field"
                }
              },
            }
          : null
      }
    />
  )
}
