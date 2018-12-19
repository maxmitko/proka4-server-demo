const pool = require('../libs/mysql-connect');
const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const logger = require('../libs/logger')

router
    .get('/', async (req, res) => {

        const schdl_sql = fs.readFileSync(path.join(__dirname, 'sql', 'schdl-list.sql'), {encoding: 'UTF-8'})
        const schdl_type_sql = fs.readFileSync(path.join(__dirname, 'sql', 'schdl-type-list.sql'), {encoding: 'UTF-8'})
        const schday_sql = fs.readFileSync(path.join(__dirname, 'sql', 'schday-list.sql'), {encoding: 'UTF-8'})
        
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

                scheduleChunkByType.push({items: mergedByTime, schedule: scheduleByType, colors})
            });
            
            res.render('schedule', {scheduleChunkByType});
        });
    })
    .get('/timelist', (req, res) => {

        const time_list_sql = fs.readFileSync(path.join(__dirname, 'sql', 'time-list.sql'), {encoding: 'UTF-8'});

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

