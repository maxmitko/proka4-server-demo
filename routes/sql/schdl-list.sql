SELECT
    id,
    color,
    title,
    type,
    DATE_FORMAT(startday, '%d.%m') AS startday,
    DATE_FORMAT(finishday, '%d.%m') AS finishday
FROM
    schedule
WHERE
    isactive = 1