import Box from "@material-ui/core/Box"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import FormGroup from "@material-ui/core/FormGroup"
import Switch from "@material-ui/core/Switch"
import Typography from "@material-ui/core/Typography"
import axios from "axios"
import React from "react"

const ShareableLinkAccessControl = ({
  checked,
  fetchUrl,
  revalidate,
  count,
}) => {
  const toggleChecked = async () => {
    const boolVal = !checked
    try {
      const { data } = await axios.patch(`${fetchUrl}/accessControl`, {
        boolVal,
      })
      if (data.shareableLink.shared === boolVal) {
        revalidate()
      } else {
        throw new Error("Updating access control")
      }
    } catch (e) {
      console.log("Error:", e)
    }
  }
  const enabledMessage = (
    <Typography variant="overline">Shareable Link is enabled</Typography>
  )
  const disabledMessage = (
    <Typography variant="overline">Shareable Link is disabled</Typography>
  )

  return (
    <Box display="flex" mt={6} justifyContent="center" flexDirection="column">
      <Box display="flex" justifyContent="center">
        <Typography variant="overline">
          {count !== 0 ? `${count} Views` : "No Views"}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="center">
        <FormGroup row>
          <FormControlLabel
            control={<Switch checked={checked} onChange={toggleChecked} />}
            label={checked ? enabledMessage : disabledMessage}
            labelPlacement="start"
          />
        </FormGroup>
      </Box>
    </Box>
  )
}

export default ShareableLinkAccessControl
