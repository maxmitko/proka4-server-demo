import { Response, NextFunction, Request } from 'express';
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { ValidationException } from '../../utils/UserException'

export default (Entity: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {

        const repository = getRepository(Entity);
        const entity = repository.create(req.body)

        const errors = await validate(entity, { groups: ["create"] })
        if (errors.length > 0) throw new ValidationException(errors)

        const result: any = await repository.save(entity);

        res.send({ id: result.id })

    } catch (err) {
        next(err)
    }
}