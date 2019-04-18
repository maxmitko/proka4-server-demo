import { ProductProperty } from '../entity/productProperty'
import { Router } from 'express';

import { deleteById, findWithOptions, getAll, getById, updateItem, createItem } from './middlewares/index'

const router = Router();

router
    .get('/', getAll(ProductProperty))
    .get('/:id', getById(ProductProperty))
    .post('/find', findWithOptions(ProductProperty))
    .post('/', createItem(ProductProperty))
    .patch('/', updateItem(ProductProperty))
    .delete('/:id', deleteById(ProductProperty))

export default router