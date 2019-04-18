import { ProductCategory } from '../entity/productCategory'
import { Router } from 'express';

import { deleteById, findWithOptions, getAll, getById, updateItem, createItem } from './middlewares/index'

const router = Router();

router
    .get('/', getAll(ProductCategory))
    .get('/:id', getById(ProductCategory))
    .post('/find', findWithOptions(ProductCategory))
    .post('/', createItem(ProductCategory))
    .patch('/', updateItem(ProductCategory))
    .delete('/:id', deleteById(ProductCategory))

export default router