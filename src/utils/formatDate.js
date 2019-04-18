
const moment = require('moment');
moment.locale('ru');

module.exports.fromToConvert = (from, to) => {
    if (moment(from).isSame(moment(to), 'month')) {
        return `c ${moment(from).date()} по ${getFromMonth(to)}`
    } else {
        return `c ${getFromMonth(from)} по ${getFromMonth(to)}`
    }
}

module.exports.formatToMysqlDate = function (date) {
    return momento(date).format('YYYY-MM-DD')
};


function getFromMonth(date) {
    const day = moment(date).date()
    const month = moment(date).format('MMMM')
    const fromToDate = `${day} ${month}`

    if (month === 'март') return `${day} марта`

    return fromToDate.slice(0, -1) + 'я'
}