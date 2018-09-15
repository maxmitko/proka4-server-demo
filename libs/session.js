const session = require('express-session');
const config = require('./myconfig');

const MySQLStore = require('express-mysql-session')(session);
const sessionStore = new MySQLStore(config.db);

module.exports = function (app) {
    app.use(session({
        key: process.env.SESSION_COOKIE_NAME,
        secret: process.env.SESSION_COOKIE_SECRET,
        store: sessionStore,
        resave: false,
        saveUninitialized: false
    }));
};

