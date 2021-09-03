import useMediaQuery from "@material-ui/core/useMediaQuery"

//takes optional sizes for sm, md, lg
//default are 400,600,700 respectively
const useImageSize = (sm, md, lg) => {
  const large = useMediaQuery("(min-width:1500px)")
  const medium = useMediaQuery("(min-width:800px)")
  const small = useMediaQuery("(min-width:300px)")
  let size
  if (large) {
    size = "lg"
  } else if (medium) {
    size = "md"
  } else {
    size = "sm"
  }
  const sizer = (size) => {
    if (size === "lg") return lg ? lg : 700
    else if (size === "md") return md ? md : 600
    else return sm ? sm : 400
  }
  return [sizer(size)]
}

export default useImageSize
