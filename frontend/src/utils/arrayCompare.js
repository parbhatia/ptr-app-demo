//Compares two arrays, using recursion
export default function compare(arr1, arr2) {
  if (!arr1 || !arr2) return
  if (!Array.isArray(arr1) && !Array.isArray(arr2)) return arr1 === arr2
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false
  if (arr1.length === 0 && arr2.length === 0) return true
  let result

  arr1.forEach((e1, i) =>
    arr2.forEach((e2) => {
      if (e1.length > 1 && e2.length) {
        result = compare(e1, e2)
      } else if (e1 !== e2) {
        result = false
      } else {
        result = true
      }
    })
  )

  return result
}
