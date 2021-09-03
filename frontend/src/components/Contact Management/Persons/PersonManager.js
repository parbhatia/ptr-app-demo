import Box from "@material-ui/core/Box"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import FormLabel from "@material-ui/core/FormLabel"
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup"
import Typography from "@material-ui/core/Typography"
import axios from "axios"
import React, { useState } from "react"
import useSWR from "swr"
import usePagination from "../../../Hooks/usePagination"
import LinearLoading from "../../LoadingComponents/LinearLoading"
import CreateNewPerson from "./CreateNewPerson"
import helpers from "../../../helpers/persons"
import Person from "./PersonItem"

const maxItemsOnPage = 10

const PersonManager = ({
  fetchUrl,
  inspectionId = null,
  fetchInspectionPersonsUrl,
  mutateInspectionPersons,
  displayAttributes = false,
}) => {
  // const classes = useStyles()
  const {
    page,
    setTotalPages,
    searchQuery,
    PaginationComponent,
    SearchBarComponent,
  } = usePagination({ searchPlaceHolder: "Search Contacts", searchDelay: 500 })

  const [personTypeFilter, setPersonTypeFilter] = useState("all")
  const [personOrderFilter, setPersonOrderFilter] = useState("recent")

  const fetchPersonsUrl = `${fetchUrl}?page=${page}&search=${searchQuery}&personTypeFilter=${personTypeFilter}&limit=${maxItemsOnPage}&inspectionId=${inspectionId}&order=${personOrderFilter}`

  const {
    data: persons,
    mutate: mutatePersons,
    isValidating,
  } = useSWR(fetchPersonsUrl, async () => {
    const { data } = await axios.get(fetchPersonsUrl)
    const persons = data.persons
    if (persons.length > 0) {
      const calculatedPages = Math.round(
        Number(persons[0].total_count / maxItemsOnPage),
      )
      setTotalPages(calculatedPages)
      return persons
    } else {
      setTotalPages(0)
      return null
    }
  })

  const handleRadioChange = (event) => {
    setPersonTypeFilter(event.target.value)
  }
  const handleRadioOrderChange = (event) => {
    setPersonOrderFilter(event.target.value)
  }

  const { addPersonToInspection, editPerson, addPerson } = helpers({
    mutateInspectionPersons,
    fetchInspectionPersonsUrl,
    fetchPersonsUrl: fetchUrl,
    mutatePersons,
  })

  const handleEdit = async ({ personId, personName }) => {
    const newPerson = await editPerson({ personId, personName })
    return newPerson
  }

  return (
    <Box display="flex" flexDirection="column" mb={1}>
      {isValidating ? <LinearLoading /> : null}
      <Box
        width="100%"
        display="flex"
        justifyContent="flex-end"
        flexWrap="wrap"
      >
        <Box flexGrow={1} p={1}>
          <CreateNewPerson addPerson={addPerson} />
        </Box>
        <Box display="flex" width="100%" flexWrap="wrap" alignItems="center">
          <Box p={0.5} flexGrow={1}>
            {SearchBarComponent}
          </Box>
          <Box p={1} display="flex" flexWrap="wrap">
            <Box alignSelf="center">
              <FormLabel component="legend">
                <Typography variant="caption">Type</Typography>
              </FormLabel>
              <RadioGroup
                row
                width="100%"
                aria-label="quiz"
                name="quiz"
                value={personTypeFilter}
                onChange={handleRadioChange}
              >
                <FormControlLabel
                  value="all"
                  labelPlacement="end"
                  control={<Radio />}
                  label={<Typography variant="overline">All</Typography>}
                />
                <FormControlLabel
                  value="client"
                  labelPlacement="end"
                  control={<Radio />}
                  label={<Typography variant="overline">Clients</Typography>}
                />
                <FormControlLabel
                  value="realtor"
                  labelPlacement="end"
                  control={<Radio />}
                  label={<Typography variant="overline">Realtors</Typography>}
                />
              </RadioGroup>
            </Box>
          </Box>
          <Box alignSelf="center">
            <FormLabel component="legend">
              <Typography variant="caption">Order</Typography>
            </FormLabel>
            <RadioGroup
              row
              width="100%"
              aria-label="quiz"
              name="quiz"
              value={personOrderFilter}
              onChange={handleRadioOrderChange}
            >
              <FormControlLabel
                value="recent"
                labelPlacement="end"
                control={<Radio />}
                label={
                  <Typography variant="overline">Recently Added</Typography>
                }
              />
              <FormControlLabel
                value="alphabetic"
                labelPlacement="end"
                control={<Radio />}
                label={<Typography variant="overline">Alphabetic</Typography>}
              />
            </RadioGroup>
          </Box>
        </Box>
      </Box>
      {/* <Box display="flex" width="100%" alignContent="center" flexWrap="wrap">
        <Box flexGrow={1}>{SearchBarComponent}</Box>
        <Box alignSelf="center">
          <CreateNewPerson addPerson={addPerson} />
        </Box>
      </Box> */}
      {/* {SearchBarComponent} */}
      <Box>
        {persons?.map((person) => (
          <Person
            key={person.id}
            id={person.id}
            name={person.name}
            type={person.type}
            handleEdit={handleEdit}
            handleAddToInspection={
              inspectionId === null ? null : addPersonToInspection
            }
            displayAttributes={displayAttributes}
          />
        ))}
      </Box>
      {PaginationComponent}
    </Box>
  )
}

export default PersonManager
