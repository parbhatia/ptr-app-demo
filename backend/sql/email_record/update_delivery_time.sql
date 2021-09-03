update email_record
set time_delivered = now()
where message_id = $1
returning user_id;