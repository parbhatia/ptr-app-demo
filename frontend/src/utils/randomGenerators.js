import { customAlphabet, nanoid } from "nanoid"

export const generateRandomFileName = customAlphabet(
  "ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz123456789",
  12,
)

export const generateRandomId = nanoid

//these are functions that must be called
