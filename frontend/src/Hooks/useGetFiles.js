import axios from "axios"
import useSWR from "swr"

const useGetFiles = ({ fetchUrl }) => {
  const { data: files, mutate } = useSWR(fetchUrl, async () => {
    const { data } = await axios.get(fetchUrl)
    return data.files
  })
  return [files, mutate]
}

export default useGetFiles
