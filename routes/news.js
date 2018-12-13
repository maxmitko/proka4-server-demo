const pool = require('../libs/mysql-connect');
const getFromToMonth = require('../libs/formatDate').getFromToMonth;
const express = require('express');
const router = express.Router();

router
    .get('/', (req, res) => {

        const sql = `
          SELECT nw.id        AS 'id',
                 nw.title     AS 'title',
                 nw.content   AS 'content',
                 nw.topic     AS 'topic',
                 nw.link_hash AS 'link_hash',
                 nw.from AS 'from',
                 nw.to AS 'to'
                 FROM news nw
          ORDER BY nw.from DESC
        `;

        pool.query(sql, function (err, rows) {
            if (err) throw err;

            const newsList = rows.map(item => ({ ...item, fromTo: getFromToMonth(item.from, item.to) }))

            pool.query(sql, function (err, rows) {
                if (err) throw err;

                res.format({
                    'text/plain': function () {
                        res.send(newsList);
                    },
                    'text/html': function () {
                        res.render('news', { newsList });
                    },
                    'application/json': function () {
                        res.header('Access-Control-Allow-Origin', '*');
                        res.json(newsList);
                    },

                    'default': function () {
                        // log the request and respond with 406
                        res.status(406).send('Not Acceptable');
                    }
                });
            });
        });
    });

module.exports = router;


