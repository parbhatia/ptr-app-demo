import axios from "axios"
export default async function fetchPdf({ fetchUrl, info, cancelTokenSource }) {
  const response = await axios.get(fetchUrl, {
    responseType: "blob",
    cancelToken: cancelTokenSource.token,
  })
  if (cancelTokenSource.token) {
    return response.data
  }
}
