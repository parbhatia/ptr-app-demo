const debug = require("debug")("backend:handleSentReport")
const logger = require("../../logger/winston.js")
const db = require("../../config/db")
const {
    email_record: { insert_item },
    file: { insert_item: insert_file },
} = require("../../sql")
const { PutObjectCommand } = require("@aws-sdk/client-s3")
const { S3Client } = require("../../config/aws")


const saveHtmlToFile = async({ messageId, html }) => {
    const keyId = `emailsPreview/${messageId}.html`
    try {
        const s3UploadParams = {
            ACL: process.env.S3_SHAREABLE_FILES_BUCKET_ACL,
            Bucket: process.env.S3_SHAREABLE_FILES_BUCKET_NAME,
            Key: keyId,
            Body: html,
        }
        const response = await S3Client.send(new PutObjectCommand(s3UploadParams))
        const newFile = await db.one(insert_file, {
            keyid: keyId,
            name: keyId,
            extension: "html",
            size: Buffer.byteLength(html, "utf8"),
            type: "email_preview",
            bucket: process.env.S3_SHAREABLE_FILES_BUCKET_NAME,
            shareable_link_id: null,
        })
    } catch (e) {
        logger.error(
            `Could not save HTML Email Preview to file with messageId: ${messageId}.`,
        )
        debug("Error", e)
    }
}

module.exports = async({
    report,
    userId,
    inspectionId,
    shareableLinkId,
    inspectionSocket,
}) => {
    try {
        const {
            response: messageId,
            envelope,
            originalMessage: { headers: emailHeaders, subject, html },
        } = report

        await saveHtmlToFile({ messageId, html })

        const personId = emailHeaders.to.id
        const emailValue = envelope.to[0]
        await db.one(insert_item, {
                emailValue,
                subject,
                messageId,
                userId,
                inspectionId,
                shareableLinkId,
                personId,
            })
            //revalidate email records via socket connection
        inspectionSocket.emit(`${userId}/notification/email`)
    } catch (e) {
        debug(`${messageId}: Error handling email report, e`)
        logger.error(`${messageId}: Error handling email report, e`)
    }
}