import { Response, NextFunction, Request } from 'express';
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { ValidationException } from '../../utils/UserException'

export default (Entity: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {

        const repository = getRepository(Entity);
        const entity = repository.create({
            id: req.params.id
        })
        
        const errors = await validate(repository)
        if (errors.length > 0) throw new ValidationException(errors)

        const result = await repository.remove(entity);

        res.send(result)

    } catch (err) {
        next(err)
    }
}