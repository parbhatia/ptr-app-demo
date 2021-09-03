const debug = require("debug")("backend:/parseInfoForEmail")
const {
    parse: { for_email },
} = require("../sql")
const db = require("../config/db")

module.exports = async({ inspectionId }) => {
    const {
        info,
        unique_id,
        cover_photo: inspectionCoverPhoto,
    } = await db.one(for_email, inspectionId)
        //need full url for cover photo, preferebaly the cdn version
    let coverPhoto = null
    if (!inspectionCoverPhoto) {
        coverPhoto = `${process.env.S3_EMAIL_ASSETS_URL}/assets/coverPhoto.jpg`
    } else if (inspectionCoverPhoto.cdn_keyid) {
        coverPhoto = `${process.env.S3_EMAIL_ASSETS_URL}/${inspectionCoverPhoto.cdn_keyid}`
    } else {
        coverPhoto = `${process.env.S3_EMAIL_ASSETS_URL}/${inspectionCoverPhoto.keyid}`
    }
    const parsedInfo = {
        ...info,
        coverPhoto,
    }
    return parsedInfo
}