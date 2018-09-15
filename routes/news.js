const pool = require('../libs/mysql-connect');
const express = require('express');
const router = express.Router();

router
    .get('/', (req, res) => {

        const sql = `
          SELECT nw.id        AS 'id',
                 nw.title     AS 'title',
                 nw.content   AS 'content',
                 nw.topic     AS 'topic',
                 nw.link_hash AS 'link_hash'
          FROM news nw
          ORDER BY nw.id DESC 
        `;

        pool.query(sql, function (err, rows) {
            if (err) throw err;

            res.render('news', {newsList: rows});
        });
    });

module.exports = router;


