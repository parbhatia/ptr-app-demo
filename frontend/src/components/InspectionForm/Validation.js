//name is unique field name
const ValidatorMachine = (name, errorType, errors) =>
  ({
    required: {
      error: errors[name] !== undefined,
      helperText: errors[name] ? errors[name].message : "",
      rules: {
        required: "Required Field",
      },
    },
    requiredAlphabetic: {
      error: errors[name] !== undefined,
      helperText: errors[name] ? errors[name].message : "",
      rules: {
        required: "Required Field",
        pattern: {
          value: /^[a-zA-Z ]*$/,
          message: "Only alphabetic letters allowed",
        },
      },
    },
    name: {
      error: errors[name] !== undefined,
      helperText: errors[name] ? errors[name].message : "",
      rules: {
        required: "Required Field",
        maxLength: {
          value: 30,
          message: "Name is too big",
        },
        pattern: {
          value: /^[a-zA-Z ]*$/,
          message: "Only alphabetic letters allowed",
        },
      },
    },
    alphabetic: {
      error: errors[name] !== undefined,
      helperText: errors[name] ? errors[name].message : "",
      rules: {
        pattern: {
          value: /^[a-zA-Z ]*$/,
          message: "Only alphabetic letters allowed",
        },
      },
    },
    phone: {
      error: errors[name] !== undefined,
      helperText: errors[name] ? errors[name].message : "",
      rules: {
        minLength: {
          value: 14,
          message: "Too Short",
        },
        pattern: {
          value: /[0-9]+/,
          message: "Only numbers allowed",
        },
      },
    },
    postalcode: {
      error: errors[name] !== undefined,
      helperText: errors[name] ? errors[name].message : "",
      rules: {
        pattern: {
          value: /^[ABCEGHJKLMNPRSTVXYabceghjklmnprstvxy]{1}\d{1}[A-Za-z]{1}[ ]{0,1}\d{1}[A-Za-z]{1}\d{1}$/,
          message: "Postal Code must be valid",
        },
      },
    },
    email: {
      error: errors[name] !== undefined,
      helperText: errors[name] ? errors[name].message : "",
      rules: {
        minLength: {
          value: 3,
          message: "Invalid Email",
        },
        pattern: {
          value: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
          message: "Invalid Email",
        },
      },
    },
    requiredEmail: {
      error: errors[name] !== undefined,
      helperText: errors[name] ? errors[name].message : "",
      rules: {
        required: "Required Field",
        pattern: {
          value: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
          message: "Invalid Email",
        },
      },
    },
  }[errorType])

export default ValidatorMachine
