const pool = require('../libs/mysql-connect');
const getFromToMonth = require('../libs/formatDate').getFromToMonth;
const logger = require('../libs/logger');

module.exports.getList = async (params) => {
    try {
        const sql = `
            SELECT 
                id, 
                title, 
                content, 
                topic, 
                DATE_FORMAT(start_date, '%Y-%m-%d') as start_date, 
                DATE_FORMAT(end_date, '%Y-%m-%d') as end_date, 
                link_hash 
                FROM news
            ORDER BY start_date DESC
        `;

        const rows = await pool.query(sql, params)
        return rows.map(item => ({ ...item, fromTo: getFromToMonth(item.from, item.to) }))

    } catch (err) {
        logger.error(err);
    }
}

module.exports.getByRange = async (params) => {
    try {
        const sql = `
            SELECT
                news.id, 
                title, 
                content, 
                topic, 
                DATE_FORMAT(start_date, '%Y-%m-%d') as start_date, 
                DATE_FORMAT(end_date, '%Y-%m-%d') as end_date, 
                link_hash
            FROM news
            JOIN (
            SELECT id
            FROM news
            ORDER BY id
            LIMIT :offset, :limit) AS b ON b.id = news.id
        `;

        const rows = await pool.query(sql, params)
        return rows.map(item => ({ ...item, fromTo: getFromToMonth(item.start_date, item.end_date) }))

    } catch (err) {
        logger.error(err);
    }
}

module.exports.getByCursor = async (params) => {
    try {
        const reqCount = await pool.query('SELECT COUNT(*) AS count FROM news');
        const count = reqCount[0].count

        const sql = `
            SELECT            
                id, 
                title, 
                content, 
                topic, 
                DATE_FORMAT(start_date, '%Y-%m-%d') as start_date, 
                DATE_FORMAT(end_date, '%Y-%m-%d') as end_date, 
                link_hash  
            FROM news
            WHERE id < :cursor
            ORDER BY id DESC
            LIMIT :limit
        `;

        const rows = await pool.query(sql, params)
        const newsList = rows.map(item => ({ ...item, fromTo: getFromToMonth(item.from, item.to) }))

        return { totalCount: count, data: newsList }

    } catch (err) {
        logger.error(err);
    }
}