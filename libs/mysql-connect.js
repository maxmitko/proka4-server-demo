const mysql = require('mysql');
const config = require('./myconfig');
const util = require('util');
const logger = require('./logger')

const pool = mysql.createPool(config.db);

pool.config.connectionConfig.queryFormat = function (query, values) {

    if (!values) return query;
    let escapedVal = query.replace(/\:(\w+)/g, function (txt, key) {
        if (values.hasOwnProperty(key)) {
            return this.escape(values[key]);
        }
        return txt;
    }.bind(this));

    let result = escapedVal.replace(/\#(\w+)/g, function (txt, key) {
        if (values.hasOwnProperty(key)) {
            return this.escapeId(values[key]);
        }
        return txt;
    }.bind(this));

    if (process.env.NODE_ENV !== 'production') logger.info(result)
    
    return result;
};

pool.query = util.promisify(pool.query);

module.exports = pool;
