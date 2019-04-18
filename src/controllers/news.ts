import { NextFunction, Request, Response, Router } from 'express';
import { getRepository } from "typeorm";

import { News } from '../entity/news'
import { fromToConvert } from '../utils/formatDate'
import { createItem, deleteById, findWithOptions, getAll, getById, updateItem } from './middlewares/index'
import protect from '../utils/authProtector'

const adminPermission = protect((req: Request) => req.ability.can('manage', 'Admin'))


const router = Router();

router
    .get('/', async (req: Request, res: Response, next: NextFunction) => {
        try {

            const repository = getRepository(News);
            const result = await repository.find({ order: { startDate:  "DESC" } });

            const data = result.map(item => ({
                ...item,
                fromTo: fromToConvert(item.startDate, item.endDate)
            }))

            res.format({
                html: () => res.render('news', { data }),
                json: () => res.json(result),
            });

        } catch (err) {
            next(err)
        }
    })
    .get('/:id', getById(News))
    .post('/find', findWithOptions(News))
    .post('/', adminPermission, createItem(News))
    .patch('/', adminPermission, updateItem(News))
    .delete('/:id', adminPermission, deleteById(News))

export default router