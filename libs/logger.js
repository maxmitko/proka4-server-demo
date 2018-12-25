const { createLogger, transports, format } = require('winston');
const { combine, timestamp, printf, prettyPrint } = format;

const myTransports = [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
]

const myFormat = combine(
    timestamp(),
    prettyPrint(),
    printf(info => `[${getDateNow()}] ${info.stack}`),
)

if (process.env.NODE_ENV !== 'production') myTransports.push(new transports.File({
    filename: 'logs/info.log',
    level: 'info',
    format: combine(
        timestamp(),
        prettyPrint(),
        printf(info => info.sql
            ? `[${getDateNow()}] ${info.sql}`
            : `[${getDateNow()}] ${info.message}`),
    )
}))

const logger = createLogger({
    levels: {
        error: 0,
        info: 1,
    },
    format: myFormat,
    transports: myTransports,
})

module.exports = logger

const getDateNow = () => {
    const date = new Date()
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timezone: 'UTC',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };

    return date.toLocaleString("ru", options)
}