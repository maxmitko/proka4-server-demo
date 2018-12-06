const pool = require('../libs/mysql-connect');
const express = require('express');
const router = express.Router();

router
    .get('/',  function (req, res) {

            res.render('admin');
        })
    .get('/clientscard', function (req, res) {

        const sql = `
          SELECT srv.id                AS 'srv_id',
                 srv.title             AS 'srv_title',
                 usr.id                AS 'usr_id',
                 usr.fullname          AS 'usr_full_name',
                 cltc.id               AS 'client_card_id',
                 cltc.count            AS 'cltc_count',
                 cltc.price            AS 'cltc_price',
                 cltc.remainder        AS 'cltc_remainder',
                 cltc.time_of_purchase AS 'time_of_purchase',
                 1                     AS 'cltv_visit_status'
          FROM client_card cltc
                 LEFT JOIN users usr ON usr.id = cltc.user_id
                 LEFT JOIN service srv ON srv.id = cltc.service_id
          WHERE cltc.count <> 0
        `;

        pool.query(sql, function (err, rows) {
            if (err) throw err;

            res.format({
                'application/json': function () {
                    res.header('Access-Control-Allow-Origin', '*');
                    res.json(rows);
                }
            })
        })
    })
    .get('/clientsvisit', function (req, res) {

        const sql = `
          SELECT srv.id                                      AS 'srv_id',
                 srv.title                                   AS 'srv_title',
                 usr.id                                      AS 'usr_id',
                 usr.fullname                                AS 'usr_full_name',
                 cltv.client_card_id                         AS 'client_card_id',
                 cltc.count                                  AS 'cltc_count',
                 cltv.id                                     AS 'cltv_id',
                 DATE_FORMAT(cltv.time, '%Y-%m-%d %H:%i:%s') AS 'cltv_time',
                 cltv.visit_status                           AS 'cltv_visit_status'
          FROM client_visit cltv
                 LEFT JOIN service srv ON cltv.service_id = srv.id
                 LEFT JOIN users usr ON cltv.user_id = usr.id
                 LEFT JOIN client_card cltc ON cltv.client_card_id = cltc.id
          WHERE cltv.time LIKE :datefilter
          GROUP BY cltv.id
        `;

        const datefilter = `${req.query.date}%`;

        pool.query(sql, {datefilter}, function (err, rows) {
            if (err) throw err;

            res.format({
                'application/json': function () {
                    res.header('Access-Control-Allow-Origin', '*');
                    res.json(rows);
                }
            })
        })
    })
    .post('/clientsvisit', function (req, res) {


        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                throw err;
            }

            let body = JSON.parse(req.body['data']);

            connection.beginTransaction(function (err) {
                if (err) throw err;

                const clientBody = body.map(item => {
                    return [item['srv_id'], item['usr_id'], item['client_card_id'], item['cltv_visit_status'], item['cltv_time']]
                });

                const sqlClientVisit = `
                  INSERT INTO client_visit (service_id, user_id, client_card_id, visit_status, time)
                  VALUES :clientBody
                `;

                connection.query(sqlClientVisit, {clientBody}, function (err, okPacket) {
                    if (err) throw err;

                    const cardBody = body.map(item => {
                        return [
                            item['client_card_id'],
                            item['cltc_remainder']
                        ]
                    });

                    const sqlClientCard = `
                      INSERT INTO client_card (id, remainder)
                      VALUES :cardBody
                      ON DUPLICATE KEY UPDATE remainder = VALUES(remainder)
                    `;


                    connection.query(sqlClientCard, {cardBody}, function (err, okPacket) {
                        if (err) throw err;

                        connection.commit(function (err) {
                            if (err) {
                                return connection.rollback(function () {
                                    connection.release();
                                    throw err;
                                });
                            }

                            res.send('OK')
                        });
                    });
                })
            });
        });

    })
    .put('/clientsvisit/status', function (req, res) {

        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                throw err;
            }

            let body = JSON.parse(req.body['data']);

            connection.beginTransaction(function (err) {
                if (err) throw err;

                const clientBody = body['clientsVisits'].map(item => {
                    return [
                        item['cltv_id'],
                        item['cltv_visit_status'],
                    ]
                });

                const sqlClientVisit = `
                  INSERT INTO client_visit (id, visit_status)
                  VALUES :clientBody
                  ON DUPLICATE KEY UPDATE visit_status = VALUES(visit_status)
                `;

                connection.query(sqlClientVisit, {clientBody}, function (err, okPacket) {
                    if (err) throw err;

                    const cardBody = body['clientsCards'].map(item => {
                        return [
                            item['client_card_id'],
                            item['cltc_remainder'],
                        ]
                    });

                    const sqlClientCard = `
                      INSERT INTO client_card (id, remainder)
                      VALUES :cardBody
                      ON DUPLICATE KEY UPDATE remainder = VALUES(remainder)
                    `;


                    connection.query(sqlClientCard, {cardBody}, function (err, okPacket) {
                        if (err) throw err;

                        connection.commit(function (err) {
                            if (err) {
                                return connection.rollback(function () {
                                    connection.release();
                                    throw err;
                                });
                            }

                            res.send('OK')
                        });
                    });
                })
            });
        });
    });


module.exports = router;
