require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();

// parse body application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse body application/json
app.use(bodyParser.json());

// parse body multipart/form-data
app.use(upload.array());

// use default render with pug
app.set('view engine', 'pug');

// static files handler
app.use(express.static(path.join(__dirname, '/public')));

// work only with NODE_ENV=development
require('./libs/cors')(app);

require('./libs/email');
require('./libs/session')(app);
require('./libs/passport')(app);
require('./routes/root')(app);

app.listen(process.env.SERVER_PORT, () => console.log('Сервер работает'));

