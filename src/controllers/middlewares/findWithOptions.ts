import { Response, NextFunction, Request } from 'express';
import { getRepository, getManager } from "typeorm";
import { validate } from "class-validator";
import { ValidationException } from '../../utils/UserException'

export default (Entity: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {

        const repository = getRepository(Entity);
        const result = await repository.findAndCount(req.body);

        res.send(result)

    } catch (err) {
        next(err)
    }
}