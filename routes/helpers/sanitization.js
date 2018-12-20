module.exports.whiteListFilter = (list, obj) => {
    const body = {};
    list.forEach(item => body[item] = obj[item])
    return body;
}
