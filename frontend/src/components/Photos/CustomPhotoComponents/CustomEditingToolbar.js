import Box from "@material-ui/core/Box"
import IconButton from "@material-ui/core/IconButton"
import ArrowForwardIcon from "@material-ui/icons/ArrowForward"
import BackspaceIcon from "@material-ui/icons/Backspace"
import CropLandscapeIcon from "@material-ui/icons/CropLandscape"
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked"
import RotateRightIcon from "@material-ui/icons/RotateRight"
import TextFormatOutlinedIcon from "@material-ui/icons/TextFormatOutlined"
import { ArrowMarker, EllipseMarker, RectMarker, TextMarker } from "markerjs"
import React from "react"

const CustomBox = ({ children }) => (
  <Box pl={0.5} pr={0.5}>
    {children}
  </Box>
)

const Toolbar = ({ markerRef, disabled, disabledCropping, rotateClockwise }) =>
  !disabled ? (
    <Box pb={0.5} display={"flex"} overflow={"auto"} bgcolor="background.paper">
      <CustomBox>
        <IconButton
          disabled={disabled}
          aria-label="arrow"
          size="small"
          onClick={() => {
            markerRef.current.addMarker(ArrowMarker)
          }}
        >
          <ArrowForwardIcon fontSize="small" />
        </IconButton>
      </CustomBox>
      <CustomBox>
        <IconButton
          disabled={disabled}
          aria-label="circle"
          size="small"
          onClick={() => {
            markerRef.current.addMarker(EllipseMarker)
          }}
        >
          <RadioButtonUncheckedIcon fontSize="small" />
        </IconButton>
      </CustomBox>
      <CustomBox>
        <IconButton
          disabled={disabled}
          aria-label="square"
          size="small"
          onClick={() => {
            markerRef.current.addMarker(RectMarker)
          }}
        >
          <CropLandscapeIcon fontSize="small" />
        </IconButton>
      </CustomBox>
      <CustomBox>
        <IconButton
          disabled={disabled}
          aria-label="text"
          size="small"
          onClick={() => {
            markerRef.current.addMarker(TextMarker)
          }}
        >
          <TextFormatOutlinedIcon fontSize="small" />
        </IconButton>
      </CustomBox>
      <CustomBox>
        <IconButton
          disabled={disabled}
          aria-label="erase"
          size="small"
          onClick={() => {
            markerRef.current.deleteActiveMarker()
          }}
        >
          <BackspaceIcon fontSize="small" />
        </IconButton>
      </CustomBox>
      <CustomBox>
        <IconButton
          disabled={disabledCropping}
          aria-label="rotate"
          size="small"
          onClick={() => rotateClockwise()}
        >
          <RotateRightIcon fontSize="small" />
        </IconButton>
      </CustomBox>
    </Box>
  ) : null

export default React.memo(Toolbar)
