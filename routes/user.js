const express = require('express');
const router = express.Router();
const passport = require('passport');
const pool = require('../libs/mysql-connect');
const { validationResult } = require('express-validator/check');
const protect = require('../libs/authorization');
const validate = require('./helpers/validator')
const logger = require('../libs/logger')

router
    .post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/user/login',
    }
    ), function (req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        res.json('OK');
        // console.log('isAuthenticated ', req.isAuthenticated());
    })
    .get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    })
    .get('/profile', protect((req) => req.ability.can('read', 'Profile')), function (req, res) {

        res.render('profile', { user: req.user });
    })
    .get('/:id', function (req, res) {
        const sql = `
            SELECT id, username, fullname, email, phone, role, money, isactive 
            FROM users
            WHERE id = :userId
      `;

        pool.query(sql, { userId: req.params.id }, function (err, rows) {
            if (err) logger.error(err);

            res.format({
                'application/json': function () {
                    res.header('Access-Control-Allow-Origin', '*');
                    res.json(rows[0]);
                }
            })
        })
    })
    .put('/profile', protect((req) => req.ability.can('update', 'Profile')), validate.signin, function (req, res) {

        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(422).json({ error: error.array() });
        }

        const whiteList = ['phone', 'fullname'];
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

        pool.query(sql, { body, userId: req.user.id }, function (err, results, fields) {
            if (err) logger.error(err);

            res.send();
        })
    })
    .post('/registration', validate.signup, function (req, res) {

        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(422).json({ error: error.array() });
        }

        const whiteList = ['username', 'email', 'password'];

        const sql = `
          INSERT INTO users
          SET :body
        `;

        const body = {};
        whiteList.forEach(item => {
            if (!req.body[item]) return
            body[item] = req.body[item]
        });
        body['role'] = 2;

        pool.query(sql, { body }, function (err, results, fields) {
            if (err) logger.error(err);

            res.send();
        })
    });


module.exports = router;




