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
const users = require('./users');
const order = require('./order');
const appointment = require('./appointment');
const protect = require('../libs/authorization');

module.exports = function (app) {
    app.use('/', index);
    app.use('/about', about);
    app.use('/admin', protect((req) => req.ability.can('manage', 'Admin')), admin);
    app.use('/admin/clientscard', clientscard);
    app.use('/admin/clientsvisit', clientsvisit);
    app.use('/admin/users', users);
    app.use('/news', news);
    app.use('/service', service);
    app.use('/schedule', schedule);
    app.use('/shop', shop);
    app.use('/shop/order', order);
    app.use('/user', user);
    app.use('/appointment', appointment);
};

