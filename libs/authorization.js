module.exports = function authorizationMiddleware(ability) {
    return function (req, res, next) {

        if (ability(req)) {
            return next()
        } else {
            res.status(406).send('Запрещено')
        }
    }
};
