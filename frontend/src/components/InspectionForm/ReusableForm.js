import Box from "@material-ui/core/Box"
import TextField from "@material-ui/core/TextField"
import moment from "moment"
import React from "react"
import { Controller } from "react-hook-form"
import StyledContainer from "../StyledContainers/StyledContainer"
import ValidatorMachine from "./Validation"

//Just responsible for validation and displaying form components
const ResuableForm = ({ formControl: { control, errors, handleSubmit } }) => {
  const date1 = new Date()
  const format1 = "YYYY-MM-DDTHH:mm"
  const dateTime = moment(date1).format(format1)
  return (
    <StyledContainer>
      <form onSubmit={() => null}>
        <Box p={1}>
          <Controller
            render={(props) => {
              const { ref, ...rest } = props
              return (
                <TextField
                  id="datetime-local"
                  label="Inspection Date/Time"
                  type="datetime-local"
                  variant="outlined"
                  // size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputRef={ref}
                  {...rest}
                />
              )
            }}
            name="date"
            control={control}
            defaultValue={dateTime}
          />
        </Box>
        <Box p={1}>
          <Controller
            render={(props) => {
              const { ref, ...rest } = props
              return (
                <TextField
                  {...rest}
                  inputRef={ref}
                  label="Address"
                  fullWidth
                  // size="small"
                  variant="outlined"
                  helperText={errors.address ? errors.address.message : null}
                  error={errors.address !== undefined}
                />
              )
            }}
            name="address"
            control={control}
            {...ValidatorMachine("address", "required", errors)}
            defaultValue=""
          />
        </Box>
        <Box p={1}>
          <Controller
            render={(props) => {
              const { ref, ...rest } = props
              return (
                <TextField
                  {...rest}
                  inputRef={ref}
                  variant="outlined"
                  label="City"
                  // size="small"
                  fullWidth
                  helperText={errors.city ? errors.city.message : null}
                  error={errors.city !== undefined}
                />
              )
            }}
            name="city"
            control={control}
            {...ValidatorMachine("city", "requiredAlphabetic", errors)}
            defaultValue=""
          />
        </Box>
        <Box p={1}>
          <Controller
            render={(props) => {
              const { ref, ...rest } = props
              return (
                <TextField
                  {...rest}
                  inputRef={ref}
                  fullWidth
                  helperText={
                    errors.postalcode ? errors.postalcode.message : null
                  }
                  variant="outlined"
                  // size="small"
                  label="Postal Code"
                  error={errors.postalcode !== undefined}
                />
              )
            }}
            name="postalcode"
            control={control}
            defaultValue=""
            {...ValidatorMachine("postalcode", "postalcode", errors)}
          />
        </Box>
        <Box p={1}>
          <Controller
            render={(props) => {
              const { ref, ...rest } = props
              return (
                <TextField
                  {...rest}
                  inputRef={ref}
                  fullWidth
                  variant="outlined"
                  disabled
                  // size="small"
                  label="Province"
                />
              )
            }}
            name="province"
            control={control}
            defaultValue="ON"
          />
        </Box>
      </form>
    </StyledContainer>
  )
}

export default ResuableForm
