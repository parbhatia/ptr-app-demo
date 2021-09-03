import Box from "@material-ui/core/Box"
import ButtonBase from "@material-ui/core/ButtonBase"
import CardHeader from "@material-ui/core/CardHeader"
import LinearProgress from "@material-ui/core/LinearProgress"
import { makeStyles } from "@material-ui/core/styles"
import React from "react"
import {
  Link,
  Route,
  Switch,
  useLocation,
  useRouteMatch,
} from "react-router-dom"
import useInputHook from "../../../Hooks/useInputHook"
import useConfirmationDialog from "../../../Hooks/useConfirmationDialog"
import TextField from "../../Misc/ReusableTextField"
import MasterPageCreator from "./MasterPageCreator"
import MasterPageStoreItem from "./MasterPageStoreItem"
import useMasterPageStores from "../../../Hooks/useMasterPageStores"
const useStyles = makeStyles((theme) => ({
  button: {
    width: "100%",
  },
  root: {
    backgroundColor: theme.palette.background.paper,
  },
}))

export default function MasterPageStores() {
  const classes = useStyles()
  const location = useLocation()
  const { url, path } = useRouteMatch()
  const [confirm, confirmationDialog] = useConfirmationDialog()
  const [data, helpers] = useMasterPageStores()
  const [input, reset, handleInputChange, ,] = useInputHook()

  return (
    <>
      {!data ? (
        <div style={{ margin: 50 }}>
          <LinearProgress />
        </div>
      ) : (
        <Switch location={location}>
          <Route
            exact
            path={path}
            render={() => (
              <Box
                p={1}
                display="flex"
                flexDirection="column"
                alignContent="center"
                justifyContent="center"
              >
                {data.templates.map((template, index) => (
                  <MasterPageStoreItem
                    key={template.id}
                    index={index}
                    template={template}
                    url={url}
                    helpers={helpers}
                    confirm={confirm}
                  />
                ))}
                {confirmationDialog}
                <Box>
                  <TextField
                    name="manualInput"
                    // variant="outlined"
                    value={input}
                    placeholder="Add Template"
                    inputProps={{
                      maxLength: 60,
                    }}
                    onChange={handleInputChange}
                    onKeyPress={async (ev) => {
                      if (ev.key === "Enter" && input !== "") {
                        ev.preventDefault()
                        await helpers.addPageStore({ name: input })
                        reset()
                      }
                    }}
                    onBlur={async () => {
                      if (input !== "") {
                        await helpers.addPageStore({ name: input })
                        reset()
                      }
                    }}
                  />
                </Box>
              </Box>
            )}
          />
          <Route
            path={`${path}/:templateId`}
            render={() => (
              <>
                <ButtonBase
                  component={Link}
                  to={url}
                  className={classes.button}
                >
                  <CardHeader
                    titleTypographyProps={{ variant: "h5" }}
                    title={"Templates"}
                  />
                </ButtonBase>
                <MasterPageCreator />
              </>
            )}
          />
        </Switch>
      )}
    </>
  )
}
