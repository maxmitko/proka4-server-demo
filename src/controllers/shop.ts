import { NextFunction, Request, Response, Router } from 'express';
import { getCustomRepository, getRepository, getManager } from "typeorm";

import { Product } from '../entity/product'
import { Orders } from '../entity/orders'
import { OrdersBook } from '../entity/ordersBook'
import { OrdersBookRepository } from '../repository/ordersBook'
import produce from 'immer'
import moment from 'moment'
const pug = require('pug');
const emailSender = require('../utils/email');
import multer from 'multer'

const upload = multer()
const router = Router();

router
    .get('/', async (req: Request, res: Response, next: NextFunction) => {
        try {

            const productRepo = getRepository(Product);

            const productList = await productRepo.find({
                relations: [
                    "categories",
                    "producer",
                    "properties",
                    "properties.type"
                ]
            });

            res.format({
                html: () => res.render('shop', { productList }),
                json: () => res.json(productList),
            });

        } catch (err) {
            next(err)
        }
    })
    .get('/product/:id', async (req: Request, res: Response, next: NextFunction) => {
        try {

            const productRepo = getRepository(Product);

            const product = await productRepo.findOne({
                relations: [
                    "categories",
                    "producer",
                    "properties",
                    "properties.type"
                ],
                where: { id: req.params.id }
            });

            res.format({
                html: () => res.render('shop-item', { product }),
                json: () => res.json(product),
            });

        } catch (err) {
            next(err)
        }
    })
    .get('/order', async (req: Request, res: Response, next: NextFunction) => {

        if (req.user) {
            const ordersBookRepo = getCustomRepository(OrdersBookRepository);

            const ordersBook = await ordersBookRepo.customFind({
                user: req.user.id,
                status: 0,
            });

            const [rawData, totalCount] = ordersBook

            const data = rawData.map((item: OrdersBook) =>
                produce(item, draftState => {
                    if (draftState.order.timeAdd) draftState.order.timeAdd = moment(draftState.order.timeAdd).format("DD-MM-YY")
                    if (draftState.order.timeDone) draftState.order.timeDone = moment(draftState.order.timeDone).format("DD-MM-YY")
                })
            )

            const ordersSet = [...new Set(data.map(item => item.order.id))]
            const result = ordersSet.map(id => data.filter(item => item.order.id === id))

            res.format({
                html: () => res.render('shop-order', { orders: result }),
                json: () => res.json(result),
            });

        } else {
            res.render('shop-order');
        }
    })
    .get('/order/reject/:id', async (req: Request, res: Response, next: NextFunction) => {

        const ordersRepo = getRepository(Orders);

        await ordersRepo.update(req.params.id, { status: 1 });

        res.redirect('/shop/order');

    })
    .post('/order/place', upload.none(), async (req: Request, res: Response, next: NextFunction) => {

        const entityManager = getManager();
        const user = req.user ? req.user : null;

        await entityManager.transaction(async manager => {
            const order = JSON.parse(req.body.order)

            const orders = await manager.create(Orders, {
                user: {
                    id: user.id
                },
                status: 0,
                customer: req.body.customer,
                phone: req.body.phone
            });

            const { id: newOrderId } = await manager.save(orders)

            const orderBookBody = order.map((item: OrdersBook) => ({
                order: {
                    id: newOrderId
                },
                product: {
                    id: item.id
                },
                count: item.count
            }))

            const orderBook = await manager.create(OrdersBook, orderBookBody);
            const orderBookRes = await manager.save(orderBook)

            const emailBody = pug.renderFile('views/order-email.pug', {
                ...req.body,
                item: order.map((item: any) => ({
                    count: item.count,
                    product: {
                        price: item.price,
                        title: item.prod_title,
                        properties: item.prod_properties
                    }
                }))
            });

            emailSender(process.env.ADMIN_EMAIL, `Поступил заказ № ${newOrderId} от покупателя!`, emailBody);

            if (req.user) {
                res.redirect('/shop/order');
            } else {
                res.send()
            }
            res.send()

        });
    });

export default router
