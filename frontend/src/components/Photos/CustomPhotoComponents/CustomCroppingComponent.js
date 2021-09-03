import Slider from "@material-ui/core/Slider"
import Typography from "@material-ui/core/Typography"
import React from "react"
import Cropper from "react-easy-crop"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(() => ({
  sliderContainer: {
    display: "flex",
    flex: "1",
    alignItems: "center",
  },
  slider: {
    marginLeft: "2rem",
  },
}))

const CroppingComponent = ({
  corsConfig,
  cropper,
  src,
  state,
  dispatch,
  updateCropValues,
}) => {
  const classes = useStyles()
  return (
    <>
      <div className="crop-container">
        <Cropper
          ref={cropper}
          image={src}
          crop={state.crop}
          rotation={state.rotation}
          zoom={state.zoom}
          aspect={4 / 3}
          restrictPosition
          zoomWithScroll={false}
          style={{
            containerStyle: {
              height: state.backupHeight,
              position: "relative",
            },
          }}
          mediaProps={{ ...corsConfig }}
          onCropChange={(crop) => {
            dispatch({ type: "setCrop", crop })
          }}
          onCropComplete={updateCropValues}
          onZoomChange={(_, zoom) => {
            dispatch({
              type: "setZoom",
              zoom,
            })
          }}
        />
      </div>
      <div className={classes.sliderContainer}>
        <Typography variant="overline" classes={{ root: classes.sliderLabel }}>
          Crop
        </Typography>
        <Slider
          className={classes.slider}
          color="secondary"
          value={state.zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(_, zoom) =>
            dispatch({
              type: "setZoom",
              zoom,
            })
          }
        />
      </div>
      <div className={classes.sliderContainer}>
        <Typography variant="overline" classes={{ root: classes.sliderLabel }}>
          Rotation
        </Typography>
        <Slider
          className={classes.slider}
          color="secondary"
          value={state.rotation}
          min={0}
          max={360}
          step={1}
          aria-labelledby="Rotation"
          onChange={(_, rotation) =>
            dispatch({
              type: "setRotation",
              rotation,
            })
          }
        />
      </div>
    </>
  )
}
export default CroppingComponent
