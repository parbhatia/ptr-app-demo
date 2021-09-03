import Box from "@material-ui/core/Box"
import Checkbox from "@material-ui/core/Checkbox"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import axios from "axios"
import produce from "immer"
import React, { memo } from "react"

//Called by CheckBoxList to renders a single checkbox, which can be controlled
//  Responsible for handling check/uncheck functionality
function CheckBoxComponent(props) {
  const { id, boolVal, text, idxToUpdate } = props.checkbox
  const { mutateCheckboxList, fetchUrl } = props
  return (
    <Box flexWrap="wrap" display="flex">
      <FormControlLabel
        key={`formcontrolcheckbox-${id}`}
        style={{
          wordBreak: "break-word",
          display: "inline-flex",
          alignItems: "baseline",
        }}
        control={
          <Box>
            <Checkbox
              key={`checkbox-${id}`}
              onClick={async () => {
                let oldBoolVal
                try {
                  mutateCheckboxList((data) => {
                    oldBoolVal = boolVal
                    return produce(data, (draftState) => {
                      draftState.checkboxes[idxToUpdate].used = !oldBoolVal
                    })
                  }, false)
                  const { data } = await axios.patch(
                    `${fetchUrl}/${id}/${!boolVal}`,
                  )
                  const ob = { ...data }

                  if (ob.id !== id || ob.boolVal === oldBoolVal) {
                    mutateCheckboxList(
                      (data) =>
                        produce(data, (draftState) => {
                          draftState.checkboxes[idxToUpdate].used = oldBoolVal
                        }),
                      true,
                    )
                  }
                } catch (e) {
                  mutateCheckboxList(
                    (data) =>
                      produce(data, (draftState) => {
                        draftState.checkboxes[idxToUpdate].used = oldBoolVal
                      }),
                    true,
                  )
                }
              }}
              checked={boolVal}
              value={text}
            />
          </Box>
        }
        label={text}
      />
    </Box>
  )
}

export default memo(CheckBoxComponent)
