const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = 3000;

const transporter = nodemailer.createTransport({
    secure: true,
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
});

function sendMail(to, sub, msg) {
    transporter.sendMail({
        to: to,
        subject: sub,
        html: msg
    });
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, 'index.html'))
);

app.get('/quoteSent', (req, res) => {
    const { name, email, phone, business, requirements } = req.query;
    const statement = `Name: ${name} \n
             Email: ${email} \n
             Phone no: ${phone} \n
             Business name: ${business} \n
             Requirements: ${requirements}`;

    sendMail(process.env.TO_USER, "New Client Alert!!!", statement);
    
    // Send an HTML response with a client-side alert
    res.send(`
        <script>
            alert('Submitted, Our team will reach out to you shortly');
            window.location.href = '/';
        </script>
    `);
});

app.listen(PORT, () =>
    console.log(`Example app listening on port ${PORT}!`)
);

