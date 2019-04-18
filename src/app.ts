import 'reflect-metadata'
import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import casl from './utils/authAbilities'
import favicon from 'serve-favicon'
import session from './utils/session'
import localsFiller from './utils/localsFiller'
import cors from './utils/cors'
import passport from './utils/passport'
import router from './router'
import cookieParser from 'cookie-parser'
const app = express()

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

// use default render with pug
app.set('view engine', 'pug');

// static files handler
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(favicon(path.join(__dirname, '..', 'public', 'images', 'favicon.ico')));

// authentication module
app.use(session);
passport(app);

// permission module | all abilities true in development mode
app.use(casl);

// cors work only in development env
cors(app);

// other middlewares
app.use(localsFiller);

// router
router(app);

app.listen(process.env.SERVER_PORT);