import { grey, red } from "@material-ui/core/colors"
import CssBaseline from "@material-ui/core/CssBaseline"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import { SnackbarProvider } from "notistack"
import React, { useLayoutEffect, useState } from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router, Route } from "react-router-dom"
import App from "./App"
import ThemeContext from "./Context/ThemeContext"
import * as serviceWorker from "./serviceWorker"

//Creates MUI Theme
//isDark is a boolean
const createTheme = (isDark) => {
  const primaryColor = grey[100]
  const secondaryColor = red[700]
  return createMuiTheme({
    popoverPaper: {
      width: "100%",
      height: "100%",
      maxHeight: "unset",
      maxWidth: "unset",
    },
    overrides: {
      MuiAppbar: {
        root: {
          elevation: 0,
        },
      },
      MuiInputBase: {
        root: {
          borderRadius: 0,
        },
      },
      MuiInputLabel: {
        root: {
          // color: darkGrey,
          "&$focused": {
            "&$focused": {
              color: secondaryColor,
            },
          },
        },
      },

      MuiListItem: {
        root: {
          "border-radius": "15px",
        },
      },
      MuiTextField: {
        root: {
          // "border-radius": "25px",
        },
      },

      // MuiFilledInput: {
      //   root: {
      //     "border-top-left-radius": "15px",
      //     "border-top-right-radius": "15px",
      //     "border-radius": "15px",
      //     borderColor: "green",
      //     boxShadow: "0 7px 30px -10px rgba(150,170,180,0.5)",
      //     "&$focused $notchedOutline": {
      //       borderColor: "green",
      //       borderWidth: 4,
      //     },
      //   },
      //   underline: {
      //     "&&&:before": {
      //       borderBottom: "none",
      //     },
      //     "&&:after": {
      //       borderBottom: "none",
      //     },
      //   },
      // },
      MuiOutlinedInput: {
        root: {
          borderColor: grey[500],
          // borderRadius: 15,
          // boxShadow: !isDark
          //   ? "0 1px 3px rgba(0, 16, 44, 0.08), 0 2px 4px rgba(0, 16, 44, 0.12)"
          //   : "0 7px 30px -10px rgb(66, 65, 65)",
          // "&$focused $notchedOutline": {
          //   borderColor: lightGrey,
          //   borderWidth: 2,
          // },
          // boxShadow: !isDark
          //   ? "0 7px 30px -10px rgba(150,170,180,0.5)"
          //   : "0 7px 30px -10px rgb(66, 65, 65)",
          "&$focused $notchedOutline": {
            borderColor: grey[500],
            borderWidth: 1,
          },
          // notchedOutline: {
          //   border: 0,
          // },
        },
      },
      MuiAppBar: {
        root: {
          borderRadius: 0,
          // "border-bottom": "1px solid black",
        },
        // colorPrimary: {
        //   backgroundColor: "primary",
        // },
        // colorDefault: {
        //   backgroundColor: "primary",
        //   // backgroundColor: "transparent",
        // },
      },
      MuiTabs: {
        indicator: {
          backgroundColor: secondaryColor,
        },
      },
      MuiCard: {
        root: {
          borderRadius: 10,
        },
      },
      MuiPaper: {
        root: {
          borderRadius: 10,
        },
        outlined: {
          borderRadius: 10,
        },
        //for app bar's box shadow removal
        elevation4: {
          boxShadow: 0,
        },
      },
      MuiTab: {
        root: {
          "&:hover": {
            backgroundColor: "transparent",
            color: secondaryColor,
          },
          "&$selected": {
            backgroundColor: "transparent",
          },
        },
        textColorPrimary: {
          "&$selected": {
            color: secondaryColor,
          },
          selected: secondaryColor,
        },
      },
    },

    palette: {
      primary: {
        main: primaryColor,
        // dark: secondaryColor,
      },
      type: isDark ? "dark" : "light",
      secondary: {
        main: secondaryColor,
      },
      background: {
        default: isDark ? "#212121" : "	#f1f1f1",
        paper: isDark ? "#181818" : "#ffffff",
      },
    },
    shape: {
      borderRadius: 7,
    },
    typography: {
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
      fontSize: 17,
    },
  })
}

const ThemedApp = () => {
  const [dark, setDark] = useState(false)
  const toggle = () => {
    setDark(!dark)
    window.localStorage.setItem("darkTheme", !dark)
  }
  const myTheme = createTheme(dark)

  // paints the app before it renders elements
  useLayoutEffect(() => {
    const lastTheme = window.localStorage.getItem("darkTheme")
    if (lastTheme === "true") {
      setDark(true)
    }
    if (!lastTheme || lastTheme === "false") {
      setDark(false)
    }
  }, [dark])

  return (
    <ThemeContext.Provider
      value={{
        dark,
        toggle,
      }}
    >
      <SnackbarProvider
        autoHideDuration={1700}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        maxSnack={3}
      >
        <MuiThemeProvider theme={myTheme}>
          <CssBaseline />
          <Router>
            <Route component={App} />
          </Router>
        </MuiThemeProvider>
      </SnackbarProvider>
    </ThemeContext.Provider>
  )
}

ReactDOM.render(<ThemedApp />, document.getElementById("root"))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
