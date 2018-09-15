const pool = require('../libs/mysql-connect');
const express = require('express');
const router = express.Router();

router
    .get('/', (req, res) => {

        const sql = `
          SELECT srv.id         AS 'id',
                 srv.title      AS 'title',
                 srv.img        AS 'img',
                 art.id         AS 'art_id',
                 art.service_id AS 'service_id'
          FROM service srv
                 LEFT JOIN article art ON srv.id = art.service_id
          WHERE srv.isactive = 1
          ORDER BY srv.myorder
        `;

        pool.query(sql, function (err, rows) {
            if (err) throw err;

            res.format({
                'text/plain': function(){
                    res.send(rows);
                },
                'text/html': function(){
                    res.render('service', {serviceList: rows});
                },
                'application/json': function(){
                    res.header('Access-Control-Allow-Origin', '*');
                    res.json(rows);
                },

                'default': function() {
                    // log the request and respond with 406
                    res.status(406).send('Not Acceptable');
                }
            });

        });
    })
    .get('/:id', (req, res) => {

        const sql = `
          SELECT art.id      AS 'art_id',
                 art.title   AS 'art_title',
                 art.content AS 'art_content',
                 srv.id      AS 'srv_id',
                 srv.title   AS 'srv_title'
          FROM article art
                 LEFT JOIN service srv ON srv.id = art.service_id
          WHERE art.service_id = :srvId
        `;

        pool.query(sql, {srvId: req.params.id}, function (err, rows) {
            if (err) throw err;

            res.render('service-article', {articleList: rows});
        });
    });

module.exports = router;


