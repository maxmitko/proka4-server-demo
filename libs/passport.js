const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('./mysql-connect');
const cryptPassword = require('./cryptPassword');

module.exports = function (app) {

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(async (username, password, done) => {

        let byName = await pool.query('SELECT * FROM users WHERE username = :username', {username: username});
        let byEmail = await pool.query('SELECT * FROM users WHERE email = :email', {email: username});
        let user = byName[0] || byEmail[0];

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
          SELECT u.id       AS 'id',
                 u.username AS 'username',
                 u.email    AS 'email',
                 u.phone    AS 'phone',
                 u.fullname AS 'fullname',
                 ur.role    AS 'role'
          FROM users u
                 LEFT JOIN user_roles ur ON ur.id = u.role
          WHERE u.id = :id
        `;

        pool.query(sql, {id: id}, function (err, rows) {

            done(err, rows[0]);
        });
    });

};


