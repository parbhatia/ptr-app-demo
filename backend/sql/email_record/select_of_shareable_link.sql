select e.*, p.name as person_name from email_record e 
left join person p on p.id = e.person_id
where e.shareable_link_id = $1
order by e.time_sent desc LIMIT $2;