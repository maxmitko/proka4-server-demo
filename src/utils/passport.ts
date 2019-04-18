import { Express } from 'express'
import passport from 'passport'
import { Strategy } from 'passport-local'
import { getRepository } from "typeorm";

import { Users } from '../entity/users'
import cryptPassword from './cryptPassword'

export default (app: Express) => {
    app.use(passport.initialize());
    app.use(passport.session());

    const localStrategy = new Strategy(async (username, password, done) => {

        const users = getRepository(Users)
        const user = await users.findOne({
            relations: ['role'],
            select: ['id', 'username', 'password'],
            where: [{ username: username }, { email: username }]
        })

        if (!user.username) return done(null, false);
        if (user.password !== cryptPassword(password)) return done(null, false);

        delete user['password']

        return done(null, user);
    })

    passport.use('local', localStrategy);

    passport.serializeUser((user: Users, done) => {

        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const users = getRepository(Users)
            const row = await users.findOne(id, { relations: ["role"] })

            done(null, row);

        } catch (err) {
            done(err, false)
        }
    });
};