
const moment = require('moment');


moment.locale('ru');

module.exports = {
    getFromToMonth(from, to) {
        if (moment(from).isSame(moment(to), 'month')) {
            return `c ${moment(from).date()} по ${getFromMonth(to)}`
        } else {
            return `c ${getFromMonth(from)} по ${getFromMonth(to)}`
        }
    }

}

function getFromMonth(date) {
    return moment(date).date() + ' ' + moment(date).format('MMMM').slice(0, -1) + 'я'
}