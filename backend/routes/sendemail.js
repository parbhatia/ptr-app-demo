const express = require("express")

const router = express.Router({ mergeParams: true })
const debug = require("debug")("backend:/sendemail")
const parseAndSend = require("../helpers/email/parseAndSend")
const createSession = require("../helpers/createSession")
const logger = require("../logger/winston.js")
const parseInfoForEmail = require("../helpers/parseInfoForEmail")
const handleSentReport = require("../helpers/email/handleSentReport")

// receives dataBundle which container emailInfo, and userInfo
router.post("/", createSession, async(req, res) => {
    const sessionId = req.sessionID
    const userId = req.headers.user_id
    const { inspectionId, shareableLinkId } = req.params
    const { userInfo, emailInfo } = req.body
    const inspectionSocket = req.app.get("inspectionsocket")
    const sendStatus = (progress, label) => {
        inspectionSocket.emit(`${inspectionId}/email/progress`, {
            progress,
            label,
        })
    }

    sendStatus(20, "Gathering Data")
    try {
        // gather inspectionInfo, so we can customize email a little bit
        const inspectionInfo = await parseInfoForEmail({
            inspectionId,
        })

        sendStatus(50, "Creating Email")
        const newDataBundle = {
            emailInfo,
            inspectionInfo,
            userInfo,
        }

        sendStatus(90, "Sending Email")

        const statusReports = await parseAndSend({
            data: newDataBundle,
        })

        if (statusReports) {
            statusReports.forEach(async(report) => {
                await handleSentReport({
                    report,
                    userId,
                    inspectionId,
                    shareableLinkId,
                    inspectionSocket,
                })
            })
            sendStatus(100, "Email Sent!")
                // client listens for 200 request!
            res.sendStatus(200)
            logger.info(`${sessionId} Email was successful!`)
        } else {
            logger.error(
                `${sessionId} Email Reports were unsuccessful. StatusReports:, ${statusReports}`,
            )
            throw new Error("Nodemailer Error")
        }
    } catch (e) {
        logger.error(`${sessionId} Unable to send email!`, e)
        debug(`${sessionId} Unable to send email!`, e)
        res.sendStatus(400)
    }
})

module.exports.router = router