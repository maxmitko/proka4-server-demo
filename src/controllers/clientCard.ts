import { validate } from "class-validator";
import { Router, NextFunction, Request, Response } from 'express';
import { getCustomRepository } from "typeorm";
import { deleteById, findWithOptions, getAll, getById, updateItem, createItem } from './middlewares/index'

import { ClientCard } from '../entity/clientCard'
import { ClientCardRepository } from '../repository/clientCard'
import { ValidationException } from '../utils/UserException'

const router = Router();

router
    .get('/', getAll(ClientCard))
    .get('/:id', getById(ClientCard))
    .post('/find', findWithOptions(ClientCard))
    .post('/find.custom', async (req: Request, res: Response, next: NextFunction) => {
        try {

            const repo = getCustomRepository(ClientCardRepository);

            const errors = await validate(repo)
            if (errors.length > 0) throw new ValidationException(errors)

            const data = await repo.customFind(req.body);

            res.send(data)

        } catch (err) {
            next(err)
        }
    })
    .post('/', createItem(ClientCard))
    .patch('/', updateItem(ClientCard))
    .delete('/:id', deleteById(ClientCard))
export default router