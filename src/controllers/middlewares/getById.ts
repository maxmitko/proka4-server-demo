import { Response, NextFunction, Request } from 'express';
import { getRepository, FindOneOptions } from "typeorm";
import { validate } from "class-validator";
import { ValidationException } from '../../utils/UserException'

export default (Entity: any, options?: FindOneOptions) => async (req: Request, res: Response, next: NextFunction) => {
    try {

        const repository = getRepository(Entity);

        const errors = await validate(repository)
        if (errors.length > 0) throw new ValidationException(errors)

        const result = await repository.findOne(req.params.id, options)

        res.format({
            html: () => res.render(`${repository.metadata.name.toLowerCase()}-item`, { data: result }),
            json: () => res.json(result),
        });

    } catch (err) {
        next(err)
    }
}