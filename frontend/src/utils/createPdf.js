import axios from "axios"
export default async function createPdf({
  fetchUrl,
  pdfRequest,
  inspectionId,
  componentName,
  ignoreSendBack = false,
  cancelTokenSource,
  deletePreviousFile,
}) {
  const response = await axios.post(
    fetchUrl,
    {
      pdfRequest: pdfRequest,
      inspectionId: inspectionId,
      componentName,
      ignoreSendBack,
      deletePreviousFile,
    },
    {
      responseType: "blob",
      cancelToken: cancelTokenSource.token,
    },
  )
  if (cancelTokenSource.token && response) {
    if (ignoreSendBack) {
      return response
    } else {
      return response.data
    }
  } else {
    throw new Error("Pdf Generation interupted.")
  }
}
