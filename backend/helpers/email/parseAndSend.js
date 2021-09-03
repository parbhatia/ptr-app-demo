const debug = require("debug")("backend:/sendEmail")
const path = require("path")
const Email = require("email-templates")
const logger = require("../../logger/winston.js")
const { SESClient, awsObjectForSES } = require("../../config/aws")

const templatePath = path.join(__dirname, "..", "..", "templates", "email")

const transporter = {
    SES: { ses: SESClient, aws: awsObjectForSES },
}

const isProd = process.env.NODE_ENV === "production"
const EMAIL_ASSETS_ENDPOINT = isProd ?
    process.env.S3_CDN_URL :
    process.env.S3_EMAIL_ASSETS_URL

// const debugging = true
const debugging = false

const emailFunc = new Email({
    send: !debugging,
    views: {
        options: {
            extension: "hbs",
            map: {
                hbs: "handlebars",
            },
        },
    },
    transport: transporter,
})

module.exports = async({ data }) => {
    // extract data
    const {
        userInfo: {
            firstName,
            lastName,
            email,
            phone_number,
            profile_pic_keyid,
            email_signature,
        },
        emailInfo: { to, subject, message, shareableUrl },
        inspectionInfo: { coverPhoto, address, postalcode, city },
    } = data
    const emailPromises = []
    for (let i = 0; i < to.length; i += 1) {
        const emailConfig = {
            template: templatePath,
            message: {
                from: `"${process.env.COMPANY_NAME}" <${process.env.SES_EMAIL}>`,
                to: `"${to[i].name}" <${to[i].email}>`,
                headers: {
                    to: to[i],
                    "X-SES-CONFIGURATION-SET": "default",
                },
                // bcc: ,
                subject,
            },
            subjectPrefix: debugging ? "[DEVELOPMENT] - " : false,
            locals: {
                name: to[i].name,
                message,
                coverPhoto,
                address,
                city,
                postalcode,
                shareableUrl,
                companyName: process.env.COMPANY_NAME,
                companyLogoLarge: `${EMAIL_ASSETS_ENDPOINT}/assets/PTRLOGOEMAIL.png`,
                companyWebsite: process.env.WEBSITE,
                linkedinIcon: `${EMAIL_ASSETS_ENDPOINT}/assets/icons/linkedinicon.png`,
                googleIcon: `${EMAIL_ASSETS_ENDPOINT}/assets/icons/googleicon.png`,
                personalsiteIcon: `${EMAIL_ASSETS_ENDPOINT}/assets/icons/personalsiteicon.png`,
                googlebusinessUrl: process.env.COMPANY_GOOGLEBUSINESS_URL,
                emailTitle: `${process.env.COMPANY_NAME} Package`,
                profilePhoto: `${EMAIL_ASSETS_ENDPOINT}/assets/${profile_pic_keyid}`,
                userFullName: `${firstName} ${lastName}`,
                nameAdditional: email_signature.nameAdditional,
                namePosition: email_signature.namePosition,
                linkedinUrl: email_signature.linkedinUrl,
                emailFrom: email,
                phoneNumber: phone_number,
            },
        }
        emailPromises.push(emailFunc.send(emailConfig))
    }

    let failure = false

    const reports = await Promise.all(
        emailPromises.map((p) =>
            p.catch((e) => {
                // logger.error(
                //     `Could not send email. Email details - name: ${config.locals.name}, address: ${config.locals.address}`,
                // )
                debug("Error Sending email:", e)
                failure = true
            }),
        ),
    )

    if (failure) return null
    return reports
}