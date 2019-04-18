import { ScheduleType } from '../entity/scheduleType'
import { Router } from 'express';

import { deleteById, findWithOptions, getAll, getById, updateItem, createItem } from './middlewares/index'

const router = Router();

router
    .get('/', getAll(ScheduleType))
    .get('/:id', getById(ScheduleType))
    .post('/find', findWithOptions(ScheduleType))
    .post('/', createItem(ScheduleType))
    .patch('/', updateItem(ScheduleType))
    .delete('/:id', deleteById(ScheduleType))

export default router