import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import Container from "@material-ui/core/Container"
import Paper from "@material-ui/core/Paper"
import { makeStyles } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import React, { useState, useContext } from "react"
import ThemeContext from "../Context/ThemeContext"
import { Controller, useForm } from "react-hook-form"
import { MAX_ALLOWED_RETRY_LOGINS } from "./../config"
import { useAuthDataContext } from "./Auth/AuthDataProvider"
import { logoSmall, logoSmallDark } from "../config"

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  logo: {
    paddingBottom: theme.spacing(2),
  },
  root: {
    background: theme.palette.action.selected,
  },
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  },
  innerContainer: {
    padding: theme.spacing(2),
    borderRadius: 10,
  },
}))

export default function SignIn() {
  const { onLogin } = useAuthDataContext()
  const { dark } = useContext(ThemeContext)
  const classes = useStyles()
  const { control, errors, handleSubmit, reset } = useForm()
  const [numberOfLogins, setNumberOfLogins] = useState(0)
  const logo = dark ? logoSmallDark : logoSmall

  const ValidatorMachine = (name, errorType) =>
    ({
      password: {
        error: errors[name] !== undefined,
        helperText: errors[name] ? errors[name].message : "",
        rules: {
          pattern: {
            required: "Required Field",
            value: /^.{8,}$/,
            message: "Invalid password",
          },
        },
      },
      email: {
        error: errors[name] !== undefined,
        helperText: errors[name] ? errors[name].message : "",
        rules: {
          required: "Required Field",
          pattern: {
            value:
              /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            message: "Invalid Email",
          },
        },
      },
    }[errorType])

  const onSubmit = async (data) => {
    const { email, password } = data
    try {
      setNumberOfLogins((prevNum) => prevNum + 1)
      const response = await fetch("/requestlogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })
      if (response.status === 200) {
        const user = await response.json()
        await onLogin(user)
      } else {
        throw new Error("Invalid Login.")
      }
    } catch (e) {
      reset()
    }
  }

  return (
    <div className={classes.root}>
      {numberOfLogins > MAX_ALLOWED_RETRY_LOGINS - 1 &&
        window.location.replace("/error.html")}
      <Container disableGutters maxWidth="sm" className={classes.container}>
        <Paper variant="outlined" className={classes.innerContainer}>
          <Box p={1} display="flex" justifyContent="center">
            <img src={logo} className={classes.logo} alt="logo" />
          </Box>
          <Box>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box p={1}>
                <Controller
                  render={(props) => {
                    const { ref, ...rest } = props
                    return (
                      <TextField
                        {...rest}
                        inputRef={ref}
                        variant="outlined"
                        label="Email"
                        fullWidth
                        inputProps={{
                          autoCapitalize: "none",
                        }}
                        // helperText={errors.email ? errors.email.message : null}
                        error={errors.email !== undefined}
                      />
                    )
                  }}
                  name="email"
                  control={control}
                  autoFocus
                  {...ValidatorMachine("email", "email")}
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
                        label="Password"
                        type="password"
                        fullWidth
                        inputProps={{
                          autoCapitalize: "none",
                        }}
                        // helperText={
                        //   errors.password ? errors.password.message : null
                        // }
                        error={errors.password !== undefined}
                      />
                    )
                  }}
                  name="password"
                  control={control}
                  {...ValidatorMachine("password", "password")}
                  defaultValue=""
                />
              </Box>
              <Box p={1}>
                <Button
                  type="submit"
                  size="large"
                  variant="outlined"
                  fullWidth
                  className={classes.submit}
                >
                  Sign In
                </Button>
              </Box>
            </form>
          </Box>
        </Paper>
      </Container>
    </div>
  )
}
