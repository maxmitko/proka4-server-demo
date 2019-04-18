// не используется

const mysql = require('mysql');
const config = require('../config');
const util = require('util');

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

    return result;
};

pool.query = util.promisify(pool.query);

module.exports = pool;
