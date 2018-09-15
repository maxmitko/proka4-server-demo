const cors = require('cors');

module.exports = function (app) {

    if (process.env === 'development') {
        app.use(cors());
        app.options('*', cors());
    }
};
