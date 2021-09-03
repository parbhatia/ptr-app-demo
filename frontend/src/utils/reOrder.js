// import produce from "immer"

// export default function reOrder(arr, order) {
//   const newList = produce(arr, (draftState) => {
//     order.map((ob, i) => draftState[ob])
//   })
//   // order.map((ob, i) => arr[ob])
//   // const newList = order.map((ob, i) => arr[ob])
//   return newList
// }

import cloneDeep from "lodash.clonedeep"

//Uses deep copy
//Takes orderArray and items as lists,
//returns items based on given orderArray
//meant to be used for category/checkbox and checkbox/subcheckbox relationships

//mutate the existing items
export default function reOrder(items, orderArray) {
  items = orderArray.map((i) => items[i])
  return items
}
// export default function reOrder(items, orderArray) {
//   let newItems = cloneDeep(items)
//   newItems = orderArray.map((i) => newItems[i])
//   return newItems
// }
