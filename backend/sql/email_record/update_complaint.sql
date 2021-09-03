update email_record
set complaint = 'true'
where message_id = $1
returning user_id;