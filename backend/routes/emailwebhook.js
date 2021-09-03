const debug = require("debug")("backend:/emailwebhook")
const express = require("express")
const router = express.Router()
const {
    handleBounce,
    handleDelivery,
    handleSubscriptionConfirmation,
    handleClick,
    handleOpen,
    handleComplaint,
} = require("../helpers/email/handleAWSNotifications")
const logger = require("../logger/winston.js")

router.post("/", handleSubscriptionConfirmation, async(req, res) => {
    const inspectionSocket = req.app.get("inspectionsocket")
    try {
        const body = JSON.parse(req.body.Message)
            // debug(body)

        // What's the event?
        const event = body.eventType.toLowerCase()
        debug("event:", event)
        const eventData = body

        // const domain = eventData.mail.tags["ses:from-domain"][0]
        // const messageId = eventData.mail.messageId
        // const date = new Date(eventData.mail.timestamp)
        // const email = eventData.mail.destination[0]
        // const subject = eventData.mail.commonHeaders.subject
        // debug({ domain, messageId, date, email, subject })

        // #todo: Verify event is from SES

        //currently not tracking clicks via SNS, but full functionality should be working
        if (event == "click") {
            const userId = await handleClick(eventData)
                //revalidate email records via socket connection
            inspectionSocket.emit(`${userId}/notification/email`)
        } else if (event == "delivery") {
            const userId = await handleDelivery(eventData)
                //revalidate email records via socket connection
            inspectionSocket.emit(`${userId}/notification/email`)
        } else if (event == "complaint") {
            const userId = await handleComplaint(eventData)
                //revalidate email records via socket connection
            inspectionSocket.emit(`${userId}/notification/email`)
        } else if (event == "open") {
            const userId = await handleOpen(eventData)
                //revalidate email records via socket connection
            inspectionSocket.emit(`${userId}/notification/email`)
        } else if (event == "bounce") {
            const userId = await handleBounce(eventData)
                //revalidate email records via socket connection
            inspectionSocket.emit(`${userId}/notification/email`)
        } else {
            logger.http("Received unknown emailwebhook data: ", eventData)
            throw new Error(eventData)
                // Not supported
        }
        // anything else can come in here
        return res.end()
    } catch (err) {
        debug(err)
        logger.error(`Unable to process emailwebhook with body:`, err)
        res.end()
    }
})

module.exports.router = router