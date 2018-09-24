require('dotenv').config();
const fs = require('fs');
const http = require('http');
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const casl = require('./libs/casl');
const config = require('./libs/myconfig')
const favicon = require('serve-favicon');

// parse body application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse body application/json
app.use(bodyParser.json());

// parse body multipart/form-data
app.use(upload.array());

// use default render with pug
app.set('view engine', 'pug');

// static files handler
app.use(express.static(path.join(__dirname, '/public')));
app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.ico')));

// authentication module
require('./libs/session')(app);
require('./libs/passport')(app);

// permission module
app.use(casl);

// work only with NODE_ENV=development
require('./libs/cors')(app);

require('./libs/email');
require('./routes/root')(app);

http.createServer(app).listen(config.server.port);

if (process.env.NODE_ENV == 'production') {
    const https = require('https');
    const httpsOptions = {
        key: fs.readFileSync('/etc/ssl/private/proka4-https.key'),
        cert: fs.readFileSync('/etc/ssl/private/proka4-https.crt')
    };

    https.createServer(httpsOptions, app).listen(443);
}