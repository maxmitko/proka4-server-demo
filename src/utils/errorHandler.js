const logger = require('./logger')

module.exports.routesErrorHandler = function (error, req, res, next) {
    switch (error.message) {
        case ('Not Acceptable'):
            res.status(406).json({ message: 'Доступ запрещен' })
            break;
        case ('ORM validation failed'):
            res.status(422).json({ message: 'Ошибка валидации данных', ...error });
            break;
        case ('Not allowed by CORS'):
            res.status(500).json({ message: 'Not allowed by CORS', ...error });
            break;
        default:
            logger.error(error)
            console.error(error)
            process.env.NODE_ENV === 'production'
                ? res.status(500).json({ message: error.message })
                : res.status(500).json({ message: 'Внутренняя ошибка сервера', ...error })

    }
}
