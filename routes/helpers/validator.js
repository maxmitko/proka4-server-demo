const cryptPassword = require('../../libs/cryptPassword');
const { sanitizeBody } = require('express-validator/filter');
const { body, param } = require('express-validator/check');
const pool = require('../../libs/mysql-connect');

module.exports.signup = [
    body('username').isLength({ min: 3, max: 20 }).withMessage('логин мин 3 макс 20 символов'),
    body('phone').isMobilePhone('ru-RU').withMessage('номер телефона введен неверно').optional(),
    body('username').custom(async (value, { req }) => {

        await pool.query(`SELECT username
                          FROM users
                          WHERE username = :username`, { username: req.body.username })
            .then(rows => {
                if (rows.length !== 0) {
                    throw new Error('Такой логин уже занят');
                }
            })

    }),
    body('email').isEmail().withMessage('email не соответствует шаблону'),
    body('email').custom(async (value, { req }) => {

        await pool.query(`SELECT email
                          FROM users
                          WHERE email = :email`, { email: req.body.email })
            .then(rows => {
                if (rows.length !== 0) {
                    throw new Error('Email уже занят');
                }
            })

    }),
    body('password').isLength({ min: 6 }).withMessage('пароль минимум 6 символов'),
    body('repassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Пароли не совпадают');
        }
        return true;
    }),
    sanitizeBody('password').customSanitizer(cryptPassword),
];

module.exports.signin = [
    body('phone').isMobilePhone('ru-RU').withMessage('номер телефона введен неверно').optional(),
    body('fullname'),
    body('password').isLength({ min: 6 }).withMessage('пароль минимум 6 символов').optional(),
    body('repassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Пароли не совпадают');
        }
        return true;
    }).optional(),
    sanitizeBody('password').customSanitizer(cryptPassword),
];



module.exports.news = {
    getRange: [
        param(['limit', 'offset']).toInt().isInt().exists(),
    ],
    getByCursor: [
        param(['limit', 'cursor']).toInt().isInt().exists(),
    ],
    create: [
        body(['title', 'content', 'topic', 'start_date', 'end_date']).trim().exists(),
    ],
    update: [
        body('id').isInt().toInt().exists(),
        body(['title', 'content', 'topic', 'start_date', 'end_date']).trim().exists(),
    ],
    id: [
        param('id').isInt().exists(),
    ]
}