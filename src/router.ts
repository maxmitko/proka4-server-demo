import { Express, Request } from 'express'
import { createConnection } from 'typeorm';

import about from './controllers/about'
import appointment from './controllers/appointment'
import clientcard from './controllers/clientCard'
import clientvisit from './controllers/clientVisit'
import home from './controllers/home'
import news from './controllers/news'
import orders from './controllers/orders'
import ordersBook from './controllers/ordersBook'
import product from './controllers/product'
import productProducer from './controllers/productProducer'
import productCategory from './controllers/productCategory'
import productProperty from './controllers/productProperty'
import productPropertyType from './controllers/productPropertyType'
import scheduleList from './controllers/scheduleList'
import scheduleType from './controllers/scheduleType'
import scheduleWeek from './controllers/scheduleWeek'
import scheduleWeekTime from './controllers/scheduleWeekTime'
import service from './controllers/service'
import shop from './controllers/shop'
import ticket from './controllers/ticket'
import user from './controllers/user'
import users from './controllers/users'
import protect from './utils/authProtector'
import { routesErrorHandler } from './utils/errorHandler'

const adminPermission = protect((req: Request) => req.ability.can('manage', 'Admin'))
const DB_CONFIG: any = {
    type: "mysql",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_BASE,
    entities: ["build/entity/*.js"],
    logging: process.env.NODE_ENV === 'production' ? ["errors"] : ["query", "errors"],
}

export default async (app: Express) => {
    await createConnection(DB_CONFIG)
    app.use('/', home);
    app.use('/about', about);
    app.use('/client-card', adminPermission, clientcard);
    app.use('/client-visit', adminPermission, clientvisit);
    app.use('/news', news);
    app.use('/service', service);
    app.use('/ticket', adminPermission, ticket);
    app.use('/schedule', scheduleWeek);
    app.use('/schedule-list', adminPermission, scheduleList);
    app.use('/schedule-type', adminPermission, scheduleType);
    app.use('/schedule-week-time', adminPermission, scheduleWeekTime);
    app.use('/product', adminPermission, product);
    app.use('/product-producer', adminPermission, productProducer);
    app.use('/product-category', adminPermission, productCategory);
    app.use('/product-property', adminPermission, productProperty);
    app.use('/product-property-type', adminPermission, productPropertyType);
    app.use('/shop', shop);
    app.use('/orders', adminPermission, orders);
    app.use('/orders-book', adminPermission, ordersBook);
    app.use('/user', user);
    app.use('/users', adminPermission, users);
    app.use('/appointment', appointment);
    app.use(routesErrorHandler)
};

