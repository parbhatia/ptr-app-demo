import axios from "axios"
const encapsulateHelpers = ({ mutate, fetchUrl }) => {
  const addPageStore = async ({ name }) => {
    try {
      const response = await axios.post(fetchUrl, {
        name,
      })
      if (response.status === 200) {
        mutate()
      } else {
        throw new Error("Inserting Page Store")
      }
    } catch (e) {
      mutate()
      console.log("Error:", e)
    }
  }
  const deletePageStore = async ({ id }) => {
    try {
      const response = await axios.delete(fetchUrl, {
        data: { id },
      })
      if (response.status === 200) {
        mutate()
      } else {
        throw new Error("Deleting Page Store")
      }
    } catch (e) {
      mutate()
      console.log("Error:", e)
    }
  }

  const duplicatePageStore = async ({ id, name }) => {
    try {
      const duplicatedStoreName = name + "-Duplicate"
      const response = await axios.post(`${fetchUrl}/${id}/duplicate`, {
        id,
        name: duplicatedStoreName,
      })
      if (response.status === 200) {
        mutate()
      } else {
        throw new Error("Duplicating Master Page Store")
      }
    } catch (e) {
      mutate()
      console.log("Error:", e)
    }
  }
  const updatePageStore = async ({ id, name }) => {
    try {
      const response = await axios.patch(`${fetchUrl}/${id}/updatetext`, {
        id,
        name,
      })
      if (response.status === 200) {
        mutate()
      } else {
        throw new Error("Updating Master Page Store")
      }
    } catch (e) {
      mutate()
      console.log("Error:", e)
    }
  }

  return {
    addPageStore,
    deletePageStore,
    updatePageStore,
    duplicatePageStore,
  }
}

export default encapsulateHelpers
