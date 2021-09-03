import PropTypes from "prop-types"
import MaskedInput from "react-text-mask"
import Input from "@material-ui/core/Input"
import TextField from "@material-ui/core/TextField"
import IconMachine from "../../Misc/IconMachine"
import InputAdornment from "@material-ui/core/InputAdornment"

function TextMaskCustom(props) {
  const { inputRef, ...other } = props

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null)
      }}
      mask={[
        "(",
        /[1-9]/,
        /\d/,
        /\d/,
        ")",
        " ",
        /\d/,
        /\d/,
        /\d/,
        "-",
        /\d/,
        /\d/,
        /\d/,
        /\d/,
      ]}
      guide={false}
      // placeholderChar={"\u2000"}
      // showMask
    />
  )
}

TextMaskCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
}

const AttributeTextField = ({
  controllerProps,
  attributeType,
  errors,
  placeHolder,
}) => {
  const { ref, ...rest } = controllerProps
  if (attributeType === "phone") {
    return (
      <>
        <Input
          {...rest}
          inputRef={ref}
          startAdornment={IconMachine(attributeType, "small")}
          inputComponent={TextMaskCustom}
          error={errors.attributeValue !== undefined}
          fullWidth
        />
        {errors.attributeValue ? errors.attributeValue.message : null}
      </>
    )
  } else {
    return (
      <TextField
        {...rest}
        inputRef={ref}
        placeholder={placeHolder}
        size="small"
        inputProps={{
          autoCapitalize: "none",
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {IconMachine(attributeType, "small")}
            </InputAdornment>
          ),
        }}
        helperText={
          errors.attributeValue ? errors.attributeValue.message : null
        }
        error={errors.attributeValue !== undefined}
        fullWidth
      />
    )
  }
}

export default AttributeTextField
