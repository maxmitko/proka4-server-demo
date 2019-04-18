import { Response, NextFunction, Request } from 'express';
import { getManager } from "typeorm";
import { validate } from "class-validator";
import { ValidationException } from '../../utils/UserException'

export default (Entity: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {

        const manager = getManager();
        const repository = manager.create(Entity, req.body);

        const errors = await validate(repository, { groups: ["update"] })
        if (errors.length > 0) throw new ValidationException(errors)

        await manager.save(repository);

        res.send()

    } catch (err) {
        next(err)
    }
}