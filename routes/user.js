const express = require('express');
const router = express.Router();
const passport = require('passport');
const pool = require('../libs/mysql-connect');
const cryptPassword = require('../libs/cryptPassword');
const {validationResult, body} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

const registrationChecker = [
    body('username').isLength({min: 3, max: 20}).withMessage('логин мин 3 макс 20 символов'),
    body('username').custom(async (value, {req}) => {

        await pool.query(`SELECT username
                                 FROM users
                                 WHERE username = :username`, {username: req.body.username})
            .then(rows => {
                if (rows.length !== 0) {
                    throw new Error('Такой логин уже занят');
                }
            })

    }),
    body('email').isEmail().withMessage('email не соответствует шаблону'),
    body('email').custom(async (value, {req}) => {

        await pool.query(`SELECT email
                                 FROM users
                                 WHERE email = :email`, {email: req.body.email})
            .then(rows => {
                if (rows.length !== 0) {
                    throw new Error('Email уже занят');
                }
            })

    }),
    body('password').isLength({min: 6}).withMessage('пароль минимум 6 символов'),
    body('repassword').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Пароли не совпадают');
        }
        return true;
    }),
    sanitizeBody('password').customSanitizer(value => {
        return cryptPassword(value);
    }),
];

const profileChecker = [
    body('phone').isMobilePhone('ru-RU').withMessage('номер телефона введе неверно'),
    body('fullname'),
    body('password').isLength({min: 6}).withMessage('пароль минимум 6 символов').optional(),
    body('repassword').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Пароли не совпадают');
        }
        return true;
    }).optional(),
    sanitizeBody('password').customSanitizer(value => {
        return cryptPassword(value);
    }),

];

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
    .get('/profile', passport.protect(), function (req, res) {

        res.render('profile', {user: req.user});
    })
    .put('/profile', passport.protect(), profileChecker, function (req, res) {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

        const whiteList = ['phone', 'fullname'];
        if (req.body.password) whiteList.push('password');

        const body = {};
        whiteList.forEach(item => {
            body[item] = req.body[item]
        });

        const sql = `
          UPDATE users
          SET :body
          WHERE id = :userId
        `;

        pool.query(sql, {body, userId: req.user.id}, function (err, results, fields) {
            if (err) throw err;

            res.send();
        })
    })
    .post('/registration', registrationChecker, function (req, res) {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

        const whiteList = ['username', 'email', 'password'];

        const sql = `
          INSERT INTO users
          SET :body
        `;

        const body = {};
        whiteList.forEach(item => {
            body[item] = req.body[item]
        });
        body['role'] = 2;

        pool.query(sql, {body}, function (err, results, fields) {
            if (err) throw err;

            res.send();
        })
    });


module.exports = router;




