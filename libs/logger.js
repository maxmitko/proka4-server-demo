const { createLogger, transports, format } = require('winston');
const { combine, timestamp, printf, prettyPrint } = format;

const myTransports = [
    new transports.File({ filename: 'logs/info.log', level: 'info' }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
]

const myFormat = combine(
    timestamp(),
    prettyPrint(),
    printf(info => {
        let message = info.message
        if (info.sql) message = `\nstack: ${info.stack} \nsql: ${info.sql}`
        return `[${getDateNow()}] ${info.level}: ${message}`
    }),
)

// if (process.env.NODE_ENV !== 'production') myTransports.push(new transports.Console())

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