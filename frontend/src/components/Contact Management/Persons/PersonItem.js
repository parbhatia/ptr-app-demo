import Avatar from "@material-ui/core/Avatar"
import Box from "@material-ui/core/Box"
import IconButton from "@material-ui/core/IconButton"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import AddIcon from "@material-ui/icons/Add"
import EditIcon from "@material-ui/icons/Edit"
import React, { useContext, useState } from "react"
import ThemeContext from "../../../Context/ThemeContext"
import capitalize from "../../../utils/capitalize"
import StyledPaper from "../../StyledContainers/StyledPaper"
import AttributeManager from "../Generic Attribute Management/Manager"
import colorPick from "../../../utils/personColorPicker"
import PersonDialog from "./PersonDialog"
import Chip from "@material-ui/core/Chip"

const useStyles = (dark, type) =>
  makeStyles((theme) => ({
    paper: {
      borderRadius: 15,
      background: theme.palette.background.default,
      // background: colorPick(dark, type),
    },
    chip: {
      background: colorPick(dark, type),
    },
  }))

export default function Person({
  id,
  name,
  type,
  handleRemove,
  handleEdit,
  handleAddToInspection,
  displayAttributes,
}) {
  const { dark } = useContext(ThemeContext)
  const classes = useStyles(dark, type)()
  const [openDialog, setOpenDialog] = useState(false)
  return (
    <Box p={0.5}>
      <PersonDialog
        id={id}
        name={name}
        handleRemove={handleRemove}
        handleEdit={handleEdit}
        handleAddToInspection={handleAddToInspection}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      />
      <StyledPaper className={classes.paper} minimalSpacing>
        <Box pb={0} display="flex" alignItems="center">
          <Box flexGrow={1} flexDirection="column">
            <Box display="flex" alignItems="center">
              <Box p={1}>
                <Avatar>{name.charAt(0).toUpperCase()}</Avatar>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                flexWrap="wrap"
                className={classes.nameButton}
                borderRadius={15}
                p={1}
              >
                <Box>
                  <Typography>{name}</Typography>
                </Box>
                <Box pl={1}>
                  {/* <Typography variant="caption" noWrap>
                  {capitalize(type)}
                </Typography> */}
                  <Chip
                    label={
                      <Typography variant="overline">
                        {capitalize(type)}
                      </Typography>
                    }
                    className={classes.chip}
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </Box>
            </Box>
          </Box>
          {handleAddToInspection ? (
            <Box>
              <IconButton
                aria-label="openDialog"
                onClick={async () =>
                  await handleAddToInspection({ personId: id })
                }
              >
                <AddIcon />
              </IconButton>
            </Box>
          ) : (
            <Box>
              <IconButton
                aria-label="openDialog"
                onClick={() => setOpenDialog(true)}
              >
                <EditIcon />
              </IconButton>
            </Box>
          )}
        </Box>
        {displayAttributes && (
          <>
            <Box overflow="auto">
              <AttributeManager personId={id} attributeType="email" viewOnly />
            </Box>
            <Box overflow="auto">
              <AttributeManager personId={id} attributeType="phone" viewOnly />
            </Box>
          </>
        )}
      </StyledPaper>
    </Box>
  )
}
