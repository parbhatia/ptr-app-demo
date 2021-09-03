const debug = require("debug")("backend:handleAWSNotifications")
const logger = require("../../logger/winston.js")
const db = require("../../config/db")
const axios = require('axios')

const {
    email_record: {
        update_delivery_time,
        update_bounced,
        update_complaint,
        update_click,
        update_open,
    },
} = require("../../sql")

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
    handleDelivery: async(message) => {
        //incase we get any unnecessary forwarded delivery emails
        if (
            message.mail.commonHeaders.subject ===
            "Delivery Status Notification (Failure)"
        ) {
            debug("Ignoring MAILER DAEMON Delivery email")
            return
        }
        const messageId = message.mail.messageId
        const deliveryTimestamp = message.delivery.timestamp
        const addresses = message.delivery.recipients
        try {
            const { user_id } = await db.one(update_delivery_time, messageId)
            logger.http(`${messageId}: delivery handle successful`)
            debug(`${messageId}: delivery handle successful`)
            return user_id
        } catch (e) {
            debug(`${messageId}: Error handling message delivery`, e)
            logger.error(`${messageId}: Error handling message delivery`, e)
            logger.error(
                `${messageId}: The message we received was:`,
                JSON.stringify(message),
            )
        }
    },
    handleBounce: async(message) => {
        const messageId = message.mail.messageId
        const addresses = message.bounce.bouncedRecipients.map(
            (recipient) => recipient.emailAddress,
        )
        try {
            const { user_id } = await db.one(update_bounced, messageId)
            logger.http(`${messageId}: bounce handling successful`)
            debug(`${messageId}: bounce handling successful`)
            return user_id
        } catch (e) {
            debug(`${messageId}: Error handling message bounce`, e)
            logger.error(`${messageId}: Error handling message bounce`, e)
        }
    },
    handleOpen: async(message) => {
        const ua = message.open.userAgent
        const timestamp = message.open.timestamp
        const messageId = message.mail.messageId
        try {
            // we're just setting timestamp as when we receive the notification, not the real timestamp, this saves us from timezone issues, since the SES region is configured in the US
            const { user_id } = await db.one(update_open, [messageId, ua])
            logger.http(`${messageId}: open handling successful`)
            debug(`${messageId}: open handling successful`)
            return user_id
        } catch (e) {
            debug(`${messageId}: Error handling message open`, e)
            logger.error(`${messageId}: Error handling message open`, e)
        }
    },
    handleClick: async(message) => {
        const ua = message.click.userAgent
        const url = message.click.link
        const timestamp = message.click.timestamp
        const messageId = message.mail.messageId
        try {
            // we're just setting timestamp as when we receive the notification, not the real timestamp, this saves us from timezone issues, since the SES region is configured in the US
            const { user_id } = await db.one(update_click, messageId)
            logger.http(`${messageId}: click handling successful`)
            debug(`${messageId}: click handling successful`)
            return user_id
        } catch (e) {
            debug(`${messageId}: Error handling message click`, e)
            logger.error(`${messageId}: Error handling message click`, e)
        }
    },
    handleComplaint: async(message) => {
        const messageId = message.mail.messageId
        const addresses = message.complaint.complainedRecipients.map(
            (recipient) => recipient.emailAddress,
        )
        try {
            const { user_id } = await db.one(update_complaint, messageId)
            logger.http(`${messageId}: complaint handling successful`)
            debug(`${messageId}: complaint handling successful`)
            return user_id
        } catch (e) {
            debug(`${messageId}: Error handling complaint bounce`, e)
            logger.error(`${messageId}: Error handling complaint bounce`, e)
        }
    },
    //middleware
    handleSubscriptionConfirmation: async(req, res, next) => {
        try {
            if (
                req.headers["x-amz-sns-message-type"] === "SubscriptionConfirmation"
            ) {
                debug("Confirming subscription")
                const payload = req.body
                debug(payload)

                if (payload.Type === "SubscriptionConfirmation") {
                    const url = payload.SubscribeURL

                    //When using localstack, the SusbcribeURL's hostname does not resolve
                    //quick dirty fix, replace localhost with name of service

                    const parsedUrl = isProd ? url : url.replace("localhost", "localstack")
                    debug(parsedUrl)

                    try {
                        const req = await axios.get(parsedUrl)
                        if (!req.status) {
                            throw new Error()
                        } else {
                            debug("Yess! We have accepted the confirmation from AWS")
                            logger.http("AWS subscription confirmed")
                        }
                    } catch (err) {
                        debug("request failed", error)
                        reject()
                    }
                } else {
                    throw new Error("Mismatch confirmaiton notification")
                }
            } else {
                return next()
            }
        } catch (e) {
            debug("Error handling subscription confirmation", e)
            logger.http("Error handling subscription confirmation", e)
            next(e)
        }
    },
}