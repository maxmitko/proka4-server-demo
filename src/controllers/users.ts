import { Users } from '../entity/users'
import { Router } from 'express';

import { deleteById, findWithOptions, getAll, getById, updateItem, createItem } from './middlewares/index'

const router = Router();

router
    .get('/', getAll(Users))
    .get('/:id', getById(Users))
    .post('/find', findWithOptions(Users))
    .post('/', createItem(Users))
    .patch('/', updateItem(Users))
    .delete('/:id', deleteById(Users))

export default router