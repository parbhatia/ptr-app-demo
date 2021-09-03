const debug = require("debug")("backend:/inspectionDataParser")
const { performance } = require("perf_hooks")
const moment = require("moment")
const fs = require("fs")
const path = require("path")
const db = require("../config/db")
const {
  inspection: { select_item_bulk },
} = require("../sql")
const { produce } = require("immer")
const axios = require("axios")

const generateInspectionFileName = require("./generateInspectionFileName")

// returns a base64 string given a valid image url
const getBase64 = async (src) => {
  try {
    const image = await axios.get(src, {
      responseType: "arraybuffer",
      maxRedirects: 0,
    })
    const returnedB64 = `data:image/png;base64,${Buffer.from(
      image.data,
    ).toString("base64")}`
    return returnedB64
  } catch (err) {
    debug("Error getting base64")
    throw err
  }
}

// takes on average 4ms
const parseData = async ({ data, pdfRequest }) => {
  // generate fileName
  const fileName = generateInspectionFileName(
    data.unique_id,
    data.info.address,
    pdfRequest,
  )

  let newCoverPhoto
  if (!data.cover_photo) {
    newCoverPhoto = `${process.env.S3_CDN_URL}/assets/coverPhoto.jpg`
  } else if (data.cover_photo.cdn_keyid) {
    newCoverPhoto = `${process.env.S3_CDN_URL}/${data.cover_photo.cdn_keyid}`
  } else {
    newCoverPhoto = `${process.env.S3_PHOTOS_RESOURCE_URL}/${data.cover_photo.keyid}`
  }

  const newData = await produce(data, async (draftState) => {
    // format moment date
    draftState.info.date = moment(draftState.info.date).format(
      "dddd, MMMM Do YYYY",
    )

    draftState.cover_photo = await getBase64(newCoverPhoto)

    draftState.summary.photos = await Promise.all(
      draftState.summary.photos.map(async (p) => {
        const url = `${process.env.S3_PHOTOS_RESOURCE_URL}/${p.keyid}`
        try {
          const image = await getBase64(url)
          return {
            ...p,
            src: image,
          }
        } catch (e) {
          debug("Error replacing summary photos with base64")
          throw e
        }
      }),
    )

    draftState.pages = await Promise.all(
      draftState.pages.map(async (page) => {
        return {
          ...page,
          photos: await Promise.all(
            page.photos.map(async (p) => {
              const url = `${process.env.S3_PHOTOS_RESOURCE_URL}/${p.keyid}`
              try {
                const image = await getBase64(url)
                return {
                  ...p,
                  src: image,
                }
              } catch (e) {
                debug("Error replacing page photos with base64")
                throw e
              }
            }),
          ),
        }
      }),
    )

    draftState.fileName = fileName
    draftState.pdfRequest = pdfRequest
  })
  // debug(newData)

  return newData
}

module.exports = async ({ userId, inspectionId, pdfRequest }) => {
  const start = performance.now()
  const rows = await db.one(select_item_bulk, [inspectionId, userId])
  // await fs.promises.writeFile(
  //   path.join(process.cwd(), "queries", "inspection.json"),
  //   JSON.stringify(rows),
  // )
  const end = performance.now()

  const totalTime = (end - start).toFixed(4)
  // debug(`PSQL query: ${totalTime}ms`)
  // parse data
  const parsedData = await parseData({
    data: rows,
    pdfRequest,
  })
  return parsedData
}
