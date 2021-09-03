select e.*, p.name as person_name from email_record e 
left join person p on p.id = e.person_id
where e.user_id = $1 AND e.inspection_id = $2
order by e.time_sent desc LIMIT $3;