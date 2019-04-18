import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from 'express';

export = (Entity: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {

        const repository = getRepository(Entity);
        const result = await repository.find();

        res.format({
            html: () => res.render(repository.metadata.name.toLowerCase(), { data: result }),
            json: () => res.json(result),
        });

    } catch (err) {
        next(err)
    }
}