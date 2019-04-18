import { validate } from "class-validator";
import { NextFunction, Response, Router, Request } from 'express';
import produce from 'immer'
import moment from 'moment'
import { getCustomRepository, getRepository } from "typeorm";

import { ScheduleWeek } from '../entity/scheduleWeek'
import { ScheduleWeekRepository } from '../repository/scheduleWeek'
import { ValidationException } from '../utils/UserException'
import protect from '../utils/authProtector'
import { createItem, deleteById, findWithOptions, getAll, getById, updateItem } from './middlewares/index'

const adminPermission = protect((req: Request) => req.ability.can('manage', 'Admin'))

const router = Router();

router
    .get('/:id', getById(ScheduleWeek))
    .post('/find', findWithOptions(ScheduleWeek))
    .post('/', adminPermission, createItem(ScheduleWeek))
    .patch('/', adminPermission, updateItem(ScheduleWeek))
    .delete('/:id', adminPermission, deleteById(ScheduleWeek))
    .post('/find.custom', async (req: Request, res: Response, next: NextFunction) => {
        try {

            const repo = getCustomRepository(ScheduleWeekRepository);

            const errors = await validate(repo)
            if (errors.length > 0) throw new ValidationException(errors)

            const data = await repo.customFind(req.body);

            res.send(data)

        } catch (err) {
            next(err)
        }
    })
    .get('/', async (req: Request, res: Response, next: NextFunction) => {
        try {

            const scheduleWeekRepo = getCustomRepository(ScheduleWeekRepository);
            const scheduleWeekResponse = await scheduleWeekRepo.customFind({
                activeSchedule: true,
                activeScheduleType: true
            });

            let [rawData, totalCount] = scheduleWeekResponse

            const formatScheduleWeekItem = (item: ScheduleWeek) => {
                const result = item.scheduleList.startDate
                    ? produce(item, draftState => {
                        draftState.scheduleList.startDate = moment(item.scheduleList.startDate).format('DD.MM.YY')
                        draftState.scheduleList.endDate = moment(item.scheduleList.endDate).format('DD.MM.YY')
                    })
                    : item

                return produce(result, draftState => {
                    draftState.timeList.title = draftState.timeList.title.slice(0, -3)
                    draftState.weekDays = draftState.weekDays
                        .map(day => day && { id: draftState.scheduleList.id, color: result.scheduleList.color })
                })
            }

            rawData = rawData.map(item => formatScheduleWeekItem(item))

            const scheduleIdSet = [
                ...new Set(rawData
                    .map((item: ScheduleWeek) => item.scheduleList.id)
                    .filter(item => item))
            ]

            const scheduleTypeSet = [
                ...new Set(rawData
                    .map((item: ScheduleWeek) => item.scheduleList.scheduleType !== null ? item.scheduleList.scheduleType.id : null)
                    .filter(item => item))
            ]

            const chunkedWithoutType = scheduleIdSet
                .map(scheduleId => rawData.filter(item => item.scheduleList.id === scheduleId && !item.scheduleList.scheduleType))
                .filter(item => item.length)

            const chunkedByType = scheduleTypeSet
                .map(typeId => rawData.filter(item => item.scheduleList.scheduleType && item.scheduleList.scheduleType.id === typeId))
                .filter(item => item.length)


            const chunkedByTypeAndMergedTime = chunkedByType.map(chank => {

                chank.sort(function (a, b) {
                    if (a.timeList.title > b.timeList.title) return 1;
                    if (a.timeList.title < b.timeList.title) return -1;
                    return 0;
                });

                let chankMergedByTime: ScheduleWeek[] = [];

                chank.reduce((acc, item) => {
                    if (acc.timeList.id === item.timeList.id) {

                        const mergedDays: any = acc.weekDays.map((day, i) => {
                            if (day) return day
                            if (item.weekDays[i]) return item.weekDays[i]
                        })

                        chankMergedByTime.pop();
                        chankMergedByTime.push({ ...acc, weekDays: mergedDays });
                        return item

                    } else {
                        chankMergedByTime.push(item)
                        return item;
                    }
                }, chank[0]);

                return chankMergedByTime
            });

            const data: any = [...chunkedWithoutType, ...chunkedByTypeAndMergedTime]

            res.format({
                html: () => res.render('schedule-week', { data }),
                json: () => res.json(data),
            });

        } catch (err) {
            next(err)
        }
    })

export default router