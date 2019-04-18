import { Router } from 'express';
import { NextFunction, Response, Request } from 'express';
import { getRepository } from "typeorm";

import { Service } from '../entity/service'
import protect from '../utils/authProtector'
import { createItem, deleteById, findWithOptions, getAll, getById, updateItem } from './middlewares/index'

const adminPermission = protect((req: Request) => req.ability.can('manage', 'Admin'))
const router = Router();

router
    .get('/', async (req: Request, res: Response, next: NextFunction) => {
        try {

            const repository = getRepository(Service);
            const result = await repository.find({ where: { isActive: 1 }, order: { myOrder: "ASC" } });

            res.format({
                html: () => res.render('service', { data: result }),
                json: () => res.json(result),
            });

        } catch (err) {
            next(err)
        }
    })
    .get('/:id', getById(Service))
    .post('/find', findWithOptions(Service))
    .post('/', adminPermission, createItem(Service))
    .patch('/', adminPermission, updateItem(Service))
    .delete('/:id', adminPermission, deleteById(Service))

export default router