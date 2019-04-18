import { ScheduleList } from '../entity/scheduleList'
import { Router } from 'express';

import { deleteById, findWithOptions, getAll, getById, updateItem, createItem } from './middlewares/index'

const router = Router();

router
    .get('/', getAll(ScheduleList))
    .get('/:id', getById(ScheduleList))
    .post('/find', findWithOptions(ScheduleList))
    .post('/', createItem(ScheduleList))
    .patch('/', updateItem(ScheduleList))
    .delete('/:id', deleteById(ScheduleList))

export default router