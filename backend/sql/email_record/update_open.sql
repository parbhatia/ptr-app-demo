update email_record
set opened = 'true',
open_user_agent = $2,
time_opened = now()
where message_id = $1
returning user_id;