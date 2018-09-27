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

            const newsList = rows.map(item => {

                return {
                    ...item,
                    fromTo: getFromToMonth(item.from, item.to)
                }
            })
            
            res.render('news', { newsList });
        });
    });

module.exports = router;


