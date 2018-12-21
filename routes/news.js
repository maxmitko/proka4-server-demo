const pool = require('../libs/mysql-connect');
const getFromToMonth = require('../libs/formatDate').getFromToMonth;
const express = require('express');
const router = express.Router();
const protect = require('../libs/authorization');
const adminAccess = protect(req => req.ability.can('update', 'Profile'))
const { validationResult } = require('express-validator/check');
const { newsChecker } = require('./helpers/validator')
const logger = require('../libs/logger');
const { whiteListFilter } = require('./helpers/sanitization')
const Api = require('../api/news')

router
    .get('/', async (req, res) => {

        const data = await Api.getList()

        res.format({
            html: () => { res.render('news', { newsList }) },
            json: () => {
                res.header('Access-Control-Allow-Origin', '*');
                res.json(data);
            },
            default: () => { res.status(406).send('Not Acceptable') }
        });
    })
    .get('/range', async function (req, res) {

        const reqCount = await pool.query('SELECT COUNT(*) AS count FROM news');
        const count = reqCount[0].count

        const newsList = await Api.getByRange({
            limit: Number(req.query.limit),
            offset: Number(req.query.offset),
        })

        const data = { totalCount: count, data: newsList }

        res.format({
            json: () => {
                res.header('Access-Control-Allow-Origin', '*');
                res.json(data);
            },
            default: () => { res.status(406).send('Not Acceptable') }
        });
    })
    .get('/cursor', async function (req, res) {

        const data = await Api.getByCursor({
            limit: Number(req.query.limit),
            cursor: Number(req.query.cursor),
        })

        res.format({
            json: () => {
                res.header('Access-Control-Allow-Origin', '*');
                res.json(data);
            },
            default: () => { res.status(406).send('Not Acceptable') }
        });
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
            body: whiteListFilter(['title', 'content', 'topic', 'from', 'to'], req.body),
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
            body: whiteListFilter(['title', 'content', 'topic', 'from', 'to'], req.body),
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


