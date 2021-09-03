import axios from "axios"
import React from "react"
import { useParams } from "react-router-dom"
import useSWR from "swr"
import CategoryPhotos from "./CategoryPhotos"

// fetch and pass photocategory_id to respective components
// can fetch inspection photos category, references photos category, as well as
//    master photos category
//categoryType is of 'master_reference', 'inspection', or 'reference'
const CategoryManager = ({ type, ...rest }) => {
  const { inspectionId, pageId } = useParams()
  const categoryType = type
  let fetchUrl = ""
  //order matters, since page is nested inside inspection
  if (pageId) {
    //page will be nested inside inspection
    fetchUrl = `/api/inspection/${inspectionId}/page/${pageId}/photocategory/ofPage`
  } else if (inspectionId) {
    fetchUrl = `/api/inspection/${inspectionId}/photocategory/ofInspection`
  } else {
    fetchUrl = `/api/photocategory/ofMaster`
  }
  const { data: photoCategory } = useSWR(fetchUrl, async () => {
    const { data } = await axios.get(fetchUrl)
    return data
  })
  const disableSetCoverphoto = pageId || !inspectionId
  if (photoCategory) {
    return (
      <CategoryPhotos
        fetchUrl={fetchUrl}
        disableSetCoverphoto={disableSetCoverphoto}
        photoCategory={{
          id: photoCategory.id,
          type: categoryType,
        }}
        {...rest}
      />
    )
  } else {
    return null
  }
}

export default CategoryManager
