module.exports = function authenticationMiddleware () {
    return function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        res.send('Вам запрещен доступк к данному разделу')
    }
};
