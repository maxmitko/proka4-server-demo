const pool = require('../libs/mysql-connect');
const express = require('express');
const router = express.Router();
const emailSender = require('../libs/email');
const pug = require('pug');

router
    .post('/', (req, res) => {

        const body = {...req.body, isdone: 0};

        const sql = `
          INSERT INTO appointment
          SET :body
        `;

        pool.query(sql, {body}, function (err, okPacket) {
            if (err) throw err;

            const emailBody = pug.renderFile('views/appointment-email.pug', {
                data: req.body,
                insertId: okPacket.insertId
            });

            emailSender(process.env.ADMIN_EMAIL, `Поступила заявка № ${okPacket.insertId} на запись!`, emailBody);

            res.send()
        })
    });

module.exports = router;
