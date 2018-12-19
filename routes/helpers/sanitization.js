module.exports.blackListFilter = (list, obj) => {
    const body = { ...obj };
    list.forEach(item => delete body[item])
    return body;
}
