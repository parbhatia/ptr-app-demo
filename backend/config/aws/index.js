const { S3Client } = require("@aws-sdk/client-s3")
const aws = require("@aws-sdk/client-ses")
const { SNSClient } = require("@aws-sdk/client-sns")

const isProd = process.env.NODE_ENV === "production"

const endpoint = isProd ?
    undefined :
    `http://localstack:${process.env.LOCALSTACK_PORT}`

const s3Client = new S3Client({
    region: process.env.AWS_BUCKET_REGION,
    endpoint: endpoint,
    forcePathStyle: isProd ? false : true,
    //this is "s3ForcePathStyle": true in aws-sdk v2!
})

const SESREGION = "us-east-1"

const SESClient = new aws.SES({
    apiVersion: "2010-12-01",
    region: SESREGION,
    endpoint: endpoint,
})

//this is supposed to be used to confirm subscriptions when using localstack, but currently throws a getRegionConfig error, so we revert back to simply visiting the SubscribeURL
const SnsClient = new SNSClient({
    region: SESREGION,
    endpoint: endpoint,
})

exports.S3Client = s3Client
exports.SESClient = SESClient
exports.SNSClient = SnsClient

//need this for nodemailer to work properly
exports.awsObjectForSES = aws