// import { makeStyles } from "@material-ui/core/styles"
import React, { useContext, memo } from "react"
import InspectionContext from "../../Context/InspectionContext"
import useDrawer from "../../Hooks/useDrawerHook"
import StoreCategoryList from "../Master Storage/Master Store/StoreCategory"
import CustomDrawer from "../Misc/CustomDrawer"
import Fab from "./Fab"

// const useStyles = makeStyles((theme) => ({
//   drawer: {
//     width: 100,
//     height: 500,
//   },
//   paper: {
//     flexGrow: 1,
//     width: `calc(100% - ${theme.spacing(4)}px)`,
//     height: `calc(100% - ${theme.spacing(5)}px)`,
//     maxWidth: 800,
//     padding: theme.spacing(1),
//     marginTop: theme.spacing(2),
//     marginRight: theme.spacing(2),
//   },
// }))

// Called by Draggable Category to render store/speeddial if needed, or just render the category otherwise
// If store is rendered, it'll look in Inspection's context for storeId and provide it to StoreCategory as prop
function StoreDisplayWrapper({
  displaySpeedDial,
  draggableCategory,
  children,
}) {
  //get store id from context, to pass to store categories
  const { storeId, inspectionId } = useContext(InspectionContext)
  const [anchorText, isOpen, toggleDrawer] = useDrawer("right")

  return (
    <>
      {children}
      {displaySpeedDial && (
        <CustomDrawer
          anchor={anchorText}
          isOpen={isOpen}
          toggleDrawer={toggleDrawer}
        >
          <StoreCategoryList
            parent={{ id: storeId }}
            inspectionId={inspectionId}
            draggableCategory={draggableCategory}
          ></StoreCategoryList>
        </CustomDrawer>
      )}
      {displaySpeedDial && <Fab toggleStore={toggleDrawer()} />}
    </>
  )
}

export default memo(StoreDisplayWrapper)
