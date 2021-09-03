import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import axios from "axios"
import React, { useContext, useEffect, useState } from "react"
import useSWR from "swr"
import { useAuthDataContext } from "../Auth/AuthDataProvider"
import InspectionContext from "../../Context/InspectionContext"
import EmailRecordList from "./EmailRecordList"

const useStyles = makeStyles((theme) => ({
  border: {
    border: `1px solid ${theme.palette.action.disabledBackground}`,
    borderRadius: 5,
  },
}))

const maxItemsOnPage = 10

//renders EmailDialog through
export default function EmailRecords({
  header,
  caption,
  fetchUrl,
  children,
  disablePagination = true,
}) {
  const classes = useStyles()
  const { user } = useAuthDataContext()
  const { socket } = useContext(InspectionContext)
  const [limit, setLimit] = useState(maxItemsOnPage)
  const fetchUrlWithLimit = `${fetchUrl}?limit=${limit}`
  const [pageItems, setPageItems] = useState([])
  const { mutate } = useSWR(fetchUrlWithLimit, async () => {
    const { data } = await axios.get(fetchUrlWithLimit)
    setPageItems(data.emailRecords)
    return data.emailRecords
  })
  useEffect(() => {
    //need to check is socket is defined, since this component can be rendered outside scope of inspection's socket
    const socketEventname = `${user.id}/notification/email`
    if (socket) {
      socket.on(socketEventname, (_) => {
        mutate()
      })
    }
    return () => {
      if (socket) {
        socket.off(socketEventname)
      }
    }
  }, [])

  return (
    <>
      {!pageItems || pageItems.length === 0 ? (
        <Box p={1}>{children}</Box>
      ) : (
        <Box p={1} m={1} className={classes.border}>
          {children}
          <Box p={1}>
            <Typography variant="h6">{header}</Typography>
            <Typography variant="caption">{caption}</Typography>
          </Box>
          <EmailRecordList emailRecords={pageItems} />
          {!disablePagination && pageItems.length >= maxItemsOnPage && (
            <Box pt={1}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() =>
                  setLimit((oldLimit) => oldLimit + maxItemsOnPage)
                }
              >
                Show More
              </Button>
            </Box>
          )}
        </Box>
      )}
    </>
  )
}
