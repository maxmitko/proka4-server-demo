import { Orders } from '../entity/orders'
import { Router } from 'express';

import { deleteById, findWithOptions, getAll, getById, updateItem, createItem } from './middlewares/index'

const router = Router();

router
    .get('/', getAll(Orders))
    .get('/:id', getById(Orders))
    .post('/find', findWithOptions(Orders))
    .post('/', createItem(Orders))
    .patch('/', updateItem(Orders))
    .delete('/:id', deleteById(Orders))

export default router