const pool = require('../libs/mysql-connect');
const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator/check');
const { registrationChecker, profileChecker } = require('./validator')
const protect = require('../libs/authorization');

router
    .get('/', function (req, res) {

        const sql = `
            SELECT 
                usr.id AS 'usr_id',
                usr.fullname AS 'fullname',
                usr.username AS 'username',
                usr.email AS 'email',
                usr.money AS 'money',
                usr.phone AS 'phone'
            FROM users usr
            WHERE usr.isactive = 1
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
    .put('/', protect((req) => req.ability.can('update', 'Profile')), profileChecker, function (req, res) {

        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const whiteList = ['username', 'phone', 'fullname', 'email', 'money'];
        if (req.body.password) whiteList.push('password');

        const body = {};
        whiteList.forEach(item => {
            if (!req.body[item]) return
            body[item] = req.body[item]
        });

        const sql = `
          UPDATE users
          SET :body
          WHERE id = :userId
        `;

        pool.query(sql, { body, userId: req.body.id }, function (err, results, fields) {
            if (err) throw err;

            res.send({});
        })
    })
    .post('/', registrationChecker, function (req, res) {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const whiteList = ['username', 'phone', 'fullname', 'email', 'money', 'password'];

        const body = {};
        whiteList.forEach(item => {
            if (!req.body[item]) return
            body[item] = req.body[item]
        });
        body['role'] = 2;

        const sql = `
          INSERT INTO users
          SET :body
        `;

        pool.query(sql, { body }, function (err, results, fields) {
            if (err) throw err;

            res.send({});
        })
    })
    .delete('/:id', protect((req) => req.ability.can('update', 'Profile')), function (req, res) {

        const sql = `
            DELETE FROM users
            WHERE id = :userId
        `;

        pool.query(sql, { userId: req.params.id }, function (err, results, fields) {
            if (err) throw err;

            res.send();
        })
    });

module.exports = router;