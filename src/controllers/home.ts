import { NextFunction, Request, Response, Router } from 'express';
import { getRepository } from "typeorm";

import { News } from '../entity/news'
import { Service } from '../entity/service'

const router = Router();
const { fromToConvert } = require('../utils/formatDate');

router
    .get('/', async (req: Request, res: Response, next: NextFunction) => {
        try {

            const serviceRepo = getRepository(Service);

            const serviceList = await serviceRepo.find({
                select: ["id", "title"],
                skip: 0,
                take: 4,
                order: {
                    myOrder: "ASC"
                }
            });

            const newsRepo = getRepository(News);

            const newsRaw = await newsRepo.find({
                skip: 0,
                take: 2,
                order: {
                    startDate: "DESC"
                }
            });

            const news = newsRaw.map(item => ({ ...item, fromTo: fromToConvert(item.startDate, item.endDate) }))

            res.format({
                html: () => res.render('home', { serviceList, news }),
                json: () => res.json({ serviceList, news }),
            });

        } catch (err) {
            next(err)
        }
    })

export default router;

