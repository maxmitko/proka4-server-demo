import { ScheduleWeekTime } from '../entity/scheduleWeekTime'
import { Router } from 'express';

import { deleteById, findWithOptions, getAll, getById, updateItem, createItem } from './middlewares/index'

const router = Router();

router
    .get('/', getAll(ScheduleWeekTime))
    .get('/:id', getById(ScheduleWeekTime))
    .post('/find', findWithOptions(ScheduleWeekTime))
    .post('/', createItem(ScheduleWeekTime))
    .patch('/', updateItem(ScheduleWeekTime))
    .delete('/:id', deleteById(ScheduleWeekTime))

export default router