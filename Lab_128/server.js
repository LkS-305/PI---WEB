const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

let verificationCodes = {};
let attempts = {};

app.post('/send-verification-code', (req, res) => {
  const { email } = req.body;
  const code = Math.random().toString(36).substring(2, 8);
  verificationCodes[email] = code;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Código de Verificação',
    text: `Seu código de verificação é: ${code}`,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      return res.status(500).send('Erro ao enviar código de verificação.');
    }
    attempts[email] = 0;
    res.status(200).send('Código de verificação enviado para ' + email);
  });
});

app.post('/send', (req, res) => {
  const { to, subject, message, verificationCode } = req.body;

  if (verificationCodes[to] && verificationCodes[to] === verificationCode) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: message,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return res.status(500).send('Erro ao enviar e-mail.');
      }
      delete verificationCodes[to];
      res.status(200).send('E-mail enviado com sucesso.');
    });
  } else {
    attempts[to] = (attempts[to] || 0) + 1;

    if (attempts[to] >= 3) {
      delete verificationCodes[to];
      res.status(400).send('Número máximo de tentativas excedido. Solicite um novo código.');
    } else {
      res.status(400).send('Código de verificação inválido. Você ainda tem ' + (3 - attempts[to]) + ' tentativas.');
    }
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});