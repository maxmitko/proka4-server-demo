const configProd = {
    server: {
        port: '80',
    },
    db: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_BASE,
    },
};

const configDev = {
    server: {
        port: '3000',
    },
    db: {
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: 'root',
        database: 'proka4',
    }
};

module.exports = (process.env.NODE_ENV === 'production') ? configProd : configDev;
