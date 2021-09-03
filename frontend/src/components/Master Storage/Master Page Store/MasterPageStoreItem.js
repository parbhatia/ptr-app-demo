import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import Card from "@material-ui/core/Card"
import CardActions from "@material-ui/core/CardActions"
import CardContent from "@material-ui/core/CardContent"
import IconButton from "@material-ui/core/IconButton"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import DeleteIcon from "@material-ui/icons/Delete"
import DoneIcon from "@material-ui/icons/Done"
import EditIcon from "@material-ui/icons/Edit"
import FileCopyIcon from "@material-ui/icons/FileCopy"
import moment from "moment"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import useInputHook from "../../../Hooks/useInputHook"
import TextField from "@material-ui/core/TextField"

// import TextField from "../../Misc/ReusableTextField";

const useStyles = makeStyles((theme) => ({
  button: {
    width: "100%",
  },
  card: {
    marginBottom: theme.spacing(2),
  },
}))

//Unable to mutate the first (default) template, this is fine since our db sorts by id,
//  and we always preserve atleast one template
export default function MasterPageStoreItem({
  index,
  template: { id, name, time_created },
  url,
  helpers,
  dumbComponent = false,
  confirm,
}) {
  const classes = useStyles()
  const [editing, setEditing] = useState(false)
  const [input, reset, handleInputChange, setManualEditInput] =
    useInputHook(name)
  const mutationDisabled = index === 0 || dumbComponent === true
  return (
    <Box>
      <Card variant="outlined" className={classes.card}>
        <CardContent>
          {editing && !mutationDisabled ? (
            <Box display="flex" alignItems="center">
              <Box>
                <TextField
                  name="manualInput"
                  //   variant="outlined"
                  value={input}
                  size="small"
                  margin="none"
                  placeholder="Edit Template"
                  inputProps={{
                    maxLength: 60,
                  }}
                  onChange={handleInputChange}
                />
              </Box>
              <Box pl={1}>
                <IconButton
                  size="small"
                  aria-label="finishedit"
                  onClick={async () => {
                    if (input !== "") {
                      await helpers.updatePageStore({ id, name: input })
                      reset()
                      setEditing(false)
                    } else {
                      setEditing(false)
                    }
                  }}
                >
                  <DoneIcon />
                </IconButton>
              </Box>
            </Box>
          ) : (
            <Box display="flex" alignItems="center">
              <Box display="flex" alignItems="center" flexGrow={1}>
                <Box>
                  <Typography variant="h5" component="h2">
                    {name}
                  </Typography>
                </Box>
                {!mutationDisabled && (
                  <Box pl={1}>
                    <IconButton
                      size="small"
                      aria-label="edit"
                      onClick={() => {
                        setManualEditInput(name)
                        setEditing(true)
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>
              {!dumbComponent && (
                <Box pl={1}>
                  <IconButton
                    size="small"
                    aria-label="edit"
                    onClick={async () => {
                      await helpers.duplicatePageStore({ id, name: input })
                    }}
                  >
                    <FileCopyIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}

              {!mutationDisabled && (
                <Box>
                  <IconButton
                    size="small"
                    aria-label="delete"
                    onClick={() => {
                      confirm({
                        type: "delete",
                        action: async () =>
                          await helpers.deletePageStore({ id }),
                      })
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          )}
          <Box>
            <Box>
              <Typography variant="overline" color="textSecondary">
                Created {moment(time_created).format("MMMM DD YYYY")}
              </Typography>
            </Box>
          </Box>
        </CardContent>
        {!dumbComponent && (
          <CardActions>
            <Button
              variant="outlined"
              size="small"
              fullWidth
              startIcon={<EditIcon />}
              component={Link}
              to={`${url}/${id}`}
            >
              Edit Pages
            </Button>
          </CardActions>
        )}
      </Card>
    </Box>
  )
}
