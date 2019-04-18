import { validate, ValidationError } from "class-validator";
import { NextFunction, Request, Response, Router } from 'express';
import multer from 'multer'
import passport from 'passport'
import { getRepository, getManager } from 'typeorm'
import { ValidationException } from '../utils/UserException'

import { Users } from '../entity/users'

const upload = multer()
const router = Router()

router
    .post('/signin', upload.none(), (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, password } = req.body
            if (!username || !password) throw new Error('Необходимые данные отсутствуют в req.body запроса')

            passport.authenticate('local', (error, user, info) => {
                if (error) next(error)

                if (!user) {
                    res.status(401).send(info);
                } else {
                    req.login(user, err => err ? next(err) : next());
                    res.redirect('/');
                }

            })(req, res, next);
        } catch (err) {
            next(err)
        }
    })
    .post('/signup', upload.none(), async (req: Request, res: Response, next: NextFunction) => {
        try {

            const repository = getRepository(Users)
            const user = repository.create({
                ...req.body
            });

            const errors = await validate(user, { groups: ["signup"] })
            if (errors.length > 0) throw new ValidationException(errors)

            await repository.save(user)

            res.send()

        } catch (err) {
            next(err)
        }
    })
    .get('/signout', (req: Request, res: Response, next: NextFunction) => {
        try {
            req.logout();
            res.redirect('/');

        } catch (err) {
            next(err)
        }
    })
    .get('/profile', (req: Request, res: Response, next: NextFunction) => {
        
        res.format({
            html: () => res.render('profile', { user: req.user }),
            json: () => res.json(req.user),
        });
    })
    .put('/profile', upload.none(), async (req: Request, res: Response, next: NextFunction) => {
        try {

            const repository = getRepository(Users)
            const user = repository.create({
                id: req.user.id,
                ...req.body
            });
            const errors = await validate(user, { groups: ["profile"] })
            if (errors.length > 0) throw new ValidationException(errors)

            await repository.save(user)

            res.send()

        } catch (err) {
            next(err)
        }
    })

export default router;