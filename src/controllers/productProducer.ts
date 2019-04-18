import { ProductProducer } from '../entity/productProducer'
import { Router } from 'express';

import { deleteById, findWithOptions, getAll, getById, updateItem, createItem } from './middlewares/index'

const router = Router();

router
    .get('/', getAll(ProductProducer))
    .get('/:id', getById(ProductProducer))
    .post('/find', findWithOptions(ProductProducer))
    .post('/', createItem(ProductProducer))
    .patch('/', updateItem(ProductProducer))
    .delete('/:id', deleteById(ProductProducer))

export default router