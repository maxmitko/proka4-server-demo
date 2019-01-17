const pool = require('../libs/mysql-connect');
const express = require('express');
const router = express.Router();
const protect = require('../libs/authorization');
const adminAccess = protect(req => req.ability.can('update', 'Profile'))
const { validationResult } = require('express-validator/check');
const { matchedData } = require('express-validator/filter');
const { default: validate, news: validateSpecific } = require('./helpers/validator')
const api = require('../api/news')

router
    .get('/', async (req, res, next) => {
        try {
            const data = await api.getAll()

            res.format({
                html: () => res.render('news', { newsList: data }),
                json: () => res.json(data),
            });

        } catch (err) {
            next(err)
        }
    })
    .get('/:id', validate.id, async (req, res, next) => {
        try {
            const data = await api.getById(req.params.id)

            res.format({
                json: () => res.json(data)
            });

        } catch (err) {
            next(err)
        }
    })
    .get('/range/:limit/:offset', validate.getRange, async (req, res, next) => {
        try {
            validationResult(req).throw();

            const reqCount = await api.getCount();
            const count = reqCount[0].count

            const newsList = await api.getByRange(req.params.limit, req.params.offset)
            const data = { totalCount: count, data: newsList }

            res.format({
                json: () => res.json(data)
            });

        } catch (err) {
            next(err)
        }
    })
    .get('/cursor/:limit/:cursor', validate.getByCursor, async (req, res, next) => {
        try {
            validationResult(req).throw();

            const data = await api.getByCursor(req.params.limit, req.params.cursor)

            res.format({
                json: () => res.json(data),
            });

        } catch (err) {
            next(err)
        }
    })
    .put('/', adminAccess, validateSpecific.update, async (req, res, next) => {
        try {
            validationResult(req).throw();
            const data = matchedData(req, { onlyValidData: true });

            await api.put(data)
            res.send()

        } catch (err) {
            next(err)
        }
    })
    .post('/', adminAccess, validateSpecific.create, async (req, res, next) => {
        try {
            validationResult(req).throw();
            const data = matchedData(req, { onlyValidData: true });

            await api.post(data)
            res.send()

        } catch (err) {
            next(err)
        }
    })
    .delete('/:id', adminAccess, validate.id, async (req, res, next) => {
        try {
            validationResult(req).throw();

            await api.remove(req.params.id)
            res.send()

        } catch (err) {
            next(err)
        }
    });


module.exports = router;