const index = require('./index');
const about = require('./about');
const news = require('./news');
const service = require('./service');
const schedule = require('./schedule');
const shop = require('./shop');
const user = require('./user');
const admin = require('./admin');
const order = require('./order');
const appointment = require('./appointment');
const api = require('./api');
const passport = require('passport');

module.exports = function (app) {
    app.use(function (req, res, next) {

        const result = req.originalUrl.match(/^\/[a-z]+/);

        res.locals.currentPage = result ? result[0].slice(1) : '/';
        res.locals.userName = req.user ? req.user.username : null;

        next();
    });
    app.use('/', index);
    app.use('/about', about);
    app.use('/admin', passport.protect(), admin);
    app.use('/news', news);
    app.use('/service', service);
    app.use('/schedule', schedule);
    app.use('/shop', shop);
    app.use('/shop/order', order);
    app.use('/user', user);
    app.use('/appointment', appointment);
    app.use('/api', api);

};

