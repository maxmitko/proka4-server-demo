const logger = require('./logger')
const serializeError = require('serialize-error');

module.exports.rootErrHandler = function (err, req, res, next) {
    logger.error(err)
    switch (err.message) {
        case ('Validation failed'):
            err.fields = err.mapped()
            res.status(422).json(serializeError(err));
            break;
        case ('Not Acceptable'):
            res.status(406).send('Not Acceptable')
            break;
        default:
            res.status(500).send('Server error: ' + err.message);
    }
}
