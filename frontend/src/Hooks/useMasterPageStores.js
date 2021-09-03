import useGetMasterPageStores from "./useGetMasterPageStores"
import encapsulateHelpers from "../helpers/masterpagestore"
const useMasterPageStores = () => {
  const fetchUrl = "/api/masterpagestore"
  const [data, mutate] = useGetMasterPageStores({ fetchUrl })
  const helpers = encapsulateHelpers({
    mutate,
    fetchUrl,
  })
  return [data, helpers]
}

export default useMasterPageStores
