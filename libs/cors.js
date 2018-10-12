const cors = require('cors');

module.exports = function (app) {

    if (process.env.NODE_ENV === 'development') {
        app.use(cors());
        app.options('*', cors());
    }
};
