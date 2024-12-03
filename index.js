const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();


const app = express();
const PORT = 3000;

const transporter = nodemailer.createTransport({
    secure:true,
    host: 'smtp.gmail.com',
    port: 465,
    auth:{
        user: process.env.USER,
        pass: process.env.PASS
    }
});

function sendMail(to,sub,msg){
    transporter.sendMail({
        to:to,
        subject:sub,
        html:msg
    });
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, 'index.html'))
);

app.get('/quoteSent', (req, res) => {
    var name = req.query.name;
    var email = req.query.email;
    var phone = req.query.phone;
    var business = req.query.business;
    var requirements = req.query.requirements;
    var statement = `Name: ${name} \n
             Email: ${email} \n
             Phone no: ${phone} \n
             Business name: ${business} \n
             Requirements: ${requirements}`;

    sendMail(process.env.TO_USER,"New Client Alert!!!",statement),
    res.redirect('/')
});

app.listen(PORT, () => 
    console.log(`Example app listening on port ${PORT}!`)
);

