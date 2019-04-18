import cors, { CorsOptions } from 'cors'
import { Express } from 'express'
import Url from 'url-parse'

export default (app: Express) => {
    if (process.env.NODE_ENV === 'development') {
        var corsOptions = {
            origin: 'http://localhost:3050',
            credentials: true,
        }
        app.use(cors(corsOptions));
        app.options('*', cors())

    } else if (process.env.NODE_ENV === 'production') {

        const whitelist = ['proka4.ru', 'www.proka4.ru']
        const corsOptions: CorsOptions = {
            origin: (origin, callback) => {
                const url = new Url(origin)

                if (whitelist.indexOf(url.hostname) !== -1 || !origin) {
                    callback(null, true)
                } else {
                    callback(new Error('Not allowed by CORS'))
                }
            },
            credentials: true,
        }

        app.use(cors(corsOptions));
        app.options('*', cors())
    }
};
