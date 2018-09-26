const pool = require('../libs/mysql-connect');
const express = require('express');
const getFromToMonth = require('../libs/formatDate').getFromToMonth;
const router = express.Router();

router
  .get('/', async (req, res) => {

    const service_sql = `
          SELECT srv.id AS 'id', srv.title AS 'title', art.id AS 'art_id'
          FROM service srv
                 LEFT JOIN article art ON srv.id = art.service_id
          ORDER BY myorder
          LIMIT 0, 4
        `;

    const serviceList = await pool.query(service_sql);

    const news_sql = `
            SELECT nw.id        AS 'id',
                  nw.title     AS 'title',
                  nw.topic     AS 'topic',
                  nw.link_hash AS 'link_hash',
                  nw.from AS 'from',
                  nw.to AS 'to'
            FROM news nw
            ORDER BY nw.from DESC
            LIMIT 0, 2
        `;

    const newsList = await pool.query(news_sql);
    
    const news = newsList.map(item => {
      return {
          ...item,
          fromTo: getFromToMonth(item.from, item.to)
      }
  })

    res.render('index', { serviceList, news });

  });

module.exports = router;

