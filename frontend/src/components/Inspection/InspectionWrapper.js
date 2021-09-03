import axios from "axios"
import React, { useEffect, useState } from "react"
import { Route, useParams } from "react-router-dom"
import InspectionContext from "../../Context/InspectionContext"
import Page from "./Page"
import io from "socket.io-client"

const InspectionWrapper = () => {
  //store inspectionId from react router url param
  const { id: inspectionId } = useParams()
  //states
  const [inspectionInfo, setInspectionInfo] = useState(null)
  const [storeId, setStoreId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [shareableLinks, setShareableLinks] = useState(null)
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const socket = io(
      `${process.env.REACT_APP_PTR_APP_SUBDOMAIN}/inspectionsocket`,
      {
        path: "/appsocket",
        transports: ["websocket"],
      },
    )
    socket.on("connect", () => {
      setSocket(socket)
    })
    const fetchData = async () => {
      const { data } = await axios.get(`/api/inspection/${inspectionId}`)
      setInspectionInfo(data.inspection)
      setStoreId(data.store.id)
      setShareableLinks(data.shareableLinks)
      setLoading(false)
    }
    fetchData()
    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <>
      {!loading ? (
        <InspectionContext.Provider
          value={{
            socket: socket,
            inspectionId: inspectionId,
            inspectionInfo: inspectionInfo,
            storeId: storeId,
            setInspectionInfo: setInspectionInfo,
            shareableLinks: shareableLinks,
          }}
        >
          <Route
            path={`/Inspection/:inspectionId`}
            render={() => (
              <Page
                inspectionId={inspectionId}
                inspectionInfo={inspectionInfo}
              />
            )}
          />
        </InspectionContext.Provider>
      ) : null}
    </>
  )
}

export default InspectionWrapper
