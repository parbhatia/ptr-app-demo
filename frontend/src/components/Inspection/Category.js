import Box from "@material-ui/core/Box"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import Skeleton from "@material-ui/lab/Skeleton"
import axios from "axios"
import React from "react"
import { useParams } from "react-router-dom"
import useSWR from "swr"
import CheckBoxList from "./CheckBoxList"

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginBottom: theme.spacing(2),
    width: "100%",
    height: "100%",
  },
}))

//Called by Subsection to render all categories of an page's subsection
export default function Category() {
  const classes = useStyles()
  const { inspectionId, pageId, subsectionId } = useParams()
  const fetchUrl = `/api/inspection/${inspectionId}/page/${pageId}/subsection/${subsectionId}/category`
  const { data } = useSWR(fetchUrl, async () => {
    const { data } = await axios.get(fetchUrl)
    return { categories: data.categories }
  })
  return (
    <>
      {!data ? (
        <Skeleton animation="wave" variant="rect" width={"100%"} height={800} />
      ) : (
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="stretch"
        >
          {data.categories.map((c, index) => (
            <Box key={c.id} className={classes.formControl}>
              <CheckBoxList
                category={{
                  id: c.id,
                  name: c.name,
                  order_info: {
                    id: c.order_id,
                    info: c.info,
                  },
                }}
              />
            </Box>
          ))}
        </Grid>
      )}
    </>
  )
}
