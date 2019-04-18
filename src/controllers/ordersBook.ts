import { OrdersBook } from '../entity/ordersBook'
import { Router } from 'express';

import { deleteById, findWithOptions, getAll, getById, updateItem, createItem } from './middlewares/index'

const router = Router();

router
    .get('/', getAll(OrdersBook))
    .get('/:id', getById(OrdersBook))
    .post('/find', findWithOptions(OrdersBook))
    .post('/', createItem(OrdersBook))
    .patch('/', updateItem(OrdersBook))
    .delete('/:id', deleteById(OrdersBook))

export default router