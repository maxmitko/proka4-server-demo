const pool = require('../libs/mysql-connect');
const express = require('express');
const router = express.Router();

router
    .post('/', (req, res) => {

        const val = {...req.body, isdone: 0};

        const sql = `
          INSERT INTO appointment 
          SET :val
        `;

        pool.query(sql, {val}, function (err, results, fields) {
            if (err) throw err;

            res.send()
        })
    });

module.exports = router;
