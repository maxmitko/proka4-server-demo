import { validate } from "class-validator";
import { Router, NextFunction, Request, Response } from 'express';
import { getCustomRepository } from "typeorm";
import { deleteById, findWithOptions, getAll, getById, updateItem, createItem } from './middlewares/index'

import { ClientVisit } from '../entity/clientVisit'
import { ClientVisitRepository } from '../repository/clientVisit'
import { ValidationException } from '../utils/UserException'

const router = Router();

router
    .get('/', getAll(ClientVisit))
    .get('/:id', getById(ClientVisit))
    .post('/find', findWithOptions(ClientVisit))
    .post('/find.custom', async (req: Request, res: Response, next: NextFunction) => {
        try {

            const repo = getCustomRepository(ClientVisitRepository);
            
            const errors = await validate(repo)
            if (errors.length > 0) throw new ValidationException(errors)
            
            const data = await repo.customFind(req.body);
            
            res.send(data)
            
        } catch (err) {
            next(err)
        }
    })
    .post('/', createItem(ClientVisit))
    .patch('/', updateItem(ClientVisit))
    .delete('/:id', deleteById(ClientVisit))
export default router