const email = require("emailjs");

module.exports = function (to, title, html) {

    const server = email.server.connect({
        user: process.env.EMAIL_SERVICE_USER,
        password: process.env.EMAIL_SERVICE_PASSWORD,
        host: process.env.EMAIL_SERVICE_HOST,
        ssl: true
    });

    const message = {
        from: `PRO-качайся <${process.env.EMAIL_SERVICE}>`,
        subject: "Центр энергетики PRO-качайся",
        attachment:
            [
                { data: "<html>Тело письма</html>", alternative: true },
            ]
    };

    message.to = `<${to}>`;
    message.subject = title;
    message.attachment = [{ data: html, alternative: true }];

    server.send(message, function (err, message) {
        if (err) throw err;
    });
};
