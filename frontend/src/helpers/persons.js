import axios from "axios"

const helpers = ({
  fetchPersonsUrl,
  fetchInspectionPersonsUrl,
  mutatePersons = () => {},
  mutateInspectionPersons = () => {},
}) => {
  const addPersonToInspection = async ({ personId }) => {
    const response = await axios.post(
      `${fetchInspectionPersonsUrl}/${personId}`,
    )
    if (response.status === 200) {
      const { data } = response
      mutateInspectionPersons()
      mutatePersons()
      return data.person.person_id
    }
  }

  const removePersonFromInspection = async ({ personId }) => {
    const response = await axios.delete(
      `${fetchInspectionPersonsUrl}/${personId}`,
    )
    if (response.status === 200) {
      //revalidate inspection persons
      mutateInspectionPersons()
      const { data } = response
      return data.person.person_id
    }
  }

  const createNewPerson = async ({ personName, personType }) => {
    const response = await axios.post(`${fetchPersonsUrl}`, {
      personName,
      personType,
    })
    if (response.status === 200) {
      const { data } = response
      return data.person
    }
  }

  const editPerson = async ({ personId, personName }) => {
    const response = await axios.patch(`${fetchPersonsUrl}/${personId}`, {
      personName,
      personId,
    })
    if (response.status === 200) {
      //revalidate inspection persons
      // mutateInspectionPersons()
      //revalidate all persons
      mutatePersons()
      const { data } = response
      return data.person
    }
  }

  //manages new addition of person, when there are no more options left, and user presses enter
  const addPerson = async ({ personName, personType }) => {
    const person = await createNewPerson({ personName, personType })
    // //revalidate all persons
    mutatePersons()
    // const personIdFromJunction = await addPersonToInspection({
    //   inspectionId,
    //   personId: person.id,
    // })
    // //revalidate inspection persons
    mutateInspectionPersons()
    return person
  }

  return {
    editPerson,
    addPerson,
    addPersonToInspection,
    removePersonFromInspection,
  }
}

export default helpers
