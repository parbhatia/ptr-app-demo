const reducer = (state, action) => {
  switch (action.type) {
    case "setDynamicHeight":
      return {
        ...state,
        dynamicHeight: action.dynamicHeight,
      }
    case "backupDynamicHeight":
      return {
        ...state,
        backupHeight: action.backupHeight,
      }
    case "loading":
      return {
        ...state,
        loading: true,
      }
    case "notLoading":
      return {
        ...state,
        loading: false,
      }
    case "cropping":
      return {
        ...state,
        cropping: true,
      }
    case "notCropping":
      return {
        ...state,
        cropping: false,
      }
    case "marking":
      return {
        ...state,
        marking: true,
      }
    case "notMarking":
      return {
        ...state,
        marking: false,
      }
    case "editingCaption":
      return {
        ...state,
        editingCaption: true,
      }
    case "notEditingCaption":
      return {
        ...state,
        editingCaption: false,
      }
    case "deleting":
      return {
        ...state,
        deleting: true,
      }
    case "notDeleting":
      return {
        ...state,
        deleting: false,
      }
    case "setZoom":
      return {
        ...state,
        zoom: action.zoom,
      }
    case "setRotation":
      return {
        ...state,
        rotation: action.rotation,
      }
    case "rotateClockwise":
      return {
        ...state,
        rotation: state.rotation + 90,
      }
    case "setCrop": {
      return {
        ...state,
        crop: action.crop,
      }
    }
    case "setCroppedAreaPixels":
      return {
        ...state,
        croppedAreaPixels: action.croppedAreaPixels,
      }
    default:
      throw new Error("Unexpected action")
  }
}

export default reducer
