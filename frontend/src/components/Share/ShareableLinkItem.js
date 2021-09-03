import Box from "@material-ui/core/Box"
import axios from "axios"
import React from "react"
import useSWR from "swr"
import EmailDialog from "../Email/Dialog"
import EmailRecords from "../Email/EmailRecords"
import FileManager from "./File Store/FileManager"
import PdfGenerator from "./PdfGenerator"
import ShareableLinkUrl from "./ShareableLinkUrl"
import ShareableLinkAccessControl from "./ShareableLinkAccessControl"

const ShareableLinkItem = (props) => {
  const { id, type, inspectionUniqueId, inspectionId } = props

  //we save all files sharable inside subfolder with name of shareable link's url id
  // const shareableFolderPrepend = id + "/"
  // this step happens in the backend, since a shareable link's file is nested inside the shareable link's route, and thus access to it's id

  const fetchUrl = `/api/inspection/${inspectionId}/shareablelink/${id}`
  const { data, mutate } = useSWR(fetchUrl, async () => {
    const { data } = await axios.get(fetchUrl)
    return data.shareablelink
  })
  const { data: masterFileStoreId } = useSWR(
    "/api/masterfilestore",
    async () => {
      const { data } = await axios.get("/api/masterfilestore")
      return data.store.id
    },
  )

  const shareableUrl = `${process.env.REACT_APP_PTR_MAIN_DOMAIN}/Shared/${id}`
  return (
    <>
      {!data || !masterFileStoreId ? null : (
        <Box>
          <ShareableLinkUrl shareableUrl={shareableUrl} />
          <PdfGenerator
            inspectionId={inspectionId}
            pdfRequest={type}
            fetchUrl={fetchUrl}
            mutateShareableLink={mutate}
          />

          <FileManager
            header="Merge Files with PDF"
            caption="The following files will be merged with the PDF"
            fetchUrl={fetchUrl}
            fileType={"merge_with_pdf"}
            masterFileStoreId={masterFileStoreId}
            mutateShareableLink={mutate}
          />
          <FileManager
            header="Additional Attachments"
            caption="The following files will be sent as separate attachments"
            masterFileStoreId={masterFileStoreId}
            mutateShareableLink={mutate}
            fileType={"attachment"}
            fetchUrl={fetchUrl}
          />
          <EmailRecords
            header="Outbox"
            caption="Record of sent emails"
            fetchUrl={`${fetchUrl}/emailrecords/ofShareableLink`}
            disablePagination={false}
          >
            <EmailDialog
              //this is composed
              shareableUrl={shareableUrl}
              fetchUrl={fetchUrl}
              inspectionType={type}
            />
          </EmailRecords>
          <ShareableLinkAccessControl
            count={data.view_count}
            checked={data.shared}
            fetchUrl={fetchUrl}
            revalidate={mutate}
          />
        </Box>
      )}
    </>
  )
}

export default ShareableLinkItem
