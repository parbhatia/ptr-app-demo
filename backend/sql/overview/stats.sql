SELECT
    (
        SELECT
            count(*)
        FROM
            inspection i
        WHERE
            i.user_id = $1
            AND i.inspection_status = 'in_progress') AS inspections_in_progress,
    (
        SELECT
            count(*)
        FROM
            inspection i
        WHERE
            i.user_id = $1
            AND i.time_created > date_trunc('week', current_date)) AS inspections_completed_weekly,
    (
        SELECT
            count(*)
        FROM
            person p
        WHERE
            p.user_id = $1
            AND p.type = 'client'
            AND p.time_created > date_trunc('week', current_date)) AS clients_created_weekly,
    (
        SELECT
            count(*)
        FROM
            person p
        WHERE
            p.user_id = $1
            AND p.type = 'realtor'
            AND p.time_created > date_trunc('week', current_date)) AS realtors_created_weekly,
    (
        SELECT
            count(*)
        FROM
            email_record r
        WHERE
            r.user_id = $1
            AND r.time_sent > date_trunc('week', current_date)) AS emails_sent_weekly,
    firstname,
    lastname
FROM
    users
WHERE
    id = $1;

