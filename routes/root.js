const index = require('./index');
const about = require('./about');
const news = require('./news');
const service = require('./service');
const schedule = require('./schedule');
const shop = require('./shop');
const user = require('./user');
const admin = require('./admin');
const clientscard = require('./clientscard');
const clientsvisit = require('./clientsvisit');
const order = require('./order');
const appointment = require('./appointment');
const protect = require('../libs/authorization');

module.exports = function (app) {
    app.use(function (req, res, next) {

        const result = req.originalUrl.match(/^\/[a-z]+/);

        res.locals.currentPage = result ? result[0].slice(1) : '/'; // храним в locals первый уровень названия роута убрав "/"
        res.locals.userName = req.user ? req.user.username : null; // прокидываем в locals имя пользователя если есть такой

        next();
    });
    app.use(function (req, res, next) {
        if (req.secure || process.env.NODE_ENV !== 'production') {
            return next();
        }
        res.redirect("https://" + req.headers.host + req.url); // редирект пользователя на https
    });
    app.use('/', index);
    app.use('/about', about);
    app.use('/admin', protect((req) => req.ability.can('manage', 'Admin')), admin);
    app.use('/admin/clientscard', clientscard);
    app.use('/admin/clientsvisit', clientsvisit);
    app.use('/news', news);
    app.use('/service', service);
    app.use('/schedule', schedule);
    app.use('/shop', shop);
    app.use('/shop/order', order);
    app.use('/user', user);
    app.use('/appointment', appointment);
};

