import arrayMove from "array-move"
import axios from "axios"
import produce from "immer"
import adjustOrderArray from "../utils/adjustOrderArray"
import arrayCompare from "../utils/arrayCompare"
import { generateRandomId } from "../utils/randomGenerators"

// Used by Draggable Category, and given to Store,
//   so user can bulk add items directly to draggable category
const addBulkItemHelper = async ({ bulkData, parent, url, mutate }) => {
  try {
    //no optimistic ui
    const { data } = await axios.post(url, {
      bulkData,
      parent,
    })
    // console.log("response from bulk insert", returnedInfo)
    const newItems = data.items

    mutate((data) => {
      return produce(data, (draftState) => {
        draftState.items = draftState.items.concat(newItems)
        // const oldLen = draftState.parent.order_info.info.length
        // const numOfNewItems = newItems.length
        const infoToMerge = newItems.map((item) => item.id)

        draftState.parent.order_info.info =
          draftState.parent.order_info.info.concat(infoToMerge)
      })
    }, false)
  } catch (e) {
    console.log("ERROR", e)
  }
}

// Used to create draggablecheckbox, and master_checkbox
const addItemWithTextHelper = async ({ text, url, mutate, reset }) => {
  const tempId = generateRandomId()
  const tempOrderId = generateRandomId()
  try {
    mutate((data) => {
      return produce(data, (draftState) => {
        draftState.items.push({
          id: tempId,
          text: text,
          info: [],
          order_id: tempOrderId,
          items: [],
        })
        draftState.parent.order_info.info.push(
          tempId,
          // draftState.parent.order_info.info.length
        )
      })
    }, false)
    reset()

    const { data } = await axios.post(url, {
      text,
    })
    const ob = { ...data }
    mutate((data) => {
      return produce(data, (draftState) => {
        draftState.items = draftState.items.map((item) =>
          item.id === tempId
            ? { ...item, id: ob.id, order_id: ob.order_id }
            : item,
        )
        draftState.parent.order_info.info =
          draftState.parent.order_info.info.map((o, idx) =>
            o === tempId ? ob.id : o,
          )
      })
    }, false)
  } catch (e) {
    mutate((data) => {
      return produce(data, (draftState) => {
        draftState.items.filter((item) => item.id === tempId)
        const oldInfo = draftState.parent.order_info.info
        oldInfo.pop()
        draftState.parent.order_info.info = oldInfo
      })
    })
  }
}

// Only used by master components, to create a generic item,
//    consisting of master page, master subsection, or master category
//  master checkbox is handled by different helper
// puts ids in order_info
// Optimistic Ui - first populates item with random id and order_id,
const addItemHelper = async ({ text, url, mutate, reset }) => {
  const tempId = generateRandomId()
  const tempOrderId = generateRandomId()
  try {
    mutate((data) => {
      return produce(data, (draftState) => {
        draftState.items.push({
          id: tempId,
          name: text,
          info: [],
          order_id: tempOrderId,
        })
        draftState.parent.order_info.info.push(tempId)
      })
    }, false)
    reset()
    const { data } = await axios.post(url, {
      text,
    })
    const ob = { ...data }
    //look for temp optimistic ui update, and mutate values to be
    //   response from server
    mutate((data) => {
      return produce(data, (draftState) => {
        draftState.items = draftState.items.map((item, idx) =>
          item.id === tempId
            ? { ...item, id: ob.id, order_id: ob.order_id }
            : item,
        )
        draftState.parent.order_info.info =
          draftState.parent.order_info.info.map((o, idx) =>
            o === tempId ? ob.id : o,
          )
      })
    }, false)
  } catch (e) {
    mutate((data) => {
      return produce(data, (draftState) => {
        draftState.items.filter((item) => item.id === tempId)
        const oldInfo = draftState.parent.order_info.info
        oldInfo.pop()
        draftState.parent.order_info.info = oldInfo
      })
    })
  }
}

// Used to delete all Master components, and draggable Checkbox
const deleteItemHelper = async ({ id, idx, url, mutate }) => {
  let parentId
  let oldOrder
  let oldItems
  let newOrder
  let newItems
  try {
    mutate((data) => {
      parentId = data.parent.order_info.id
      oldOrder = data.parent.order_info.info
      oldItems = data.items
      newOrder = adjustOrderArray(data.parent.order_info.info, idx)
      newItems = adjustOrderArray(data.items, idx)

      return produce(data, (draftState) => {
        draftState.items = newItems
        draftState.parent.order_info.info = newOrder
      })
    }, false)
    const { data } = await axios.delete(url, {
      data: {
        id,
      },
    })

    const ob = { ...data }
    //verify that correct id was deleted, and correct order info was returned
    if (ob.id !== id || !arrayCompare(ob.parent.order_info.info, newOrder)) {
      mutate(
        (data) =>
          produce(data, (draftState) => {
            draftState.items = oldItems
            draftState.parent.order_info.info = oldOrder
          }),
        true,
      )
    }
  } catch (e) {
    mutate(
      (data) =>
        produce(data, (draftState) => {
          draftState.items = oldItems
          draftState.parent.order_info.info = oldOrder
        }),
      true,
    )
  }
}

//Used by all Master Components, and Draggable Category to reorder items
const updateOrderHelper = async ({ oldIndex, newIndex, url, mutate }) => {
  let parentOrderId
  let oldOrder
  let oldItems
  let newOrder

  try {
    mutate((data) => {
      parentOrderId = data.parent.order_info.id
      oldOrder = data.parent.order_info.info
      oldItems = data.items

      newOrder = arrayMove(data.parent.order_info.info, oldIndex, newIndex)

      return produce(data, (draftState) => {
        draftState.parent.order_info.info = newOrder
        draftState.items = arrayMove(draftState.items, oldIndex, newIndex)
      })
    }, false)

    const { data } = await axios.patch(url, {
      parent: {
        order_info: {
          id: parentOrderId,
          info: newOrder,
        },
      },
    })

    const ob = { ...data }

    // verify that correct order info was returned
    if (!arrayCompare(ob.parent.order_info.info, newOrder)) {
      mutate(
        (data) =>
          produce(data, (draftState) => {
            draftState.parent.order_info.info = oldOrder
            draftState.items = oldItems
          }),
        true,
      )
    }
  } catch (e) {
    mutate(
      (data) =>
        produce(data, (draftState) => {
          draftState.parent.order_info.info = oldOrder
          draftState.items = oldItems
        }),
      true,
    )
  }
}

//Used by Master Category to update Master Checkbox's boolean checked value
// is passed index for which item needs to be updated at
const updateBoolValueHelper = async ({ id, boolVal, idx, url, mutate }) => {
  let oldBoolVal
  try {
    mutate((data) => {
      oldBoolVal = data.items[idx].used
      return produce(data, (draftState) => {
        draftState.items[idx].used = boolVal
      })
    }, false)
    const { data } = await axios.patch(url, {
      id,
      boolVal,
    })

    const ob = { ...data }
    //verify that and correct info was updated
    if (ob.id !== id || ob.boolVal !== boolVal) {
      mutate(
        (data) =>
          produce(data, (draftState) => {
            draftState.items[idx].used = oldBoolVal
          }),
        true,
      )
    }
  } catch (e) {
    mutate(
      (data) =>
        produce(data, (draftState) => {
          draftState.items[idx].used = oldBoolVal
        }),
      true,
    )
  }
}

// Used to update Draggable Checkbox and Master Checkbox text
//  This is done because these components have a "text" field, instead of a "name" field
//passed index for which item needs to be updated at
const updateTextValueHelper = async ({ id, text, idx, url, mutate }) => {
  let oldTextVal

  try {
    mutate((data) => {
      oldTextVal = data.items[idx].text
      return produce(data, (draftState) => {
        draftState.items[idx].text = text
      })
    }, false)
    const { data } = await axios.patch(url, {
      id,
      text,
    })

    const ob = { ...data }
    //verify that and correct info was updated
    if (ob.id !== id || ob.text !== text) {
      mutate(
        (data) =>
          produce(data, (draftState) => {
            draftState.items[idx].text = oldTextVal
          }),
        true,
      )
    }
  } catch (e) {
    mutate(
      (data) =>
        produce(data, (draftState) => {
          draftState.items[idx].text = oldTextVal
        }),
      true,
    )
  }
}

// Used by all Master Components to update their names
//passed index for which item needs to be updated at
const updateNameValueHelper = async ({ id, name, idx, url, mutate }) => {
  let oldTextVal

  try {
    mutate((data) => {
      oldTextVal = data.items[idx].name
      return produce(data, (draftState) => {
        draftState.items[idx].name = name
      })
    }, false)
    const { data } = await axios.patch(url, {
      id,
      name,
    })
    const ob = { ...data }
    //verify that and correct info was updated
    if (ob.id !== id || ob.name !== name) {
      mutate(
        (data) =>
          produce(data, (draftState) => {
            draftState.items[idx].name = oldTextVal
          }),
        true,
      )
    }
  } catch (e) {
    mutate(
      (data) =>
        produce(data, (draftState) => {
          draftState.items[idx].name = oldTextVal
        }),
      true,
    )
  }
}

export {
  addItemHelper,
  addItemWithTextHelper,
  addBulkItemHelper,
  deleteItemHelper,
  updateOrderHelper,
  updateBoolValueHelper,
  updateTextValueHelper,
  updateNameValueHelper,
}
