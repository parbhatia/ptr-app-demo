# #get bucket acl
# aws --endpoint-url=http://localhost:4566 s3api get-bucket-acl --bucket dev-ptr-inspection-photos

# #get bucket file sizes
# aws --endpoint-url=http://localhost:4566 s3 ls --summarize --recursive s3://dev-ptr-inspection-photos

# #send email
# aws ses send-email \
#     --endpoint-url=http://localhost:4566 \
#     --from "sender@example.com" \
#     --destination "ToAddresses=mike@gmail.com" \
#     --message "Subject={Data=from ses,Charset=utf8},Body={Text={Data=ses says hi,Charset=utf8},Html={Data=,Charset=utf8}}" \
#     --region "us-east-1"

# #list subscriptions
# aws --endpoint-url=http://localhost:4566 --region "us-east-1" sns list-subscriptions

# #send message!
# aws --endpoint-url=http://localhost:4566 sns publish --region "us-east-1" --topic-arn arn:aws:sns:us-east-1:000000000000:delivery --message 'Welcome to Onexlab!'

# #unsubscribe
# aws --endpoint-url=http://localhost:4566 --region "us-east-1" sns unsubscribe --subscription-arn arn:aws:sns:us-east-1:000000000000:delivery:ac3fe864-36f3-4ec5-9a80-6f98cc313e4f

# #to read user input

# read -p "Enter the SubscribeURL's token: " TOKEN

# #then we can just reference "$TOKEN" from any bash command

# #manually confirming subscription
# aws --endpoint-url=http://localhost:4566 --region "us-east-1" sns confirm-subscription \
#     --endpoint-url "$SNS_ENDPOINT_URL" \
#     --topic-arn "$TOPIC_ARN" \
#     --token "$TOKEN"

# #create susbcription on localhost with port 81
# aws --endpoint-url=http://localhost:4566 --region "us-east-1" sns subscribe --topic-arn arn:aws:sns:us-east-1:000000000000:delivery --protocol http --notification-endpoint http://proxy:81/emailwebhook
