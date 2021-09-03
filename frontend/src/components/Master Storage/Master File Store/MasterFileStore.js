import axios from "axios"
import React from "react"
import { Route, useRouteMatch } from "react-router-dom"
import useSWR from "swr"
import MasterFileManager from "./MasterFileManager"

const MasterFileStore = () => {
  const { path } = useRouteMatch()
  const fetchUrl = "/api/masterfilestore"
  const { data: masterFileStoreId } = useSWR(fetchUrl, async () => {
    const { data } = await axios.get(fetchUrl)
    return data.store.id
  })

  return (
    <>
      {masterFileStoreId ? (
        <Route
          path={path}
          render={() => (
            <MasterFileManager masterFileStoreId={masterFileStoreId} />
          )}
        />
      ) : null}
    </>
  )
}

export default MasterFileStore
