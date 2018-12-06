const pool = require('../libs/mysql-connect');
const express = require('express');
const router = express.Router();

router
    .get('/', function (req, res) {

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

module.exports = router;