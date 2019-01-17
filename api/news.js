const pool = require('../libs/mysql-connect');
const getFromToMonth = require('../libs/formatDate').getFromToMonth;
const logger = require('../libs/logger');

module.exports.getCount = async () => {
    try {
        return await pool.query('SELECT COUNT(*) AS count FROM news');

    } catch (err) {
        throw err
    }
}

module.exports.getAll = async () => {
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

        const rows = await pool.query(sql)
        return rows.map(item => ({ ...item, fromTo: getFromToMonth(item.from, item.to) }))

    } catch (err) {
        throw err
    }
}

module.exports.getByRange = async (limit, offset) => {
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

        const rows = await pool.query(sql, { limit, offset })
        return rows.map(item => ({ ...item, fromTo: getFromToMonth(item.start_date, item.end_date) }))

    } catch (err) {
        throw err
    }
}

module.exports.getByCursor = async (limit, cursor) => {
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

        const rows = await pool.query(sql, { limit, cursor })
        const newsList = rows.map(item => ({ ...item, fromTo: getFromToMonth(item.from, item.to) }))

        return { totalCount: count, data: newsList }

    } catch (err) {
        throw err
    }
}


module.exports.getById = async id => {
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
            link_hash FROM news
            WHERE id = :id
        `;

        const rows = await pool.query(sql, { id })
        const newsList = { ...rows[0], fromTo: getFromToMonth(rows[0].from, rows[0].to) }

        return newsList

    } catch (err) {
        throw err
    }
}

module.exports.put = async body => {
    try {
        const sql = `
            UPDATE news
            SET :body
            WHERE id = :id
        `;

        return await pool.query(sql, { body, id: body.id })

    } catch (err) {
        throw err
    }
}

module.exports.post = async body => {
    try {
        const sql = `
            INSERT INTO news
            SET :body
        `;

        return await pool.query(sql, { body })

    } catch (err) {
        throw err
    }
}

module.exports.remove = async id => {
    try {
        const sql = `
            DELETE FROM news
            WHERE id = :id
        `;

        return await pool.query(sql, { id })

    } catch (err) {
        throw err
    }
}