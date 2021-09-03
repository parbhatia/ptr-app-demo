insert into email_record(
    email_value,
    subject,
    message_id,
    user_id,
    inspection_id,
    shareable_link_id,
    person_id
    )
values (
        $/emailValue/,
        $/subject/,
        $/messageId/,
        $/userId/,
        $/inspectionId/,
        $/shareableLinkId/,
        $/personId/
    )
returning *;