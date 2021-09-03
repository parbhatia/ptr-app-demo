LOCALSTACK_PORT="$1"
BACKEND_PORT="$2"
DOMAIN="$3"
SES_EMAIL="$4"

#in a production app, this SNS notification endpoint goes through the reverse proxy
#in this case, since localstack is containerized, it's difficult to go through the proxy to our backend port
#hitting the endpoint becomes more complicated when you have subdomains in the reverse proxy
#instead of dealing with hostname resolutions, skip the reverse proxy, hit the backend directly
SNS_NOTIFICATION_ENDPOINT="http://backend:${BACKEND_PORT}/api/emailwebhook"

ENDPOINT="--endpoint-url=http://localhost:${LOCALSTACK_PORT}"
REGION="--region=us-east-1"

echo $ENDPOINT
echo $SNS_NOTIFICATION_ENDPOINT
echo $DOMAIN
echo $SES_EMAIL

function create_bucket() {
    BUCKET_NAME="$1"
    aws $ENDPOINT s3api create-bucket --acl public-read --bucket $BUCKET_NAME

    #enable versioning
    aws $ENDPOINT s3api put-bucket-versioning --bucket $BUCKET_NAME --versioning-configuration=Status=Enabled
}

function ses_verify_email_and_domain() {
    #verify ses email
    aws $ENDPOINT $REGION ses verify-email-identity --email-address $SES_EMAIL

    #ses verify domain
    aws $ENDPOINT $REGION ses verify-domain-identity --domain $DOMAIN
}

function create_sns_topic_assigned_to_config_set() {
    TOPIC_NAME=$1
    TOPIC_EVENT_TYPE=$2

    #create sns topic
    aws $ENDPOINT $REGION sns create-topic --name "$TOPIC_NAME" --attributes DisplayName="$TOPIC_NAME"
    #topicArn format is arn:aws:sns:us-east-1:000000000000:delivery

    #create ses config set
    aws $ENDPOINT $REGION ses create-configuration-set --configuration-set Name="$TOPIC_NAME"

    #assign config set to sns
    aws $ENDPOINT $REGION ses create-configuration-set-event-destination --configuration-set-name "$TOPIC_NAME" --event-destination Name="$TOPIC_NAME",Enabled=true,MatchingEventTypes=["$TOPIC_EVENT_TYPE"],SNSDestination={TopicARN=arn:aws:sns:us-east-1:000000000000:"$TOPIC_NAME"}

    #create susbcription on app.localhost on port 80, susbcription will be confirmed automatically by backend
    aws $ENDPOINT $REGION sns subscribe --topic-arn arn:aws:sns:us-east-1:000000000000:"$TOPIC_NAME" --protocol http --notification-endpoint "$SNS_NOTIFICATION_ENDPOINT"

}

#create buckets
create_bucket dev-ptr-inspection-photos
create_bucket dev-ptr-files
create_bucket dev-ptr-shareable

#verify SES email and domain
ses_verify_email_and_domain

#create topics that we need for SNS notifications, read receipts, delivery notifs, etc
#we've mapped sns topic names wtih SES config set events
create_sns_topic_assigned_to_config_set delivery Delivery
create_sns_topic_assigned_to_config_set emailbounce Bounce
create_sns_topic_assigned_to_config_set opened Open
create_sns_topic_assigned_to_config_set complaint Complaint

aws $ENDPOINT s3 cp ./dev-ptr-shareable/ s3://dev-ptr-shareable --recursive
aws $ENDPOINT s3 cp ./dev-ptr-files/ s3://dev-ptr-files --recursive
aws $ENDPOINT s3 cp ./dev-ptr-inspection-photos/ s3://dev-ptr-inspection-photos --recursive
