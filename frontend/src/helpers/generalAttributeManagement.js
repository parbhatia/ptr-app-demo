import axios from "axios"

const encapsulateHelpers = ({
  mutate,
  personId,
  attributeType,
  handleClose,
  reset,
}) => {
  const removeAttribute = async ({ attributeId }) => {
    const { data } = await axios.delete(
      `/api/person/${personId}/${attributeType}/${attributeId}`,
    )
    const returnedAttributeId = data.attribute.id
    if (returnedAttributeId === attributeId) {
      //revalidate attributes of person
      mutate()
      return returnedAttributeId
    }
  }

  const editAttribute = async ({ attributeId, attributeValue }) => {
    const { data } = await axios.patch(
      `/api/person/${personId}/${attributeType}/${attributeId}`,
      {
        attributeValue,
      },
    )
    const returnedAttributeId = data.attribute.id
    if (returnedAttributeId === attributeId) {
      //revalidate attributes of person
      mutate()
      return returnedAttributeId
    }
  }

  const addAttribute = async ({ attributeValue, personId }) => {
    const response = await axios.post(
      `/api/person/${personId}/${attributeType}`,
      {
        attributeValue,
      },
    )
    return response
  }

  const onSubmit = async (data) => {
    handleClose()
    reset({
      attributeValue: "",
    })
    const attributeValue = data.attributeValue
    if (attributeValue !== "") {
      const attributeResponse = await addAttribute({ attributeValue, personId })
      if (attributeResponse.status === 200) {
        //revalidate attributes of person
        mutate()
      }
    }
  }
  return {
    removeAttribute,
    editAttribute,
    onSubmit,
  }
}

export default encapsulateHelpers
