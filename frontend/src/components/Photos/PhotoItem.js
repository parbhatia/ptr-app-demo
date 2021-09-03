import Box from "@material-ui/core/Box"
import Card from "@material-ui/core/Card"
import { green, red } from "@material-ui/core/colors"
import { makeStyles } from "@material-ui/core/styles"
import { ArrowMarker, MarkerArea, RectMarker } from "markerjs"
import DragIndicatorIcon from "@material-ui/icons/DragIndicator"
import IconButton from "@material-ui/core/IconButton"
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react"
import { useInView } from "react-intersection-observer"
import cropImage from "../../utils/cropAndDownscaleImage"
import useInputHook from "../../Hooks/useInputHook"
import useError from "../../Hooks/useError"
import CustomActionsToolbar from "./CustomPhotoComponents/CustomActionsToolbar"
import CustomCaption from "./CustomPhotoComponents/CustomCaption"
import CustomCroppingComponent from "./CustomPhotoComponents/CustomCroppingComponent"
import CustomEditingToolbar from "./CustomPhotoComponents/CustomEditingToolbar"
import CustomSkeleton from "./CustomPhotoComponents/CustomSkeleton"
import sortablePhotoReducer from "./sortablePhotoReducer"

const useStyles = ({ unsaved, faded, userWidth, orderingDisabled, loading }) =>
  makeStyles((theme) => ({
    sliderContainer: {
      display: "flex",
      flex: "1",
      alignItems: "center",
    },
    slider: {
      marginLeft: "2rem",
    },
    card: {
      opacity: faded ? 0.2 : 1,
      borderBottomColor: unsaved ? red[500] : green[500],
      borderBottomWidth: orderingDisabled ? 8 : 0,
      borderRadius: orderingDisabled ? 10 : 0,
      width: "100%",
      //initially set default card height, so our intersection observer doesn't register unnecessary renders based on 0 height
      height: loading ? userWidth : "inherit",
      // width: userWidth,
      // height: "100%",
    },
  }))
const transformNullCaption = (text) => (text ? text : "")
const initialState = {
  src: "",
  backupHeight: 0,
  dynamicHeight: 500,
  editingCaption: false,
  marking: false,
  cropping: false,
  loading: true,
  deleting: false,
  zoom: 1,
  rotation: 0,
  crop: { x: 0, y: 0 },
  croppedAreaPixels: null,
}

const PhotoItem = forwardRef(
  (
    {
      photo: { id, keyid, versionid, caption, type },
      orderingDisabled,
      userWidth,
      disableSetCoverphoto,
      helpers,
      noPreview,
      faded,
      style,
      confirm,
      ...props
    },
    ref,
  ) => {
    const { ref: onScreenRef, inView } = useInView()
    //Problem: S3 doesn't set the "Vary: Origin" header, even though it should
    // As a result, if you load an image via CSS or an <img> tag, the image will be cached without the Access-Control-Allow-Origin header
    // Which is fine 90% of the time, except when you want to modify img via canvas, and need to use crossOrigin tags
    // We need to append a unique memcache-busting query parameter
    // If we don't, first image load will work fine, but when image gets stored in browser cache,
    //   cors headers are not stored with them.
    //   Chrome Desktop, Firefox Desktop (2021), Safari don't show any CORS errors for this scenario!
    //   On Safari Technology Preview Desktop browser (2021 February version), these errors show up
    //   On Mobile, iPad, iPhone, possible other android browsers, we receive CORS errors, but also a blank image
    // As a consequence, this resolves the browser reusing the img cached without CORS header.
    // As a downside, we lose benefits of caching, and the browser is storing multiple versions of potentially the same image in local storage
    // To combat this, we ensure that our images use "Cache-Control: max-age=0, must-revalidate" header
    // We're using a custom cache busting stragegy. By default, src string is unmodified
    //   this allows the browser to cache the image as it sees fit
    // Whenever want to mark/crop an image, we bust image cache by appending random value to the filename
    // The browser understands this as a new image, and allows us to use cors header on the image
    // This is better than using axios to fetch an image with no fetch headers each time,
    // since in that scenario, you lose caching, which when faced with loading over 25 full time images, leads to a significant lag
    const [state, dispatch] = useReducer(sortablePhotoReducer, initialState)
    const [src, setSrc] = useState(null)
    const [corsConfig, setCorsConfig] = useState({})

    useEffect(() => {
      if (inView) {
        const newSrc =
          versionid.length === 0
            ? process.env.REACT_APP_S3_PHOTOS_RESOURCE_URL + "/" + keyid
            : `${process.env.REACT_APP_S3_PHOTOS_RESOURCE_URL}/${keyid}?versionId=${versionid[0]}`
        setSrc(newSrc)
        setCorsConfig({})
        //update initial loading state
        dispatch({ type: "notLoading" })
      }
    }, [keyid, versionid, inView])

    const divKey = `item-${id}`
    const [notify] = useError()
    const [input, _, handleInputChange, setManualEditInput] = useInputHook(
      transformNullCaption(caption),
    )

    const imageRef = useRef(null)
    const markerRef = useRef(null)
    const cropper = useRef(null)
    const closeMarkerJs = () => {
      markerRef.current.close()
      markerRef.current = null
    }

    useEffect(() => {
      return () => {
        if (markerRef.current) {
          closeMarkerJs()
        }
      }
    }, [])

    const unsaved =
      state.marking ||
      state.cropping ||
      state.deleting ||
      state.editingCaption ||
      state.loading
    const classes = useStyles({
      unsaved,
      faded,
      orderingDisabled,
      userWidth,
      loading: state.loading,
    })()
    const updateCropValues = useCallback((croppedArea, croppedAreaPixels) => {
      dispatch({
        type: "setCroppedAreaPixels",
        croppedAreaPixels,
      })
    }, [])
    const rotateClockwise = () => {
      dispatch({
        type: "rotateClockwise",
      })
    }

    const takeAction = (type) => {
      dispatch({ type })
    }
    //if caption is "", then we update db with a null field
    const sanitizedCaption = input !== "" ? input : null

    const handler = {
      marker: {
        initiate: () => {
          const newSrc =
            versionid.length === 0
              ? process.env.REACT_APP_S3_PHOTOS_RESOURCE_URL +
                "/" +
                keyid +
                "?cachebust" +
                new Date().getTime()
              : `${
                  process.env.REACT_APP_S3_PHOTOS_RESOURCE_URL
                }/${keyid}?versionId=${
                  versionid[0]
                }&cachebust${new Date().getTime()}`
          setSrc(newSrc)
          setCorsConfig({ crossOrigin: "use-credentials" })
          if (markerRef.current === null) {
            markerRef.current = new MarkerArea(
              document.getElementById(divKey),
              {
                renderAtNaturalSize: true,
                renderImageType: "image/jpeg",
                strokeWidth: 4,
                markerColors: {
                  mainColor: "#ff0000",
                },
              },
            )
            markerRef.current.open()
            document.getElementById(divKey).style.display = ""
            markerRef.current.addMarker(RectMarker)
            markerRef.current.addMarker(ArrowMarker)
            takeAction("marking")
          }
        },
        save: async () => {
          try {
            await markerRef.current.render(async (dataUrl) => {
              await helpers.saveMarkedFile({
                id,
                keyid,
                type,
                dataUrl,
              })
              // notify("Edit successfull", "success")
              handler.marker.finish()
            })
          } catch (e) {
            notify("Uuccessfull", "error")
            handler.marker.finish()
          }
        },
        finish: () => {
          closeMarkerJs()
          takeAction("notMarking")
        },
      },
      crop: {
        initiate: () => {
          const newSrc =
            versionid.length === 0
              ? process.env.REACT_APP_S3_PHOTOS_RESOURCE_URL +
                "/" +
                keyid +
                "?cachebust" +
                new Date().getTime()
              : `${
                  process.env.REACT_APP_S3_PHOTOS_RESOURCE_URL
                }/${keyid}?versionId=${
                  versionid[0]
                }&cachebust${new Date().getTime()}`
          setSrc(newSrc)
          setCorsConfig({ crossOrigin: "use-credentials" })
          takeAction("cropping")
          //backup image height while it's in DOM
          // when we show the crop component, we wont have access to image's ref (height,width)
          dispatch({
            type: "backupDynamicHeight",
            backupHeight: state.dynamicHeight,
          })
        },
        save: async () => {
          try {
            //crop
            const compressedDataUrl = await cropImage(
              src,
              state.croppedAreaPixels,
              state.rotation,
            )
            await helpers.saveMarkedFile({
              id,
              keyid,
              type,
              dataUrl: compressedDataUrl,
            })
            handler.crop.finish()
            // notify("Edit successfull", "success")
          } catch (e) {
            notify("Uuccessfull", "error")
            console.log(e)
            handler.crop.finish()
          }
        },
        finish: () => {
          takeAction("notCropping")
          //reset backup height
          dispatch({
            type: "backupDynamicHeight",
            backupHeight: 0,
          })
        },
      },
      caption: {
        initiate: () => {
          takeAction("editingCaption")
        },
        save: async () => {
          const newCaption = await helpers.updateCaption({
            id,
            caption: sanitizedCaption,
          })
          if (newCaption !== sanitizedCaption) {
            notify("Unsuccessful caption set", "error")
            throw new Error("Could not update caption")
          }
          takeAction("notEditingCaption")
        },
        finish: () => {
          setManualEditInput(transformNullCaption(caption))
          takeAction("notEditingCaption")
        },
      },
      delete: {
        initiate: () => {
          confirm({
            type: "delete",
            action: async () => await helpers.deletePhoto({ id, keyid }),
          })
        },
        save: async () => {
          await handler.delete.initiate()
        },
        finish: async () => {
          //doesn't matter if we update state or not, component is unmounted
          await handler.delete.initiate()
        },
      },
      setCoverPhoto: {
        initiate: async () => {
          await helpers.setCoverPhoto({ id, keyid })
          // notify("Cover photo set!", "success")
        },
        save: async () => {
          await handler.setCoverPhoto.initiate()
        },
        finish: async () => {
          await handler.setCoverPhoto.initiate()
        },
      },
      deleteVersion: {
        initiate: async () => {
          confirm({
            type: "restore",
            action: async () => {
              takeAction("deleting")
              await helpers.deletePhotoVersion({
                id,
                keyid,
                type,
                versionid: versionid[0],
              })
              takeAction("notDeleting")
            },
          })
        },
        save: async () => {
          handler.deleteVersion.initiate()
        },
        finish: () => {
          takeAction("notDeleting")
        },
      },
    }

    //revalidate image height when we modify it in any way
    useEffect(() => {
      if (
        !state.loading &&
        imageRef.current &&
        imageRef.current.clientHeight > 0
      ) {
        dispatch({
          type: "setDynamicHeight",
          dynamicHeight: imageRef.current.clientHeight,
        })
      }
    }, [imageRef.current?.clientHeight, state.loading])

    const imgConfig = {
      src,
      id: divKey,
      width: "100%",
      ref: React.useRef(imageRef),
      ...corsConfig,
      style: {
        //need to prevent image selection on touch devices, otherwise long press hold disrupts drag event
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
        userSelect: "none",
        KhtmlUserSelect: "none",
        OUserSelect: "none",
        MozUserSelect: "-moz-none",
        OUserDrag: "none",
        userDrag: "none",
        WebkitUserDrag: "none",
        //remove blue selection border in mobile browsers
        outline: "none",
      },
    }

    let NormalComponent = React.createElement("img", { ...imgConfig }, null)

    let ComponentRendered
    if (state.cropping) {
      ComponentRendered = (
        <CustomCroppingComponent
          corsConfig={corsConfig}
          cropper={cropper}
          src={src}
          state={state}
          dispatch={dispatch}
          updateCropValues={updateCropValues}
        />
      )
    } else {
      ComponentRendered = NormalComponent
    }

    return (
      <Box ref={ref} style={style}>
        <Card ref={onScreenRef} className={classes.card} variant="outlined">
          {!src && (
            <div>
              <CustomSkeleton width={"100%"} height={400} />
            </div>
          )}
          {ComponentRendered}
          {orderingDisabled ? (
            <>
              <CustomEditingToolbar
                markerRef={markerRef}
                rotateClockwise={rotateClockwise}
                disabled={!state.marking}
                disabledCropping={!state.cropping}
              />
              <CustomCaption
                input={input}
                caption={caption}
                editingCaption={state.editingCaption}
                handleInputChange={handleInputChange}
                setManualEditInput={setManualEditInput}
              />
              <CustomActionsToolbar
                unsaved={unsaved}
                versionid={versionid}
                handler={handler}
                type={type}
                orderingDisabled={orderingDisabled}
                disableSetCoverphoto={disableSetCoverphoto}
              />
            </>
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              style={{
                //need to prevent image selection on touch devices, otherwise long press hold disrupts drag event
                WebkitUserDrag: "none",
                OUserDrag: "none",
                userDrag: "none",
                touchAction: props.orderingDisabled ? "auto" : "none",
                WebkitUserSelect: "none",
                WebkitTouchCallout: "none",
                userSelect: "none",
                KhtmlUserSelect: "none",
                OUserSelect: "none",
                MozUserSelect: "-moz-none",
                //remove blue selection border in mobile browsers
                outline: "none",
              }}
            >
              <IconButton size="medium">
                <DragIndicatorIcon fontSize="small" {...props} />
              </IconButton>
            </Box>
          )}
        </Card>
      </Box>
    )
  },
)

export default PhotoItem
