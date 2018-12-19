const pool = require('../libs/mysql-connect');
const getFromToMonth = require('../libs/formatDate').getFromToMonth;
const express = require('express');
const router = express.Router();
const protect = require('../libs/authorization');
const adminAccess = protect(req => req.ability.can('update', 'Profile'))
const { validationResult } = require('express-validator/check');
const { newsChecker } = require('./helpers/validator')
const logger = require('../libs/logger');
const { blackListFilter } = require('./helpers/sanitization')

router
    .get('/', (req, res) => {

        const sql = `
          SELECT * FROM news
          ORDER BY 'from' DESC
        `;

        pool.query(sql, function (err, rows) {
            if (err) logger.error(err);
            const newsList = rows.map(item => ({ ...item, fromTo: getFromToMonth(item.from, item.to) }))

            res.format({
                'text/html': function () {
                    res.render('news', { newsList })
                },
                'application/json': function () {
                    res.header('Access-Control-Allow-Origin', '*');
                    res.json(newsList);
                },
                'default': function () {
                    res.status(406).send('Not Acceptable')
                }
            });
        });
    })
    .get('/range', async function (req, res) {

        const reqCount = await pool.query('SELECT COUNT(*) AS count FROM news');
        const count = reqCount[0].count

        const sql = `
            SELECT * FROM news
            WHERE id > :cursor
            LIMIT :limit
            `;

        const { limit, cursor } = req.query

        const sqlParams = {
            cursor: Number(cursor),
            limit: Number(limit),
        }

        pool.query(sql, sqlParams, function (err, rows, fields) {
            if (err) logger.error(err);

            const newsList = rows.map(item => ({ ...item, fromTo: getFromToMonth(item.from, item.to) }))

            const data = {
                count: newsList.length,
                totalCount: count,
                newsList,
            }

            res.format({
                'text/html': function () {
                    res.render('news', data)
                },
                'application/json': function () {
                    res.header('Access-Control-Allow-Origin', '*');
                    res.json(data);
                },
                'default': function () {
                    res.status(406).send('Not Acceptable')
                }
            });
        })
    })
    .get('/:id', function (req, res, next) {

        const sql = `
            SELECT * FROM news
            WHERE id = :id
        `;

        const sqlParams = {
            id: Number(req.params.id),
        }

        pool.query(sql, sqlParams, function (err, rows, fields) {
            if (err) logger.error(err);

            const news = { ...rows[0], fromTo: getFromToMonth(rows[0].from, rows[0].to) }

            res.format({
                'application/json': function () {
                    res.header('Access-Control-Allow-Origin', '*');
                    res.json(news);
                },
                'default': function () {
                    res.status(406).send('Not Acceptable')
                }
            });
        })
    })
    .put('/', adminAccess, newsChecker, function (req, res) {

        const error = validationResult(req);
        if (!error.isEmpty()) return res.status(422).json({ error: error.array() })

        const sql = `
          UPDATE news
          SET :body
          WHERE id = :id
        `;

        const sqlParams = {
            body: blackListFilter(['id', 'fromTo'], req.body),
            id: Number(req.body.id),
        }

        pool.query(sql, sqlParams, function (err, OkPacket, fields) {
            if (err) logger.error(err);

            res.send();
        })

    })
    .post('/', adminAccess, newsChecker, function (req, res) {

        const error = validationResult(req);
        if (!error.isEmpty()) return res.status(422).json({ error: error.array() })

        const sql = `
          INSERT INTO news
          SET :body
        `;

        const sqlParams = {
            body: blackListFilter(['id', 'fromTo'], req.body),
        }

        pool.query(sql, sqlParams, function (err, OkPacket, fields) {
            if (err) logger.error(err);

            res.send();
        })
    })
    .delete('/:id', adminAccess, function (req, res) {

        const sql = `
            DELETE FROM news
            WHERE id = :id
        `;

        const sqlParams = {
            id: Number(req.params.id),
        }

        pool.query(sql, sqlParams, function (err, OkPacket, fields) {
            if (err) logger.error(err);

            res.send();
        })
    });


module.exports = router;


