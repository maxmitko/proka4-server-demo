const email = require("emailjs");

const server = email.server.connect({
    user: process.env.EMAIL_USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    ssl: true
});

const message = {
    from: "PRO-качайся <proka4club@mail.ru>",
    subject: "Заголовок письма",
    attachment:
        [
            {data: "<html>Тело письма</html>", alternative: true},
        ]
};


module.exports = function (to, title, html) {

    message.to = `<${to}>`;
    message.subject = title;
    message.attachment = [{data: html, alternative: true}];

    server.send(message, function (err, message) {
        if(err) throw err;
    });
};
