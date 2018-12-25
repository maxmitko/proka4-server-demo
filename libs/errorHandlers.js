const logger = require('./logger')

module.exports.rootErrHandler = function (err, req, res, next) {
    logger.error(err)
    switch (err.message) {
        case ('Validation failed'):
            res.status(422).json(err.mapped());
            break;
        case ('Not Acceptable'):
            res.status(406).send('Not Acceptable')
            break;
        default:
            res.status(500).send('Server error: ' + err.message);
    }
}
