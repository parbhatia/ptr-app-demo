import produce from "immer"
import axios from "axios"

//Primarily used by Store Category to bulk insert
//  Returns number of new Items added, excluding Subitems
const updateBulkCheckboxHelper = async ({ bulkData, url, mutate }) => {
  try {
    const { data } = await axios.patch(url, {
      bulkData,
    })
    const newItems = data.items
    mutate((data) => {
      return produce(data, (draftState) => {
        const fixedItems = draftState.items.map((t1) => ({
          ...t1,
          ...newItems.find((t2) => t2.id === t1.id),
        }))
        //remove checkedSubitems key from object, because it conflicts with next state change
        const fixedItemsAndSubitems = fixedItems.map((t1) => ({
          id: t1.id,
          text: t1.text,
          info: t1.info,
          order_id: t1.order_id,
          checked: "checkedSubitems" in t1 ? true : t1.checked,
          used: "checkedSubitems" in t1 ? true : t1.used,
          items: t1.items.map((sub) => ({
            id: sub.id,
            text: sub.text,
            checked:
              "checkedSubitems" in t1 && t1.checkedSubitems.includes(sub.id)
                ? true
                : sub.checked,
            used:
              "checkedSubitems" in t1 && t1.checkedSubitems.includes(sub.id)
                ? true
                : sub.used,
          })),
        }))
        draftState.items = fixedItemsAndSubitems
      })
    }, false)
    return newItems.length
  } catch (e) {
    console.log(e)
  }
}

//primarily used by Store Category
// uncheck all checkboxes and subcheckboxes!
const updateBulkUNCheckboxHelper = async ({ bulkData, url, mutate }) => {
  try {
    const { data } = await axios.patch(url, {
      bulkData,
    })
    const newItems = data.items

    mutate((data) => {
      return produce(data, (draftState) => {
        const fixedItems = draftState.items.map((t1) => ({
          ...t1,
          ...newItems.find((t2) => t2.id === t1.id),
        }))
        const fixedItemsAndSubitems = fixedItems.map((t1) => ({
          id: t1.id,
          text: t1.text,
          info: t1.info,
          order_id: t1.order_id,
          checked: false,
          used: "checkedSubitems" in t1 ? false : t1.used,
          items: t1.items.map((sub) => ({
            id: sub.id,
            text: sub.text,
            checked: false,
            used:
              "checkedSubitems" in t1 && t1.checkedSubitems.includes(sub.id)
                ? false
                : sub.used,
          })),
        }))
        draftState.items = fixedItemsAndSubitems
      })
    }, false)
  } catch (e) {
    console.log(e)
  }
}

export { updateBulkCheckboxHelper, updateBulkUNCheckboxHelper }
