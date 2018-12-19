const pool = require('../libs/mysql-connect');
const express = require('express');
const router = express.Router();
const logger = require('../libs/logger')

router
    .get('/', (req, res) => {

        const sql = `
          SELECT pd.id            AS 'id',
                 pd.price         AS 'price',
                 pd.instock       AS 'instock',
                 pd.count         AS 'count',
                 pd.image         AS 'image',
                 prop.id          AS 'prop_id',
                 prop.title       AS 'prod_title',
                 prop.set         AS 'set',
                 prop.description AS 'description',
                 grp.title        AS 'grp_title',
                 taste.title      AS 'prod_taste'
          FROM product pd
                 LEFT JOIN product_properties prop ON pd.properties_id = prop.id
                 LEFT JOIN product_group grp ON prop.group_id = grp.id
                 LEFT JOIN product_taste taste ON pd.taste_id = taste.id
        `;

        pool.query(sql, function (err, rows) {
            if (err) logger.error(err);

            res.render('shop', {productList: rows});
        });
    })
    .get('/product/:id', (req, res) => {

        const sql = `
          SELECT pd.id            AS 'id',
                 pd.price         AS 'price',
                 pd.instock       AS 'instock',
                 pd.count         AS 'count',
                 pd.image         AS 'image',
                 prop.id          AS 'prop_id',
                 prop.title       AS 'prod_title',
                 prop.set         AS 'set',
                 prop.description AS 'description',
                 grp.title        AS 'grp_title',
                 taste.title      AS 'prod_taste'
          FROM product pd
                 LEFT JOIN product_properties prop ON pd.properties_id = prop.id
                 LEFT JOIN product_group grp ON prop.group_id = grp.id
                 LEFT JOIN product_taste taste ON pd.taste_id = taste.id
          WHERE pd.id = :pdId
        `;

        pool.query(sql, {pdId: req.params.id}, function (err, rows) {
            if (err) logger.error(err);

            res.format({
                'text/plain': function(){
                    res.send(rows);
                },
                'text/html': function(){
                    res.render('product', {product: rows[0]});
                },
                'application/json': function(){
                    res.header('Access-Control-Allow-Origin', '*');
                    res.json(rows[0]);
                },
                'default': function() {
                    // log the request and respond with 406
                    res.status(406).send('Not Acceptable');
                }
            });

        })

    });

module.exports = router;


