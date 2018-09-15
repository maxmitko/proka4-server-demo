const pool = require('../libs/mysql-connect');
const express = require('express');
const router = express.Router();

router
    .get('/', async (req, res) => {

        const schdl_sql = `
          SELECT id,
                 color,
                 title,
                 type,
                 DATE_FORMAT(startday, '%d.%m')  AS startday,
                 DATE_FORMAT(finishday, '%d.%m') AS finishday
          FROM schedule`;

        const schedule = await pool.query(schdl_sql);

        const schday_sql = `
          SELECT schday.id                    AS schday_id,
                 schday.mon                   AS mon,
                 schday.tue                   AS tue,
                 schday.wed                   AS wed,
                 schday.thu                   AS thu,
                 schday.fri                   AS fri,
                 schday.sut                   AS sut,
                 schday.sun                   AS sun,
                 schdl.type                   AS type,
                 tmlst.id                     AS 'tmlst_id',
                 SUBSTRING(tmlst.title, 1, 5) AS 'tmlst_title'
          FROM schedule_day schday
                 LEFT JOIN schedule schdl ON schday.schedule_id = schdl.id
                 LEFT JOIN time_list tmlst ON schday.time_list_id = tmlst.id
          ORDER BY tmlst.title
        `;

        pool.query(schday_sql, function (err, rows) {
            if (err) throw err;

            const scheduleTypes = new Set();
            rows.forEach(schedule => {
                scheduleTypes.add(schedule.type)
            });

            const scheduleChunkByType = [];
            scheduleTypes.forEach(type => {

                let items = rows.filter(item => {
                    if (item.type === type) return item;
                });

                let mergedByTime = [];
                items.reduce((acc, item) => {
                    if (acc.tmlst_id === item.tmlst_id) {
                        item.mon = acc.mon + item.mon;
                        item.tue = acc.tue + item.tue;
                        item.wed = acc.wed + item.wed;
                        item.thu = acc.thu + item.thu;
                        item.fri = acc.fri + item.fri;
                        item.sut = acc.sut + item.sut;
                        item.sun = acc.sun + item.sun;
                        mergedByTime.pop();
                    }
                    mergedByTime.push(item);
                    return item;
                }, 0);

                let scheduleByType = schedule.filter(item => {
                    if (item.type === type) return item;
                });

                const colors = {};
                scheduleByType.forEach(item => {
                    colors[item.id] = item.color;
                });

                scheduleChunkByType.push({items: mergedByTime, colors, schedule: scheduleByType})
            });

            res.render('schedule', {scheduleChunkByType});
        });
    })
    .get('/timelist', (req, res) => {

        const sql = `
          SELECT id, SUBSTRING(title, 1, 5) AS title
          FROM time_list
          WHERE isactive = 1
          ORDER BY title
        `;

        pool.query(sql, function (err, rows) {

            res.format({
                'application/json': function () {
                    res.header('Access-Control-Allow-Origin', '*');
                    res.json(rows);
                }
            })
        })

    });

module.exports = router;

