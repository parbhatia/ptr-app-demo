import lightBlue from "@material-ui/core/colors/lightBlue"
import orange from "@material-ui/core/colors/orange"

const colorPick = (dark, type) => {
  if (dark) {
    if (type === "realtor") {
      return orange[800]
    } else {
      return lightBlue[800]
    }
  } else {
    if (type === "realtor") {
      return orange[200]
    } else {
      return lightBlue[100]
    }
  }
}

export default colorPick
