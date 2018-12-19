const logger = require('./logger')

module.exports = () => function (err, req, res, next) {
    logger.error(err);
    res.status(500).send('Server error: ' + err.message);
}

