const pool = require('../libs/mysql-connect');
const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const logger = require('../libs/logger')

router
    .get('/', async (req, res) => {

        const schdl_sql = `
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

        `

        const schdl_type_sql = `
            SELECT 
                schtype.id AS id,
                sch.startday AS startday
            FROM 
                schedule_type schtype
                LEFT JOIN schedule sch ON sch.type = schtype.id
            WHERE 
                schtype.isactive = 1
            GROUP BY
                schtype.id
            ORDER BY
                sch.startday
        `

        const schday_sql = `
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
        `

        const schedule = await pool.query(schdl_sql);
        const scheduleTypes = await pool.query(schdl_type_sql);

        pool.query(schday_sql, function (err, rows) {
            if (err) logger.error(err);

            const scheduleChunkByType = [];
            scheduleTypes.forEach(schdl_type => {
                
                let items = rows.filter(item => {
                    return (item.type === schdl_type.id);
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
                    return (item.type === schdl_type.id);
                });

                const colors = {};
                scheduleByType.forEach(item => {
                    colors[item.id] = item.color;
                });

                scheduleChunkByType.push({ items: mergedByTime, schedule: scheduleByType, colors })
            });
            console.log(scheduleChunkByType);
            
            res.render('schedule', { scheduleChunkByType });
        });
    })
    .get('/timelist', (req, res) => {

        const time_list_sql = `
            SELECT
                id,
                SUBSTRING(title, 1, 5) AS title
            FROM
                time_list
            WHERE
                isactive = 1
            ORDER BY
                title
        `

        pool.query(time_list_sql, function (err, rows) {

            res.format({
                'application/json': function () {
                    res.header('Access-Control-Allow-Origin', '*');
                    res.json(rows);
                }
            })
        })

    });

module.exports = router;

