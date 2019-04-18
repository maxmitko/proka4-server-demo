import { Product } from '../entity/product'
import { ProductCategory } from '../entity/productCategory'
import { Router } from 'express';
import { getRepository } from 'typeorm';
import { NextFunction, Response, Request } from 'express';

import { deleteById, findWithOptions, getAll, getById, updateItem, createItem } from './middlewares/index'

const router = Router();
const options = {
    relations: [
        "categories",
        "producer",
        "properties",
        "properties.type"
    ]
}

router
    .get('/', getAll(Product))
    .get('/:id', getById(Product, options))
    .post('/find', findWithOptions(Product))
    .post('/', createItem(Product))
    .patch('/', updateItem(Product))
    .delete('/:id', deleteById(Product))
    .delete('/', deleteById(Product))

export default router