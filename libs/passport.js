const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('./mysql-connect');
const cryptPassword = require('./cryptPassword');

module.exports = function (app) {

    app.use(passport.initialize());
    app.use(passport.session());
    passport.protect = require('./authentication');

    passport.use(new LocalStrategy(async (username, password, done) => {

        let foo = await pool.query('SELECT * FROM users WHERE username = :username', {username: username});
        let bar = await pool.query('SELECT * FROM users WHERE email = :email', {email: username});
        let user = foo[0] || bar[0];

        if (!user.username) {
            return done(null, false);
        }

        if (user.password !== cryptPassword(password)) {

            return done(null, false);
        }

        return done(null, user);
    }));

    passport.serializeUser(function (user, done) {

        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {

        const sql = `
          SELECT id, username, email, phone, fullname
          FROM users
          WHERE id = :id
        `;

        pool.query(sql, {id: id}, function (err, rows) {

            done(err, rows[0]);
        });
    });

};


