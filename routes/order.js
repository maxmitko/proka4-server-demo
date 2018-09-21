const pool = require('../libs/mysql-connect');
const express = require('express');
const router = express.Router();
const emailSender = require('../libs/email');
const pug = require('pug');

router
    .get('/', (req, res) => {

        if (req.user) {
            const sql = `
              SELECT ord.id                                 AS 'id',
                     DATE_FORMAT(ord.time_add, '%d.%m.%y')  AS 'time_add',
                     DATE_FORMAT(ord.time_done, '%d.%m.%y') AS 'time_done',
                     pdord.count                            AS 'count',
                     pd.price                               AS 'price',
                     pd.price * pdord.count                 AS 'total',
                     pd.id                                  AS 'product_id',
                     prop.title                             AS 'prod_title',
                     tst.title                              AS 'prod_taste'
              FROM orders ord
                     LEFT JOIN orders_product pdord ON ord.id = pdord.order_id
                     LEFT JOIN product pd ON pd.id = pdord.product_id
                     LEFT JOIN product_properties prop ON prop.id = pd.properties_id
                     LEFT JOIN product_taste tst ON tst.id = pd.taste_id
              WHERE ord.user_id = :userId
                AND ord.rejected = 0
              ORDER BY ord.time_add DESC
            `;

            pool.query(sql, {userId: req.user.id}, function (err, rows) {
                if (err) throw err;

                let orderId = new Set();
                rows.forEach(item => orderId.add(item.id));

                let result = [];

                orderId.forEach(ordItem => {

                    let row = rows.filter(row => {
                        return (row.id === ordItem);
                    });

                    result.push(row)
                });

                res.render('order', {orders: result});
            });

        } else {
            res.render('order');
        }
    })
    .get('/reject/:id', (req, res) => {

        const sql = `
          UPDATE orders
          SET rejected = 1
          WHERE id = :id
            AND user_id = :userId
        `;


        pool.query(sql, {id: req.params.id, userId: req.user.id}, function (err, rows) {
            if (err) throw err;

            res.redirect('/shop/order');
        })
    })
    .post('/place', (req, res) => {

        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                throw err;
            }

            connection.beginTransaction(function (err) {
                if (err) throw err;

                const orderSql = `
                  INSERT INTO orders (user_id, rejected, customer, phone)
                  VALUES (:userId, 0, :customer, :phone);
                `;

                const user = req.user ? req.user.id : null;

                connection.query(orderSql, {
                    userId: user,
                    customer: req.body.customer,
                    phone: req.body.phone
                }, function (err, okPacketOrder) {

                    if (err) {
                        return connection.rollback(function () {
                            connection.release();
                            throw err;
                        })
                    }

                    const order = JSON.parse(req.body.order);

                    const body = order.map(item => {
                        return [okPacketOrder.insertId, item['id'], item['count']]
                    });

                    const orderProdSql = `
                      INSERT INTO orders_product (order_id, product_id, count)
                      VALUES :body
                    `;

                    connection.query(orderProdSql, {body}, function (err, okPacket) {
                        if (err) {
                            return connection.rollback(function () {
                                connection.release();
                                throw err;
                            })
                        }

                        connection.commit(function (err) {

                            if (err) {
                                return connection.rollback(function () {
                                    connection.release();
                                    throw err;
                                });
                            }

                            const emailBody = pug.renderFile('views/order-email.pug', {
                                ...req.body,
                                order
                            });

                            emailSender(process.env.ADMIN_EMAIL, `Поступил заказ № ${okPacketOrder.insertId} от покупателя!`, emailBody);

                            if (req.user) {
                                res.redirect('/shop/order');
                            } else {
                                res.send()
                            }

                        });
                    });
                })
            });
        });
    });


module.exports = router;


