import arrayMove from "array-move"
import produce from "immer"
import adjustOrderArray from "../utils/adjustOrderArray"
import arrayCompare from "../utils/arrayCompare"
import axios from "axios"
import { generateRandomId } from "../utils/randomGenerators"

const addSubItemHelper = async ({ text, url, parent, mutate, reset }) => {
  const tempId = generateRandomId()

  try {
    mutate((data) => {
      return produce(data, (draftState) => {
        draftState.items[parent.idx].items.push({
          id: tempId,
          text: text,
        })
        draftState.items[parent.idx].info.push(tempId)
      })
    }, false)
    reset()

    const { data } = await axios.post(url, {
      text,
    })
    const ob = { ...data }
    mutate((data) => {
      return produce(data, (draftState) => {
        draftState.items[parent.idx].items = draftState.items[
          parent.idx
        ].items.map((item) =>
          item.id === tempId ? { ...item, id: ob.id } : item,
        )
        draftState.items[parent.idx].info = draftState.items[
          parent.idx
        ].info.map((o, idx) => (o === tempId ? ob.id : o))
      })
    }, false)
  } catch (e) {
    mutate((data) => {
      return produce(data, (draftState) => {
        draftState.items[parent.idx].items.filter((item) => item.id === tempId)
        const oldInfo = draftState.items[parent.idx].info
        oldInfo.pop()
        draftState.items[parent.idx].info = oldInfo
      })
    })
  }
}

const deleteSubItemHelper = async ({ id, idx, parent, url, mutate }) => {
  let newOrder
  let oldOrder
  let oldItems
  let newItems
  try {
    mutate((data) => {
      oldOrder = [...data.items[parent.idx].info]
      oldItems = data.items[parent.idx].items
      newOrder = adjustOrderArray(data.items[parent.idx].info, idx)
      newItems = adjustOrderArray(data.items[parent.idx].items, idx)
      return produce(data, (draftState) => {
        draftState.items[parent.idx].items = newItems
        draftState.items[parent.idx].info = newOrder
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
            draftState.items[parent.idx].items = oldItems
            draftState.items[parent.idx].info = oldOrder
          }),
        true,
      )
    }
  } catch (e) {
    console.log("error deleting subitem")
    mutate(
      (data) =>
        produce(data, (draftState) => {
          draftState.items[parent.idx].items = oldItems
          draftState.items[parent.idx].info = oldOrder
        }),
      true,
    )
  }
}

const updateSubOrderHelper = async ({
  oldIndex,
  newIndex,
  parent,
  url,
  mutate,
}) => {
  let parentOrderId
  let newOrder
  let oldOrder
  let oldSubitems
  try {
    mutate((data) => {
      parentOrderId = parent.order_id
      oldOrder = data.items[parent.idx].info
      oldSubitems = data.items[parent.idx].items
      newOrder = arrayMove(data.items[parent.idx].info, oldIndex, newIndex)

      return produce(data, (draftState) => {
        draftState.items[parent.idx].info = newOrder
        //move subitems
        draftState.items[parent.idx].items = arrayMove(
          draftState.items[parent.idx].items,
          oldIndex,
          newIndex,
        )
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
    //verify that and correct order info was returned
    if (!arrayCompare(ob.parent.order_info.info, newOrder)) {
      // console.log("error updating subitem order")
      mutate(
        (data) =>
          produce(data, (draftState) => {
            //revert back old data
            draftState.items[parent.idx].info = oldOrder
            draftState.items[parent.idx].items = oldSubitems
          }),
        true,
      )
    }
  } catch (e) {
    console.log("error updating subitem order")
    mutate(
      (data) =>
        produce(data, (draftState) => {
          //revert back old data
          draftState.items[parent.idx].info = oldOrder
          draftState.items[parent.idx].items = oldSubitems
        }),
      true,
    )
  }
}

const updateSubTextValueHelper = async ({
  id,
  text,
  idx,
  parent,
  url,
  mutate,
}) => {
  try {
    mutate((data) => {
      return produce(data, (draftState) => {
        draftState.items[parent.idx].items[idx].text = text
      })
    })
    const { data } = await axios.patch(url, {
      id,
      text,
    })

    const ob = { ...data }
    //verify that and correct info was updated
    if (ob.id !== id || ob.text !== text) {
      throw new Error("Error updating subitem")
    } else {
      mutate(
        (data) =>
          produce(data, (draftState) => {
            draftState.items[parent.idx].items[idx].text = ob.text
          }),
        true,
      )
    }
  } catch (e) {
    console.log("Error updating subitem text", e)
    mutate()
  }
}

export {
  addSubItemHelper,
  deleteSubItemHelper,
  updateSubOrderHelper,
  updateSubTextValueHelper,
}
