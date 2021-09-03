import axios from "axios"
import React from "react"
import { Redirect, Route, useRouteMatch } from "react-router-dom"
import useSWR from "swr"
import DraggableCategory from "../../DraggableItems/DraggableCategory"
import { PHOTO_CAPTION_MAX_LENGTH } from "../../../config"
import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"

const MasterPhotoCaptionStore = () => {
  const { path, url } = useRouteMatch()
  const fetchUrl = "/api/masterphotocaptionstore"
  const { data: draggableCategory } = useSWR(fetchUrl, async () => {
    const { data } = await axios.get(fetchUrl)
    return data.category
  })

  return (
    <>
      {draggableCategory?.id ? (
        <>
          <Redirect replace to={`${url}/${draggableCategory.id}`} />
          <Route
            path={`${path}/:draggableCategoryId`}
            render={() => (
              <Box>
                <Typography variant="h6" align="center">
                  Photo Captions
                </Typography>
                <DraggableCategory
                  fetchUrl={`${fetchUrl}/${draggableCategory.master_photo_caption_store_id}/draggablecategory`}
                  displaySpeedDial={false}
                  disableAutocomplete={true}
                  disableSubcheckboxes={true}
                  draggableCheckboxMaxlength={PHOTO_CAPTION_MAX_LENGTH}
                />
              </Box>
            )}
          />
        </>
      ) : null}
    </>
  )
}

export default MasterPhotoCaptionStore
