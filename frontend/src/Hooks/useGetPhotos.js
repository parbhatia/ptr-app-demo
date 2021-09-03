import axios from "axios"
import useSWR from "swr"

//fetches photos of photoCategory and it's order array
const useGetPhotos = ({ fetchUrl }) => {
  const { data: photosInfo, mutate } = useSWR(fetchUrl, async () => {
    const { data } = await axios.get(fetchUrl)
    return {
      photos: data.photos,
      orderInfo: data.orderInfo,
    }
  })
  return [photosInfo, mutate]
}

export default useGetPhotos
