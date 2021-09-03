import axios from "axios"
import produce from "immer"

const encapsulateHelpers = ({ mutateFiles, fetchUrl }) => {
  const deleteFile = async ({ id }) => {
    try {
      //optimistic ui
      mutateFiles((files) => {
        return produce(files, (draftState) => {
          draftState = draftState.filter((f) => f.id !== id)
        })
      }, false)
      const response = await axios.delete(`${fetchUrl}/${id}`)
      if (response.status === 200) {
        const { data } = response
        const deletedFile = data
        if (deletedFile.id !== id) {
          throw new Error("Deleting File")
        } else {
          mutateFiles()
        }
      } else {
        throw new Error("Deleting File")
      }
    } catch (e) {
      //revalidate
      mutateFiles()
      console.log("Error:", e)
    }
  }

  const updateFileName = async ({ id, name }) => {
    try {
      //optimistic ui
      mutateFiles(
        (files) =>
          produce(files, (draftState) => {
            draftState.forEach((f) => {
              if (f.id === id) {
                f.name = name
              }
            })
          }),
        false,
      )
      const response = await axios.patch(`${fetchUrl}/${id}`, {
        name,
      })
      if (response.status === 200) {
        const { data } = response
        const file = data
        if (file.id !== id || file.name !== name) {
          throw new Error("Updating Name")
        }
        mutateFiles()
        return file.name
      }
    } catch (e) {
      //revalidate
      mutateFiles()
      console.log("Error:", e)
    }
    // const addFilesBulk = async ({ newFiles }) => {
    //   try {
    //     const response = await axios.post(fetchUrl, {
    //       newFiles,
    //     })
    //     if (response.status === 200) {
    //       const { data } = response
    //       mutateFiles()
    //     } else {
    //       throw new Error("Adding photos")
    //     }
    //   } catch (e) {
    //     //revalidate
    //     mutateFiles()
    //     console.log("Error:", e)
    //   }
    // }
  }

  return {
    // addFilesBulk,
    deleteFile,
    updateFileName,
  }
}

export default encapsulateHelpers
