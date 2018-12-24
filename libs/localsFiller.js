module.exports = function (req, res, next) {

    const result = req.originalUrl.match(/^\/[a-z]+/);

    res.locals.currentPage = result ? result[0].slice(1) : '/'; // храним в locals первый уровень названия роута убрав "/"
    res.locals.userName = req.user ? req.user.username : null; // прокидываем в locals имя пользователя если есть такой

    next();
}