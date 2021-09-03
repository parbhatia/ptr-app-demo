import Box from "@material-ui/core/Box"
import Chip from "@material-ui/core/Chip"
import IconButton from "@material-ui/core/IconButton"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import AddIcon from "@material-ui/icons/Add"
import DoneIcon from "@material-ui/icons/Done"
import HighlightOffIcon from "@material-ui/icons/HighlightOff"
import axios from "axios"
import PropTypes from "prop-types"
import React, { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import useSWR from "swr"
import capitalize from "../../../utils/capitalize"
import ValidatorMachine from "../../InspectionForm/Validation"
import AttributeInputField from "./AttributeInputField"
import GenericAttributeItem from "./GenericAttribute"
import encapsulateHelpers from "../../../helpers/generalAttributeManagement"

const useStyles = makeStyles(() => ({
  chip: {
    display: "inline-flex",
    "vertical-align": "top",
  },
}))

GenericAttributeManager.propTypes = {
  attributeType: PropTypes.oneOf(["phone", "email"]),
}

//handles Addding, editing, deleting a generic attribute of a person, such as phone numbers or emails
//can persist data to database, or store data locally
export default function GenericAttributeManager({
  personId,
  attributeType,
  viewOnly,
}) {
  const fetchUrl = `/api/person/${personId}/${attributeType}`
  const classes = useStyles()
  const { data: attributes, mutate } = useSWR(fetchUrl, async () => {
    const { data } = await axios.get(fetchUrl)
    return data.attributes
  })
  const { errors, control, handleSubmit, reset } = useForm()
  const [adding, setAdding] = useState(false)
  const handleClick = () => {
    setAdding(true)
  }
  const handleClose = () => {
    setAdding(false)
  }

  const { removeAttribute, editAttribute, onSubmit } = encapsulateHelpers({
    mutate,
    personId,
    attributeType,
    handleClose,
    reset,
  })

  const prettyAttribute = capitalize(attributeType)

  return (
    <>
      {!attributes ? null : (
        <>
          <Box display="inline">
            {attributes.map((e) => (
              <React.Fragment key={e.id}>
                <GenericAttributeItem
                  id={e.id}
                  attributeType={attributeType}
                  value={e.value}
                  handleEdit={editAttribute}
                  handleRemove={removeAttribute}
                  viewOnly={viewOnly}
                />
              </React.Fragment>
            ))}
            {!viewOnly && (
              <Box className={classes.chip} p={1}>
                {!adding ? (
                  <Chip
                    icon={<AddIcon fontSize="small" />}
                    label={
                      <Typography noWrap>{`Add ${prettyAttribute}`}</Typography>
                    }
                    clickable
                    variant="outlined"
                    // color="secondary"
                    onClick={handleClick}
                  />
                ) : (
                  <Box display="flex" alignItems="center">
                    <Box>
                      <form
                        style={{ width: "100%" }}
                        onSubmit={handleSubmit(onSubmit)}
                      >
                        <Controller
                          control={control}
                          render={(props) => (
                            <AttributeInputField
                              controllerProps={props}
                              attributeType={attributeType}
                              errors={errors}
                              placeholder={`Add ${prettyAttribute}`}
                            />
                          )}
                          name="attributeValue"
                          label={`Add ${prettyAttribute}`}
                          defaultValue=""
                          {...ValidatorMachine(
                            "attributeValue",
                            attributeType,
                            errors,
                          )}
                        />
                      </form>
                    </Box>
                    <Box>
                      <IconButton
                        size="small"
                        aria-label="finishedit"
                        onClick={handleClose}
                      >
                        <HighlightOffIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Box>
                      <IconButton
                        size="small"
                        aria-label="finishedit"
                        onClick={handleSubmit(onSubmit)}
                      >
                        <DoneIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </>
      )}
    </>
  )
}
