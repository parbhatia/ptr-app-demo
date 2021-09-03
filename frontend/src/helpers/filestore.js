import axios from "axios"
import produce from "immer"
import { mutate } from "swr"

const encapsulateHelpers = ({
  mutateFiles,
  fetchUrl,
  handleAdditionalRevalidation,
  shareableLinkFetchUrl,
}) => {
  const handleMultipleRevalidations = () => {
    mutateFiles()
    handleAdditionalRevalidation()
    mutate(`${shareableLinkFetchUrl}/fetchpdf`)
  }
  const localFetchUrl = fetchUrl
  const addFilesBulk = async ({ newFiles }) => {
    try {
      const response = await axios.post(localFetchUrl, {
        newFiles,
      })
      if (response.status === 200) {
        handleMultipleRevalidations()
      } else {
        throw new Error("Adding photos")
      }
    } catch (e) {
      //revalidate
      handleMultipleRevalidations()
      console.log("Error:", e)
    }
  }
  const deleteFile = async ({ id }) => {
    try {
      //optimistic ui
      mutateFiles((files) => {
        return produce(files, (draftState) => {
          draftState = draftState.filter((f) => f.id !== id)
        })
      }, false)
      const response = await axios.delete(`${localFetchUrl}/${id}`)
      if (response.status === 200) {
        const { data } = response
        const deletedFile = data
        if (deletedFile.id !== id) {
          throw new Error("Deleting File")
        } else {
          handleMultipleRevalidations()
        }
      } else {
        throw new Error("Deleting File")
      }
    } catch (e) {
      //revalidate
      handleMultipleRevalidations()
      console.log("Error:", e)
    }
  }

  const copyFromMasterFile = async ({ id, name, keyid, size, extension }) => {
    //we have shareableLinkId, just send signal to url to copy file of params given to this function
    try {
      const response = await axios.post(`${fetchUrl}/copy`, {
        id,
        name,
        keyid,
        extension,
        size,
      })
      if (response.status === 200) {
        const { data } = response
        const copiedFile = data
        if (copiedFile.name !== name) {
          throw new Error("Copying File")
        } else {
          handleMultipleRevalidations()
        }
        console.log("returning copiedFile", copiedFile)
        return copiedFile
      } else {
        throw new Error("Copying File")
      }
    } catch (e) {
      console.log("Error:", e)
      handleMultipleRevalidations()
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
      const response = await axios.patch(`${localFetchUrl}/${id}`, {
        name,
      })
      if (response.status === 200) {
        const { data } = response
        const file = data
        if (file.id !== id || file.name !== name) {
          throw new Error("Updating Name")
        }
        handleMultipleRevalidations()
        return file.name
      }
    } catch (e) {
      //revalidate
      handleMultipleRevalidations()
      console.log("Error:", e)
    }
  }

  return {
    addFilesBulk,
    deleteFile,
    updateFileName,
    copyFromMasterFile,
  }
}

export default encapsulateHelpers
