import arrayMove from "array-move"
import axios from "axios"
import produce from "immer"
import arrayCompare from "../utils/arrayCompare"

const encapsulateHelpers = ({ photosInfo, mutatePhotos, fetchUrl }) => {
  const deletePhoto = async ({ id, keyid }) => {
    try {
      //optimistic ui
      mutatePhotos((photosInfo) => {
        return produce(photosInfo, (draftState) => {
          draftState.photos = draftState.photos.filter((p) => p.id !== id)
          draftState.orderInfo = draftState.orderInfo.filter(
            (itemId) => itemId !== id,
          )
        })
      }, false)
      const response = await axios.delete(`${fetchUrl}/${id}`, {
        data: {
          keyid,
        },
      })
      if (response.status === 200) {
        const { data } = response
        const { photo: deletedPhoto } = data
        if (deletedPhoto.id !== id) {
          throw new Error("Deleting photo")
        } else {
          mutatePhotos()
        }
      } else {
        throw new Error("Deleting photo")
      }
    } catch (e) {
      //revalidate
      mutatePhotos()
      console.log("Error:", e)
    }
  }

  const updateCaption = async ({ id, caption }) => {
    try {
      //optimistic ui
      mutatePhotos((photosInfo) => {
        return produce(photosInfo, (draftState) => {
          draftState.photos = draftState.photos.map((p) => {
            if (p.id === id) {
              return {
                ...p,
                caption,
              }
            } else {
              return p
            }
          })
        })
      }, false)
      const response = await axios.patch(`${fetchUrl}/updateCaption/${id}`, {
        caption,
      })
      if (response.status === 200) {
        const { data } = response
        const photo = data.photo
        if (photo.id !== id || photo.caption !== caption) {
          throw new Error("Updating Caption")
        }
        mutatePhotos()
        return photo.caption
      }
    } catch (e) {
      //revalidate
      mutatePhotos()
      console.log("Error:", e)
    }
  }
  const setCoverPhoto = async ({ id, keyid }) => {
    try {
      const response = await axios.patch(`${fetchUrl}/setCoverPhoto/${id}`, {
        keyid,
      })
      if (response.status === 200) {
        mutatePhotos()
      } else {
        throw new Error("Setting cover photo")
      }
    } catch (e) {
      //revalidate
      mutatePhotos()
      console.log("Error:", e)
    }
  }

  const onSortEnd = async ({ oldIndex, newIndex }) => {
    try {
      const oldOrderInfo = photosInfo.orderInfo
      const oldPhotos = photosInfo.photos
      const newOrderInfo = arrayMove(oldOrderInfo, oldIndex, newIndex)
      const newPhotos = arrayMove(oldPhotos, oldIndex, newIndex)
      //optimistic ui
      mutatePhotos(
        (photosInfo) => ({
          photos: newPhotos,
          orderInfo: newOrderInfo,
        }),
        false,
      )
      const { data } = await axios.patch(`${fetchUrl}/update`, {
        newOrderInfo,
      })
      const returnedOrderedInfo = data.orderInfo

      if (!arrayCompare(newOrderInfo, returnedOrderedInfo)) {
        throw new Error("Updating Error")
      }
      mutatePhotos()
    } catch (e) {
      console.log("Error", e)
      mutatePhotos()
    }
  }
  //save marked image using FORM data
  const saveMarkedFile = async ({ id, keyid, type, dataUrl }) => {
    try {
      const base64Response = await fetch(dataUrl)
      const blob = await base64Response.blob()
      const file = new File([blob], "filename.jpeg")
      const formData = new FormData()
      formData.append("keyid", keyid)
      formData.append("type", type)
      formData.append("image", file)
      const response = await axios.post(
        `${fetchUrl}/saveMarkedFile/${id}`,
        formData,
      )
      if (response.status === 200) {
        //revalidate
        mutatePhotos()
      } else {
        throw new Error("Updating Marked File")
      }
    } catch (e) {
      //revalidate
      mutatePhotos()
      console.log("Error:", e)
    }
  }

  const deletePhotoVersion = async ({ id, keyid, type, versionid }) => {
    try {
      const response = await axios.patch(`${fetchUrl}/deleteVersion/${id}`, {
        keyid,
        versionid,
        type,
      })
      if (response.status === 200) {
        const { data } = response
        const { photo: deletedPhoto } = data
        const expectedVersionIdArray = photosInfo.photos
          .filter((p) => p.id === id)[0]
          .versionid.filter((v) => v !== versionid)
        if (
          deletedPhoto.id !== id ||
          !arrayCompare(deletedPhoto.versionid, expectedVersionIdArray)
        ) {
          throw new Error("Deleting photo version")
        }
        mutatePhotos((photosInfo) => {
          return produce(photosInfo, (draftState) => {
            draftState.photos = draftState.photos.map((p) => {
              if (p.id === id) {
                return {
                  ...p,
                  versionid: deletedPhoto.versionid,
                }
              } else {
                return p
              }
            })
          })
        }, false)
      } else {
        throw new Error("Deleting photo version")
      }
    } catch (e) {
      //revalidate
      mutatePhotos()
      console.log("Error:", e)
    }
    // const addPhotosBulk = async ({ newPhotos }) => {
    //   try {
    //     const response = await axios.post(fetchUrl, {
    //       newPhotos,
    //     })
    //     if (response.status === 200) {
    //       const { data } = response
    //       // const newPhotos = addBulkResponse.newPhotos;
    //       // const newOrderInfo = addBulkResponse.orderInfo;
    //       //revalidate
    //       mutatePhotos()
    //     } else {
    //       throw new Error("Adding photos")
    //     }
    //   } catch (e) {
    //     //revalidate
    //     mutatePhotos()
    //     console.log("Error:", e)
    //   }
    // }
  }
  return {
    // addPhotosBulk,
    deletePhoto,
    onSortEnd,
    updateCaption,
    saveMarkedFile,
    deletePhotoVersion,
    setCoverPhoto,
  }
}

export default encapsulateHelpers
