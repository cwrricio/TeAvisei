const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servindo arquivos estáticos (CSS e JS) das pastas raiz e scripts
app.use(express.static(path.join(__dirname)));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/pages', express.static(path.join(__dirname, 'pages')));

// Rota para a página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Configuração do transporte de e-mail
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'teaviseifaleconosco@gmail.com', // Seu e-mail
        pass: 'yqlf poga imjz ktqz' // Substitua pela senha de app do Gmail
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Rota para enviar e-mail
app.post('/enviar-email', (req, res) => {
    const { name, email, message } = req.body;

    const mailOptions = {
        from: email,
        to: 'teaviseifaleconosco@gmail.com', // E-mail que receberá as mensagens
        subject: `Contato de ${name}`,
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erro ao enviar email:', error);
            res.status(500).send('Erro ao enviar email'); // Resposta de erro para o frontend
        } else {
            console.log('Email enviado:', info.response);
            res.status(200).send('Email enviado com sucesso'); // Resposta de sucesso para o frontend
        }
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
