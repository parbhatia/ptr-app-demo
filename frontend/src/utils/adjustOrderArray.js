//Filters orderArray of of item at index = indexToDelete
export default function adjustOrderArray(orderArray, indexToDelete) {
  return orderArray.filter((item, i) => i !== indexToDelete)
}

//oldVerion, which stored item indices, and sorted them !
// //Filters orderArray of item at indexToDelete
// export default function adjustOrderArray(orderArray, indexToDelete) {
//   console.log("adjustOrderArray:", orderArray, indexToDelete)
//   let order_array_itemtoRemove = orderArray[indexToDelete]
//   let filteredArray
//   if (orderArray.length === 1) {
//     filteredArray = []
//   } else {
//     const slicedArray = orderArray
//       .slice(0, indexToDelete)
//       .concat(orderArray.slice(indexToDelete + 1, orderArray.length))
//     filteredArray = slicedArray.map((elem) => {
//       if (elem === 0) {
//         return elem
//       } else if (elem >= order_array_itemtoRemove) {
//         return elem - 1
//       } else return elem
//     })
//   }
//   return filteredArray
// }
