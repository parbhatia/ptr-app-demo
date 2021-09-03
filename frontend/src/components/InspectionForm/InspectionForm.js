import React from "react"
import useError from "../../Hooks/useError"
import CreateNewInspection from "./CreateNewInspection"
import UpdateForm from "./UpdateForm"

//Handles Creation and Updating of existing Inspection Form
//request is "updateExisting" or "createNew"
export default function InspectionForm(props) {
  const { request } = props
  const [notify] = useError()
  //parse request
  if (request === "createNew") {
    return <CreateNewInspection {...props} notify={notify} />
  } else return <UpdateForm {...props} notify={notify} />
}
