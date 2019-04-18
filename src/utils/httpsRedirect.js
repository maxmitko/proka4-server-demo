// не используется
module.exports = (req, res, next) => {
    if (req.secure || process.env.NODE_ENV !== 'production') {
        return next();
    }
    res.redirect("https://" + req.headers.host + req.url); // редирект пользователя на https
}