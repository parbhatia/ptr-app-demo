import useSWR from "swr"
import axios from "axios"

const stopRefreshOptions = {
  revalidateOnReconnect: false,
  revalidateOnFocus: false,
  refreshWhenOffline: false,
  refreshWhenHidden: false,
  refreshInterval: 0,
}

const useGetMasterPageStores = ({ fetchUrl, stopRefresh = false }) => {
  const { data, mutate } = useSWR(
    fetchUrl,
    async () => {
      const { data } = await axios.get(fetchUrl)
      return {
        templates: data.templates,
      }
    },
    stopRefresh ? stopRefreshOptions : {},
  )
  return [data, mutate]
}

export default useGetMasterPageStores
