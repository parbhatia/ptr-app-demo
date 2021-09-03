import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import React from "react"

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    minHeight: 500,
  },
})

export default function EmptyList({
  itemLabel = "Items",
  CustomAddItemsComponent,
}) {
  const classes = useStyles()
  return (
    <Grid
      className={classes.root}
      container
      direction="column"
      justify="center"
      alignItems="center"
    >
      <Grid item>
        <Typography variant="h4" gutterBottom>
          No {itemLabel} Added
        </Typography>
      </Grid>
      {CustomAddItemsComponent ? (
        CustomAddItemsComponent
      ) : (
        <Grid item>
          <Typography variant="body1" color="textSecondary" component="p">
            Add {itemLabel} below
          </Typography>
        </Grid>
      )}
    </Grid>
  )
}
