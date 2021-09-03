import Box from "@material-ui/core/Box"
import React from "react"
import FileItem from "./FileItem"
import useConfirmationDialog from "../../Hooks/useConfirmationDialog"

export default function FileList({ files, ...rest }) {
  const [confirm, confirmationDialog] = useConfirmationDialog()
  return (
    <Box>
      {files.map((file) => (
        <FileItem key={file.id} confirm={confirm} {...file} {...rest} />
      ))}
      {confirmationDialog}
    </Box>
  )
}
