const pool = require('../libs/mysql-connect');
const express = require('express');
const router = express.Router();

router
    .get('/product/:id', (req, res) => {

        const sql = `
          SELECT pd.id      AS 'id',
                 pd.price   AS 'price',
                 pd.instock AS 'instock',
                 pd.count   AS 'count',
                 pd.image   AS 'image',
                 prop.id      AS 'prop_id',
                 prop.title   AS 'title',
                 prop.set     AS 'set',
                 prop.description     AS 'description',
                 grp.title    AS 'grp_title',
                 taste.title  AS 'taste_title'
          FROM product pd
                 LEFT JOIN product_properties prop ON pd.properties_id = prop.id
                 LEFT JOIN product_group grp ON prop.group_id = grp.id
                 LEFT JOIN product_taste taste ON pd.taste_id = taste.id
          WHERE pd.id = :pdId
        `;

        pool.query(sql, {pdId: req.params.id}, function (err, rows) {
            if (err) throw err;

            res.json(rows[0]);
        });

    });

module.exports = router;


