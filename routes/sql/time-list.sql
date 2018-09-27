SELECT
    id,
    SUBSTRING(title, 1, 5) AS title
FROM
    time_list
WHERE
    isactive = 1
ORDER BY
    title