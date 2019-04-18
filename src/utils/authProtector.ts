import { NextFunction, Request, Response } from 'express';

export default (ability: Function) => (req: Request, res: Response, next: NextFunction) => {
    try {

        if (process.env.NODE_ENV === 'development' ? true : ability(req)) {
            return next()
        } else {
            throw new Error('Not Acceptable')
        }
    } catch (err) {
        next(err)
    }
};