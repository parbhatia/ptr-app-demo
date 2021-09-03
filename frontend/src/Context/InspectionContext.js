import React from "react"
const InspectionContext = React.createContext({
  inspectionId: null,
  socket: null,
  storeId: null,

  inspectionInfo: null,
  setInspectionInfo: () => {},

  shareableLinks: null,
})
export default InspectionContext
