import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import PersonAddIcon from "@material-ui/icons/PersonAdd"
import axios from "axios"
import React, { useState } from "react"
import useSWR from "swr"
import SelectPersonDialog from "../../Misc/DialogHOC"
import helpers from "../../../helpers/persons"
import Person from "./PersonItem"
import PersonManager from "./PersonManager"

const InspectionPersonManager = ({
  fetchUrl,
  inspectionId,
  displayAttributes = true,
}) => {
  const fetchInspectionPersonsUrl = fetchUrl
  const fetchPersonsUrl = `/api/person`

  const { data: persons, mutate: mutatePersons } = useSWR(
    fetchInspectionPersonsUrl,
    async () => {
      const { data } = await axios.get(fetchInspectionPersonsUrl)
      const persons = data.persons
      return persons
    },
  )
  const { removePersonFromInspection, editPerson } = helpers({
    mutateInspectionPersons: mutatePersons,
    fetchInspectionPersonsUrl,
    fetchPersonsUrl,
  })

  const handleRemove = ({ personId }) => {
    removePersonFromInspection({ inspectionId, personId })
  }
  const handleEdit = async ({ personId, personName }) => {
    const newPerson = await editPerson({ personId, personName })
    return newPerson
  }

  const [openDialog, setOpenDialog] = useState(false)

  return (
    <Box mb={1}>
      <SelectPersonDialog
        dialogTitle="Add To Inspection"
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      >
        <PersonManager
          inspectionId={inspectionId}
          fetchUrl={fetchPersonsUrl}
          fetchInspectionPersonsUrl={fetchInspectionPersonsUrl}
          mutateInspectionPersons={mutatePersons}
          displayAttributes={false}
          selectingForInspection
        />
      </SelectPersonDialog>

      <Box mt={1} mb={1}>
        <Button
          fullWidth
          disableRipple
          variant="outlined"
          startIcon={<PersonAddIcon fontSize="large" />}
          onClick={() => setOpenDialog(true)}
        >
          Add To Inspection
        </Button>
      </Box>
      <Box>
        {persons?.map((person) => (
          <Person
            key={person.id}
            id={person.id}
            name={person.name}
            type={person.type}
            handleRemove={handleRemove}
            handleEdit={handleEdit}
            displayAttributes={displayAttributes}
          />
        ))}
      </Box>
    </Box>
  )
}

export default InspectionPersonManager
