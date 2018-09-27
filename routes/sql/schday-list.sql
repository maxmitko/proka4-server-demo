SELECT
    schday.id AS schday_id,
    schday.mon AS mon,
    schday.tue AS tue,
    schday.wed AS wed,
    schday.thu AS thu,
    schday.fri AS fri,
    schday.sut AS sut,
    schday.sun AS sun,
    schdl.type AS type,
    tmlst.id AS 'tmlst_id',
    SUBSTRING(tmlst.title, 1, 5) AS 'tmlst_title'
FROM
    schedule_day schday
    LEFT JOIN schedule schdl ON schday.schedule_id = schdl.id
    LEFT JOIN time_list tmlst ON schday.time_list_id = tmlst.id
ORDER BY
    tmlst.title