import { Ticket } from '../entity/ticket'
import { Router } from 'express';

import { deleteById, findWithOptions, getAll, getById, updateItem, createItem } from './middlewares/index'

const router = Router();

router
    .get('/', getAll(Ticket))
    .get('/:id', getById(Ticket))
    .post('/find', findWithOptions(Ticket))
    .post('/', createItem(Ticket))
    .patch('/', updateItem(Ticket))
    .delete('/:id', deleteById(Ticket))

export default router