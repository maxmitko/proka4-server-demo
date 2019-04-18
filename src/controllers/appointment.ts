import { Router, Request } from 'express';

import { Appointment } from '../entity/appointment'
import protect from '../utils/authProtector'
import { createItem, deleteById, findWithOptions, getAll, getById, updateItem } from './middlewares/index'

const adminPermission = protect((req: Request) => req.ability.can('manage', 'Admin'))

const router = Router();

router
    .get('/', adminPermission, getAll(Appointment))
    .get('/:id', adminPermission, getById(Appointment))
    .post('/find', adminPermission, findWithOptions(Appointment))
    .post('/', createItem(Appointment))
    .patch('/', adminPermission, updateItem(Appointment))
    .delete('/:id', adminPermission, deleteById(Appointment))

export default router