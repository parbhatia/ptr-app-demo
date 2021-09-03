import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useContext,
} from "react"
import Cookies from "js-cookie"

import { useHistory } from "react-router-dom"

export const AuthDataContext = createContext(null)

const initialAuthData = null

const AuthDataProvider = (props) => {
  const [authData, setAuthData] = useState(initialAuthData)
  const history = useHistory()
  /* The first time the component is rendered, it tries to
   * fetch the auth data from a source, like a cookie or
   * the localStorage.
   */
  useEffect(() => {
    async function onFirstRender() {
      try {
        setAuthData({
          user: {
            authenticating: true,
          },
        })
        //check for existence of existing ptr passport cookie, which indicates if user had previously logged in
        const passportToken = Cookies.get("ptr-passport")
        //we only make any requests to login if such a previous passport exists
        if (!passportToken) {
          setAuthData(initialAuthData)
          history.push({
            pathname: "/login",
          })
          return
        }
        const response = await fetch("/requestlogin", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "same-origin",
        })
        if (response.status === 200) {
          const user = await response.json()
          setAuthData({
            user,
          })
        } else {
          throw new Error("Couldn't verify existing auth")
        }
      } catch (e) {
        setAuthData(initialAuthData)
        //redirect to login
        history.push({
          pathname: "/login",
        })
      }
    }
    onFirstRender()
  }, [])

  const onLogout = async () => {
    try {
      const response = await fetch("/requestlogout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
      })
      if (response.status === 200) {
        //route handler will redirect automatically
        setAuthData(initialAuthData)
      } else {
        throw new Error("Accessing server")
      }
    } catch (e) {
      console.log("Error logging out", e)
      setAuthData(initialAuthData)
    }
  }

  const onLogin = (user) => {
    setAuthData({
      user,
    })
    history.push({
      pathname: "/",
    })
  }

  const authDataValue = useMemo(
    () => ({ ...authData, onLogin, onLogout }),
    [authData, onLogin],
  )

  return <AuthDataContext.Provider value={authDataValue} {...props} />
}

export const useAuthDataContext = () => useContext(AuthDataContext)
export default AuthDataProvider
