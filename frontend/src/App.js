import Box from "@material-ui/core/Box"
import axios from "axios"
import { AnimatePresence } from "framer-motion"
import React, { lazy, Suspense, useEffect, useState } from "react"
import { Redirect, Route, Switch, useLocation } from "react-router-dom"
import "./App.css"
import AuthDataProvider, {
  useAuthDataContext,
} from "./components/Auth/AuthDataProvider"
import LazyLoading from "./components/LoadingComponents/LazyLoading"
import Login from "./components/Login"
import OfflineComponent from "./components/Misc/OfflineComponent"
import PageNotFound from "./components/Misc/PageNotFound"
import PageTransition from "./components/Motion/PageTransition"
import StyledContainer from "./components/StyledContainers/StyledContainer"
import useDetectOfflineHook from "./Hooks/useDetectOfflineHook"
import useError from "./Hooks/useError"
import useRenderMenuBar from "./Hooks/useRenderMenuBar"

const Home = lazy(() => import("./components/Home"))
const InspectionWrapper = lazy(() =>
  import("./components/Inspection/InspectionWrapper"),
)
const MasterFileStore = lazy(() =>
  import("./components/Master Storage/Master File Store/MasterFileStore"),
)
const MasterPageStore = lazy(() =>
  import("./components/Master Storage/Master Page Store/MasterPageStores"),
)
const MasterPhotoCaptionStore = lazy(() =>
  import(
    "./components/Master Storage/Master Photo Caption Store/MasterPhotoCaptionStore"
  ),
)
const MasterStore = lazy(() =>
  import("./components/Master Storage/Master Store/MasterStore"),
)
const PersonManager = lazy(() =>
  import("./components/Contact Management/Persons/PersonManager"),
)
const PhotoCategoryManager = lazy(() =>
  import("./components/Photos/CategoryManager"),
)
const EmailRecords = lazy(() => import("./components/Email/EmailRecords"))

const RouteHandler = () => {
  const { user } = useAuthDataContext()
  const online = useDetectOfflineHook()
  const location = useLocation()

  if (!online) return <OfflineComponent />
  else if (!user) return <Route render={() => <Login />} />
  else if (user.authenticating) return <LazyLoading />
  else
    return (
      <Suspense fallback={<LazyLoading />}>
        <AnimatePresence exitBeforeEnter>
          <Switch location={location}>
            <Route
              key={"home"}
              exact
              path="/"
              render={() => (
                <PageTransition>
                  <GlobalMenuBar />
                  <Home />
                </PageTransition>
              )}
            />
            <Route
              key={"itemstore"}
              path="/Item Store"
              render={() => (
                <PageTransition>
                  <GlobalMenuBar />
                  <MasterStore parent={{ id: 1 }} />
                </PageTransition>
              )}
            />
            <Route
              key={"inspection"}
              path="/Inspection/:id"
              render={() => (
                <PageTransition>
                  <InspectionWrapper />
                </PageTransition>
              )}
            />
            <Route
              key={"inspectiontemplates"}
              path="/Inspection Templates"
              render={() => (
                <PageTransition>
                  <GlobalMenuBar />
                  <StyledContainer size="lg">
                    <MasterPageStore />
                  </StyledContainer>
                </PageTransition>
              )}
            />
            <Route
              key={"refphotos"}
              path="/Reference Photos"
              render={() => (
                <PageTransition>
                  <GlobalMenuBar />
                  <StyledContainer size="lg">
                    <PhotoCategoryManager type="master_reference" />
                  </StyledContainer>
                </PageTransition>
              )}
            />
            <Route
              key={"refphotocaptionstore"}
              path="/Photo Captions"
              render={() => (
                <PageTransition>
                  <GlobalMenuBar />
                  <StyledContainer size="lg">
                    <MasterPhotoCaptionStore />
                  </StyledContainer>
                </PageTransition>
              )}
            />
            <Route
              key={"outbox"}
              path="/Outbox"
              render={() => (
                <PageTransition>
                  <GlobalMenuBar />
                  <StyledContainer size="lg">
                    <EmailRecords
                      header="Outbox"
                      caption="Record of all sent Emails"
                      fetchUrl={`/api/emailrecords/ofUser`}
                      disablePagination={false}
                    />
                  </StyledContainer>
                </PageTransition>
              )}
            />
            <Route
              key={"contacts"}
              path="/Contacts"
              render={() => (
                <PageTransition>
                  <GlobalMenuBar />
                  <StyledContainer size="lg">
                    <PersonManager fetchUrl={`/api/person`} displayAttributes />
                  </StyledContainer>
                </PageTransition>
              )}
            />
            <Route
              key={"myfiles"}
              path="/My Files"
              render={() => (
                <PageTransition>
                  <GlobalMenuBar />
                  <StyledContainer size="lg">
                    <MasterFileStore />
                  </StyledContainer>
                </PageTransition>
              )}
            />
            <Route
              key={"login"}
              path="/login"
              render={() => <Redirect to={"/"} />}
            />

            <Route
              key={"catchall"}
              path="*"
              render={() => (
                <PageTransition>
                  <Box
                    height="100vh"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                  >
                    <PageNotFound />
                  </Box>
                </PageTransition>
              )}
            />
          </Switch>
        </AnimatePresence>
      </Suspense>
    )
}

export const globalRoutesList = [
  {
    label: "Home",
    url: "/",
    startIcon: "home",
  },
  {
    label: "Contacts",
    url: "/Contacts",
    startIcon: "person",
  },
  {
    label: "Outbox",
    url: "/Outbox",
    startIcon: "email",
  },

  {
    label: "Inspection Templates",
    url: "/Inspection Templates",
    startIcon: "pageStore",
  },
  {
    label: "Item Store",
    url: "/Item Store",
    startIcon: "store",
  },
  {
    label: "Photo Captions",
    url: "/Photo Captions",
    startIcon: "photoCaptions",
  },
  // {
  //   label: "Reference Photos",
  //   url: "/Reference Photos",
  //   startIcon: "photos",
  // },
  {
    label: "My Files",
    url: "/My Files",
    startIcon: "file",
  },
]

const GlobalMenuBar = () => {
  const { AppBarComponent } = useRenderMenuBar({
    type: "global",
    titleMatchPath: "/:pageName",
  })
  return AppBarComponent
}

function isNetworkError(err) {
  return !!err.isAxiosError && !err.response
}

//Each PrivateRoute takes a isNavRoute prop and renders MenuBar
const App = () => {
  const [networkError, setNetworkError] = useState(false)
  const [notify] = useError()
  useEffect(() => {
    axios.interceptors.response.use(
      (res) => res,
      (err) => {
        if (axios.isCancel(err)) {
          //we don't display any notifications for user cancelled actions, since they get pretty annoying
          return
        }
        if (err.response.status === 500) {
          setNetworkError(true)
        } else if (isNetworkError(err)) {
          console.log("Network Error!")
          setNetworkError(true)
        } else {
          notify(`Error: ${err}`, "error")
        }
        return Promise.reject(err)
      },
    )
  }, [])
  if (networkError)
    return (
      <OfflineComponent
        message={
          "Consecutive errors detected. There is a problem with the Server's network"
        }
      />
    )
  return (
    <AuthDataProvider>
      <RouteHandler />
    </AuthDataProvider>
  )
}

export default App
