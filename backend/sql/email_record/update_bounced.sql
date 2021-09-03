update email_record
set bounced = 'true'
where message_id = $1
returning user_id;