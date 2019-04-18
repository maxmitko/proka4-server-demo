import { ProductPropertyType } from '../entity/productPropertyType'
import { Router } from 'express';

import { deleteById, findWithOptions, getAll, getById, updateItem, createItem } from './middlewares/index'

const router = Router();

router
    .get('/', getAll(ProductPropertyType))
    .get('/:id', getById(ProductPropertyType))
    .post('/find', findWithOptions(ProductPropertyType))
    .post('/', createItem(ProductPropertyType))
    .patch('/', updateItem(ProductPropertyType))
    .delete('/:id', deleteById(ProductPropertyType))

export default router