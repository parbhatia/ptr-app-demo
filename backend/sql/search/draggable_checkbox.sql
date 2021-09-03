--ts_rank_cd is better for phrases than just frequency of words
--need to use plainto_tsquery with 'simple', not 'english dictionary
--   since we're not trying to match literal values with a lexeme
-- we mask our ranking by using normalized paramters
SELECT DISTINCT
    text,
    ts_rank_cd(search, websearch_to_tsquery('english', $1), 2 | 4) + ts_rank_cd(search, plainto_tsquery('simple', $1), 2 | 4) AS rank
FROM
    draggable_checkbox
WHERE
    search @@ websearch_to_tsquery('english', $1)
    OR search @@ plainto_tsquery('simple', $1)
ORDER BY
    rank DESC
LIMIT 5;

